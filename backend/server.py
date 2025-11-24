from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime
from models import (
    ConferenceRegistrationCreate, ConferenceRegistration,
    ContactMessageCreate, ContactMessage,
    AdminLogin, TokenResponse, DashboardStats,
    PaymentInitialize, PaymentVerify,
    Book, BookPurchaseCreate, BookPurchase
)
from models_sql import (
    Admin as DBAdmin,
    Registration as DBRegistration,
    Contact as DBContact,
    Book as DBBook,
    BookPurchase as DBBookPurchase
)
from database import get_db
from utils.auth import create_access_token, verify_token, hash_password, verify_password
from utils.paystack import paystack_client
from utils.sendgrid_client import sendgrid_client

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app without a prefix
app = FastAPI(title="Nigerland Consult API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ==================== CONFERENCE REGISTRATION ENDPOINTS ====================

@api_router.post("/registrations/conference", response_model=ConferenceRegistration)
def create_conference_registration(
    registration: ConferenceRegistrationCreate,
    db: Session = Depends(get_db)
):
    """Register for a conference"""
    try:
        # Create registration object
        registration_obj = ConferenceRegistration(**registration.dict())
        
        # Convert to dict for database
        registration_dict = registration_obj.dict()
        
        # Create database model instance
        db_registration = DBRegistration(**registration_dict)
        
        db.add(db_registration)
        db.commit()
        db.refresh(db_registration)
        
        # Send confirmation email
        sendgrid_client.send_registration_confirmation(
            registration_obj.email,
            registration_obj.fullName,
            registration_obj.conference,
            registration_obj.registrationId
        )
        
        logger.info(f"New conference registration: {registration_obj.registrationId}")
        return registration_obj
    except Exception as e:
        logger.error(f"Error creating registration: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/registrations", response_model=List[ConferenceRegistration])
def get_all_registrations(
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Get all conference registrations (Admin only)"""
    try:
        registrations = db.query(DBRegistration).order_by(DBRegistration.created_at.desc()).all()
        return [ConferenceRegistration(**reg.__dict__) for reg in registrations]
    except Exception as e:
        logger.error(f"Error fetching registrations: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/registrations/{registration_id}", response_model=ConferenceRegistration)
def get_registration(
    registration_id: str,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Get a specific registration (Admin only)"""
    registration = db.query(DBRegistration).filter(DBRegistration.registration_id == registration_id).first()
    if not registration:
        raise HTTPException(status_code=404, detail="Registration not found")
    return ConferenceRegistration(**registration.__dict__)

@api_router.put("/registrations/{registration_id}/status")
def update_registration_status(
    registration_id: str,
    status: str,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Update registration status (Admin only)"""
    try:
        registration = db.query(DBRegistration).filter(DBRegistration.registration_id == registration_id).first()
        if not registration:
            raise HTTPException(status_code=404, detail="Registration not found")
        
        registration.status = status
        registration.updated_at = datetime.utcnow()
        db.commit()
        
        return {"message": "Status updated successfully"}
    except Exception as e:
        logger.error(f"Error updating status: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# ==================== PAYMENT ENDPOINTS ====================

@api_router.post("/payments/initialize")
def initialize_payment(
    payment: PaymentInitialize,
    db: Session = Depends(get_db)
):
    """Initialize Paystack payment"""
    try:
        # Find registration
        registration = db.query(DBRegistration).filter(
            DBRegistration.registration_id == payment.registrationId
        ).first()
        
        if not registration:
            raise HTTPException(status_code=404, detail="Registration not found")
        
        # Calculate amount in kobo (Paystack uses kobo)
        amount_kobo = int(payment.amount * 100)
        
        # Generate unique reference
        reference = f"REG-{payment.registrationId}-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Get frontend URL for callback
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
        callback_url = f"{frontend_url}/payment/success?reference={reference}"
        
        # Initialize Paystack payment
        result = paystack_client.initialize_payment(
            email=payment.email,
            amount=amount_kobo,
            reference=reference,
            callback_url=callback_url
        )
        
        if result.get("status"):
            # Update registration with payment reference
            registration.payment_reference = reference
            registration.amount = payment.amount
            registration.updated_at = datetime.utcnow()
            db.commit()
            
            return {
                "status": True,
                "authorization_url": result["data"]["authorization_url"],
                "reference": reference
            }
        else:
            raise HTTPException(status_code=400, detail=result.get("message"))
    except Exception as e:
        logger.error(f"Payment initialization error: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/payments/verify")
def verify_payment(
    payment: PaymentVerify,
    db: Session = Depends(get_db)
):
    """Verify Paystack payment"""
    try:
        result = paystack_client.verify_payment(payment.reference)
        
        if result.get("status") and result["data"]["status"] == "success":
            # Find and update registration
            registration = db.query(DBRegistration).filter(
                DBRegistration.payment_reference == payment.reference
            ).first()
            
            if registration:
                registration.status = "confirmed"
                registration.payment_status = "completed"
                registration.updated_at = datetime.utcnow()
                db.commit()
                
                # Send confirmation email
                sendgrid_client.send_payment_confirmation(
                    registration.email,
                    registration.full_name,
                    registration.conference,
                    registration.amount
                )
                
                return {
                    "status": True,
                    "message": "Payment verified successfully",
                    "registration_id": registration.registration_id
                }
            
            return {
                "status": True,
                "message": "Payment verified but registration not found"
            }
        else:
            return {
                "status": False,
                "message": "Payment verification failed"
            }
    except Exception as e:
        logger.error(f"Payment verification error: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# ==================== CONTACT MESSAGE ENDPOINTS ====================

@api_router.post("/contact", response_model=ContactMessage)
def create_contact_message(
    contact: ContactMessageCreate,
    db: Session = Depends(get_db)
):
    """Submit a contact message"""
    try:
        contact_obj = ContactMessage(**contact.dict())
        
        # Create database model
        db_contact = DBContact(**contact_obj.dict())
        
        db.add(db_contact)
        db.commit()
        db.refresh(db_contact)
        
        # Send confirmation emails
        sendgrid_client.send_contact_confirmation(contact_obj.email, contact_obj.name)
        sendgrid_client.send_admin_notification(
            contact_obj.name,
            contact_obj.email,
            contact_obj.subject,
            contact_obj.message
        )
        
        logger.info(f"New contact message from: {contact_obj.email}")
        return contact_obj
    except Exception as e:
        logger.error(f"Error creating contact message: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/contact", response_model=List[ContactMessage])
def get_all_messages(
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Get all contact messages (Admin only)"""
    try:
        messages = db.query(DBContact).order_by(DBContact.created_at.desc()).all()
        return [ContactMessage(**msg.__dict__) for msg in messages]
    except Exception as e:
        logger.error(f"Error fetching messages: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/contact/{message_id}/status")
def update_message_status(
    message_id: str,
    status: str,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Update message status (Admin only)"""
    try:
        message = db.query(DBContact).filter(DBContact.id == message_id).first()
        if not message:
            raise HTTPException(status_code=404, detail="Message not found")
        
        message.status = status
        db.commit()
        
        return {"message": "Status updated successfully"}
    except Exception as e:
        logger.error(f"Error updating status: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# ==================== AUTHENTICATION ENDPOINTS ====================

@api_router.post("/auth/login", response_model=TokenResponse)
def admin_login(
    credentials: AdminLogin,
    db: Session = Depends(get_db)
):
    """Admin login endpoint"""
    try:
        # Find admin by username
        admin = db.query(DBAdmin).filter(DBAdmin.username == credentials.username).first()
        
        if not admin:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        # Verify password
        if not verify_password(credentials.password, admin.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        # Create access token
        access_token = create_access_token(data={"sub": admin.username})
        
        logger.info(f"Admin logged in: {admin.username}")
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/auth/verify")
def verify_auth_token(token: dict = Depends(verify_token)):
    """Verify authentication token"""
    return {"valid": True, "user": token.get("sub")}

# ==================== ADMIN DASHBOARD ENDPOINTS ====================

@api_router.get("/admin/stats", response_model=DashboardStats)
def get_dashboard_stats(
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Get dashboard statistics"""
    try:
        # Get total registrations
        total_registrations = db.query(DBRegistration).count()
        
        # Get total messages
        total_messages = db.query(DBContact).count()
        
        # Get pending registrations
        pending_registrations = db.query(DBRegistration).filter(
            DBRegistration.status == "pending"
        ).count()
        
        # Get confirmed registrations
        confirmed_registrations = db.query(DBRegistration).filter(
            DBRegistration.status.in_(["confirmed", "paid"])
        ).count()
        
        # Calculate total revenue from conference registrations
        conference_revenue = db.query(func.sum(DBRegistration.amount)).filter(
            DBRegistration.payment_status == "completed"
        ).scalar() or 0
        
        # Calculate total revenue from book purchases
        book_revenue = db.query(func.sum(DBBookPurchase.amount)).filter(
            DBBookPurchase.payment_status == "completed"
        ).scalar() or 0
        
        # Total revenue from all sources
        total_revenue = conference_revenue + book_revenue
        
        # Get monthly registrations (placeholder)
        monthly_registrations = []
        
        return DashboardStats(
            totalRegistrations=total_registrations,
            totalMessages=total_messages,
            pendingRegistrations=pending_registrations,
            confirmedRegistrations=confirmed_registrations,
            totalRevenue=total_revenue,
            monthlyRegistrations=monthly_registrations
        )
    except Exception as e:
        logger.error(f"Error fetching stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== BOOK ENDPOINTS ====================

@api_router.get("/books", response_model=List[Book])
def get_all_books(db: Session = Depends(get_db)):
    """Get all available books"""
    try:
        books = db.query(DBBook).order_by(DBBook.created_at.desc()).all()
        return [Book(**book.__dict__) for book in books]
    except Exception as e:
        logger.error(f"Error fetching books: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/books/purchases", response_model=List[BookPurchase])
def get_book_purchases(
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Get all book purchases (Admin only)"""
    try:
        purchases = db.query(DBBookPurchase).order_by(DBBookPurchase.created_at.desc()).all()
        return [BookPurchase(**purchase.__dict__) for purchase in purchases]
    except Exception as e:
        logger.error(f"Error fetching purchases: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/books/{book_id}", response_model=Book)
def get_book(book_id: str, db: Session = Depends(get_db)):
    """Get a specific book"""
    book = db.query(DBBook).filter(DBBook.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return Book(**book.__dict__)

@api_router.post("/books/purchase", response_model=BookPurchase)
def purchase_book(
    purchase: BookPurchaseCreate,
    db: Session = Depends(get_db)
):
    """Purchase a book"""
    try:
        # Find the book
        book = db.query(DBBook).filter(DBBook.id == purchase.bookId).first()
        if not book:
            raise HTTPException(status_code=404, detail="Book not found")
        
        # Create purchase object
        purchase_obj = BookPurchase(**purchase.dict(), amount=book.price)
        
        # Create database model
        db_purchase = DBBookPurchase(**purchase_obj.dict())
        
        db.add(db_purchase)
        db.commit()
        db.refresh(db_purchase)
        
        logger.info(f"New book purchase: {purchase_obj.purchaseId}")
        return purchase_obj
    except Exception as e:
        logger.error(f"Error creating book purchase: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/books/purchase/{purchase_id}/payment")
def initialize_book_payment(
    purchase_id: str,
    db: Session = Depends(get_db)
):
    """Initialize payment for book purchase"""
    try:
        # Find purchase
        purchase = db.query(DBBookPurchase).filter(
            DBBookPurchase.purchase_id == purchase_id
        ).first()
        
        if not purchase:
            raise HTTPException(status_code=404, detail="Purchase not found")
        
        # Calculate amount in kobo
        amount_kobo = int(purchase.amount * 100)
        
        # Generate unique reference
        reference = f"BOOK-{purchase_id}-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Get frontend URL for callback
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
        callback_url = f"{frontend_url}/payment/success?reference={reference}"
        
        # Initialize Paystack payment
        result = paystack_client.initialize_payment(
            email=purchase.email,
            amount=amount_kobo,
            reference=reference,
            callback_url=callback_url
        )
        
        if result.get("status"):
            # Update purchase with payment reference
            purchase.payment_reference = reference
            purchase.updated_at = datetime.utcnow()
            db.commit()
            
            return {
                "status": True,
                "authorization_url": result["data"]["authorization_url"],
                "reference": reference
            }
        else:
            raise HTTPException(status_code=400, detail=result.get("message"))
    except Exception as e:
        logger.error(f"Book payment initialization error: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/books/purchase/verify")
def verify_book_payment(
    payment: PaymentVerify,
    db: Session = Depends(get_db)
):
    """Verify book purchase payment"""
    try:
        result = paystack_client.verify_payment(payment.reference)
        
        if result.get("status") and result["data"]["status"] == "success":
            # Find and update purchase
            purchase = db.query(DBBookPurchase).filter(
                DBBookPurchase.payment_reference == payment.reference
            ).first()
            
            if purchase:
                purchase.payment_status = "completed"
                purchase.updated_at = datetime.utcnow()
                db.commit()
                
                # Get book details
                book = db.query(DBBook).filter(DBBook.id == purchase.book_id).first()
                
                # Send confirmation email with download link
                if book:
                    sendgrid_client.send_book_purchase_confirmation(
                        purchase.email,
                        purchase.full_name,
                        book.title,
                        book.pdf_url if book.pdf_url else "Contact support for download"
                    )
                
                return {
                    "status": True,
                    "message": "Payment verified successfully",
                    "purchase_id": purchase.purchase_id
                }
            
            return {
                "status": True,
                "message": "Payment verified but purchase not found"
            }
        else:
            return {
                "status": False,
                "message": "Payment verification failed"
            }
    except Exception as e:
        logger.error(f"Book payment verification error: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/books/purchase/user/{email}")
def get_user_purchases(
    email: str,
    db: Session = Depends(get_db)
):
    """Get all purchases for a user by email"""
    try:
        purchases = db.query(DBBookPurchase).filter(
            DBBookPurchase.email == email,
            DBBookPurchase.payment_status == "completed"
        ).all()
        return [BookPurchase(**purchase.__dict__) for purchase in purchases]
    except Exception as e:
        logger.error(f"Error fetching user purchases: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== ROOT ENDPOINTS ====================

@api_router.get("/")
def read_root():
    """API root endpoint"""
    return {
        "message": "Nigerland Consult API",
        "version": "1.0.0",
        "status": "active"
    }

# ==================== CORS MIDDLEWARE ====================

# Get CORS origins from environment
cors_origins = os.getenv('CORS_ORIGINS', '*').split(',')

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the API router
app.include_router(api_router)

# Include other routers
from routes_admin import router as admin_router
from routes_morelife import router as morelife_router
from routes_training import router as training_router
from conference_payment import router as conference_payment_router

app.include_router(admin_router, prefix="/api")
app.include_router(morelife_router, prefix="/api")
app.include_router(training_router, prefix="/api")
app.include_router(conference_payment_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
