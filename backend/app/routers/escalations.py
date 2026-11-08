from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import SupportEscalation, User
from app.schemas import EscalationResponse
from app.auth_utils import get_current_user

router = APIRouter(prefix="/api/escalations", tags=["escalations"])

@router.get("", response_model=List[EscalationResponse])
def get_escalations(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    tickets = db.query(SupportEscalation).filter(SupportEscalation.user_id == user.id).order_by(SupportEscalation.created_at.desc()).all()
    return tickets

@router.get("/{ticket_id}", response_model=EscalationResponse)
def get_escalation_by_ticket(ticket_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    ticket = db.query(SupportEscalation).filter(SupportEscalation.ticket_id == ticket_id, SupportEscalation.user_id == user.id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Escalation ticket not found")
    return ticket

