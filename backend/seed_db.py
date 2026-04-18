import os
import sys
from pathlib import Path
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import asyncio

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

async def seed_database():
    print("Starting database seeding...")
    
    # Clear existing data
    await db.activities.delete_many({})
    await db.about.delete_many({})
    await db.events.delete_many({})
    await db.gallery.delete_many({})
    await db.contact.delete_many({})
    await db.donation.delete_many({})
    
    # Seed Activities
    activities = [
        {
            "title": "Jivdaya",
            "subtitle": "Compassion for All Living Beings",
            "description": "Our Jivdaya initiative focuses on serving and protecting all forms of life. We organize regular activities for animal welfare, bird feeding, and creating awareness about compassion towards all living creatures. We have saved 2,14,000 animals in 16 years.",
            "icon": "Heart",
            "image": "https://customer-assets.emergentagent.com/job_sanskar-dham/artifacts/kt5cbhxn_Jivdaya%20Image.jpeg"
        },
        {
            "title": "Anukampa",
            "subtitle": "Service to Humanity",
            "description": "Anukampa represents our commitment to serving those in need. We conduct food distribution drives, medical camps, disaster relief work, school renovations and provide support to underprivileged families in our community.",
            "icon": "HandHeart",
            "image": "https://customer-assets.emergentagent.com/job_sanskar-dham/artifacts/mm0luazz_uttrakhand-relief-work-2.jpg"
        },
        {
            "title": "Sadharmik Bhakti",
            "subtitle": "Spiritual Development",
            "description": "Through Sadharmik Bhakti, we organize spiritual discourses, bhajan sandhyas, meditation sessions, and pooja anushthans to help individuals connect with their inner self and cultivate devotion.",
            "icon": "Sparkles",
            "image": "https://customer-assets.emergentagent.com/job_sanskar-dham/artifacts/nl6kd1wj_Sadharmik%20Bhakti.jpg"
        },
        {
            "title": "Bal Sanskaran",
            "subtitle": "Values for Young Minds",
            "description": "Bal Sanskaran is our flagship program for children, teaching them moral values, cultural heritage, and life skills through engaging workshops, stories, and interactive sessions.",
            "icon": "GraduationCap",
            "image": "https://customer-assets.emergentagent.com/job_sanskar-dham/artifacts/104ekvzy_Pooja-Anushthan.jpeg"
        }
    ]
    
    result = await db.activities.insert_many(activities)
    print(f"Seeded {len(result.inserted_ids)} activities")
    
    # Seed About
    about = {
        "title": "About Vardhaman Sanskar Dham",
        "description": "We are dedicated to work towards the betterment of the society. We have been active over the past two decades in various areas. Vardhaman Sanskar Dham is a spiritual and social service organization based in Dombivli, fostering cultural values, compassion, and community service. Established with the vision of creating a harmonious society, we work tirelessly to spread the message of universal brotherhood and spiritual growth.",
        "mission": "To create a compassionate society rooted in spiritual values and cultural heritage, while serving humanity through various social welfare initiatives.",
        "vision": "A world where every individual lives with dignity, compassion, and spiritual awareness.",
        "stats": [
            {"label": "Years of Service", "value": "20+"},
            {"label": "Lives Touched", "value": "10,000+"},
            {"label": "Animals Saved", "value": "2,14,000+"},
            {"label": "Programs Conducted", "value": "1,200+"}
        ]
    }
    
    await db.about.insert_one(about)
    print("Seeded about section")
    
    # Seed Events
    events = [
        {
            "title": "Annual Spiritual Retreat",
            "date": "2024-03-15",
            "time": "6:00 AM - 8:00 PM",
            "location": "Vardhaman Sanskar Dham, Dombivli",
            "description": "Join us for a day of spiritual discourse, meditation, and cultural programs. Open to all age groups.",
            "status": "upcoming"
        },
        {
            "title": "Bal Sanskaran Workshop",
            "date": "2024-02-20",
            "time": "4:00 PM - 6:00 PM",
            "location": "Main Hall, Dombivli",
            "description": "Interactive workshop for children aged 6-14 years focusing on moral values and life skills.",
            "status": "upcoming"
        },
        {
            "title": "Community Food Drive",
            "date": "2024-01-28",
            "time": "10:00 AM - 2:00 PM",
            "location": "Various locations in Dombivli",
            "description": "Monthly food distribution program serving underprivileged families.",
            "status": "completed"
        }
    ]
    
    result = await db.events.insert_many(events)
    print(f"Seeded {len(result.inserted_ids)} events")
    
    # Seed Gallery
    gallery_images = [
        {
            "url": "https://customer-assets.emergentagent.com/job_sanskar-dham/artifacts/104ekvzy_Pooja-Anushthan.jpeg",
            "title": "Pooja Anushthan",
            "category": "bhakti"
        },
        {
            "url": "https://customer-assets.emergentagent.com/job_sanskar-dham/artifacts/mm0luazz_uttrakhand-relief-work-2.jpg",
            "title": "Uttrakhand Relief Work",
            "category": "service"
        },
        {
            "url": "https://customer-assets.emergentagent.com/job_sanskar-dham/artifacts/nl6kd1wj_Sadharmik%20Bhakti.jpg",
            "title": "Disaster Relief",
            "category": "service"
        },
        {
            "url": "https://customer-assets.emergentagent.com/job_sanskar-dham/artifacts/kt5cbhxn_Jivdaya%20Image.jpeg",
            "title": "Jivdaya - Animal Rescue",
            "category": "service"
        },
        {
            "url": "https://images.pexels.com/photos/1001914/pexels-photo-1001914.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            "title": "Bal Sanskaran Class",
            "category": "education"
        },
        {
            "url": "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            "title": "Children's Workshop",
            "category": "education"
        }
    ]
    
    result = await db.gallery.insert_many(gallery_images)
    print(f"Seeded {len(result.inserted_ids)} gallery images")
    
    # Seed Contact
    contact = {
        "name": "Ankit",
        "phone": "+91 98765 43210",
        "email": "vsddomb@gmail.com",
        "address": "Vardhaman Sanskar Dham, Near City Center, Dombivli (East), Maharashtra - 421201",
        "timing": "Monday - Sunday: 6:00 AM - 8:00 PM"
    }
    
    await db.contact.insert_one(contact)
    print("Seeded contact information")
    
    # Seed Donation
    donation = {
        "bankName": "ICICI Bank",
        "accountName": "Vardhaman Sanskar Dham",
        "accountNumber": "026101000206",
        "ifscCode": "ICIC0000348",
        "upiId": "Q4282391 4@ybl"
    }
    
    await db.donation.insert_one(donation)
    print("Seeded donation details")
    
    print("\nDatabase seeding completed successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
