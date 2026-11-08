from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, UserProfile
from app.schemas import UserRegister, UserLogin, UserResponse, TokenResponse
from app.auth_utils import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=TokenResponse)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email is already registered")

    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=get_password_hash(user_data.password),
        is_demo=False
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": str(new_user.id)})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "is_demo": new_user.is_demo,
            "created_at": new_user.created_at,
            "has_profile": False
        }
    }

@router.post("/login", response_model=TokenResponse)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": str(user.id)})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "is_demo": user.is_demo,
            "created_at": user.created_at,
            "has_profile": user.profile is not None
        }
    }

@router.post("/demo-login", response_model=TokenResponse)
def demo_login(db: Session = Depends(get_db)):
    """Instant one-click demo login for reviewer evaluation."""
    demo_user = db.query(User).filter(User.is_demo == True).first()
    if not demo_user:
        # Create fallback if not seeded
        demo_user = User(
            name="Kavya Gada",
            email="kavya@bodywise.demo",
            password_hash=get_password_hash("demo123"),
            is_demo=True
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)

    token = create_access_token({"sub": str(demo_user.id)})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": demo_user.id,
            "name": demo_user.name,
            "email": demo_user.email,
            "is_demo": True,
            "created_at": demo_user.created_at,
            "has_profile": demo_user.profile is not None
        }
    }

@router.get("/me", response_model=UserResponse)
def get_me(user: User = Depends(get_current_user)):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "is_demo": user.is_demo,
        "created_at": user.created_at,
        "has_profile": user.profile is not None
    }

