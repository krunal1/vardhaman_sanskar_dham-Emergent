from dotenv import load_dotenv
from pathlib import Path

# Load environment variables FIRST
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime, timezone, timedelta
from bson import ObjectId
import os
import logging
import bcrypt
import jwt
import secrets
import base64
import uuid
import shutil

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-this')
JWT_ALGORITHM = "HS256"

# Create the main app
app = FastAPI()

# Create uploads directory
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# CORS Configuration - MUST be before other middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ============ Password & Token Utilities ============

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=15),
        "type": "access"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "refresh"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

# ============ Auth Dependency ============

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ============ Models ============

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ActivityModel(BaseModel):
    title: str
    subtitle: str
    description: str
    icon: str
    image: str
    slug: Optional[str] = None
    category: Optional[str] = "Our Work"
    stats: Optional[List[str]] = []
    images: Optional[List[str]] = []
    videos: Optional[List[str]] = []
    customFields: Optional[dict] = {}

class AboutModel(BaseModel):
    title: str
    description: str
    mission: str
    vision: str
    stats: List[dict]

class EventModel(BaseModel):
    title: str
    date: str
    time: str
    location: str
    description: str
    status: str = "upcoming"
    image: str = ""
    googleFormLink: str = ""
    whatsappGroupLink: str = ""

class UpdateModel(BaseModel):
    title: str
    description: str
    image: str = ""
    video: str = ""
    date: str
    category: str = "news"

class GalleryImageModel(BaseModel):
    url: str
    title: str
    category: str
    type: str = "image"  # "image" or "video"

class ContactModel(BaseModel):
    name: str
    phone: str
    email: str
    address: str
    timing: str

class DonationModel(BaseModel):
    bankName: str
    accountName: str
    accountNumber: str
    ifscCode: str
    branch: str = ""
    upiId: str
    qrCodeImage: str = ""
    receiptContact: str = ""
    receiptContactType: str = "WhatsApp"
    playStoreLink: str = ""
    declarationPdf: str = ""
    additionalBanks: Optional[List[dict]] = []
    foreignDonation: Optional[dict] = {}

class ContactMessageModel(BaseModel):
    name: str
    email: str
    phone: str
    message: str

class DonationRecordModel(BaseModel):
    donorName: str
    donorEmail: str
    donorPhone: str
    amount: float
    transactionId: str
    date: str
    status: str = "pending"

class HeroSectionModel(BaseModel):
    badge: str
    title: str
    highlightedWord: str
    subtitle: str
    backgroundImage: str
    button1Text: str = "Join Our Mission"
    button2Text: str = "Learn More"
    height: str = "500px"
    slides: Optional[List[dict]] = []

class UserCreateModel(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: str = "admin"

class PasswordChangeModel(BaseModel):
    currentPassword: str
    newPassword: str

class ProfileUpdateModel(BaseModel):
    name: str
    email: EmailStr

# ============ Admin Seeding ============

async def seed_admin():
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@example.com")
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        hashed = hash_password(admin_password)
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hashed,
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc)
        })
        logger.info(f"Admin user created: {admin_email}")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}}
        )
        logger.info(f"Admin password updated: {admin_email}")
    
    # Write credentials to test file
    os.makedirs("/app/memory", exist_ok=True)
    with open("/app/memory/test_credentials.md", "w") as f:
        f.write("# Admin Credentials\n\n")
        f.write(f"**Email:** {admin_email}\n")
        f.write(f"**Password:** {admin_password}\n")
        f.write("**Role:** admin\n\n")
        f.write("## Endpoints\n")
        f.write("- POST /api/auth/login\n")
        f.write("- GET /api/auth/me\n")
        f.write("- POST /api/auth/logout\n")

@app.on_event("startup")
async def startup_event():
    await seed_admin()
    # Create indexes
    await db.users.create_index("email", unique=True)
    logger.info("Application started successfully")

