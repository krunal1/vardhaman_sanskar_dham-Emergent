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

# Create uploads directory - use /tmp for cloud deployments (Render, etc.)
import tempfile
UPLOAD_DIR = Path("/tmp/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

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
        secure=True,
        samesite="none",
        max_age=900,
        path="/"
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=604800,
        path="/"
    )
    
    return {
        "email": user["email"],
        "name": user.get("name", ""),
        "role": user.get("role", "user"),
        "access_token": access_token,
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

class DonationCategoryModel(BaseModel):
    name: str
    nameHindi: str = ""
    description: str = ""
    order: int = 0
    active: bool = True

class RazorpayOrderModel(BaseModel):
    amount: int  # in paise
    currency: str = "INR"
    donations: dict = {}  # category-wise breakdown
    donor: dict = {}  # donor details

@api_router.post("/auth/forgot-password")
async def forgot_password(data: dict):
    email = data.get("email", "").lower().strip()
    user = await db.users.find_one({"email": email})
    if not user:
        # Don't reveal if email exists
        return {"message": "If this email is registered, a reset link has been sent."}
    
    # Generate reset token valid for 1 hour
    token = uuid.uuid4().hex
    expires = datetime.now(timezone.utc).timestamp() + 3600
    await db.password_resets.insert_one({
        "email": email,
        "token": token,
        "expires": expires,
        "used": False
    })

    frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")
    reset_link = f"{frontend_url}/admin/reset-password?token={token}"

    smtp_user = os.environ.get("SMTP_USER", "")
    smtp_pass = os.environ.get("SMTP_PASS", "")
    smtp_host = os.environ.get("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.environ.get("SMTP_PORT", "587"))

    if smtp_user and smtp_pass:
        html = f"""
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:30px;background:#f5f5f5;border-radius:12px;">
            <div style="background:#1a3a6b;padding:20px;border-radius:8px 8px 0 0;text-align:center;">
                <h2 style="color:white;margin:0;">Vardhaman Sanskar Dham</h2>
                <p style="color:#fbbf24;margin:5px 0 0;">Admin Password Reset</p>
            </div>
            <div style="background:white;padding:25px;border-radius:0 0 8px 8px;">
                <p style="color:#555;">You requested a password reset for your admin account.</p>
                <p style="color:#555;">Click the button below to reset your password. This link expires in <strong>1 hour</strong>.</p>
                <div style="text-align:center;margin:25px 0;">
                    <a href="{reset_link}" style="background:#1a3a6b;color:white;padding:12px 30px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">
                        Reset Password
                    </a>
                </div>
                <p style="color:#999;font-size:12px;">If you didn't request this, ignore this email. Your password won't change.</p>
                <p style="color:#999;font-size:11px;word-break:break-all;">Link: {reset_link}</p>
            </div>
        </div>
        """
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = "Admin Password Reset — Vardhaman Sanskar Dham"
            msg["From"] = f"Vardhaman Sanskar Dham <{smtp_user}>"
            msg["To"] = email
            msg.attach(MIMEText(html, "html"))

            def _send():
                with smtplib.SMTP(smtp_host, smtp_port) as server:
                    server.ehlo()
                    server.starttls()
                    server.ehlo()
                    server.login(smtp_user, smtp_pass)
                    server.sendmail(smtp_user, [email], msg.as_string())

            import asyncio
            await asyncio.to_thread(_send)
        except Exception as e:
            logger.error(f"Reset email failed: {str(e)}")

    return {"message": "If this email is registered, a reset link has been sent."}

@api_router.post("/auth/reset-password")
async def reset_password(data: dict):
    token = data.get("token", "")
    new_password = data.get("password", "")

    if not token or len(new_password) < 6:
        raise HTTPException(status_code=400, detail="Invalid token or password too short")

    reset = await db.password_resets.find_one({"token": token, "used": False})
    if not reset:
        raise HTTPException(status_code=400, detail="Invalid or expired reset link")

    if datetime.now(timezone.utc).timestamp() > reset["expires"]:
        raise HTTPException(status_code=400, detail="Reset link has expired. Please request a new one.")

    # Update password
    await db.users.update_one(
        {"email": reset["email"]},
        {"$set": {"password_hash": hash_password(new_password)}}
    )
    # Mark token as used
    await db.password_resets.update_one({"token": token}, {"$set": {"used": True}})

    return {"message": "Password reset successfully"}


@api_router.get("/test-email")
async def test_email():
    smtp_host = os.environ.get("SMTP_HOST", "NOT SET")
    smtp_port = os.environ.get("SMTP_PORT", "NOT SET")
    smtp_user = os.environ.get("SMTP_USER", "NOT SET")
    smtp_pass = os.environ.get("SMTP_PASS", "NOT SET")
    
    config = {
        "smtp_host": smtp_host,
        "smtp_port": smtp_port,
        "smtp_user": smtp_user,
        "smtp_pass_length": len(smtp_pass) if smtp_pass != "NOT SET" else 0,
        "smtp_pass_set": smtp_pass != "NOT SET"
    }
    
    try:
        import smtplib
        with smtplib.SMTP(smtp_host, int(smtp_port)) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(smtp_user, smtp_pass)
            server.sendmail(
                smtp_user,
                [smtp_user],
                f"Subject: VSD Test Email\n\nThis is a test email from your VSD backend. SMTP is working!"
            )
        return {"success": True, "config": config, "message": "Test email sent successfully to " + smtp_user}
    except Exception as e:
        return {"success": False, "config": config, "error": str(e), "error_type": type(e).__name__}


async def get_all_donation_categories_admin(user: dict = Depends(get_current_user)):
    cats = await db.donation_categories.find().sort("order", 1).to_list(100)
    for c in cats:
        c["_id"] = str(c["_id"])
    return cats

@api_router.get("/donation-categories")
async def get_donation_categories():
    cats = await db.donation_categories.find({"active": True}).sort("order", 1).to_list(50)
    if not cats:
        # Return defaults if none set
        defaults = [
            {"name": "Sarva Sadharana", "nameHindi": "सर्व साधारण", "order": 1, "active": True},
            {"name": "Sadhu Sadhvi Vaiyavacch", "nameHindi": "साधु साध्वी वैयावच्च", "order": 2, "active": True},
            {"name": "Sadharmik Bhakti", "nameHindi": "साधर्मिक भक्ति", "order": 3, "active": True},
            {"name": "Bal Sanskaran", "nameHindi": "बाल संस्करण", "order": 4, "active": True},
            {"name": "Jeevdaya", "nameHindi": "जीवदया", "order": 5, "active": True},
            {"name": "Rahat Karya", "nameHindi": "राहत कार्य", "order": 6, "active": True},
            {"name": "Anukampa", "nameHindi": "अनुकंपा", "order": 7, "active": True},
        ]
        await db.donation_categories.insert_many(defaults)
        cats = await db.donation_categories.find({"active": True}).sort("order", 1).to_list(50)
    for c in cats:
        c["_id"] = str(c["_id"])
    return cats

@api_router.post("/donation-categories")
async def create_donation_category(cat: DonationCategoryModel, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    result = await db.donation_categories.insert_one(cat.dict())
    return {"_id": str(result.inserted_id), **cat.dict()}

@api_router.put("/donation-categories/{cat_id}")
async def update_donation_category(cat_id: str, cat: DonationCategoryModel, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    await db.donation_categories.update_one({"_id": ObjectId(cat_id)}, {"$set": cat.dict()})
    return {"message": "Updated"}

@api_router.delete("/donation-categories/{cat_id}")
async def delete_donation_category(cat_id: str, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    await db.donation_categories.delete_one({"_id": ObjectId(cat_id)})
    return {"message": "Deleted"}

@api_router.post("/razorpay/create-order")
async def create_razorpay_order(order_data: RazorpayOrderModel):
    razorpay_key = os.environ.get("RAZORPAY_KEY_ID")
    razorpay_secret = os.environ.get("RAZORPAY_KEY_SECRET")
    if not razorpay_key or not razorpay_secret:
        raise HTTPException(status_code=500, detail="Razorpay not configured")
    try:
        import razorpay
        client = razorpay.Client(auth=(razorpay_key, razorpay_secret))
        order = client.order.create({
            "amount": order_data.amount,
            "currency": order_data.currency,
            "receipt": f"vsd_{uuid.uuid4().hex[:8]}",
            "notes": {
                "donor_name": order_data.donor.get("name", ""),
                "donor_email": order_data.donor.get("email", ""),
                "donor_phone": order_data.donor.get("phone", ""),
                "categories": str(order_data.donations)
            }
        })
        # Save pending donation record
        await db.razorpay_orders.insert_one({
            "order_id": order["id"],
            "amount": order_data.amount,
            "donations": order_data.donations,
            "donor": order_data.donor,
            "status": "created",
            "created_at": datetime.utcnow().isoformat()
        })
        return {
            "order_id": order["id"],
            "amount": order["amount"],
            "currency": order["currency"],
            "key": razorpay_key
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Razorpay error: {str(e)}")

@api_router.post("/razorpay/verify-payment")
async def verify_razorpay_payment(data: dict):
    razorpay_key = os.environ.get("RAZORPAY_KEY_ID")
    razorpay_secret = os.environ.get("RAZORPAY_KEY_SECRET")
    try:
        import razorpay
        client = razorpay.Client(auth=(razorpay_key, razorpay_secret))
        client.utility.verify_payment_signature({
            "razorpay_order_id": data["razorpay_order_id"],
            "razorpay_payment_id": data["razorpay_payment_id"],
            "razorpay_signature": data["razorpay_signature"]
        })

        # Get the original order details
        order = await db.razorpay_orders.find_one({"order_id": data["razorpay_order_id"]})

        # Update razorpay_orders status
        await db.razorpay_orders.update_one(
            {"order_id": data["razorpay_order_id"]},
            {"$set": {"status": "paid", "payment_id": data["razorpay_payment_id"]}}
        )

        # Save to donation_records (shown in admin panel)
        donor = order.get("donor", {}) if order else {}
        amount = (order.get("amount", 0) / 100) if order else 0  # convert paise to rupees
        donations = order.get("donations", {}) if order else {}
        now = datetime.now(timezone.utc)

        await db.donation_records.insert_one({
            "donorName": donor.get("name", "Unknown"),
            "donorEmail": donor.get("email", ""),
            "donorPhone": donor.get("phone", ""),
            "donorPan": donor.get("pan", ""),
            "donorAddress": f"{donor.get('address1', '')} {donor.get('address2', '')} {donor.get('city', '')} {donor.get('state', '')} {donor.get('pincode', '')}".strip(),
            "amount": amount,
            "transactionId": data["razorpay_payment_id"],
            "orderId": data["razorpay_order_id"],
            "status": "paid",
            "paymentMethod": "Razorpay",
            "donationBreakdown": donations,
            "date": now.strftime("%Y-%m-%d"),
            "time": now.strftime("%H:%M:%S"),
            "created_at": now,
            "thankYouSent": False
        })

        # Send acknowledgement email in background (non-blocking)
        import asyncio
        asyncio.create_task(send_donation_email(donor, amount, donations, data["razorpay_payment_id"]))

        return {"success": True, "payment_id": data["razorpay_payment_id"]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Payment verification failed: {str(e)}")


import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

async def send_donation_email(donor: dict, amount: float, donations: dict, payment_id: str):
    """Send donation acknowledgement email to donor"""
    smtp_host = os.environ.get("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.environ.get("SMTP_PORT", "587"))
    smtp_user = os.environ.get("SMTP_USER", "")
    smtp_pass = os.environ.get("SMTP_PASS", "")
    
    if not smtp_user or not smtp_pass:
        logger.warning("SMTP not configured, skipping email")
        return False

    donor_email = donor.get("email", "")
    donor_name = donor.get("name", "Donor")
    donor_pan = donor.get("pan", "")
    
    if not donor_email:
        return False

    # Build category breakdown HTML
    breakdown_rows = ""
    for cat, amt in donations.items():
        breakdown_rows += f"""
        <tr>
            <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;color:#555;">{cat}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:bold;color:#1a3a6b;">₹{int(amt):,}</td>
        </tr>"""

    html = f"""
    <!DOCTYPE html>
    <html>
    <body style="font-family:Arial,sans-serif;background:#f5f5f5;margin:0;padding:20px;">
    <div style="max-width:600px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#1a3a6b,#2a4a8b);padding:30px;text-align:center;">
            <img src="https://customer-assets.emergentagent.com/job_sanskar-dham/artifacts/ed94r76r_VSD_PNG_LOGO.png" height="60" style="margin-bottom:10px;" alt="VSD Logo"/>
            <h1 style="color:white;margin:0;font-size:22px;">Vardhaman Sanskar Dham</h1>
            <p style="color:#fbbf24;margin:5px 0 0 0;font-size:13px;">Inspired by P.P.P. Chandrashekharvijaiyji M.S.</p>
        </div>

        <!-- Body -->
        <div style="padding:30px;">
            <h2 style="color:#1a3a6b;margin-top:0;">🙏 Thank You, {donor_name}!</h2>
            <p style="color:#555;line-height:1.6;">
                Your generous donation has been received successfully. May your contribution bring blessings and happiness to you and your family.
            </p>

            <!-- Amount box -->
            <div style="background:#f0f7ff;border:2px solid #1a3a6b;border-radius:8px;padding:20px;text-align:center;margin:20px 0;">
                <p style="margin:0;color:#555;font-size:14px;">Total Donation Amount</p>
                <p style="margin:5px 0 0 0;color:#1a3a6b;font-size:36px;font-weight:bold;">₹{amount:,.0f}</p>
            </div>

            <!-- Breakdown -->
            {"<h3 style='color:#1a3a6b;'>Donation Breakdown</h3><table style='width:100%;border-collapse:collapse;'>" + breakdown_rows + "</table>" if breakdown_rows else ""}

            <!-- Transaction details -->
            <div style="background:#f9f9f9;border-radius:8px;padding:15px;margin-top:20px;">
                <h3 style="color:#1a3a6b;margin-top:0;font-size:15px;">Transaction Details</h3>
                <table style="width:100%;font-size:13px;color:#555;">
                    <tr><td style="padding:4px 0;"><strong>Payment ID:</strong></td><td style="font-family:monospace;">{payment_id}</td></tr>
                    <tr><td style="padding:4px 0;"><strong>Donor Name:</strong></td><td>{donor_name}</td></tr>
                    {"<tr><td style='padding:4px 0;'><strong>PAN Number:</strong></td><td>" + donor_pan + "</td></tr>" if donor_pan else ""}
                    <tr><td style="padding:4px 0;"><strong>Amount:</strong></td><td>₹{amount:,.0f}</td></tr>
                </table>
            </div>

            <!-- 80G Note -->
            <div style="background:#fffbeb;border-left:4px solid #d97706;padding:15px;margin-top:20px;border-radius:0 8px 8px 0;">
                <p style="margin:0;color:#92400e;font-size:13px;">
                    <strong>📄 80G Tax Exemption:</strong> This donation is eligible for 80G tax deduction. 
                    {"Your PAN (" + donor_pan + ") has been recorded." if donor_pan else "Please share your PAN number for the 80G certificate."}
                    Contact us at <a href="mailto:vsddombivli@gmail.com" style="color:#1a3a6b;">vsddombivli@gmail.com</a> or WhatsApp 
                    <a href="https://wa.me/918080102012" style="color:#1a3a6b;">+91 8080102012</a>.
                </p>
            </div>

            <p style="color:#555;margin-top:25px;line-height:1.6;">
                With gratitude,<br/>
                <strong style="color:#1a3a6b;">Vardhaman Sanskar Dham</strong><br/>
                <span style="font-size:13px;color:#888;">Registration No: E-19790 | Mumbai, Maharashtra</span>
            </p>
        </div>

        <!-- Footer -->
        <div style="background:#1a3a6b;padding:15px;text-align:center;">
            <p style="color:#94a3b8;margin:0;font-size:12px;">
                © {datetime.now().year} Vardhaman Sanskar Dham. All rights reserved.
            </p>
        </div>
    </div>
    </body>
    </html>
    """

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"🙏 Donation Acknowledgement - ₹{amount:,.0f} | Vardhaman Sanskar Dham"
        msg["From"] = f"Vardhaman Sanskar Dham <{smtp_user}>"
        msg["To"] = donor_email
        msg["Bcc"] = smtp_user  # Admin gets a copy
        msg.attach(MIMEText(html, "html"))

        def _send():
            with smtplib.SMTP(smtp_host, smtp_port) as server:
                server.ehlo()
                server.starttls()
                server.ehlo()
                server.login(smtp_user, smtp_pass)
                server.sendmail(smtp_user, [donor_email, smtp_user], msg.as_string())

        import asyncio
        await asyncio.to_thread(_send)
        logger.info(f"Donation email sent to {donor_email}")
        return True
    except Exception as e:
        logger.error(f"Email send failed: {str(e)}")
        return False


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

    allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif",
                     "video/mp4", "video/webm", "video/ogg", "video/quicktime", "video/x-msvideo"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Only image and video files are allowed")

    cloudinary_url = os.environ.get("CLOUDINARY_URL")

    if cloudinary_url:
        # Upload to Cloudinary
        try:
            import cloudinary
            import cloudinary.uploader

            cloudinary.config(cloudinary_url=cloudinary_url)

            is_video = file.content_type.startswith("video/")
            file_bytes = await file.read()

            result = cloudinary.uploader.upload(
                file_bytes,
                resource_type="video" if is_video else "image",
                folder="vsdham",
            )
            return {"url": result["secure_url"], "filename": result["public_id"]}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Cloudinary upload failed: {str(e)}")
        finally:
            file.file.close()
    else:
        # Fallback: local /tmp storage
        try:
            file_extension = file.filename.split(".")[-1]
            unique_filename = f"{uuid.uuid4()}.{file_extension}"
            file_path = UPLOAD_DIR / unique_filename
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            backend_url = os.environ.get("REACT_APP_BACKEND_URL", "http://localhost:8001")
            return {"url": f"{backend_url}/api/uploads/{unique_filename}", "filename": unique_filename}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
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