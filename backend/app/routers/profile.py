from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json

from app.database import get_db
from app.models import User, UserProfile, Routine, RoutineTask, Product
from app.schemas import UserProfileCreate, UserProfileUpdate, UserProfileResponse
from app.auth_utils import get_current_user

router = APIRouter(prefix="/api/profile", tags=["profile"])

@router.post("/onboarding", response_model=UserProfileResponse)
def submit_onboarding(data: UserProfileCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Check if profile already exists
    profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
    if profile:
        profile.age_range = data.age_range
        profile.primary_concern = data.primary_concern
        profile.secondary_concerns = data.secondary_concerns
        profile.current_products = data.current_products
        profile.routine_frequency = data.routine_frequency
        profile.reminder_time = data.reminder_time
        profile.preferences = data.preferences
        profile.routine_habits = data.routine_habits
    else:
        profile = UserProfile(
            user_id=user.id,
            age_range=data.age_range,
            primary_concern=data.primary_concern,
            secondary_concerns=data.secondary_concerns,
            current_products=data.current_products,
            routine_frequency=data.routine_frequency,
            reminder_time=data.reminder_time,
            preferences=data.preferences,
            routine_habits=data.routine_habits
        )
        db.add(profile)

    db.commit()
    db.refresh(profile)

    # Automatically generate an active personalized routine based on user's primary concern
    concern = (data.primary_concern or "Hair fall").lower()
    existing_routine = db.query(Routine).filter(Routine.user_id == user.id, Routine.status == "active").first()
    if not existing_routine:
        if "hair" in concern or "dandruff" in concern:
            routine_name = f"Personalized {data.primary_concern} Care Regimen"
            goal = f"Strengthen hair follicles and nourish scalp to resolve {data.primary_concern}"
            p1 = db.query(Product).filter(Product.name.like("%Hair Growth Serum%")).first()
            p2 = db.query(Product).filter(Product.name.like("%Biotin%")).first()
            routine = Routine(user_id=user.id, name=routine_name, goal=goal, frequency="daily", status="active")
            db.add(routine)
            db.commit()
            db.refresh(routine)

            tasks = [
                RoutineTask(
                    routine_id=routine.id,
                    user_id=user.id,
                    title="Biotin Hair Gummy with Zinc",
                    description="Chew 1 gummy post-breakfast for internal keratin support.",
                    time_of_day="morning",
                    scheduled_time="08:30 AM",
                    step_order=1,
                    product_name="Biotin Hair Gummies with Zinc & Multivitamins",
                    product_id=p2.id if p2 else None
                ),
                RoutineTask(
                    routine_id=routine.id,
                    user_id=user.id,
                    title="Scalp Application of Redensyl Serum",
                    description="Apply 1ml dropper directly to scalp and massage gently.",
                    time_of_day="evening",
                    scheduled_time="09:30 PM",
                    step_order=2,
                    product_name="Hair Growth Serum with Redensyl & Procapil",
                    product_id=p1.id if p1 else None
                )
            ]
            db.add_all(tasks)
            db.commit()
        elif "body" in concern or "pigment" in concern:
            routine_name = f"Personalized {data.primary_concern} Clarity Regimen"
            goal = f"Clarify skin, clear body bumps, and restore natural skin barrier"
            p1 = db.query(Product).filter(Product.name.like("%Salicylic Acid Body Wash%")).first()
            p2 = db.query(Product).filter(Product.name.like("%10% Niacinamide Body%")).first()
            routine = Routine(user_id=user.id, name=routine_name, goal=goal, frequency="daily", status="active")
            db.add(routine)
            db.commit()
            db.refresh(routine)

            tasks = [
                RoutineTask(
                    routine_id=routine.id,
                    user_id=user.id,
                    title="1% Salicylic Acid Body Wash",
                    description="Lather onto damp chest and back for 60 seconds before rinsing.",
                    time_of_day="morning",
                    scheduled_time="08:30 AM",
                    step_order=1,
                    product_name="1% Salicylic Acid Body Wash",
                    product_id=p1.id if p1 else None
                ),
                RoutineTask(
                    routine_id=routine.id,
                    user_id=user.id,
                    title="10% Niacinamide Body Hydration",
                    description="Apply on towel-dried skin after shower to brighten skin tone.",
                    time_of_day="evening",
                    scheduled_time="09:00 PM",
                    step_order=2,
                    product_name="10% Niacinamide Body Lotion with Aloe Vera",
                    product_id=p2.id if p2 else None
                )
            ]
            db.add_all(tasks)
            db.commit()
        else:
            routine_name = f"Personalized {data.primary_concern} Repair Regimen"
            goal = f"Restore moisture barrier and balance sebum for healthy skin glow"
            p1 = db.query(Product).filter(Product.name.like("%Salicylic Acid Face Wash%")).first()
            p2 = db.query(Product).filter(Product.name.like("%Ceramide%")).first()
            routine = Routine(user_id=user.id, name=routine_name, goal=goal, frequency="daily", status="active")
            db.add(routine)
            db.commit()
            db.refresh(routine)

            tasks = [
                RoutineTask(
                    routine_id=routine.id,
                    user_id=user.id,
                    title="Gentle Cleanse with Salicylic Acid Face Wash",
                    description="Massage on damp face for 60 seconds, then rinse with lukewarm water.",
                    time_of_day="morning",
                    scheduled_time="08:00 AM",
                    step_order=1,
                    product_name="1% Salicylic Acid Face Wash",
                    product_id=p1.id if p1 else None
                ),
                RoutineTask(
                    routine_id=routine.id,
                    user_id=user.id,
                    title="Ceramide & Hyaluronic Barrier Cream",
                    description="Smooth dime-sized amount across face and neck to seal moisture.",
                    time_of_day="evening",
                    scheduled_time="09:30 PM",
                    step_order=2,
                    product_name="Ceramide & Hyaluronic Acid Barrier Moisturizer",
                    product_id=p2.id if p2 else None
                )
            ]
            db.add_all(tasks)
            db.commit()

    return profile

@router.get("", response_model=UserProfileResponse)
def get_profile(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found. Please complete onboarding.")
    return profile

@router.put("", response_model=UserProfileResponse)
def update_profile(data: UserProfileUpdate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    for key, val in data.dict(exclude_unset=True).items():
        if val is not None:
            setattr(profile, key, val)

    db.commit()
    db.refresh(profile)
    return profile

