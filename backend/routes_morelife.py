from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from models import MoreLifeAssessmentCreate, MoreLifeAssessment, PaymentVerify
from models_sql import MoreLifeAssessment as DBMoreLifeAssessment
from database import get_db
from utils.paystack import paystack_client
from utils.sendgrid_client import sendgrid_client
from datetime import datetime
import logging
import os
from dotenv import load_dotenv
from pathlib import Path

logger = logging.getLogger(__name__)

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

router = APIRouter(prefix="/morelife", tags=["MoreLife"])

# Pricing
MORELIFE_PRICING = {
    "private_2weeks": 85000,
    "private_1week": 45000,
    "joint": 30000
}

@router.post("/assessment", response_model=MoreLifeAssessment)
def create_morelife_assessment(
    assessment: MoreLifeAssessmentCreate,
    db: Session = Depends(get_db)
):
    """Submit MoreLife assessment form"""
    try:
        # Determine amount based on session type
        amount = MORELIFE_PRICING.get(assessment.sessionType, 0)
        
        assessment_obj = MoreLifeAssessment(**assessment.dict(), amount=amount)
        
        # Create database model
        db_assessment = DBMoreLifeAssessment(**assessment_obj.dict())
        
        db.add(db_assessment)
        db.commit()
        db.refresh(db_assessment)
        
        # Send confirmation email
        sendgrid_client.send_morelife_assessment_confirmation(
            assessment_obj.email,
            assessment_obj.name,
            assessment_obj.assessmentId
        )
        
        logger.info(f"New MoreLife assessment: {assessment_obj.assessmentId}")
        return assessment_obj
    except Exception as e:
        logger.error(f"Error creating MoreLife assessment: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/assessment/{assessment_id}/payment")
def initialize_morelife_payment(
    assessment_id: str,
    db: Session = Depends(get_db)
):
    """Initialize payment for MoreLife session"""
    try:
        assessment = db.query(DBMoreLifeAssessment).filter(
            DBMoreLifeAssessment.assessment_id == assessment_id
        ).first()
        
        if not assessment:
            raise HTTPException(status_code=404, detail="Assessment not found")
        
        amount_kobo = int(assessment.amount * 100)
        reference = f"ML-{assessment_id}-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Get frontend URL for callback
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
        callback_url = f"{frontend_url}/payment/success?reference={reference}"
        
        result = paystack_client.initialize_payment(
            email=assessment.email,
            amount=amount_kobo,
            reference=reference,
            callback_url=callback_url
        )
        
        if result.get("status"):
            assessment.payment_reference = reference
            assessment.updated_at = datetime.utcnow()
            db.commit()
            
            return {
                "status": True,
                "authorization_url": result["data"]["authorization_url"],
                "reference": reference
            }
        else:
            raise HTTPException(status_code=400, detail=result.get("message"))
    except Exception as e:
        logger.error(f"MoreLife payment initialization error: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/assessment/verify")
def verify_morelife_payment(
    payment: PaymentVerify,
    db: Session = Depends(get_db)
):
    """Verify MoreLife payment"""
    try:
        result = paystack_client.verify_payment(payment.reference)
        
        if result.get("status") and result["data"]["status"] == "success":
            # Find and update assessment
            assessment = db.query(DBMoreLifeAssessment).filter(
                DBMoreLifeAssessment.payment_reference == payment.reference
            ).first()
            
            if assessment:
                assessment.payment_status = "completed"
                assessment.status = "approved"
                assessment.updated_at = datetime.utcnow()
                db.commit()
                
                # Send confirmation email
                sendgrid_client.send_morelife_payment_confirmation(
                    assessment.email,
                    assessment.name,
                    assessment.session_type,
                    assessment.amount
                )
                
                return {
                    "status": True,
                    "message": "Payment verified successfully",
                    "assessment_id": assessment.assessment_id
                }
            
            return {
                "status": True,
                "message": "Payment verified but assessment not found"
            }
        else:
            return {
                "status": False,
                "message": "Payment verification failed"
            }
    except Exception as e:
        logger.error(f"MoreLife payment verification error: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
