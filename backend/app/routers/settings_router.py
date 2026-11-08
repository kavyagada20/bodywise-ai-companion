from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any

from app.database import get_db
from app.models import Product, User
from app.schemas import SettingsUpdate, SystemStatusResponse
from app.config import settings
from app.auth_utils import get_current_user

router = APIRouter(prefix="/api/settings", tags=["settings"])

@router.get("/status", response_model=SystemStatusResponse)
def get_system_status(db: Session = Depends(get_db)):
    prod_count = db.query(Product).count()
    users_count = db.query(User).count()
    has_api_key = bool(settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY.strip()) > 5)

    return {
        "status": "healthy",
        "demo_mode": settings.DEMO_MODE,
        "has_api_key": has_api_key,
        "active_llm_provider": "Gemini 1.5 Flash (Live)" if (has_api_key and not settings.DEMO_MODE) else "Deterministic Verified AI (Demo Mode)",
        "database": "SQLite (Local Persistent)",
        "product_count": prod_count,
        "registered_users": users_count
    }

@router.post("")
def update_settings(data: SettingsUpdate):
    if data.gemini_api_key is not None:
        settings.GEMINI_API_KEY = data.gemini_api_key
    if data.demo_mode is not None:
        settings.DEMO_MODE = data.demo_mode

    has_api_key = bool(settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY.strip()) > 5)
    return {
        "success": True,
        "demo_mode": settings.DEMO_MODE,
        "has_api_key": has_api_key,
        "message": "Settings updated successfully"
    }

