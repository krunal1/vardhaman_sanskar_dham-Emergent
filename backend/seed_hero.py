import os
import sys
from pathlib import Path
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import asyncio

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

async def seed_hero():
    print("Seeding hero section...")
    
    await db.hero_section.delete_many({})
    
    hero = {
        "badge": "Serving Since 2004",
        "title": "Building a Compassionate",
        "highlightedWord": "Society",
        "subtitle": "Join us in our mission to spread spiritual values, cultural heritage, and serve humanity through compassion and dedication.",
        "backgroundImage": "https://images.pexels.com/photos/33610944/pexels-photo-33610944.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "button1Text": "Join Our Mission",
        "button2Text": "Learn More",
        "height": "500px"
    }
    
    await db.hero_section.insert_one(hero)
    print("Hero section seeded successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_hero())
