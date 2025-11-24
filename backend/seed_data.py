"""
Seed script to populate the database with initial data
Run this script once to add books, team members, projects, and announcements
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Books data
books_data = [
    {
        "id": "book-001",
        "title": "Nigeria's Hero Vol 1",
        "author": "Nigerland Consult",
        "description": "Inspiring stories of Nigerian heroes and nation builders",
        "price": 5000,
        "category": "Nation Building",
        "image": "/assets/books/building courage.jpg",
        "pdfUrl": "/assets/books/Nigeria's hero Vol 1.pdf",
        "isPaid": True
    },
    {
        "id": "book-002",
        "title": "Nigeria's Hero Vol 2",
        "author": "Nigerland Consult",
        "description": "Continuing the journey of Nigerian excellence",
        "price": 5000,
        "category": "Nation Building",
        "image": "/assets/books/salute to .jpg",
        "pdfUrl": "/assets/books/Nigeria's hero Vol 2 .pdf",
        "isPaid": True
    },
    {
        "id": "book-003",
        "title": "The Good Nigerian",
        "author": "Nigerland Consult",
        "description": "Stories of integrity and nation building",
        "price": 4500,
        "category": "Ethics & Values",
        "image": "/assets/books/the good nigerian.jpg",
        "pdfUrl": "/assets/books/the good nigerian.pdf",
        "isPaid": True
    },
    {
        "id": "book-004",
        "title": "Yomi and the Three Thieves",
        "author": "Nigerland Consult",
        "description": "A captivating children's story with moral lessons",
        "price": 3000,
        "category": "Children's Books",
        "image": "/assets/books/yomi.jpg",
        "pdfUrl": "/assets/books/yomi n d three thieves (4).pdf",
        "isPaid": True
    },
    {
        "id": "book-005",
        "title": "Building Courage",
        "author": "Nigerland Consult",
        "description": "Developing leadership and courage in young Nigerians",
        "price": 4000,
        "category": "Leadership",
        "image": "/assets/books/building courage.jpg",
        "isPaid": True
    }
]

# Team members data
team_members_data = [
    {
        "id": "team-001",
        "name": "Mr. Kelechi Ngwaba",
        "title": "Managing Director",
        "credentials": "MBA, FCIT",
        "bio": "Visionary leader with over 20 years of experience in management consulting",
        "image": "/assets/team/kelechi.jpg",
        "order": 1
    },
    {
        "id": "team-002",
        "name": "Mrs. Uduak Nkanga Ngwaba",
        "title": "Executive Director",
        "credentials": "MSc, ACCA",
        "bio": "Expert in business development and strategic planning",
        "image": "/assets/team/uduak.jpg",
        "order": 2
    }
]

# Projects data
projects_data = [
    {
        "id": "project-001",
        "title": "Children's Foundation Initiative",
        "description": "Supporting underprivileged children through education and welfare programs",
        "category": "Social Impact",
        "image": "/assets/foundation/foundation1.jpg",
        "status": "active"
    },
    {
        "id": "project-002",
        "title": "Business Development Program",
        "description": "Empowering SMEs with modern business strategies and tools",
        "category": "Business",
        "status": "active"
    },
    {
        "id": "project-003",
        "title": "Government Advisory Services",
        "description": "Providing strategic advice to government institutions",
        "category": "Government",
        "status": "active"
    }
]

# Announcements data
announcements_data = [
    {
        "id": "ann-001",
        "title": "Tax Conference 2025 Registration Open",
        "content": "Join us for the biggest tax conference of the year! Early bird registration now available with special discounts.",
        "type": "info",
        "isActive": True
    },
    {
        "id": "ann-002",
        "title": "New Book Release: Building Courage",
        "content": "Our latest publication on leadership and courage development is now available for purchase.",
        "type": "success",
        "isActive": True
    }
]

async def seed_database():
    """Seed the database with initial data"""
    
    print("Starting database seeding...")
    
    # Clear existing data (optional - comment out if you want to keep existing data)
    # await db.books.delete_many({})
    # await db.team_members.delete_many({})
    # await db.projects.delete_many({})
    # await db.announcements.delete_many({})
    
    # Insert books
    existing_books = await db.books.count_documents({})
    if existing_books == 0:
        await db.books.insert_many(books_data)
        print(f"✅ Inserted {len(books_data)} books")
    else:
        print(f"ℹ️  Books already exist ({existing_books} found)")
    
    # Insert team members
    existing_team = await db.team_members.count_documents({})
    if existing_team == 0:
        await db.team_members.insert_many(team_members_data)
        print(f"✅ Inserted {len(team_members_data)} team members")
    else:
        print(f"ℹ️  Team members already exist ({existing_team} found)")
    
    # Insert projects
    existing_projects = await db.projects.count_documents({})
    if existing_projects == 0:
        await db.projects.insert_many(projects_data)
        print(f"✅ Inserted {len(projects_data)} projects")
    else:
        print(f"ℹ️  Projects already exist ({existing_projects} found)")
    
    # Insert announcements
    existing_announcements = await db.announcements.count_documents({})
    if existing_announcements == 0:
        await db.announcements.insert_many(announcements_data)
        print(f"✅ Inserted {len(announcements_data)} announcements")
    else:
        print(f"ℹ️  Announcements already exist ({existing_announcements} found)")
    
    print("\n✅ Database seeding completed!")
    print("\nData summary:")
    print(f"  - Books: {await db.books.count_documents({})}")
    print(f"  - Team Members: {await db.team_members.count_documents({})}")
    print(f"  - Projects: {await db.projects.count_documents({})}")
    print(f"  - Announcements: {await db.announcements.count_documents({})}")

if __name__ == "__main__":
    asyncio.run(seed_database())
