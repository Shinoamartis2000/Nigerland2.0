from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from models import TrainingEnrollmentCreate, TrainingEnrollment, PaymentVerify
from models_sql import (
    TrainingProgram as DBTrainingProgram,
    TrainingEnrollment as DBTrainingEnrollment
)
from database import get_db
from utils.paystack import paystack_client
from utils.sendgrid_client import sendgrid_client
from datetime import datetime
import logging
import os
import json
from dotenv import load_dotenv
from pathlib import Path

logger = logging.getLogger(__name__)

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

router = APIRouter(prefix="/training", tags=["Training"])

@router.post("/enroll", response_model=TrainingEnrollment)
def create_training_enrollment(
    enrollment: TrainingEnrollmentCreate,
    db: Session = Depends(get_db)
):
    """Enroll in training program"""
    try:
        # Find the training program
        program = db.query(DBTrainingProgram).filter(
            DBTrainingProgram.id == enrollment.programId
        ).first()
        
        if not program:
            raise HTTPException(status_code=404, detail="Training program not found")
        
        # Create enrollment object
        enrollment_obj = TrainingEnrollment(**enrollment.dict(), amount=program.fee)
        
        # Create database model
        db_enrollment = DBTrainingEnrollment(**enrollment_obj.dict())
        
        db.add(db_enrollment)
        db.commit()
        db.refresh(db_enrollment)
        
        # Send confirmation email
        sendgrid_client.send_training_enrollment_confirmation(
            enrollment_obj.email,
            enrollment_obj.fullName,
            program.title,
            enrollment_obj.enrollmentId
        )
        
        logger.info(f"New training enrollment: {enrollment_obj.enrollmentId}")
        return enrollment_obj
    except Exception as e:
        logger.error(f"Error creating training enrollment: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/enrollment/{enrollment_id}/payment")
def initialize_training_payment(
    enrollment_id: str,
    db: Session = Depends(get_db)
):
    """Initialize payment for training enrollment"""
    try:
        enrollment = db.query(DBTrainingEnrollment).filter(
            DBTrainingEnrollment.enrollment_id == enrollment_id
        ).first()
        
        if not enrollment:
            raise HTTPException(status_code=404, detail="Enrollment not found")
        
        amount_kobo = int(enrollment.amount * 100)
        reference = f"TRN-{enrollment_id}-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Get frontend URL for callback
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
        callback_url = f"{frontend_url}/payment/success?reference={reference}"
        
        result = paystack_client.initialize_payment(
            email=enrollment.email,
            amount=amount_kobo,
            reference=reference,
            callback_url=callback_url
        )
        
        if result.get("status"):
            enrollment.payment_reference = reference
            enrollment.updated_at = datetime.utcnow()
            db.commit()
            
            return {
                "status": True,
                "authorization_url": result["data"]["authorization_url"],
                "reference": reference
            }
        else:
            raise HTTPException(status_code=400, detail=result.get("message"))
    except Exception as e:
        logger.error(f"Training payment initialization error: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/enrollment/verify")
def verify_training_payment(
    payment: PaymentVerify,
    db: Session = Depends(get_db)
):
    """Verify training enrollment payment"""
    try:
        result = paystack_client.verify_payment(payment.reference)
        
        if result.get("status") and result["data"]["status"] == "success":
            # Find and update enrollment
            enrollment = db.query(DBTrainingEnrollment).filter(
                DBTrainingEnrollment.payment_reference == payment.reference
            ).first()
            
            if enrollment:
                enrollment.payment_status = "completed"
                enrollment.status = "confirmed"
                enrollment.updated_at = datetime.utcnow()
                db.commit()
                
                # Get program details
                program = db.query(DBTrainingProgram).filter(
                    DBTrainingProgram.id == enrollment.program_id
                ).first()
                
                # Send confirmation email
                if program:
                    sendgrid_client.send_training_payment_confirmation(
                        enrollment.email,
                        enrollment.full_name,
                        program.title,
                        enrollment.amount
                    )
                
                return {
                    "status": True,
                    "message": "Payment verified successfully",
                    "enrollment_id": enrollment.enrollment_id
                }
            
            return {
                "status": True,
                "message": "Payment verified but enrollment not found"
            }
        else:
            return {
                "status": False,
                "message": "Payment verification failed"
            }
    except Exception as e:
        logger.error(f"Training payment verification error: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
