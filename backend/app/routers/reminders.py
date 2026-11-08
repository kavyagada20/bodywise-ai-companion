from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Reminder, User
from app.schemas import ReminderCreate, ReminderResponse
from app.auth_utils import get_current_user

router = APIRouter(prefix="/api/reminders", tags=["reminders"])

@router.get("", response_model=List[ReminderResponse])
def get_reminders(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    reminders = db.query(Reminder).filter(Reminder.user_id == user.id).all()
    if not reminders:
        # Default reminders
        r1 = Reminder(user_id=user.id, title="Morning Routine Reminder", time_of_day="morning", scheduled_time="08:30 AM", is_enabled=True)
        r2 = Reminder(user_id=user.id, title="Night Scalp Care Reminder", time_of_day="evening", scheduled_time="09:30 PM", is_enabled=True)
        db.add_all([r1, r2])
        db.commit()
        reminders = [r1, r2]
    return reminders

@router.post("", response_model=ReminderResponse)
def create_reminder(data: ReminderCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rem = Reminder(
        user_id=user.id,
        title=data.title,
        time_of_day=data.time_of_day,
        scheduled_time=data.scheduled_time,
        channel=data.channel,
        routine_task_id=data.routine_task_id,
        is_enabled=True
    )
    db.add(rem)
    db.commit()
    db.refresh(rem)
    return rem

@router.post("/{reminder_id}/toggle")
def toggle_reminder(reminder_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rem = db.query(Reminder).filter(Reminder.id == reminder_id, Reminder.user_id == user.id).first()
    if not rem:
        raise HTTPException(status_code=404, detail="Reminder not found")
    rem.is_enabled = not rem.is_enabled
    db.commit()
    return {"id": rem.id, "is_enabled": rem.is_enabled}

