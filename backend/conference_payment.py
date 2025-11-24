"""
Simple conference registration and payment endpoint
"""
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from datetime import datetime
import uuid
from utils.paystack import paystack_client
from models_sql import Registration as DBRegistration
from database import get_db
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

router = APIRouter()

class ConferencePaymentRequest(BaseModel):
    fullName: str
    email: EmailStr
    phone: str
    organization: str
    profession: str
    additionalInfo: str
    conference: str
    conferenceDate: str
    amount: float

@router.post("/conference/register-and-pay")
def register_and_pay_for_conference(
    data: ConferencePaymentRequest,
    db: Session = Depends(get_db)
):
    """
    Simple endpoint: Register for conference and get payment link in one step
    """
    try:
        # Generate registration ID
        registration_id = f"REG{uuid.uuid4().hex[:8].upper()}"
        
        # Create registration in database
        db_registration = DBRegistration(
            registration_id=registration_id,
            full_name=data.fullName,
            email=data.email,
            phone=data.phone,
            organization=data.organization,
            profession=data.profession,
            additional_info=data.additionalInfo,
            conference=data.conference,
            conference_date=data.conferenceDate,
            amount=data.amount,
            status="pending",
            payment_status="pending"
        )
        
        db.add(db_registration)
        db.commit()
        
        # Initialize Paystack payment
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
        callback_url = f"{frontend_url}/payment/success?type=conference&reference={registration_id}"
        
        payment_result = paystack_client.initialize_payment(
            email=data.email,
            amount=int(data.amount * 100),  # Convert to kobo
            reference=f"CONF-{registration_id}",
            callback_url=callback_url
        )
        
        if payment_result.get("status"):
            payment_data = payment_result.get("data", {})
            return {
                "success": True,
                "registration_id": registration_id,
                "authorization_url": payment_data.get("authorization_url"),
                "reference": payment_data.get("reference")
            }
        else:
            raise HTTPException(status_code=500, detail="Payment initialization failed")
            
    except Exception as e:
        print(f"Error in register_and_pay: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
