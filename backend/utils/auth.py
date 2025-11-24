from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import bcrypt
import os

JWT_SECRET = os.getenv('JWT_SECRET_KEY')
JWT_ALGORITHM = os.getenv('JWT_ALGORITHM', 'HS256')
JWT_EXPIRATION = int(os.getenv('JWT_EXPIRATION_HOURS', 24))

security = HTTPBearer()

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    """Verify a password against its hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_access_token(data: dict) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION)
    to_encode.update({"exp": expire})
    # Ensure JWT_SECRET is a string for python-jose
    secret_key = JWT_SECRET if isinstance(JWT_SECRET, str) else str(JWT_SECRET)
    encoded_jwt = jwt.encode(to_encode, secret_key, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Verify JWT token from Authorization header"""
    try:
        token = credentials.credentials
        # Ensure JWT_SECRET is a string for python-jose
        secret_key = JWT_SECRET if isinstance(JWT_SECRET, str) else str(JWT_SECRET)
        payload = jwt.decode(token, secret_key, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
