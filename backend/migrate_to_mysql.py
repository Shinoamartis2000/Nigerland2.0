"""
Migration script to create MySQL tables and import data from MongoDB export
"""
import json
from datetime import datetime
from database import engine, SessionLocal
from models_sql import Base, Admin, Registration, Contact, Book, BookPurchase, Conference, TeamMember, Project, Announcement, TrainingProgram, TrainingEnrollment, MoreLifeAssessment
import uuid

def create_tables():
    """Create all tables in MySQL"""
    print("Creating MySQL tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully!\n")

def import_data():
    """Import data from MongoDB export"""
    print("Starting data import from MongoDB export...")
    
    with open('/app/mongodb_export.json', 'r') as f:
        data = json.load(f)
    
    db = SessionLocal()
    
    try:
        # Import Admins
        print(f"Importing {len(data['admins'])} admins...")
        for item in data['admins']:
            admin = Admin(
                id=item.get('id', str(uuid.uuid4())),
                username=item['username'],
                password=item['password'],
                email=item.get('email'),
                created_at=datetime.fromisoformat(item['createdAt']) if 'createdAt' in item else datetime.now()
            )
            db.add(admin)
        db.commit()
        print(f"✅ Imported {len(data['admins'])} admins\n")
        
        # Import Books
        print(f"Importing {len(data['books'])} books...")
        for item in data['books']:
            book = Book(
                id=item.get('id', str(uuid.uuid4())),
                title=item['title'],
                description=item.get('description', ''),
                author=item['author'],
                price=float(item['price']),
                image=item.get('image', ''),
                pdf_url=item.get('pdfUrl'),
                is_paid=item.get('isPaid', True),
                category=item.get('category', ''),
                created_at=datetime.fromisoformat(item['createdAt']) if 'createdAt' in item else datetime.now()
            )
            db.add(book)
        db.commit()
        print(f"✅ Imported {len(data['books'])} books\n")
        
        # Import Book Purchases
        print(f"Importing {len(data['book_purchases'])} book purchases...")
        for item in data['book_purchases']:
            purchase = BookPurchase(
                id=item.get('id', str(uuid.uuid4())),
                purchase_id=item['purchaseId'],
                book_id=item['bookId'],
                email=item['email'],
                full_name=item['fullName'],
                phone=item['phone'],
                amount=float(item['amount']),
                payment_status=item.get('paymentStatus', 'pending'),
                payment_reference=item.get('paymentReference'),
                created_at=datetime.fromisoformat(item['createdAt']) if 'createdAt' in item else datetime.now(),
                updated_at=datetime.fromisoformat(item['updatedAt']) if 'updatedAt' in item else datetime.now()
            )
            db.add(purchase)
        db.commit()
        print(f"✅ Imported {len(data['book_purchases'])} book purchases\n")
        
        # Import Registrations
        print(f"Importing {len(data['registrations'])} registrations...")
        for item in data['registrations']:
            registration = Registration(
                id=item.get('id', str(uuid.uuid4())),
                registration_id=item['registrationId'],
                full_name=item['fullName'],
                email=item['email'],
                phone=item['phone'],
                organization=item.get('organization'),
                profession=item.get('profession'),
                conference=item['conference'],
                conference_date=item.get('conferenceDate'),
                additional_info=item.get('additionalInfo'),
                status=item.get('status', 'pending'),
                payment_status=item.get('paymentStatus', 'pending'),
                payment_reference=item.get('paymentReference'),
                amount=float(item.get('amount', 0)),
                created_at=datetime.fromisoformat(item['createdAt']) if 'createdAt' in item else datetime.now(),
                updated_at=datetime.fromisoformat(item['updatedAt']) if 'updatedAt' in item else datetime.now()
            )
            db.add(registration)
        db.commit()
        print(f"✅ Imported {len(data['registrations'])} registrations\n")
        
        # Import Contacts
        print(f"Importing {len(data['contacts'])} contacts...")
        for item in data['contacts']:
            contact = Contact(
                id=item.get('id', str(uuid.uuid4())),
                name=item['name'],
                email=item['email'],
                subject=item.get('subject'),
                message=item['message'],
                status=item.get('status', 'unread'),
                created_at=datetime.fromisoformat(item['createdAt']) if 'createdAt' in item else datetime.now()
            )
            db.add(contact)
        db.commit()
        print(f"✅ Imported {len(data['contacts'])} contacts\n")
        
        # Import Team Members
        print(f"Importing {len(data['team_members'])} team members...")
        for item in data['team_members']:
            member = TeamMember(
                id=item.get('id', str(uuid.uuid4())),
                name=item['name'],
                position=item['position'],
                bio=item.get('bio'),
                image=item.get('image'),
                order=item.get('order', 0),
                created_at=datetime.fromisoformat(item['createdAt']) if 'createdAt' in item else datetime.now()
            )
            db.add(member)
        db.commit()
        print(f"✅ Imported {len(data['team_members'])} team members\n")
        
        # Import Projects
        print(f"Importing {len(data['projects'])} projects...")
        for item in data['projects']:
            project = Project(
                id=item.get('id', str(uuid.uuid4())),
                title=item['title'],
                description=item.get('description'),
                image=item.get('image'),
                category=item.get('category'),
                status=item.get('status', 'active'),
                order=item.get('order', 0),
                created_at=datetime.fromisoformat(item['createdAt']) if 'createdAt' in item else datetime.now(),
                updated_at=datetime.fromisoformat(item['updatedAt']) if 'updatedAt' in item else datetime.now()
            )
            db.add(project)
        db.commit()
        print(f"✅ Imported {len(data['projects'])} projects\n")
        
        # Import Announcements
        print(f"Importing {len(data['announcements'])} announcements...")
        for item in data['announcements']:
            announcement = Announcement(
                id=item.get('id', str(uuid.uuid4())),
                title=item['title'],
                message=item['message'],
                type=item.get('type', 'info'),
                is_active=item.get('isActive', True),
                created_at=datetime.fromisoformat(item['createdAt']) if 'createdAt' in item else datetime.now(),
                updated_at=datetime.fromisoformat(item['updatedAt']) if 'updatedAt' in item else datetime.now()
            )
            db.add(announcement)
        db.commit()
        print(f"✅ Imported {len(data['announcements'])} announcements\n")
        
        # Import MoreLife Assessments
        print(f"Importing {len(data['morelife_assessments'])} MoreLife assessments...")
        for item in data['morelife_assessments']:
            assessment = MoreLifeAssessment(
                id=item.get('id', str(uuid.uuid4())),
                assessment_id=item['assessmentId'],
                name=item['name'],
                location=item.get('location'),
                email=item['email'],
                age=item.get('age'),
                education=item.get('education'),
                specific_challenge=item.get('specificChallenge'),
                likely_cause=item.get('likelyCause'),
                duration_of_challenge=item.get('durationOfChallenge'),
                triggering_incident=item.get('triggeringIncident'),
                on_drugs=item.get('onDrugs'),
                commencement_month=item.get('commencementMonth'),
                session_type=item.get('sessionType'),
                status=item.get('status', 'pending'),
                amount=float(item.get('amount', 0)),
                payment_status=item.get('paymentStatus', 'pending'),
                payment_reference=item.get('paymentReference'),
                created_at=datetime.fromisoformat(item['createdAt']) if 'createdAt' in item else datetime.now(),
                updated_at=datetime.fromisoformat(item['updatedAt']) if 'updatedAt' in item else datetime.now()
            )
            db.add(assessment)
        db.commit()
        print(f"✅ Imported {len(data['morelife_assessments'])} MoreLife assessments\n")
        
        print("✅ All data imported successfully!")
        
    except Exception as e:
        print(f"❌ Error during import: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("="*60)
    print("MongoDB to MySQL Migration Script")
    print("="*60 + "\n")
    
    create_tables()
    import_data()
    
    print("\n" + "="*60)
    print("Migration Complete!")
    print("="*60)
