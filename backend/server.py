from dotenv import load_dotenv
from pathlib import Path

# Load environment variables FIRST
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, UploadFile, File
from fastapi.responses import JSONResponse
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

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-this')
JWT_ALGORITHM = "HS256"

# Create the main app
app = FastAPI()

# CORS Configuration
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

class GalleryImageModel(BaseModel):
    url: str
    title: str
    category: str

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
    upiId: str

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
        f.write(f"# Admin Credentials\n\n")
        f.write(f"**Email:** {admin_email}\n")
        f.write(f"**Password:** {admin_password}\n")
        f.write(f"**Role:** admin\n\n")
        f.write(f"## Endpoints\n")
        f.write(f"- POST /api/auth/login\n")
        f.write(f"- GET /api/auth/me\n")
        f.write(f"- POST /api/auth/logout\n")

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

# ============ Activities Routes ============

@api_router.get("/activities")
async def get_activities():
    activities = await db.activities.find().to_list(100)
    for activity in activities:
        activity["_id"] = str(activity["_id"])
    return activities

@api_router.post("/activities")
async def create_activity(activity: ActivityModel, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    result = await db.activities.insert_one(activity.dict())
    return {"id": str(result.inserted_id), **activity.dict()}

@api_router.put("/activities/{activity_id}")
async def update_activity(activity_id: str, activity: ActivityModel, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.activities.update_one(
        {"_id": ObjectId(activity_id)},
        {"$set": activity.dict()}
    )
    return {"id": activity_id, **activity.dict()}

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
    return events

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

# Include router in app
app.include_router(api_router)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
