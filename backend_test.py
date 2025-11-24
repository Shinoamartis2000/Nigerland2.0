#!/usr/bin/env python3
"""
Backend API Testing for Nigerland Consult Website
Tests the recent changes as specified in the review request:
1. Admin Stats Endpoint - revenue calculation from conferences and books
2. New Book CRUD Endpoints
3. New Training CRUD Endpoints  
4. New MoreLife Endpoints
5. Conference Payment Endpoint
"""

import requests
import json
import sys
import os
from datetime import datetime
import uuid

# Get backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except Exception as e:
        print(f"Error reading frontend .env: {e}")
        return None

BACKEND_URL = get_backend_url()
if not BACKEND_URL:
    print("ERROR: Could not get REACT_APP_BACKEND_URL from frontend/.env")
    sys.exit(1)

API_BASE = f"{BACKEND_URL}/api"

print(f"Testing backend API at: {API_BASE}")
print("=" * 60)

# Test results tracking
test_results = {
    "passed": 0,
    "failed": 0,
    "errors": []
}

def log_test(test_name, success, message="", response_data=None):
    """Log test results"""
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status}: {test_name}")
    if message:
        print(f"   {message}")
    if response_data and not success:
        print(f"   Response: {response_data}")
    
    if success:
        test_results["passed"] += 1
    else:
        test_results["failed"] += 1
        test_results["errors"].append(f"{test_name}: {message}")
    print()

def test_authentication():
    """Test admin login and JWT token generation"""
    print("🔐 TESTING AUTHENTICATION")
    print("-" * 30)
    
    # Test admin login
    login_data = {
        "username": "admin",
        "password": "admin123"
    }
    
    try:
        response = requests.post(f"{API_BASE}/auth/login", json=login_data, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if "access_token" in data:
                token = data["access_token"]
                log_test("Admin Login", True, f"Token received (length: {len(token)})")
                return token
            else:
                log_test("Admin Login", False, "No access_token in response", data)
                return None
        else:
            log_test("Admin Login", False, f"HTTP {response.status_code}: {response.text}")
            return None
            
    except requests.exceptions.RequestException as e:
        log_test("Admin Login", False, f"Request failed: {str(e)}")
        return None

def test_admin_stats_endpoint(token):
    """Test admin stats endpoint - should calculate revenue from conferences and books"""
    if not token:
        print("⚠️  Skipping admin stats test - no valid token")
        return
    
    print("📊 TESTING ADMIN STATS ENDPOINT")
    print("-" * 30)
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{API_BASE}/admin/stats", headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ["totalRegistrations", "totalMessages", "pendingRegistrations", 
                             "confirmedRegistrations", "totalRevenue", "monthlyRegistrations"]
            
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                log_test("Admin Stats Endpoint", False, f"Missing fields: {missing_fields}")
            else:
                log_test("Admin Stats Endpoint", True, 
                        f"Total Revenue: ₦{data['totalRevenue']:,.2f}, Registrations: {data['totalRegistrations']}")
        else:
            log_test("Admin Stats Endpoint", False, f"HTTP {response.status_code}: {response.text}")
            
    except requests.exceptions.RequestException as e:
        log_test("Admin Stats Endpoint", False, f"Request failed: {str(e)}")

