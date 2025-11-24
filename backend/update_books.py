"""
Update books with complete list and correct prices
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

# Complete books data with correct prices
books_data = [
    {
        "id": "book-001",
        "title": "Nigeria's Hero Vol 1",
        "author": "Nigerland Consult",
        "description": "Inspiring stories of Nigerian heroes and nation builders",
        "price": 1500,
        "category": "Nation Building",
        "image": "/assets/books/salute to .jpg",
        "pdfUrl": "/assets/books/Nigeria's hero Vol 1.pdf",
        "isPaid": True
    },
    {
        "id": "book-002",
        "title": "Nigeria's Hero Vol 2",
        "author": "Nigerland Consult",
        "description": "Continuing the journey of Nigerian excellence",
        "price": 1500,
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
        "price": 1500,
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
        "price": 1500,
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
        "price": 1500,
        "category": "Leadership",
        "image": "/assets/books/building courage.jpg",
        "pdfUrl": "",  # No PDF - will be sent via email
        "isPaid": True
    },
    {
        "id": "book-006",
        "title": "Never Again",
        "author": "Nigerland Consult",
        "description": "Powerful lessons on resilience and determination",
        "price": 4500,
        "category": "Inspiration",
        "image": "/assets/books/never again.jpg",
        "pdfUrl": "",  # No PDF - will be sent via email
        "isPaid": True
    },
    {
        "id": "book-007",
        "title": "Three Feet Tall",
        "author": "Nigerland Consult",
        "description": "A heartwarming story about courage and growth",
        "price": 2500,
        "category": "Children's Books",
        "image": "/assets/books/three feet tall.jpg",
        "pdfUrl": "",  # No PDF - will be sent via email
        "isPaid": True
    },
    {
        "id": "book-008",
        "title": "The Quest",
        "author": "Nigerland Consult",
        "description": "An adventure in personal growth and discovery",
        "price": 1500,
        "category": "Adventure",
        "image": "/assets/books/the quest.jpg",
        "pdfUrl": "",  # No PDF - will be sent via email
        "isPaid": True
    },
    {
        "id": "book-009",
        "title": "The Generations",
        "author": "Nigerland Consult",
        "description": "Bridging the gap between generations",
        "price": 1500,
        "category": "Family & Society",
        "image": "/assets/books/the generations.jpg",
        "pdfUrl": "",  # No PDF - will be sent via email
        "isPaid": True
    },
    {
        "id": "book-010",
        "title": "The Tiger and Lion",
        "author": "Nigerland Consult",
        "description": "A tale of strength, courage, and wisdom",
        "price": 1500,
        "category": "Children's Books",
        "image": "/assets/books/the tiger and lion.jpg",
        "pdfUrl": "",  # No PDF - will be sent via email
        "isPaid": True
    }
]

async def update_books():
    """Update books with complete list"""
    
    print("Clearing existing books...")
    await db.books.delete_many({})
    print("✅ Cleared existing books")
    
    print("\nAdding updated books...")
    await db.books.insert_many(books_data)
    print(f"✅ Added {len(books_data)} books")
    
    print("\n📚 Books Summary:")
    for book in books_data:
        pdf_status = "✅ PDF Available" if book['pdfUrl'] else "📧 Will be emailed"
        print(f"  - {book['title']}: ₦{book['price']:,} {pdf_status}")
    
    print("\n✅ Update completed!")

if __name__ == "__main__":
    asyncio.run(update_books())
