import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    routines = relationship("Routine", back_populates="user", cascade="all, delete-orphan")
    progress_entries = relationship("ProgressEntry", back_populates="user", cascade="all, delete-orphan")
    weekly_summaries = relationship("WeeklySummary", back_populates="user", cascade="all, delete-orphan")
    reminders = relationship("Reminder", back_populates="user", cascade="all, delete-orphan")
    conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")
    agent_executions = relationship("AgentExecution", back_populates="user", cascade="all, delete-orphan")
    escalations = relationship("SupportEscalation", back_populates="user", cascade="all, delete-orphan")
    task_completions = relationship("TaskCompletion", back_populates="user", cascade="all, delete-orphan")


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    age_range = Column(String(50), nullable=True)
    primary_concern = Column(String(100), nullable=False)
    secondary_concerns = Column(Text, nullable=True)  # Comma-separated or JSON string
    current_products = Column(Text, nullable=True)
    routine_frequency = Column(String(50), default="daily")
    reminder_time = Column(String(50), default="08:00 AM, 09:00 PM")
    preferences = Column(Text, nullable=True)  # fragrance-free, sensitive skin, etc.
    routine_habits = Column(Text, nullable=True)  # beginner, intermediate, consistent
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="profile")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    category = Column(String(100), nullable=False, index=True)  # Hair, Face, Body, Nutrition
    intended_concern = Column(String(100), nullable=False, index=True)  # Hair fall, Acne, Body acne, etc.
    description = Column(Text, nullable=False)
    ingredients = Column(Text, nullable=False)
    key_actives = Column(String(255), nullable=True)
    usage_instructions = Column(Text, nullable=False)
    warnings = Column(Text, nullable=False)
    benefits = Column(Text, nullable=True)
    faq_json = Column(Text, nullable=True)
    price = Column(Float, default=499.0)
    rating = Column(Float, default=4.8)
    review_count = Column(Integer, default=320)
    source_url = Column(String(300), default="https://bebodywise.com")
    verification_status = Column(String(50), default="Verified Be Bodywise Information")
    image_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class Routine(Base):
    __tablename__ = "routines"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(150), nullable=False)
    goal = Column(String(255), nullable=True)
    frequency = Column(String(50), default="daily")
    status = Column(String(50), default="active")  # active, paused, archived, proposed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="routines")
    tasks = relationship("RoutineTask", back_populates="routine", cascade="all, delete-orphan", order_by="RoutineTask.step_order")


class RoutineTask(Base):
    __tablename__ = "routine_tasks"

    id = Column(Integer, primary_key=True, index=True)
    routine_id = Column(Integer, ForeignKey("routines.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    time_of_day = Column(String(50), default="morning")  # morning, afternoon, evening, weekly
    scheduled_time = Column(String(50), default="08:00 AM")
    step_order = Column(Integer, default=1)
    frequency_days = Column(String(100), default="Everyday")  # Everyday, Mon/Wed/Fri, etc.
    product_name = Column(String(200), nullable=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="SET NULL"), nullable=True)
    is_active = Column(Boolean, default=True)

    routine = relationship("Routine", back_populates="tasks")
    completions = relationship("TaskCompletion", back_populates="task", cascade="all, delete-orphan")


class TaskCompletion(Base):
    __tablename__ = "task_completions"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("routine_tasks.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    date = Column(String(20), nullable=False)  # YYYY-MM-DD
    completed_at = Column(DateTime, default=datetime.datetime.utcnow)
    notes = Column(Text, nullable=True)

    task = relationship("RoutineTask", back_populates="completions")
    user = relationship("User", back_populates="task_completions")


class ProgressEntry(Base):
    __tablename__ = "progress_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    date = Column(String(20), nullable=False)  # YYYY-MM-DD
    adherence_percentage = Column(Float, default=0.0)
    completed_tasks = Column(Integer, default=0)
    total_tasks = Column(Integer, default=0)
    feedback = Column(Text, nullable=True)
    skin_hair_condition = Column(String(100), nullable=True)  # Improving, Stable, Needs Attention
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="progress_entries")


class WeeklySummary(Base):
    __tablename__ = "weekly_summaries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    week_label = Column(String(100), nullable=False)  # e.g., "Week of Nov 3 - Nov 9, 2026"
    adherence_score = Column(Float, default=0.0)
    summary_text = Column(Text, nullable=False)
    recommendations = Column(Text, nullable=False)
    agent_insights = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="weekly_summaries")


class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    routine_task_id = Column(Integer, ForeignKey("routine_tasks.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(200), nullable=False)
    time_of_day = Column(String(50), default="morning")
    scheduled_time = Column(String(50), default="08:00 AM")
    is_enabled = Column(Boolean, default=True)
    channel = Column(String(50), default="in_app")  # in_app, browser_push
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="reminders")


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), default="Personal Care Consultation")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan", order_by="Message.timestamp")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False)
    role = Column(String(50), nullable=False)  # user, assistant, system
    content = Column(Text, nullable=False)
    agent_name = Column(String(100), nullable=True)  # Personalisation Agent, Routine Management Agent, etc.
    metadata_json = Column(Text, nullable=True)  # JSON for structured proposals, citations, actions
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    conversation = relationship("Conversation", back_populates="messages")


class AgentExecution(Base):
    __tablename__ = "agent_executions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    conversation_id = Column(Integer, ForeignKey("conversations.id", ondelete="SET NULL"), nullable=True)
    agent_name = Column(String(100), nullable=False)
    action = Column(String(150), nullable=False)
    status = Column(String(50), default="success")  # planned, running, approved, completed, rejected, escalated
    execution_details = Column(Text, nullable=True)  # JSON or text logs
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="agent_executions")


class SupportEscalation(Base):
    __tablename__ = "support_escalations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    conversation_id = Column(Integer, ForeignKey("conversations.id", ondelete="SET NULL"), nullable=True)
    ticket_id = Column(String(50), unique=True, nullable=False)
    reason = Column(String(150), nullable=False)  # Adverse reaction, allergic symptom, severe irritation, etc.
    severity = Column(String(50), default="high")  # low, medium, high, urgent
    summary = Column(Text, nullable=False)
    customer_note = Column(Text, nullable=True)
    status = Column(String(50), default="escalated_to_human_expert")  # escalated, in_review, resolved
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="escalations")

