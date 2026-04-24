import os
from pathlib import Path
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import asyncio

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

async def update_donation():
    print("Updating donation details...")
    
    donation = {
        "bankName": "ICICI Bank",
        "accountName": "Vardhman Sanskar Dham",
        "accountNumber": "026101000206",
        "ifscCode": "ICIC0000348",
        "branch": "Opera House, Mumbai",
        "upiId": "Q42823914@ybl",
        "qrCodeImage": "https://customer-assets.emergentagent.com/job_sanskar-dham/artifacts/1vq1jn1z_image.png",
        "receiptContact": "+91 9323199325",
        "receiptContactType": "WhatsApp"
    }
    
    await db.donation.update_one({}, {"$set": donation}, upsert=True)
    print("Donation details updated successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(update_donation())