# ============ API Router ============
api_router = APIRouter(prefix="/api")

# ============ Auth Routes ============

@api_router.post("/auth/login")
async def login(credentials: LoginRequest, response: Response):
    email = credentials.email.lower()
    user = await db.users.find_one({"email": email})
    
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user_id = str(user["_id"])
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=900,
        path="/"
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=604800,
        path="/"
    )
    
    return {
        "email": user["email"],
        "name": user.get("name", ""),
        "role": user.get("role", "user"),
        "_id": user_id
    }

@api_router.get("/auth/me")
async def get_me(user: dict = Depends(get_current_user)):
    return user

@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"message": "Logged out successfully"}

# ============ Profile Management Routes ============

@api_router.put("/auth/profile")
async def update_profile(profile: ProfileUpdateModel, user: dict = Depends(get_current_user)):
    # Check if email is being changed and if it's already taken
    if profile.email.lower() != user["email"]:
        existing = await db.users.find_one({"email": profile.email.lower()})
        if existing:
            raise HTTPException(status_code=400, detail="Email already in use")
    
    await db.users.update_one(
        {"_id": ObjectId(user["_id"])},
        {"$set": {"name": profile.name, "email": profile.email.lower()}}
    )
    return {"message": "Profile updated successfully"}

@api_router.post("/auth/change-password")
async def change_password(passwords: PasswordChangeModel, user: dict = Depends(get_current_user)):
    # Get user with password hash
    db_user = await db.users.find_one({"_id": ObjectId(user["_id"])})
    
    # Verify current password
    if not verify_password(passwords.currentPassword, db_user["password_hash"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    # Update password
    new_hash = hash_password(passwords.newPassword)
    await db.users.update_one(
        {"_id": ObjectId(user["_id"])},
        {"$set": {"password_hash": new_hash}}
    )
    return {"message": "Password changed successfully"}

# ============ User Management Routes ============

@api_router.get("/users")
async def get_users(user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    users = await db.users.find().to_list(100)
    for u in users:
        u["_id"] = str(u["_id"])
        u.pop("password_hash", None)
    return users

@api_router.post("/users")
async def create_user(new_user: UserCreateModel, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Check if email already exists
    existing = await db.users.find_one({"email": new_user.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    # Create user
    hashed = hash_password(new_user.password)
    user_dict = {
        "email": new_user.email.lower(),
        "password_hash": hashed,
        "name": new_user.name,
        "role": new_user.role,
        "created_at": datetime.now(timezone.utc)
    }
    result = await db.users.insert_one(user_dict)
    
    return {"id": str(result.inserted_id), "message": "User created successfully"}

@api_router.delete("/users/{user_id}")
async def delete_user(user_id: str, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Don't allow deleting yourself
    if user_id == user["_id"]:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    
    await db.users.delete_one({"_id": ObjectId(user_id)})
    return {"message": "User deleted successfully"}

# ============ Activities Routes ============

@api_router.get("/activities")
async def get_activities():
    activities = await db.activities.find().to_list(100)
    for activity in activities:
        activity["_id"] = str(activity["_id"])
        # Generate slug if not present
        if "slug" not in activity or not activity["slug"]:
            activity["slug"] = activity.get("id") or str(activity["_id"])
    return activities

@api_router.get("/activities/{slug}")
async def get_activity_detail(slug: str):
    # Try to find by slug first, then by _id
    activity = await db.activities.find_one({"slug": slug})
    if not activity:
        # Try finding by _id if slug doesn't match
        try:
            activity = await db.activities.find_one({"_id": ObjectId(slug)})
        except Exception:
            raise HTTPException(status_code=404, detail="Activity not found")
    
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    activity["_id"] = str(activity["_id"])
    activity["id"] = activity["_id"]
    return activity

@api_router.post("/activities")
async def create_activity(activity: ActivityModel, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    activity_dict = activity.dict()
    # Generate slug from title if not provided
    if not activity_dict.get("slug"):
        activity_dict["slug"] = activity_dict["title"].lower().replace(" ", "-").replace("/", "-")
    
    result = await db.activities.insert_one(activity_dict)
    return {"id": str(result.inserted_id), **activity_dict}

@api_router.put("/activities/{activity_id}")
async def update_activity(activity_id: str, activity: ActivityModel, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    activity_dict = activity.dict()
    # Generate slug from title if not provided
    if not activity_dict.get("slug"):
        activity_dict["slug"] = activity_dict["title"].lower().replace(" ", "-").replace("/", "-")
    
    await db.activities.update_one(
        {"_id": ObjectId(activity_id)},
        {"$set": activity_dict}
    )
    return {"id": activity_id, **activity_dict}

@api_router.delete("/activities/{activity_id}")
async def delete_activity(activity_id: str, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.activities.delete_one({"_id": ObjectId(activity_id)})
    return {"message": "Activity deleted successfully"}

# ============ About Routes ============

@api_router.get("/about")
async def get_about():
    about = await db.about.find_one()
    if about:
        about["_id"] = str(about["_id"])
    return about

@api_router.put("/about")
async def update_about(about: AboutModel, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.about.update_one(
        {},
        {"$set": about.dict()},
        upsert=True
    )
    return about.dict()

# ============ Events Routes ============

@api_router.get("/events")
async def get_events():
    events = await db.events.find().to_list(100)
    for event in events:
        event["_id"] = str(event["_id"])
        event["id"] = event["_id"]
    return events

@api_router.get("/events/{event_id}")
async def get_event_detail(event_id: str):
    try:
        event = await db.events.find_one({"_id": ObjectId(event_id)})
        if event:
            event["_id"] = str(event["_id"])
            event["id"] = event["_id"]
            return event
    except Exception:
        pass
    raise HTTPException(status_code=404, detail="Event not found")

@api_router.post("/events")
async def create_event(event: EventModel, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    result = await db.events.insert_one(event.dict())
    return {"id": str(result.inserted_id), **event.dict()}

@api_router.put("/events/{event_id}")
async def update_event(event_id: str, event: EventModel, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.events.update_one(
        {"_id": ObjectId(event_id)},
        {"$set": event.dict()}
    )
    return {"id": event_id, **event.dict()}

@api_router.delete("/events/{event_id}")
async def delete_event(event_id: str, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.events.delete_one({"_id": ObjectId(event_id)})
    return {"message": "Event deleted successfully"}

# ============ Updates/News Routes ============

@api_router.get("/updates")
async def get_updates():
    updates = await db.updates.find().to_list(100)
    for update in updates:
        update["_id"] = str(update["_id"])
        update["id"] = update["_id"]
    return updates

@api_router.get("/updates/{update_id}")
async def get_update_detail(update_id: str):
    try:
        update = await db.updates.find_one({"_id": ObjectId(update_id)})
        if update:
            update["_id"] = str(update["_id"])
            update["id"] = update["_id"]
            return update
    except Exception:
        pass
    raise HTTPException(status_code=404, detail="Update not found")

@api_router.post("/updates")
async def create_update(update: UpdateModel, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    result = await db.updates.insert_one(update.dict())
    return {"id": str(result.inserted_id), **update.dict()}

@api_router.put("/updates/{update_id}")
async def update_update(update_id: str, update: UpdateModel, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.updates.update_one(
        {"_id": ObjectId(update_id)},
        {"$set": update.dict()}
    )
    return {"id": update_id, **update.dict()}

@api_router.delete("/updates/{update_id}")
async def delete_update(update_id: str, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.updates.delete_one({"_id": ObjectId(update_id)})
    return {"message": "Update deleted successfully"}

# ============ Gallery Routes ============

@api_router.get("/gallery")
async def get_gallery():
    images = await db.gallery.find().to_list(100)
    for image in images:
        image["_id"] = str(image["_id"])
    return images

@api_router.post("/gallery")
async def create_gallery_image(image: GalleryImageModel, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    result = await db.gallery.insert_one(image.dict())
    return {"id": str(result.inserted_id), **image.dict()}

@api_router.delete("/gallery/{image_id}")
async def delete_gallery_image(image_id: str, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.gallery.delete_one({"_id": ObjectId(image_id)})
    return {"message": "Image deleted successfully"}

# ============ Contact Routes ============

@api_router.get("/contact")
async def get_contact():
    contact = await db.contact.find_one()
    if contact:
        contact["_id"] = str(contact["_id"])
    return contact

@api_router.put("/contact")
async def update_contact(contact: ContactModel, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.contact.update_one(
        {},
        {"$set": contact.dict()},
        upsert=True
    )
    return contact.dict()

# ============ Donation Routes ============

@api_router.get("/donation")
async def get_donation():
    donation = await db.donation.find_one()
    if donation:
        donation["_id"] = str(donation["_id"])
    return donation

@api_router.put("/donation")
async def update_donation(donation: DonationModel, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.donation.update_one(
        {},
        {"$set": donation.dict()},
        upsert=True
    )
    return donation.dict()

# ============ Contact Messages Routes ============

@api_router.post("/contact/message")
async def submit_contact_message(message: ContactMessageModel):
    message_dict = message.dict()
    message_dict["created_at"] = datetime.now(timezone.utc)
    message_dict["status"] = "unread"
    
    result = await db.contact_messages.insert_one(message_dict)
    return {"id": str(result.inserted_id), "message": "Message sent successfully"}

@api_router.get("/contact/messages")
async def get_contact_messages(user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    messages = await db.contact_messages.find().sort("created_at", -1).to_list(100)
    for msg in messages:
        msg["_id"] = str(msg["_id"])
    return messages

@api_router.put("/contact/messages/{message_id}/read")
async def mark_message_read(message_id: str, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.contact_messages.update_one(
        {"_id": ObjectId(message_id)},
        {"$set": {"status": "read"}}
    )
    return {"message": "Message marked as read"}

@api_router.delete("/contact/messages/{message_id}")
async def delete_contact_message(message_id: str, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.contact_messages.delete_one({"_id": ObjectId(message_id)})
    return {"message": "Message deleted successfully"}

# ============ Donation Records Routes ============

@api_router.get("/donations/records")
async def get_donation_records(user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    records = await db.donation_records.find().sort("date", -1).to_list(100)
    for record in records:
        record["_id"] = str(record["_id"])
    return records

@api_router.post("/donations/records")
async def create_donation_record(record: DonationRecordModel, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    record_dict = record.dict()
    record_dict["created_at"] = datetime.now(timezone.utc)
    result = await db.donation_records.insert_one(record_dict)
    
    return {"id": str(result.inserted_id), "message": "Donation recorded successfully"}

@api_router.put("/donations/records/{record_id}")
async def update_donation_record(record_id: str, record: DonationRecordModel, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.donation_records.update_one(
        {"_id": ObjectId(record_id)},
        {"$set": record.dict()}
    )
    return {"message": "Donation record updated successfully"}

@api_router.post("/donations/records/{record_id}/send-thankyou")
async def send_thankyou(record_id: str, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    record = await db.donation_records.find_one({"_id": ObjectId(record_id)})
    if not record:
        raise HTTPException(status_code=404, detail="Donation record not found")
    
    # Update status to confirmed and add thank you sent timestamp
    await db.donation_records.update_one(
        {"_id": ObjectId(record_id)},
        {"$set": {
            "status": "confirmed",
            "thank_you_sent_at": datetime.now(timezone.utc)
        }}
    )
    
    # For now, just return success. Email/WhatsApp integration can be added later
    return {
        "message": "Thank you notification sent successfully",
        "donor": record["donorName"],
        "email": record.get("donorEmail", "")
    }

@api_router.delete("/donations/records/{record_id}")
async def delete_donation_record(record_id: str, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.donation_records.delete_one({"_id": ObjectId(record_id)})
    return {"message": "Donation record deleted successfully"}

# ============ Hero Section Routes ============

@api_router.get("/hero")
async def get_hero():
    hero = await db.hero_section.find_one()
    if hero:
        hero["_id"] = str(hero["_id"])
    return hero

@api_router.put("/hero")
async def update_hero(hero: HeroSectionModel, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.hero_section.update_one(
        {},
        {"$set": hero.dict()},
        upsert=True
    )
    return hero.dict()

class TapovanSchoolModel(BaseModel):
    name: str
    location: str = ""
    image: str = ""
    description: str = ""
    websiteLink: str = ""
    order: int = 0

@api_router.get("/tapovan-schools")
async def get_tapovan_schools():
    schools = await db.tapovan_schools.find().sort("order", 1).to_list(50)
    for s in schools:
        s["_id"] = str(s["_id"])
    return schools

@api_router.post("/tapovan-schools")
async def create_tapovan_school(school: TapovanSchoolModel, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    result = await db.tapovan_schools.insert_one(school.dict())
    return {"_id": str(result.inserted_id), **school.dict()}

@api_router.put("/tapovan-schools/{school_id}")
async def update_tapovan_school(school_id: str, school: TapovanSchoolModel, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    await db.tapovan_schools.update_one({"_id": ObjectId(school_id)}, {"$set": school.dict()})
    return {"message": "Updated"}

@api_router.delete("/tapovan-schools/{school_id}")
async def delete_tapovan_school(school_id: str, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    await db.tapovan_schools.delete_one({"_id": ObjectId(school_id)})
    return {"message": "Deleted"}

# ============ Image/Video Upload Route ============

@api_router.post("/upload")
async def upload_image(file: UploadFile = File(...), user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Validate file type
    allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif",
                     "video/mp4", "video/webm", "video/ogg", "video/quicktime", "video/x-msvideo"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Only image and video files are allowed")
    
    # Generate unique filename
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = UPLOAD_DIR / unique_filename
    
    # Save file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Return the URL
        backend_url = os.environ.get("REACT_APP_BACKEND_URL", "http://localhost:8001")
        image_url = f"{backend_url}/api/uploads/{unique_filename}"
        
        return {"url": image_url, "filename": unique_filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")
    finally:
        file.file.close()

# ============ Gallery PUT (update existing item) ============

@api_router.put("/gallery/{image_id}")
async def update_gallery_image(image_id: str, image: GalleryImageModel, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    await db.gallery.update_one({"_id": ObjectId(image_id)}, {"$set": image.dict()})
    return {"message": "Updated successfully"}

# ============ Pages Routes (Tapovan, Gurudev) ============

class PageModel(BaseModel):
    title: Optional[str] = ""
    subtitle: Optional[str] = ""
    description: Optional[str] = ""
    image: Optional[str] = ""
    images: Optional[List[dict]] = []
    videos: Optional[List[str]] = []
    pdfs: Optional[List[dict]] = []

@api_router.get("/pages/{page_slug}")
async def get_page(page_slug: str):
    page = await db.pages.find_one({"slug": page_slug})
    if not page:
        return {}
    page["_id"] = str(page["_id"])
    return page

@api_router.put("/pages/{page_slug}")
async def update_page(page_slug: str, page: PageModel, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    data = page.dict()
    data["slug"] = page_slug
    existing = await db.pages.find_one({"slug": page_slug})
    if existing:
        await db.pages.update_one({"slug": page_slug}, {"$set": data})
    else:
        await db.pages.insert_one(data)
    return {"message": "Page saved successfully"}

# Include router in app
app.include_router(api_router)

# Mount static files AFTER router to avoid conflicts
app.mount("/api/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
