from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import datetime

from app.database import get_db
from app.models import Routine, RoutineTask, TaskCompletion, ProgressEntry, User
from app.schemas import RoutineResponse, RoutineCreate, RoutineTaskCreate, RoutineTaskResponse, TaskToggleComplete
from app.auth_utils import get_current_user

router = APIRouter(prefix="/api/routines", tags=["routines"])

@router.get("/active")
def get_active_routine(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    routine = db.query(Routine).filter(Routine.user_id == user.id, Routine.status == "active").first()
    if not routine:
        return {"routine": None, "tasks": []}

    today_str = datetime.date.today().isoformat()
    completed_task_ids = set(
        c.task_id for c in db.query(TaskCompletion).filter(
            TaskCompletion.user_id == user.id,
            TaskCompletion.date == today_str
        ).all()
    )

    tasks_out = []
    for t in routine.tasks:
        tasks_out.append({
            "id": t.id,
            "routine_id": t.routine_id,
            "user_id": t.user_id,
            "title": t.title,
            "description": t.description,
            "time_of_day": t.time_of_day,
            "scheduled_time": t.scheduled_time,
            "step_order": t.step_order,
            "frequency_days": t.frequency_days,
            "product_name": t.product_name,
            "product_id": t.product_id,
            "is_active": t.is_active,
            "is_completed_today": t.id in completed_task_ids
        })

    return {
        "routine": {
            "id": routine.id,
            "name": routine.name,
            "goal": routine.goal,
            "frequency": routine.frequency,
            "status": routine.status,
            "created_at": routine.created_at,
            "updated_at": routine.updated_at
        },
        "tasks": tasks_out
    }

@router.get("", response_model=List[RoutineResponse])
def get_all_routines(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    routines = db.query(Routine).filter(Routine.user_id == user.id).all()
    today_str = datetime.date.today().isoformat()
    completed_task_ids = set(
        c.task_id for c in db.query(TaskCompletion).filter(
            TaskCompletion.user_id == user.id,
            TaskCompletion.date == today_str
        ).all()
    )

    result = []
    for r in routines:
        tasks_list = []
        for t in r.tasks:
            tasks_list.append(RoutineTaskResponse(
                id=t.id,
                routine_id=t.routine_id,
                user_id=t.user_id,
                title=t.title,
                description=t.description,
                time_of_day=t.time_of_day,
                scheduled_time=t.scheduled_time,
                step_order=t.step_order,
                frequency_days=t.frequency_days,
                product_name=t.product_name,
                product_id=t.product_id,
                is_active=t.is_active,
                is_completed_today=t.id in completed_task_ids
            ))
        result.append(RoutineResponse(
            id=r.id,
            user_id=r.user_id,
            name=r.name,
            goal=r.goal,
            frequency=r.frequency,
            status=r.status,
            created_at=r.created_at,
            updated_at=r.updated_at,
            tasks=tasks_list
        ))
    return result

@router.post("", response_model=RoutineResponse)
def create_routine(data: RoutineCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Set existing active routines to inactive if replacing
    db.query(Routine).filter(Routine.user_id == user.id, Routine.status == "active").update({"status": "archived"})

    routine = Routine(
        user_id=user.id,
        name=data.name,
        goal=data.goal,
        frequency=data.frequency,
        status="active"
    )
    db.add(routine)
    db.commit()
    db.refresh(routine)

    created_tasks = []
    for idx, t in enumerate(data.tasks, start=1):
        task = RoutineTask(
            routine_id=routine.id,
            user_id=user.id,
            title=t.title,
            description=t.description,
            time_of_day=t.time_of_day,
            scheduled_time=t.scheduled_time,
            step_order=idx,
            frequency_days=t.frequency_days,
            product_name=t.product_name,
            product_id=t.product_id
        )
        db.add(task)
        created_tasks.append(task)

    db.commit()
    db.refresh(routine)

    tasks_response = [
        RoutineTaskResponse(
            id=t.id,
            routine_id=t.routine_id,
            user_id=t.user_id,
            title=t.title,
            description=t.description,
            time_of_day=t.time_of_day,
            scheduled_time=t.scheduled_time,
            step_order=t.step_order,
            frequency_days=t.frequency_days,
            product_name=t.product_name,
            product_id=t.product_id,
            is_active=t.is_active,
            is_completed_today=False
        ) for t in routine.tasks
    ]

    return RoutineResponse(
        id=routine.id,
        user_id=routine.user_id,
        name=routine.name,
        goal=routine.goal,
        frequency=routine.frequency,
        status=routine.status,
        created_at=routine.created_at,
        updated_at=routine.updated_at,
        tasks=tasks_response
    )

@router.delete("/{routine_id}")
def delete_routine(routine_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    routine = db.query(Routine).filter(Routine.id == routine_id, Routine.user_id == user.id).first()
    if not routine:
        raise HTTPException(status_code=404, detail="Routine not found")
    db.delete(routine)
    db.commit()
    return {"message": "Routine deleted successfully"}

# Task endpoints
task_router = APIRouter(prefix="/api/tasks", tags=["tasks"])

@task_router.post("/toggle")
def toggle_task_completion(data: TaskToggleComplete, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.query(RoutineTask).filter(RoutineTask.id == data.task_id, RoutineTask.user_id == user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    date_str = data.date or datetime.date.today().isoformat()

    existing = db.query(TaskCompletion).filter(
        TaskCompletion.task_id == task.id,
        TaskCompletion.user_id == user.id,
        TaskCompletion.date == date_str
    ).first()

    if data.completed:
        if not existing:
            comp = TaskCompletion(
                task_id=task.id,
                user_id=user.id,
                date=date_str,
                notes=data.notes
            )
            db.add(comp)
    else:
        if existing:
            db.delete(existing)

    db.commit()

    # Recalculate adherence for date
    routine = db.query(Routine).filter(Routine.id == task.routine_id).first()
    total_routine_tasks = len(routine.tasks) if routine else 1
    completed_today_count = db.query(TaskCompletion).filter(
        TaskCompletion.user_id == user.id,
        TaskCompletion.date == date_str
    ).count()

    adherence_pct = round((completed_today_count / max(1, total_routine_tasks)) * 100.0, 1)

    progress = db.query(ProgressEntry).filter(
        ProgressEntry.user_id == user.id,
        ProgressEntry.date == date_str
    ).first()

    if progress:
        progress.adherence_percentage = adherence_pct
        progress.completed_tasks = completed_today_count
        progress.total_tasks = total_routine_tasks
    else:
        progress = ProgressEntry(
            user_id=user.id,
            date=date_str,
            adherence_percentage=adherence_pct,
            completed_tasks=completed_today_count,
            total_tasks=total_routine_tasks,
            skin_hair_condition="Improving"
        )
        db.add(progress)

    db.commit()

    return {
        "success": True,
        "task_id": task.id,
        "completed": data.completed,
        "date": date_str,
        "adherence_percentage": adherence_pct,
        "completed_count": completed_today_count,
        "total_tasks": total_routine_tasks
    }

