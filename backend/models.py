from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
import uuid

# Registration Models
class ConferenceRegistrationCreate(BaseModel):
    fullName: str
    email: EmailStr
    phone: str
    organization: str
    profession: str
    conference: str
    conferenceDate: str
    additionalInfo: Optional[str] = ""

class ConferenceRegistration(ConferenceRegistrationCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: str = "pending"  # pending, confirmed, paid, cancelled
    paymentStatus: str = "pending"  # pending, completed, failed
    paymentReference: Optional[str] = None
    amount: Optional[float] = None
    registrationId: str = Field(default_factory=lambda: f"REG{uuid.uuid4().hex[:8].upper()}")
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

# Contact Form Models
class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    subject: str
    message: str

class ContactMessage(ContactMessageCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: str = "unread"  # unread, read, responded
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

# Admin Models
class AdminLogin(BaseModel):
    username: str
    password: str

class AdminUser(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: EmailStr
    password: str  # This will be hashed
    role: str = "admin"  # admin, super_admin
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    lastLogin: Optional[datetime] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Payment Models
class PaymentInitialize(BaseModel):
    registrationId: str
    email: EmailStr
    amount: float

class PaymentVerify(BaseModel):
    reference: str

# Dashboard Stats
class DashboardStats(BaseModel):
    totalRegistrations: int
    totalMessages: int
    pendingRegistrations: int
    confirmedRegistrations: int
    totalRevenue: float
    monthlyRegistrations: List[dict]

# E-Book Models
class BookCreate(BaseModel):
    title: str
    description: str
    author: str
    price: float
    image: str
    pdfUrl: Optional[str] = None
    isPaid: bool = True
    category: str

class Book(BookCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=datetime.utcnow)

class BookPurchaseCreate(BaseModel):
    bookId: str
    email: EmailStr
    fullName: str
    phone: str

class BookPurchase(BookPurchaseCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    purchaseId: str = Field(default_factory=lambda: f"BP{uuid.uuid4().hex[:8].upper()}")
    amount: float
    paymentStatus: str = "pending"  # pending, completed, failed
    paymentReference: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

# MoreLife Session Models
class MoreLifeAssessmentCreate(BaseModel):
    name: str
    location: str
    email: EmailStr
    age: int
    education: str
    specificChallenge: str
    likelyCause: str
    durationOfChallenge: str
    triggeringIncident: str
    onDrugs: str
    commencementMonth: str
    sessionType: str  # "private_2weeks" or "private_1week" or "joint"

class MoreLifeAssessment(MoreLifeAssessmentCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    assessmentId: str = Field(default_factory=lambda: f"ML{uuid.uuid4().hex[:8].upper()}")
    status: str = "pending"  # pending, reviewed, approved, rejected
    amount: float = 0
    paymentStatus: str = "pending"
    paymentReference: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

# Training Program Models
class TrainingProgramCreate(BaseModel):
    title: str
    category: str  # Management, Marketing, Business Admin, etc.
    description: str
    duration: str
    fee: float
    objectives: List[str]
    targetAudience: str
    isActive: bool = True

class TrainingProgram(TrainingProgramCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class TrainingEnrollmentCreate(BaseModel):
    programId: str
    fullName: str
    email: EmailStr
    phone: str
    organization: str
    position: str

class TrainingEnrollment(TrainingEnrollmentCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    enrollmentId: str = Field(default_factory=lambda: f"TE{uuid.uuid4().hex[:8].upper()}")
    status: str = "pending"
    paymentStatus: str = "pending"
    paymentReference: Optional[str] = None
    amount: float = 0
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

# Conference Model for CRUD
class ConferenceCreate(BaseModel):
    title: str
    date: str
    fee: str
    description: str
    forWhom: str
    isActive: bool = True

class Conference(ConferenceCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

# Team Member Model
class TeamMemberCreate(BaseModel):
    name: str
    title: str
    credentials: str
    bio: str
    image: str
    order: int = 0

class TeamMember(TeamMemberCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=datetime.utcnow)

# Project Model
class ProjectCreate(BaseModel):
    title: str
    description: str
    year: Optional[str] = None
    status: Optional[str] = None

class Project(ProjectCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=datetime.utcnow)

# Announcement Model
class AnnouncementCreate(BaseModel):
    title: str
    content: str
    type: str  # info, warning, success
    isActive: bool = True

class Announcement(AnnouncementCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)
