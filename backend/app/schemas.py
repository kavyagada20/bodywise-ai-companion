from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

# ----------------- Auth & User -----------------
class UserRegister(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    is_demo: bool
    created_at: datetime
    has_profile: bool = False

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ----------------- Profile -----------------
class UserProfileBase(BaseModel):
    age_range: Optional[str] = "25-34"
    primary_concern: str
    secondary_concerns: Optional[str] = None
    current_products: Optional[str] = None
    routine_frequency: Optional[str] = "daily"
    reminder_time: Optional[str] = "08:00 AM, 09:00 PM"
    preferences: Optional[str] = None
    routine_habits: Optional[str] = "beginner"

class UserProfileCreate(UserProfileBase):
    pass

class UserProfileUpdate(BaseModel):
    age_range: Optional[str] = None
    primary_concern: Optional[str] = None
    secondary_concerns: Optional[str] = None
    current_products: Optional[str] = None
    routine_frequency: Optional[str] = None
    reminder_time: Optional[str] = None
    preferences: Optional[str] = None
    routine_habits: Optional[str] = None

class UserProfileResponse(UserProfileBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ----------------- Products -----------------
class ProductResponse(BaseModel):
    id: int
    name: str
    category: str
    intended_concern: str
    description: str
    ingredients: str
    key_actives: Optional[str] = None
    usage_instructions: str
    warnings: str
    benefits: Optional[str] = None
    faq_json: Optional[str] = None
    price: float
    rating: float
    review_count: int
    source_url: str
    verification_status: str
    image_url: Optional[str] = None

    class Config:
        from_attributes = True


# ----------------- Routine & Tasks -----------------
class RoutineTaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    time_of_day: str = "morning"  # morning, evening, weekly
    scheduled_time: str = "08:00 AM"
    step_order: int = 1
    frequency_days: str = "Everyday"
    product_name: Optional[str] = None
    product_id: Optional[int] = None

class RoutineTaskCreate(RoutineTaskBase):
    pass

class RoutineTaskResponse(RoutineTaskBase):
    id: int
    routine_id: int
    user_id: int
    is_active: bool
    is_completed_today: bool = False

    class Config:
        from_attributes = True

class RoutineCreate(BaseModel):
    name: str
    goal: Optional[str] = None
    frequency: str = "daily"
    tasks: List[RoutineTaskCreate] = []

class RoutineResponse(BaseModel):
    id: int
    user_id: int
    name: str
    goal: Optional[str] = None
    frequency: str
    status: str
    created_at: datetime
    updated_at: datetime
    tasks: List[RoutineTaskResponse] = []

    class Config:
        from_attributes = True

class TaskToggleComplete(BaseModel):
    task_id: int
    completed: bool
    date: Optional[str] = None
    notes: Optional[str] = None


# ----------------- Progress & Summaries -----------------
class CheckInRequest(BaseModel):
    feedback: str
    skin_hair_condition: str = "Improving"  # Improving, Stable, Needs Attention
    notes: Optional[str] = None

class ProgressEntryResponse(BaseModel):
    id: int
    user_id: int
    date: str
    adherence_percentage: float
    completed_tasks: int
    total_tasks: int
    feedback: Optional[str] = None
    skin_hair_condition: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class WeeklySummaryResponse(BaseModel):
    id: int
    user_id: int
    week_label: str
    adherence_score: float
    summary_text: str
    recommendations: str
    agent_insights: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ----------------- Reminders -----------------
class ReminderCreate(BaseModel):
    title: str
    time_of_day: str
    scheduled_time: str
    channel: str = "in_app"
    routine_task_id: Optional[int] = None

class ReminderResponse(BaseModel):
    id: int
    user_id: int
    title: str
    time_of_day: str
    scheduled_time: str
    is_enabled: bool
    channel: str

    class Config:
        from_attributes = True


# ----------------- AI Companion & Agent Workflows -----------------
class ChatMessageRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None

class AgentActionProposal(BaseModel):
    action_type: str  # "create_routine", "update_routine", "schedule_reminder", "escalate"
    summary: str
    details: Dict[str, Any]
    requires_approval: bool = True
    status: str = "pending"  # pending, approved, rejected, executed

class ChatMessageResponse(BaseModel):
    conversation_id: int
    message_id: int
    role: str = "assistant"
    content: str
    agent_name: str
    agent_steps: List[Dict[str, str]] = []
    proposed_action: Optional[AgentActionProposal] = None
    citations: List[Dict[str, Any]] = []
    suggested_actions: List[str] = []
    is_demo: bool = False
    timestamp: datetime

class ActionApprovalRequest(BaseModel):
    conversation_id: int
    action_type: str
    approved: bool
    action_payload: Dict[str, Any]


# ----------------- Support Escalation -----------------
class EscalationResponse(BaseModel):
    id: int
    ticket_id: str
    reason: str
    severity: str
    summary: str
    customer_note: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# ----------------- Settings & Health -----------------
class SettingsUpdate(BaseModel):
    gemini_api_key: Optional[str] = None
    demo_mode: Optional[bool] = None

class SystemStatusResponse(BaseModel):
    status: str
    demo_mode: bool
    has_api_key: bool
    active_llm_provider: str
    database: str
    product_count: int
    registered_users: int
