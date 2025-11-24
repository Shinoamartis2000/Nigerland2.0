import os
import requests
from typing import Dict, Any
import logging
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
load_dotenv(Path(__file__).parent.parent / '.env')

logger = logging.getLogger(__name__)

PAYSTACK_SECRET_KEY = os.getenv('PAYSTACK_SECRET_KEY')
PAYSTACK_PUBLIC_KEY = os.getenv('PAYSTACK_PUBLIC_KEY')
PAYSTACK_BASE_URL = "https://api.paystack.co"

class PaystackClient:
    def __init__(self):
        self.secret_key = PAYSTACK_SECRET_KEY
        print(f"[PAYSTACK] Initialized with key: {self.secret_key[:20]}...{self.secret_key[-15:]}")
        logger.info(f"Paystack initialized with key: {self.secret_key[:15]}...{self.secret_key[-10:]}")
        self.headers = {
            "Authorization": f"Bearer {self.secret_key}",
            "Content-Type": "application/json"
        }
    
    def initialize_payment(self, email: str, amount: int, reference: str, callback_url: str = None) -> Dict[str, Any]:
        """
        Initialize a payment transaction
        Amount should be in kobo (Naira * 100)
        """
        url = f"{PAYSTACK_BASE_URL}/transaction/initialize"
        
        payload = {
            "email": email,
            "amount": amount,
            "reference": reference,
        }
        
        if callback_url:
            payload["callback_url"] = callback_url
        
        try:
            response = requests.post(url, json=payload, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Paystack initialize payment error: {e}")
            return {"status": False, "message": str(e)}
    
    def verify_payment(self, reference: str) -> Dict[str, Any]:
        """
        Verify a payment transaction
        """
        url = f"{PAYSTACK_BASE_URL}/transaction/verify/{reference}"
        
        try:
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Paystack verify payment error: {e}")
            return {"status": False, "message": str(e)}
    
    def get_transaction(self, transaction_id: int) -> Dict[str, Any]:
        """
        Get transaction details
        """
        url = f"{PAYSTACK_BASE_URL}/transaction/{transaction_id}"
        
        try:
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Paystack get transaction error: {e}")
            return {"status": False, "message": str(e)}

paystack_client = PaystackClient()