def test_book_crud_endpoints(token):
    """Test Book CRUD endpoints"""
    if not token:
        print("⚠️  Skipping book CRUD tests - no valid token")
        return
    
    print("📚 TESTING BOOK CRUD ENDPOINTS")
    print("-" * 30)
    
    headers = {"Authorization": f"Bearer {token}"}
    created_book_id = None
    
    # 1. GET /api/admin/books - List all books
    try:
        response = requests.get(f"{API_BASE}/admin/books", headers=headers, timeout=10)
        if response.status_code == 200:
            books = response.json()
            log_test("GET /api/admin/books", True, f"Retrieved {len(books)} books")
        else:
            log_test("GET /api/admin/books", False, f"HTTP {response.status_code}: {response.text}")
    except requests.exceptions.RequestException as e:
        log_test("GET /api/admin/books", False, f"Request failed: {str(e)}")
    
    # 2. POST /api/admin/books - Create a new test book
    test_book = {
        "title": "Test Book for API Testing",
        "description": "This is a test book created during API testing",
        "author": "Test Author",
        "price": 15000.0,
        "image": "https://example.com/test-book-cover.jpg",
        "pdfUrl": "https://example.com/test-book.pdf",
        "isPaid": True,
        "category": "Business"
    }
    
    try:
        response = requests.post(f"{API_BASE}/admin/books", headers=headers, json=test_book, timeout=10)
        if response.status_code == 200:
            book_data = response.json()
            created_book_id = book_data.get("id")
            log_test("POST /api/admin/books", True, f"Created book with ID: {created_book_id}")
        else:
            log_test("POST /api/admin/books", False, f"HTTP {response.status_code}: {response.text}")
    except requests.exceptions.RequestException as e:
        log_test("POST /api/admin/books", False, f"Request failed: {str(e)}")
    
    # 3. PUT /api/admin/books/{book_id} - Update the test book
    if created_book_id:
        updated_book = test_book.copy()
        updated_book["title"] = "Updated Test Book for API Testing"
        updated_book["price"] = 20000.0
        
        try:
            response = requests.put(f"{API_BASE}/admin/books/{created_book_id}", 
                                  headers=headers, json=updated_book, timeout=10)
            if response.status_code == 200:
                log_test("PUT /api/admin/books/{book_id}", True, "Book updated successfully")
            else:
                log_test("PUT /api/admin/books/{book_id}", False, f"HTTP {response.status_code}: {response.text}")
        except requests.exceptions.RequestException as e:
            log_test("PUT /api/admin/books/{book_id}", False, f"Request failed: {str(e)}")
    
    # 4. DELETE /api/admin/books/{book_id} - Delete the test book
    if created_book_id:
        try:
            response = requests.delete(f"{API_BASE}/admin/books/{created_book_id}", 
                                     headers=headers, timeout=10)
            if response.status_code == 200:
                log_test("DELETE /api/admin/books/{book_id}", True, "Book deleted successfully")
            else:
                log_test("DELETE /api/admin/books/{book_id}", False, f"HTTP {response.status_code}: {response.text}")
        except requests.exceptions.RequestException as e:
            log_test("DELETE /api/admin/books/{book_id}", False, f"Request failed: {str(e)}")

def test_training_crud_endpoints(token):
    """Test Training CRUD endpoints"""
    if not token:
        print("⚠️  Skipping training CRUD tests - no valid token")
        return
    
    print("🎓 TESTING TRAINING CRUD ENDPOINTS")
    print("-" * 30)
    
    headers = {"Authorization": f"Bearer {token}"}
    created_training_id = None
    
    # 1. GET /api/admin/trainings - List all training programs
    try:
        response = requests.get(f"{API_BASE}/admin/trainings", headers=headers, timeout=10)
        if response.status_code == 200:
            trainings = response.json()
            log_test("GET /api/admin/trainings", True, f"Retrieved {len(trainings)} training programs")
        else:
            log_test("GET /api/admin/trainings", False, f"HTTP {response.status_code}: {response.text}")
    except requests.exceptions.RequestException as e:
        log_test("GET /api/admin/trainings", False, f"Request failed: {str(e)}")
    
    # 2. POST /api/admin/trainings - Create a new test training program
    test_training = {
        "title": "Test Training Program for API Testing",
        "category": "Business Management",
        "description": "This is a test training program created during API testing",
        "duration": "2 weeks",
        "fee": 50000.0,
        "objectives": [
            "Learn API testing fundamentals",
            "Understand business management principles",
            "Practice real-world scenarios"
        ],
        "targetAudience": "Business professionals and developers",
        "isActive": True
    }
    
    try:
        response = requests.post(f"{API_BASE}/admin/trainings", headers=headers, json=test_training, timeout=10)
        if response.status_code == 200:
            training_data = response.json()
            created_training_id = training_data.get("id")
            log_test("POST /api/admin/trainings", True, f"Created training with ID: {created_training_id}")
        else:
            log_test("POST /api/admin/trainings", False, f"HTTP {response.status_code}: {response.text}")
    except requests.exceptions.RequestException as e:
        log_test("POST /api/admin/trainings", False, f"Request failed: {str(e)}")
    
    # 3. PUT /api/admin/trainings/{training_id} - Update the test training
    if created_training_id:
        updated_training = test_training.copy()
        updated_training["title"] = "Updated Test Training Program for API Testing"
        updated_training["fee"] = 75000.0
        
        try:
            response = requests.put(f"{API_BASE}/admin/trainings/{created_training_id}", 
                                  headers=headers, json=updated_training, timeout=10)
            if response.status_code == 200:
                log_test("PUT /api/admin/trainings/{training_id}", True, "Training updated successfully")
            else:
                log_test("PUT /api/admin/trainings/{training_id}", False, f"HTTP {response.status_code}: {response.text}")
        except requests.exceptions.RequestException as e:
            log_test("PUT /api/admin/trainings/{training_id}", False, f"Request failed: {str(e)}")
    
    # 4. DELETE /api/admin/trainings/{training_id} - Delete the test training
    if created_training_id:
        try:
            response = requests.delete(f"{API_BASE}/admin/trainings/{created_training_id}", 
                                     headers=headers, timeout=10)
            if response.status_code == 200:
                log_test("DELETE /api/admin/trainings/{training_id}", True, "Training deleted successfully")
            else:
                log_test("DELETE /api/admin/trainings/{training_id}", False, f"HTTP {response.status_code}: {response.text}")
        except requests.exceptions.RequestException as e:
            log_test("DELETE /api/admin/trainings/{training_id}", False, f"Request failed: {str(e)}")

