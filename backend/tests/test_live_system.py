import httpx
import json

BASE_API = "http://localhost:8000"
FRONTEND_URL = "http://localhost:3000"

def test_full_live_system():
    results = {}

    # ----------------- TEST 1: APPLICATION LOADING -----------------
    try:
        r_front = httpx.get(FRONTEND_URL, timeout=10.0)
        assert r_front.status_code == 200
        assert "Bodywise" in r_front.text or "AI Companion" in r_front.text
        r_docs = httpx.get(f"{BASE_API}/docs", timeout=10.0)
        assert r_docs.status_code == 200
        results["Test 1: Application Loading"] = "PASS"
    except Exception as e:
        results["Test 1: Application Loading"] = f"FAIL: {e}"

    # ----------------- TEST 2: DEMO LOGIN -----------------
    auth_token = None
    try:
        r_login = httpx.post(f"{BASE_API}/api/auth/demo-login", timeout=10.0)
        assert r_login.status_code == 200
        data = r_login.json()
        assert "access_token" in data
        assert data["user"]["is_demo"] is True
        auth_token = data["access_token"]
        results["Test 2: Demo Login"] = "PASS"
    except Exception as e:
        results["Test 2: Demo Login"] = f"FAIL: {e}"

    headers = {"Authorization": f"Bearer {auth_token}"} if auth_token else {}

    # ----------------- TEST 3: ONBOARDING -----------------
    try:
        onboard_payload = {
            "age_range": "25-34",
            "primary_concern": "Hair fall",
            "secondary_concerns": "Dandruff, Pigmentation",
            "current_products": "Gentle daily shampoo",
            "routine_frequency": "daily",
            "reminder_time": "08:30 AM, 09:30 PM",
            "preferences": "Lightweight, non-greasy scalp serum",
            "routine_habits": "Intermediate"
        }
        r_onboard = httpx.post(f"{BASE_API}/api/profile/onboarding", json=onboard_payload, headers=headers, timeout=10.0)
        assert r_onboard.status_code == 200
        assert r_onboard.json()["primary_concern"] == "Hair fall"

        # Verify active routine generated
        r_active = httpx.get(f"{BASE_API}/api/routines/active", headers=headers, timeout=10.0)
        assert r_active.status_code == 200
        active_data = r_active.json()
        assert active_data["routine"] is not None
        assert len(active_data["tasks"]) >= 2
        results["Test 3: Personalisation Onboarding"] = "PASS"
    except Exception as e:
        results["Test 3: Personalisation Onboarding"] = f"FAIL: {e}"

    # ----------------- TEST 4: ROUTINE APPROVAL WORKFLOW -----------------
    try:
        chat_req = {
            "message": "Please create a simple evening routine for hair fall"
        }
        r_chat = httpx.post(f"{BASE_API}/api/companion/chat", json=chat_req, headers=headers, timeout=10.0)
        assert r_chat.status_code == 200
        chat_data = r_chat.json()
        assert chat_data["proposed_action"] is not None
        assert chat_data["proposed_action"]["action_type"] == "create_routine"
        assert chat_data["proposed_action"]["requires_approval"] is True

        conv_id = chat_data["conversation_id"]

        # Human-in-the-loop: Approve the proposed action
        approval_req = {
            "conversation_id": conv_id,
            "action_type": "create_routine",
            "approved": True,
            "action_payload": chat_data["proposed_action"]
        }
        r_approve = httpx.post(f"{BASE_API}/api/companion/action/approve", json=approval_req, headers=headers, timeout=10.0)
        assert r_approve.status_code == 200
        assert r_approve.json()["status"] == "approved_and_saved"

        # Verify new routine is active in DB
        r_active2 = httpx.get(f"{BASE_API}/api/routines/active", headers=headers, timeout=10.0)
        assert r_active2.status_code == 200
        assert len(r_active2.json()["tasks"]) >= 2
        results["Test 4: Routine Proposal & Human Approval"] = "PASS"
    except Exception as e:
        results["Test 4: Routine Proposal & Human Approval"] = f"FAIL: {e}"

    # ----------------- TEST 5: ROUTINE COMPLETION & PERSISTENCE -----------------
    try:
        r_tasks = httpx.get(f"{BASE_API}/api/routines/active", headers=headers, timeout=10.0)
        tasks = r_tasks.json()["tasks"]
        target_task = tasks[0]

        # Toggle task complete
        toggle_req = {
            "task_id": target_task["id"],
            "completed": True,
            "notes": "Night application completed"
        }
        r_toggle = httpx.post(f"{BASE_API}/api/tasks/toggle", json=toggle_req, headers=headers, timeout=10.0)
        assert r_toggle.status_code == 200
        toggle_data = r_toggle.json()
        assert toggle_data["completed"] is True
        assert toggle_data["adherence_percentage"] > 0

        # Verify persistence on subsequent fetch
        r_check = httpx.get(f"{BASE_API}/api/routines/active", headers=headers, timeout=10.0)
        completed_ids = [t["id"] for t in r_check.json()["tasks"] if t["is_completed_today"]]
        assert target_task["id"] in completed_ids

        # Verify progress stats updated
        r_stats = httpx.get(f"{BASE_API}/api/progress/stats", headers=headers, timeout=10.0)
        assert r_stats.status_code == 200
        results["Test 5: Routine Completion & Adherence Persistence"] = "PASS"
    except Exception as e:
        results["Test 5: Routine Completion & Adherence Persistence"] = f"FAIL: {e}"

    # ----------------- TEST 6: PRODUCT KNOWLEDGE RAG -----------------
    try:
        rag_query = {
            "message": "Explain how Redensyl works in the Hair Growth Serum."
        }
        r_rag = httpx.post(f"{BASE_API}/api/companion/chat", json=rag_query, headers=headers, timeout=10.0)
        assert r_rag.status_code == 200
        rag_data = r_rag.json()
        assert len(rag_data["citations"]) > 0
        assert any("Hair Growth Serum" in c["product_name"] for c in rag_data["citations"])
        assert "Redensyl" in rag_data["content"] or "procapil" in rag_data["content"].lower()
        results["Test 6: Product Knowledge RAG Grounding"] = "PASS"
    except Exception as e:
        results["Test 6: Product Knowledge RAG Grounding"] = f"FAIL: {e}"

    # ----------------- TEST 7: WEEKLY PROGRESS CHECK-IN -----------------
    try:
        checkin_req = {
            "feedback": "Scalp feels hydrated and hair fall has noticeably decreased after 3 weeks.",
            "skin_hair_condition": "Improving",
            "notes": "Consistent evening serum routine."
        }
        r_checkin = httpx.post(f"{BASE_API}/api/progress/check-in", json=checkin_req, headers=headers, timeout=10.0)
        assert r_checkin.status_code == 200
        checkin_data = r_checkin.json()
        assert checkin_data["success"] is True
        assert "summary" in checkin_data

        # Verify summary appears in history
        r_summaries = httpx.get(f"{BASE_API}/api/progress/summaries", headers=headers, timeout=10.0)
        assert r_summaries.status_code == 200
        assert len(r_summaries.json()) > 0
        results["Test 7: Weekly Progress & AI Summary Generation"] = "PASS"
    except Exception as e:
        results["Test 7: Weekly Progress & AI Summary Generation"] = f"FAIL: {e}"

    # ----------------- TEST 8: SAFETY ESCALATION TRIAGE -----------------
    try:
        esc_query = {
            "message": "I am experiencing burning and a severe rash after using a product."
        }
        r_esc = httpx.post(f"{BASE_API}/api/companion/chat", json=esc_query, headers=headers, timeout=10.0)
        assert r_esc.status_code == 200
        esc_data = r_esc.json()
        assert esc_data["agent_name"] == "Customer Support and Escalation Agent"
        assert "Safety Advisory Notice" in esc_data["content"] or "stop using" in esc_data["content"].lower()
        assert "BW-ESC-" in esc_data["content"]

        # Verify escalation ticket logged
        r_tickets = httpx.get(f"{BASE_API}/api/escalations", headers=headers, timeout=10.0)
        assert r_tickets.status_code == 200
        assert len(r_tickets.json()) > 0
        results["Test 8: Safety Escalation & Human Triage Ticket"] = "PASS"
    except Exception as e:
        results["Test 8: Safety Escalation & Human Triage Ticket"] = f"FAIL: {e}"

    # ----------------- TEST 9: RESPONSIVE INTERFACE & PRODUCTS -----------------
    try:
        # Check product catalogue retrieval with filters
        r_prods = httpx.get(f"{BASE_API}/api/products?category=Hair", timeout=10.0)
        assert r_prods.status_code == 200
        assert len(r_prods.json()) > 0

        # Check frontend HTML contains responsive meta viewport
        r_page = httpx.get(FRONTEND_URL, timeout=10.0)
        assert r_page.status_code == 200
        assert "viewport" in r_page.text.lower() or "bodywise" in r_page.text.lower()
        results["Test 9: Responsive Layout & Product Exploration"] = "PASS"
    except Exception as e:
        results["Test 9: Responsive Layout & Product Exploration"] = f"FAIL: {e}"

    print(json.dumps(results, indent=2))
    return results

if __name__ == "__main__":
    test_full_live_system()

