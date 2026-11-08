from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
import json
import datetime

from app.database import get_db
from app.models import Conversation, Message, AgentExecution, SupportEscalation, Routine, RoutineTask, Product, User, UserProfile
from app.schemas import ChatMessageRequest, ChatMessageResponse, ActionApprovalRequest
from app.auth_utils import get_current_user
from app.agents.orchestrator import orchestrator
from app.config import settings

router = APIRouter(prefix="/api/companion", tags=["companion"])

@router.post("/chat", response_model=ChatMessageResponse)
def chat_with_companion(
    payload: ChatMessageRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Find or create conversation
    conv = None
    if payload.conversation_id:
        conv = db.query(Conversation).filter(Conversation.id == payload.conversation_id, Conversation.user_id == user.id).first()
    if not conv:
        conv = Conversation(user_id=user.id, title=f"Consultation on {datetime.date.today().strftime('%b %d')}")
        db.add(conv)
        db.commit()
        db.refresh(conv)

    # Save user message
    user_msg = Message(
        conversation_id=conv.id,
        role="user",
        content=payload.message
    )
    db.add(user_msg)
    db.commit()

    # Prepare user profile context
    profile_dict = {
        "name": user.name,
        "email": user.email,
        "primary_concern": "Hair fall",
        "secondary_concerns": "",
        "routine_habits": "beginner"
    }
    if user.profile:
        profile_dict.update({
            "primary_concern": user.profile.primary_concern or "Hair fall",
            "secondary_concerns": user.profile.secondary_concerns or "",
            "routine_habits": user.profile.routine_habits or "beginner",
            "preferences": user.profile.preferences or "",
            "reminder_time": user.profile.reminder_time or ""
        })

    # Run LangGraph Agent Orchestrator
    agent_output = orchestrator.run(
        user_id=user.id,
        query=payload.message,
        user_profile=profile_dict,
        db=db
    )

    agent_name = agent_output.get("active_agent", "Agent Orchestrator")
    agent_trace = agent_output.get("agent_trace", [])
    proposed_action = agent_output.get("proposed_action")
    citations = agent_output.get("retrieved_docs", [])
    suggested = agent_output.get("suggested_prompts", [])
    content = agent_output.get("response_content", "")
    escalation = agent_output.get("escalation")

    # If an escalation occurred, persist it in the DB
    if escalation:
        esc_record = SupportEscalation(
            user_id=user.id,
            conversation_id=conv.id,
            ticket_id=escalation["ticket_id"],
            reason=escalation["reason"],
            severity=escalation["severity"],
            summary=escalation["summary"],
            customer_note=payload.message,
            status=escalation["status"]
        )
        db.add(esc_record)
        db.commit()

    # Log Agent Execution
    exec_log = AgentExecution(
        user_id=user.id,
        conversation_id=conv.id,
        agent_name=agent_name,
        action=agent_output.get("intent", "consultation"),
        status="escalated" if escalation else ("pending_approval" if proposed_action else "completed"),
        execution_details=json.dumps({
            "trace": agent_trace,
            "has_proposal": proposed_action is not None,
            "has_escalation": escalation is not None
        })
    )
    db.add(exec_log)

    # Save Assistant Message
    meta = {
        "agent_trace": agent_trace,
        "proposed_action": proposed_action,
        "citations": citations,
        "suggested_actions": suggested,
        "escalation": escalation
    }
    assistant_msg = Message(
        conversation_id=conv.id,
        role="assistant",
        agent_name=agent_name,
        content=content,
        metadata_json=json.dumps(meta)
    )
    db.add(assistant_msg)
    db.commit()
    db.refresh(assistant_msg)

    return {
        "conversation_id": conv.id,
        "message_id": assistant_msg.id,
        "role": "assistant",
        "content": content,
        "agent_name": agent_name,
        "agent_steps": agent_trace,
        "proposed_action": proposed_action,
        "citations": citations,
        "suggested_actions": suggested,
        "is_demo": settings.DEMO_MODE or not bool(settings.GEMINI_API_KEY),
        "timestamp": assistant_msg.timestamp
    }

@router.post("/action/approve")
def approve_agent_action(
    payload: ActionApprovalRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Human-in-the-loop approval: Commits proposed agent action into database."""
    conv = db.query(Conversation).filter(Conversation.id == payload.conversation_id, Conversation.user_id == user.id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    if not payload.approved:
        # User rejected the action
        msg = Message(
            conversation_id=conv.id,
            role="assistant",
            agent_name="Routine Management Agent",
            content="Understood! The proposed routine was not saved. Feel free to let me know what changes or preferences you'd like me to consider.",
            metadata_json=json.dumps({"suggested_actions": ["Change products", "Modify reminder times", "Ask a question"]})
        )
        db.add(msg)
        db.commit()
        return {"success": True, "status": "rejected", "message": "Action proposal discarded per your direction."}

    # Action approved!
    if payload.action_type == "create_routine":
        details = payload.action_payload.get("details", payload.action_payload)
        name = details.get("name", "Personalized Care Routine")
        goal = details.get("goal", "Personal care routine")
        tasks_data = details.get("tasks", [])

        # Archive old active routines
        db.query(Routine).filter(Routine.user_id == user.id, Routine.status == "active").update({"status": "archived"})

        new_routine = Routine(
            user_id=user.id,
            name=name,
            goal=goal,
            frequency="daily",
            status="active"
        )
        db.add(new_routine)
        db.commit()
        db.refresh(new_routine)

        for idx, t in enumerate(tasks_data, start=1):
            # Try to match product
            prod_name = t.get("product_name")
            prod = None
            if prod_name:
                prod = db.query(Product).filter(Product.name.ilike(f"%{prod_name[:15]}%")).first()

            task = RoutineTask(
                routine_id=new_routine.id,
                user_id=user.id,
                title=t.get("title", f"Step {idx}"),
                description=t.get("description", ""),
                time_of_day=t.get("time_of_day", "morning"),
                scheduled_time=t.get("scheduled_time", "08:30 AM"),
                step_order=idx,
                frequency_days=t.get("frequency_days", "Everyday"),
                product_name=prod_name,
                product_id=prod.id if prod else None
            )
            db.add(task)

        db.commit()

        # Log approval
        exec_log = AgentExecution(
            user_id=user.id,
            conversation_id=conv.id,
            agent_name="Routine Management Agent",
            action="create_routine_approved",
            status="executed",
            execution_details=json.dumps({"routine_id": new_routine.id, "tasks_count": len(tasks_data)})
        )
        db.add(exec_log)

        # Notify user in conversation
        confirm_msg = Message(
            conversation_id=conv.id,
            role="assistant",
            agent_name="Routine Management Agent",
            content=f"🎉 **Routine Approved and Activated!**\n\nI have saved **{new_routine.name}** with {len(tasks_data)} steps to your active schedule. You can now view, complete, and track tasks directly in the **My Routine** and **Overview** tabs.",
            metadata_json=json.dumps({
                "routine_id": new_routine.id,
                "suggested_actions": ["View My Routine", "What should I do if I miss a step?", "Log today's tasks"]
            })
        )
        db.add(confirm_msg)
        db.commit()

        return {
            "success": True,
            "status": "approved_and_saved",
            "routine_id": new_routine.id,
            "message": f"Successfully created and saved {new_routine.name} to your schedule."
        }

    return {"success": True, "status": "executed"}

@router.get("/conversation")
def get_current_conversation(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    conv = db.query(Conversation).filter(Conversation.user_id == user.id).order_by(Conversation.updated_at.desc()).first()
    if not conv:
        # Create initial consultation
        conv = Conversation(user_id=user.id, title="Personal Care Consultation")
        db.add(conv)
        db.commit()
        db.refresh(conv)

        welcome_msg = Message(
            conversation_id=conv.id,
            role="assistant",
            agent_name="Personalisation Agent",
            content=f"Hello {user.name}! I'm your Bodywise AI Companion. How can I assist with your personal care routine or product questions today?",
            metadata_json=json.dumps({
                "suggested_actions": [
                    "Help me create a hair-care routine",
                    "Explain how Salicylic Acid works",
                    "Summarise my weekly progress",
                    "I missed yesterday's routine. What should I do?"
                ]
            })
        )
        db.add(welcome_msg)
        db.commit()

    messages_data = []
    for m in conv.messages:
        meta = {}
        if m.metadata_json:
            try:
                meta = json.loads(m.metadata_json)
            except Exception:
                meta = {}
        messages_data.append({
            "id": m.id,
            "role": m.role,
            "agent_name": m.agent_name or ("You" if m.role == "user" else "AI Companion"),
            "content": m.content,
            "timestamp": m.timestamp,
            "agent_steps": meta.get("agent_trace", []),
            "proposed_action": meta.get("proposed_action"),
            "citations": meta.get("citations", []),
            "suggested_actions": meta.get("suggested_actions", []),
            "escalation": meta.get("escalation")
        })

    return {
        "conversation_id": conv.id,
        "title": conv.title,
        "messages": messages_data
    }

@router.post("/reset")
def reset_conversation(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    new_conv = Conversation(user_id=user.id, title=f"Consultation — {datetime.date.today().strftime('%b %d')}")
    db.add(new_conv)
    db.commit()
    db.refresh(new_conv)

    welcome_msg = Message(
        conversation_id=new_conv.id,
        role="assistant",
        agent_name="Personalisation Agent",
        content=f"Hello {user.name}! A fresh consultation session has started. What personal care goals or concerns shall we focus on today?",
        metadata_json=json.dumps({
            "suggested_actions": [
                "Create a simple evening routine",
                "Explain active ingredients",
                "Review my routine adherence"
            ]
        })
    )
    db.add(welcome_msg)
    db.commit()

    return {"conversation_id": new_conv.id, "message": "Conversation reset successfully"}