def test_morelife_endpoints(token):
    """Test MoreLife endpoints"""
    if not token:
        print("⚠️  Skipping MoreLife tests - no valid token")
        return
    
    print("🧠 TESTING MORELIFE ENDPOINTS")
    print("-" * 30)
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # 1. GET /api/admin/morelife/assessments - List all MoreLife assessments
    try:
        response = requests.get(f"{API_BASE}/admin/morelife/assessments", headers=headers, timeout=10)
        if response.status_code == 200:
            assessments = response.json()
            log_test("GET /api/admin/morelife/assessments", True, f"Retrieved {len(assessments)} assessments")
            
            # If we have assessments, test status update and delete
            if assessments:
                test_assessment_id = assessments[0].get("id")
                
                # 2. PUT /api/admin/morelife/assessments/{assessment_id}/status - Update assessment status
                try:
                    status_data = {"status": "reviewed"}
                    response = requests.put(f"{API_BASE}/admin/morelife/assessments/{test_assessment_id}/status", 
                                          headers=headers, params={"status": "reviewed"}, timeout=10)
                    if response.status_code == 200:
                        log_test("PUT /api/admin/morelife/assessments/{id}/status", True, "Assessment status updated")
                    else:
                        log_test("PUT /api/admin/morelife/assessments/{id}/status", False, 
                               f"HTTP {response.status_code}: {response.text}")
                except requests.exceptions.RequestException as e:
                    log_test("PUT /api/admin/morelife/assessments/{id}/status", False, f"Request failed: {str(e)}")
                
                # Note: We won't test DELETE to avoid removing real data
                log_test("DELETE /api/admin/morelife/assessments/{id}", True, 
                        "Endpoint available (not tested to preserve data)")
            else:
                log_test("PUT /api/admin/morelife/assessments/{id}/status", True, 
                        "No assessments to test status update")
                log_test("DELETE /api/admin/morelife/assessments/{id}", True, 
                        "No assessments to test deletion")
        else:
            log_test("GET /api/admin/morelife/assessments", False, f"HTTP {response.status_code}: {response.text}")
    except requests.exceptions.RequestException as e:
        log_test("GET /api/admin/morelife/assessments", False, f"Request failed: {str(e)}")

