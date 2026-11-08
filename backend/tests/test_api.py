import pytest
import os
import sys

# Ensure backend directory is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, SessionLocal
from app.seed_data import seed_database
from app.rag.knowledge_base import rag_service
from app.models import Product

client = TestClient(app)

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    seed_database(db)
    prods = db.query(Product).all()
    rag_service.index_products([
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
    ])
    db.close()
    yield

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_demo_login():
    response = client.post("/api/auth/demo-login")
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["is_demo"] is True

def test_product_catalogue_and_search():
    response = client.get("/api/products?concern=Hair fall")
    assert response.status_code == 200
    products = response.json()
    assert len(products) > 0
    assert any("Hair Growth Serum" in p["name"] for p in products)

def test_demo_1_onboarding_and_routine_generation():
    # Submit onboarding profile
    payload = {
        "age_range": "25-34",
        "primary_concern": "Body acne",
        "secondary_concerns": "Pigmentation",
        "current_products": "Bar soap",
        "routine_frequency": "daily",
        "reminder_time": "09:00 AM",
        "routine_habits": "beginner"
    }
    response = client.post("/api/profile/onboarding", json=payload)
    assert response.status_code == 200
    assert response.json()["primary_concern"] == "Body acne"

    # Check active routine was generated
    routine_res = client.get("/api/routines/active")
    assert routine_res.status_code == 200
    r_data = routine_res.json()
    assert r_data["routine"] is not None
    assert len(r_data["tasks"]) > 0

def test_demo_2_ai_routine_proposal_and_approval():
    # User asks AI to create a routine
    chat_res = client.post("/api/companion/chat", json={
        "message": "Please create a simple evening routine for hair fall"
    })
    assert chat_res.status_code == 200
    data = chat_res.json()
    assert data["proposed_action"] is not None
    assert data["proposed_action"]["action_type"] == "create_routine"
    assert data["proposed_action"]["requires_approval"] is True

    # User reviews and approves the proposal
    approval_res = client.post("/api/companion/action/approve", json={
        "conversation_id": data["conversation_id"],
        "action_type": "create_routine",
        "approved": True,
        "action_payload": data["proposed_action"]
    })
    assert approval_res.status_code == 200
    assert approval_res.json()["status"] == "approved_and_saved"

    # Verify saved in active routine
    active_res = client.get("/api/routines/active")
    assert active_res.status_code == 200
    assert len(active_res.json()["tasks"]) >= 2

def test_demo_3_task_completion_and_adherence():
    active_res = client.get("/api/routines/active")
    tasks = active_res.json()["tasks"]
    assert len(tasks) > 0
    first_task = tasks[0]

    # Toggle complete
    toggle_res = client.post("/api/tasks/toggle", json={
        "task_id": first_task["id"],
        "completed": True,
        "notes": "Completed test step"
    })
    assert toggle_res.status_code == 200
    assert toggle_res.json()["completed"] is True
    assert toggle_res.json()["adherence_percentage"] > 0

def test_demo_4_product_question_grounded_rag():
    chat_res = client.post("/api/companion/chat", json={
        "message": "Explain how Redensyl works and what the hair growth serum ingredients are"
    })
    assert chat_res.status_code == 200
    data = chat_res.json()
    assert len(data["citations"]) > 0
    assert any("Hair Growth Serum" in c["product_name"] for c in data["citations"])
    assert "Redensyl" in data["content"] or "procapil" in data["content"].lower()

def test_demo_5_weekly_check_in_and_summary():
    checkin_res = client.post("/api/progress/check-in", json={
        "feedback": "Hair texture feels noticeably thicker and less brittle after 2 weeks of serum.",
        "skin_hair_condition": "Improving",
        "notes": "No missed nighttime applications."
    })
    assert checkin_res.status_code == 200
    data = checkin_res.json()
    assert data["success"] is True
    assert "summary" in data
    assert data["summary"]["adherence_score"] > 0

def test_demo_6_safety_escalation():
    chat_res = client.post("/api/companion/chat", json={
        "message": "I applied the wash and my skin is burning and swelling with severe red rash!"
    })
    assert chat_res.status_code == 200
    data = chat_res.json()
    assert data["agent_name"] == "Customer Support and Escalation Agent"
    assert "Safety Advisory Notice" in data["content"] or "stop using" in data["content"].lower()
    assert "BW-ESC-" in data["content"]

    # Check escalation tickets API
    esc_res = client.get("/api/escalations")
    assert esc_res.status_code == 200
    tickets = esc_res.json()
    assert len(tickets) > 0
    assert any("Adverse" in t["reason"] or "Sensitivity" in t["reason"] for t in tickets)

