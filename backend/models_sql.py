from sqlalchemy import Column, String, Integer, Float, Boolean, Text, DateTime, Enum
from sqlalchemy.sql import func
from database import Base
import uuid
from datetime import datetime

# Admin Model
class Admin(Base):
    __tablename__ = "admins"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String(100), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    email = Column(String(255))
    created_at = Column(DateTime, default=func.now())

# Conference Registration Model
class Registration(Base):
    __tablename__ = "registrations"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    registration_id = Column(String(20), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    phone = Column(String(50), nullable=False)
    organization = Column(String(255))
    profession = Column(String(255))
    conference = Column(String(255), nullable=False)
    conference_date = Column(String(100))
    additional_info = Column(Text)
    status = Column(String(50), default="pending")
    payment_status = Column(String(50), default="pending")
    payment_reference = Column(String(100), index=True)
    amount = Column(Float, default=0)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

# Contact Message Model
class Contact(Base):
    __tablename__ = "contacts"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    subject = Column(String(500))
    message = Column(Text, nullable=False)
    status = Column(String(50), default="unread")
    created_at = Column(DateTime, default=func.now())

# Book Model
class Book(Base):
    __tablename__ = "books"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(500), nullable=False)
    description = Column(Text)
    author = Column(String(255), nullable=False)
    price = Column(Float, nullable=False)
    image = Column(Text)
    pdf_url = Column(Text)
    is_paid = Column(Boolean, default=True)
    category = Column(String(100))
    created_at = Column(DateTime, default=func.now())

# Book Purchase Model
class BookPurchase(Base):
    __tablename__ = "book_purchases"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    purchase_id = Column(String(20), unique=True, nullable=False, index=True)
    book_id = Column(String(36), nullable=False, index=True)
    email = Column(String(255), nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    amount = Column(Float, nullable=False)
    payment_status = Column(String(50), default="pending")
    payment_reference = Column(String(100), index=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

# Conference Model
class Conference(Base):
    __tablename__ = "conferences"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(500), nullable=False)
    description = Column(Text)
    date = Column(String(100))
    location = Column(String(255))
    fee = Column(Float)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

# Team Member Model
class TeamMember(Base):
    __tablename__ = "team_members"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    position = Column(String(255), nullable=False)
    bio = Column(Text)
    image = Column(Text)
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=func.now())

# Project Model
class Project(Base):
    __tablename__ = "projects"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(500), nullable=False)
    description = Column(Text)
    image = Column(Text)
    category = Column(String(100))
    status = Column(String(50), default="active")
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

# Announcement Model
class Announcement(Base):
    __tablename__ = "announcements"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(500), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="info")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

# Training Program Model
class TrainingProgram(Base):
    __tablename__ = "training_programs"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(500), nullable=False)
    category = Column(String(100))
    description = Column(Text)
    duration = Column(String(100))
    fee = Column(Float)
    objectives = Column(Text)  # JSON string
    target_audience = Column(String(500))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

# Training Enrollment Model
class TrainingEnrollment(Base):
    __tablename__ = "training_enrollments"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    enrollment_id = Column(String(20), unique=True, nullable=False, index=True)
    program_id = Column(String(36), nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    phone = Column(String(50))
    organization = Column(String(255))
    position = Column(String(255))
    status = Column(String(50), default="pending")
    payment_status = Column(String(50), default="pending")
    payment_reference = Column(String(100), index=True)
    amount = Column(Float, default=0)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

# MoreLife Assessment Model
class MoreLifeAssessment(Base):
    __tablename__ = "morelife_assessments"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    assessment_id = Column(String(20), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    location = Column(String(255))
    email = Column(String(255), nullable=False, index=True)
    age = Column(Integer)
    education = Column(String(255))
    specific_challenge = Column(Text)
    likely_cause = Column(Text)
    duration_of_challenge = Column(String(255))
    triggering_incident = Column(Text)
    on_drugs = Column(String(50))
    commencement_month = Column(String(100))
    session_type = Column(String(50))
    status = Column(String(50), default="pending")
    amount = Column(Float, default=0)
    payment_status = Column(String(50), default="pending")
    payment_reference = Column(String(100), index=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