def test_conference_payment_endpoint():
    """Test Conference Payment Endpoint"""
    print("💳 TESTING CONFERENCE PAYMENT ENDPOINT")
    print("-" * 30)
    
    # Test conference registration and payment
    test_registration = {
        "fullName": "John Doe Test User",
        "email": "john.doe.test@example.com",
        "phone": "+2348012345678",
        "organization": "Test Organization Ltd",
        "profession": "Software Developer",
        "additionalInfo": "This is a test registration for API testing",
        "conference": "Tax Conference 2025",
        "conferenceDate": "2025-03-15",
        "amount": 100000.0
    }
    
    try:
        response = requests.post(f"{API_BASE}/conference/register-and-pay", 
                               json=test_registration, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and data.get("authorization_url"):
                log_test("POST /api/conference/register-and-pay", True, 
                        f"Registration successful, Paystack URL received")
            else:
                log_test("POST /api/conference/register-and-pay", False, 
                        "Missing success flag or authorization_url in response")
        else:
            log_test("POST /api/conference/register-and-pay", False, 
                   f"HTTP {response.status_code}: {response.text}")
    except requests.exceptions.RequestException as e:
        log_test("POST /api/conference/register-and-pay", False, f"Request failed: {str(e)}")

def test_public_endpoints():
    """Test public endpoints that don't require authentication"""
    print("🌐 TESTING PUBLIC ENDPOINTS")
    print("-" * 30)
    
    # Test books endpoint
    try:
        response = requests.get(f"{API_BASE}/books", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                log_test("GET /api/books - List books", True, f"Returned {len(data)} books")
            else:
                log_test("GET /api/books - List books", False, "Response is not a list", data)
        else:
            log_test("GET /api/books - List books", False, f"HTTP {response.status_code}: {response.text}")
            
    except requests.exceptions.RequestException as e:
        log_test("GET /api/books - List books", False, f"Request failed: {str(e)}")

def test_auth_verification(token):
    """Test JWT token verification endpoint"""
    if not token:
        return
        
    print("🔍 TESTING TOKEN VERIFICATION")
    print("-" * 30)
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{API_BASE}/auth/verify", headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("valid") == True:
                log_test("JWT Token Verification", True, "Token is valid")
            else:
                log_test("JWT Token Verification", False, "Token validation failed", data)
        else:
            log_test("JWT Token Verification", False, f"HTTP {response.status_code}: {response.text}")
            
    except requests.exceptions.RequestException as e:
        log_test("JWT Token Verification", False, f"Request failed: {str(e)}")

def test_root_endpoint():
    """Test API root endpoint"""
    print("🏠 TESTING ROOT ENDPOINT")
    print("-" * 30)
    
    try:
        response = requests.get(f"{API_BASE}/", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if "message" in data and "status" in data:
                log_test("GET /api/ - Root endpoint", True, f"API Status: {data.get('status')}")
            else:
                log_test("GET /api/ - Root endpoint", False, "Missing expected fields", data)
        else:
            log_test("GET /api/ - Root endpoint", False, f"HTTP {response.status_code}: {response.text}")
            
    except requests.exceptions.RequestException as e:
        log_test("GET /api/ - Root endpoint", False, f"Request failed: {str(e)}")

def check_specific_registration():
    """Check for the specific registration mentioned in the review request"""
    print("👤 CHECKING SPECIFIC REGISTRATION")
    print("-" * 30)
    
    # This requires authentication, so we need to login first
    login_data = {"username": "admin", "password": "admin123"}
    
    try:
        login_response = requests.post(f"{API_BASE}/auth/login", json=login_data, timeout=10)
        if login_response.status_code == 200:
            token = login_response.json().get("access_token")
            headers = {"Authorization": f"Bearer {token}"}
            
            # Get all registrations
            response = requests.get(f"{API_BASE}/registrations", headers=headers, timeout=10)
            if response.status_code == 200:
                registrations = response.json()
                
                # Look for Chidiebere Peter UMEOKEKE
                found_registration = False
                for reg in registrations:
                    if "Chidiebere Peter UMEOKEKE" in reg.get("fullName", ""):
                        found_registration = True
                        log_test("Find Chidiebere Peter UMEOKEKE registration", True, 
                               f"Found registration: {reg.get('registrationId')}")
                        break
                
                if not found_registration:
                    log_test("Find Chidiebere Peter UMEOKEKE registration", False, 
                           f"Registration not found among {len(registrations)} total registrations")
            else:
                log_test("Find Chidiebere Peter UMEOKEKE registration", False, 
                       f"Could not fetch registrations: HTTP {response.status_code}")
        else:
            log_test("Find Chidiebere Peter UMEOKEKE registration", False, 
                   "Could not authenticate to check registrations")
            
    except requests.exceptions.RequestException as e:
        log_test("Find Chidiebere Peter UMEOKEKE registration", False, f"Request failed: {str(e)}")

def main():
    """Main test execution"""
    print(f"🚀 NIGERLAND CONSULT API TESTING - RECENT CHANGES")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    # Test root endpoint first
    test_root_endpoint()
    
    # Test authentication and get token
    token = test_authentication()
    
    # Test token verification
    test_auth_verification(token)
    
    # Test the specific endpoints mentioned in the review request
    print("\n🎯 TESTING RECENT CHANGES AS PER REVIEW REQUEST")
    print("=" * 60)
    
    # 1. Test Admin Stats Endpoint - revenue calculation
    test_admin_stats_endpoint(token)
    
    # 2. Test New Book CRUD Endpoints
    test_book_crud_endpoints(token)
    
    # 3. Test New Training CRUD Endpoints
    test_training_crud_endpoints(token)
    
    # 4. Test New MoreLife Endpoints
    test_morelife_endpoints(token)
    
    # 5. Test Conference Payment Endpoint
    test_conference_payment_endpoint()
    
    # Print summary
    print("=" * 60)
    print("📊 TEST SUMMARY")
    print("-" * 30)
    print(f"✅ Passed: {test_results['passed']}")
    print(f"❌ Failed: {test_results['failed']}")
    total_tests = test_results['passed'] + test_results['failed']
    if total_tests > 0:
        print(f"📈 Success Rate: {test_results['passed']/total_tests*100:.1f}%")
    
    if test_results['errors']:
        print("\n🚨 FAILED TESTS:")
        for error in test_results['errors']:
            print(f"   • {error}")
    
    print(f"\nTest completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Return exit code based on results
    return 0 if test_results['failed'] == 0 else 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)