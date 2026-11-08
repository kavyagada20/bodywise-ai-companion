from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.seed_data import seed_database
from app.rag.knowledge_base import rag_service
from app.models import Product

# Import Routers
from app.routers.auth import router as auth_router
from app.routers.profile import router as profile_router
from app.routers.products import router as products_router
from app.routers.routines import router as routines_router, task_router
from app.routers.progress import router as progress_router
from app.routers.companion import router as companion_router
from app.routers.escalations import router as escalations_router
from app.routers.reminders import router as reminders_router
from app.routers.settings_router import router as settings_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Initialize Tables
    Base.metadata.create_all(bind=engine)

    # 2. Seed Database
    db = SessionLocal()
    try:
        seed_database(db)
        # 3. Index Products into RAG vector space
        prods = db.query(Product).all()
        products_dict = [
            {
                "id": p.id,
                "name": p.name,
                "category": p.category,
                "intended_concern": p.intended_concern,
                "description": p.description,
                "ingredients": p.ingredients,
                "key_actives": p.key_actives,
                "usage_instructions": p.usage_instructions,
                "warnings": p.warnings,
                "benefits": p.benefits,
                "source_url": p.source_url,
                "verification_status": p.verification_status
            }
            for p in prods
        ]
        rag_service.index_products(products_dict)
        print(f"RAG Knowledge Base initialized with {len(products_dict)} products.")
    finally:
        db.close()

    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Agentic Personal-Care Assistant Backend for Be Bodywise",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(products_router)
app.include_router(routines_router)
app.include_router(task_router)
app.include_router(progress_router)
app.include_router(companion_router)
app.include_router(escalations_router)
app.include_router(reminders_router)
app.include_router(settings_router)

@app.get("/")
def root():
    return {
        "app": "Bodywise AI Companion",
        "tagline": "Your Personal Care Journey, Intelligently Managed.",
        "status": "online",
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "demo_mode": settings.DEMO_MODE,
        "llm_ready": bool(settings.GEMINI_API_KEY)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

