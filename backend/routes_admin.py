from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from models import (
    Conference, ConferenceCreate, 
    TeamMember, TeamMemberCreate, 
    Project, ProjectCreate, 
    Announcement, AnnouncementCreate, 
    Book, BookCreate,
    TrainingProgram, TrainingProgramCreate,
    MoreLifeAssessment
)
from models_sql import (
    Conference as DBConference,
    TeamMember as DBTeamMember,
    Project as DBProject,
    Announcement as DBAnnouncement,
    Book as DBBook,
    TrainingProgram as DBTrainingProgram,
    TrainingEnrollment as DBTrainingEnrollment,
    MoreLifeAssessment as DBMoreLifeAssessment,
    Registration as DBRegistration,
    BookPurchase as DBBookPurchase
)
from database import get_db
from utils.auth import verify_token
from datetime import datetime
from typing import List
import logging
import json

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/admin", tags=["Admin Management"])

# ==================== CONFERENCES MANAGEMENT ====================

@router.post("/conferences", response_model=Conference)
def create_conference(
    conference: ConferenceCreate,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Create conference"""
    try:
        conf_obj = Conference(**conference.dict())
        db_conf = DBConference(**conf_obj.dict())
        db.add(db_conf)
        db.commit()
        db.refresh(db_conf)
        return conf_obj
    except Exception as e:
        logger.error(f"Error creating conference: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/conferences", response_model=List[Conference])
def get_all_conferences_admin(
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Get all conferences (Admin)"""
    logger.info("GET /admin/conferences called")
    try:
        conferences = db.query(DBConference).all()
        return [Conference(**conf.__dict__) for conf in conferences]
    except Exception as e:
        logger.error(f"Error fetching conferences: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/conferences/{conference_id}")
def update_conference(
    conference_id: str,
    conference: ConferenceCreate,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Update conference"""
    try:
        db_conf = db.query(DBConference).filter(DBConference.id == conference_id).first()
        if not db_conf:
            raise HTTPException(status_code=404, detail="Conference not found")
        
        for key, value in conference.dict().items():
            setattr(db_conf, key, value)
        db_conf.updated_at = datetime.utcnow()
        
        db.commit()
        return {"message": "Conference updated successfully"}
    except Exception as e:
        logger.error(f"Error updating conference: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/conferences/{conference_id}")
def delete_conference(
    conference_id: str,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Delete conference"""
    try:
        db_conf = db.query(DBConference).filter(DBConference.id == conference_id).first()
        if not db_conf:
            raise HTTPException(status_code=404, detail="Conference not found")
        
        db.delete(db_conf)
        db.commit()
        return {"message": "Conference deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting conference: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# ==================== TEAM MEMBERS MANAGEMENT ====================

@router.post("/team", response_model=TeamMember)
def create_team_member(
    member: TeamMemberCreate,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Create team member"""
    try:
        member_obj = TeamMember(**member.dict())
        db_member = DBTeamMember(**member_obj.dict())
        db.add(db_member)
        db.commit()
        db.refresh(db_member)
        return member_obj
    except Exception as e:
        logger.error(f"Error creating team member: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/team", response_model=List[TeamMember])
def get_all_team_members(db: Session = Depends(get_db)):
    """Get all team members"""
    logger.info("GET /admin/team called")
    try:
        members = db.query(DBTeamMember).order_by(DBTeamMember.order).all()
        return [TeamMember(**member.__dict__) for member in members]
    except Exception as e:
        logger.error(f"Error fetching team members: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/team/{member_id}")
def update_team_member(
    member_id: str,
    member: TeamMemberCreate,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Update team member"""
    try:
        db_member = db.query(DBTeamMember).filter(DBTeamMember.id == member_id).first()
        if not db_member:
            raise HTTPException(status_code=404, detail="Team member not found")
        
        for key, value in member.dict().items():
            setattr(db_member, key, value)
        
        db.commit()
        return {"message": "Team member updated successfully"}
    except Exception as e:
        logger.error(f"Error updating team member: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/team/{member_id}")
def delete_team_member(
    member_id: str,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Delete team member"""
    try:
        db_member = db.query(DBTeamMember).filter(DBTeamMember.id == member_id).first()
        if not db_member:
            raise HTTPException(status_code=404, detail="Team member not found")
        
        db.delete(db_member)
        db.commit()
        return {"message": "Team member deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting team member: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# ==================== PROJECTS MANAGEMENT ====================

@router.post("/projects", response_model=Project)
def create_project(
    project: ProjectCreate,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Create project"""
    try:
        project_obj = Project(**project.dict())
        db_project = DBProject(**project_obj.dict())
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
        return project_obj
    except Exception as e:
        logger.error(f"Error creating project: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/projects", response_model=List[Project])
def get_all_projects(db: Session = Depends(get_db)):
    """Get all projects"""
    try:
        projects = db.query(DBProject).order_by(DBProject.order).all()
        return [Project(**project.__dict__) for project in projects]
    except Exception as e:
        logger.error(f"Error fetching projects: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/projects/{project_id}")
def update_project(
    project_id: str,
    project: ProjectCreate,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Update project"""
    try:
        db_project = db.query(DBProject).filter(DBProject.id == project_id).first()
        if not db_project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        for key, value in project.dict().items():
            setattr(db_project, key, value)
        db_project.updated_at = datetime.utcnow()
        
        db.commit()
        return {"message": "Project updated successfully"}
    except Exception as e:
        logger.error(f"Error updating project: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/projects/{project_id}")
def delete_project(
    project_id: str,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Delete project"""
    try:
        db_project = db.query(DBProject).filter(DBProject.id == project_id).first()
        if not db_project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        db.delete(db_project)
        db.commit()
        return {"message": "Project deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting project: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# ==================== ANNOUNCEMENTS MANAGEMENT ====================

@router.post("/announcements", response_model=Announcement)
def create_announcement(
    announcement: AnnouncementCreate,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Create announcement"""
    try:
        ann_obj = Announcement(**announcement.dict())
        db_ann = DBAnnouncement(**ann_obj.dict())
        db.add(db_ann)
        db.commit()
        db.refresh(db_ann)
        return ann_obj
    except Exception as e:
        logger.error(f"Error creating announcement: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/announcements", response_model=List[Announcement])
def get_all_announcements(db: Session = Depends(get_db)):
    """Get all active announcements"""
    try:
        announcements = db.query(DBAnnouncement).filter(
            DBAnnouncement.is_active == True
        ).order_by(DBAnnouncement.created_at.desc()).all()
        return [Announcement(**ann.__dict__) for ann in announcements]
    except Exception as e:
        logger.error(f"Error fetching announcements: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/announcements/{announcement_id}")
def update_announcement(
    announcement_id: str,
    announcement: AnnouncementCreate,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Update announcement"""
    try:
        db_ann = db.query(DBAnnouncement).filter(DBAnnouncement.id == announcement_id).first()
        if not db_ann:
            raise HTTPException(status_code=404, detail="Announcement not found")
        
        for key, value in announcement.dict().items():
            setattr(db_ann, key, value)
        db_ann.updated_at = datetime.utcnow()
        
        db.commit()
        return {"message": "Announcement updated successfully"}
    except Exception as e:
        logger.error(f"Error updating announcement: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/announcements/{announcement_id}")
def delete_announcement(
    announcement_id: str,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Delete announcement"""
    try:
        db_ann = db.query(DBAnnouncement).filter(DBAnnouncement.id == announcement_id).first()
        if not db_ann:
            raise HTTPException(status_code=404, detail="Announcement not found")
        
        db.delete(db_ann)
        db.commit()
        return {"message": "Announcement deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting announcement: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# ==================== BOOKS MANAGEMENT ====================

@router.post("/books", response_model=Book)
def create_book(
    book: BookCreate,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Create book"""
    try:
        book_obj = Book(**book.dict())
        db_book = DBBook(**book_obj.dict())
        db.add(db_book)
        db.commit()
        db.refresh(db_book)
        return book_obj
    except Exception as e:
        logger.error(f"Error creating book: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/books", response_model=List[Book])
def get_all_books_admin(db: Session = Depends(get_db)):
    """Get all books (Admin)"""
    try:
        books = db.query(DBBook).order_by(DBBook.created_at.desc()).all()
        return [Book(**book.__dict__) for book in books]
    except Exception as e:
        logger.error(f"Error fetching books: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/books/{book_id}")
def update_book(
    book_id: str,
    book: BookCreate,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Update book"""
    try:
        db_book = db.query(DBBook).filter(DBBook.id == book_id).first()
        if not db_book:
            raise HTTPException(status_code=404, detail="Book not found")
        
        for key, value in book.dict().items():
            setattr(db_book, key, value)
        
        db.commit()
        return {"message": "Book updated successfully"}
    except Exception as e:
        logger.error(f"Error updating book: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/books/{book_id}")
def delete_book(
    book_id: str,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Delete book"""
    try:
        db_book = db.query(DBBook).filter(DBBook.id == book_id).first()
        if not db_book:
            raise HTTPException(status_code=404, detail="Book not found")
        
        db.delete(db_book)
        db.commit()
        return {"message": "Book deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting book: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# ==================== TRAINING PROGRAMS MANAGEMENT ====================

@router.post("/trainings", response_model=TrainingProgram)
def create_training(
    training: TrainingProgramCreate,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Create training program"""
    try:
        training_obj = TrainingProgram(**training.dict())
        
        # Convert objectives list to JSON string
        training_dict = training_obj.dict()
        training_dict['objectives'] = json.dumps(training_dict.get('objectives', []))
        
        db_training = DBTrainingProgram(**training_dict)
        db.add(db_training)
        db.commit()
        db.refresh(db_training)
        return training_obj
    except Exception as e:
        logger.error(f"Error creating training: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/trainings", response_model=List[TrainingProgram])
def get_all_trainings(db: Session = Depends(get_db)):
    """Get all training programs"""
    try:
        trainings = db.query(DBTrainingProgram).order_by(DBTrainingProgram.created_at.desc()).all()
        result = []
        for training in trainings:
            training_dict = training.__dict__
            # Convert objectives JSON string back to list
            if training_dict.get('objectives'):
                try:
                    training_dict['objectives'] = json.loads(training_dict['objectives'])
                except:
                    training_dict['objectives'] = []
            result.append(TrainingProgram(**training_dict))
        return result
    except Exception as e:
        logger.error(f"Error fetching trainings: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/trainings/{training_id}")
def update_training(
    training_id: str,
    training: TrainingProgramCreate,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Update training program"""
    try:
        db_training = db.query(DBTrainingProgram).filter(DBTrainingProgram.id == training_id).first()
        if not db_training:
            raise HTTPException(status_code=404, detail="Training program not found")
        
        training_dict = training.dict()
        # Convert objectives to JSON string
        if 'objectives' in training_dict:
            training_dict['objectives'] = json.dumps(training_dict['objectives'])
        
        for key, value in training_dict.items():
            setattr(db_training, key, value)
        db_training.updated_at = datetime.utcnow()
        
        db.commit()
        return {"message": "Training program updated successfully"}
    except Exception as e:
        logger.error(f"Error updating training: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/trainings/{training_id}")
def delete_training(
    training_id: str,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Delete training program"""
    try:
        db_training = db.query(DBTrainingProgram).filter(DBTrainingProgram.id == training_id).first()
        if not db_training:
            raise HTTPException(status_code=404, detail="Training program not found")
        
        db.delete(db_training)
        db.commit()
        return {"message": "Training program deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting training: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# ==================== MORELIFE SESSIONS MANAGEMENT ====================

@router.get("/morelife/assessments", response_model=List[MoreLifeAssessment])
def get_all_morelife_assessments(
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Get all MoreLife assessments (Admin)"""
    try:
        assessments = db.query(DBMoreLifeAssessment).order_by(DBMoreLifeAssessment.created_at.desc()).all()
        return [MoreLifeAssessment(**assessment.__dict__) for assessment in assessments]
    except Exception as e:
        logger.error(f"Error fetching MoreLife assessments: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/morelife/assessments/{assessment_id}/status")
def update_morelife_assessment_status(
    assessment_id: str,
    status: str,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Update MoreLife assessment status"""
    try:
        assessment = db.query(DBMoreLifeAssessment).filter(DBMoreLifeAssessment.id == assessment_id).first()
        if not assessment:
            raise HTTPException(status_code=404, detail="Assessment not found")
        
        assessment.status = status
        assessment.updated_at = datetime.utcnow()
        db.commit()
        
        return {"message": "Assessment status updated successfully"}
    except Exception as e:
        logger.error(f"Error updating assessment status: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/morelife/assessments/{assessment_id}")
def delete_morelife_assessment(
    assessment_id: str,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Delete MoreLife assessment"""
    try:
        assessment = db.query(DBMoreLifeAssessment).filter(DBMoreLifeAssessment.id == assessment_id).first()
        if not assessment:
            raise HTTPException(status_code=404, detail="Assessment not found")
        
        db.delete(assessment)
        db.commit()
        return {"message": "Assessment deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting assessment: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# ==================== ANALYTICS ====================

@router.get("/analytics/revenue")
def get_revenue_analytics(
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Get revenue analytics"""
    try:
        # Conference revenue
        conf_revenue = db.query(func.sum(DBRegistration.amount)).filter(
            DBRegistration.payment_status == "completed"
        ).scalar() or 0
        
        # Book revenue
        book_revenue = db.query(func.sum(DBBookPurchase.amount)).filter(
            DBBookPurchase.payment_status == "completed"
        ).scalar() or 0
        
        # Training revenue
        training_revenue = db.query(func.sum(DBTrainingEnrollment.amount)).filter(
            DBTrainingEnrollment.payment_status == "completed"
        ).scalar() or 0
        
        # MoreLife revenue
        morelife_revenue = db.query(func.sum(DBMoreLifeAssessment.amount)).filter(
            DBMoreLifeAssessment.payment_status == "completed"
        ).scalar() or 0
        
        return {
            "conference_revenue": float(conf_revenue),
            "book_revenue": float(book_revenue),
            "training_revenue": float(training_revenue),
            "morelife_revenue": float(morelife_revenue),
            "total_revenue": float(conf_revenue + book_revenue + training_revenue + morelife_revenue)
        }
    except Exception as e:
        logger.error(f"Error fetching revenue analytics: {e}")
        raise HTTPException(status_code=500, detail=str(e))
