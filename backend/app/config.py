import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Bodywise AI Companion"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./bodywise.db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "bodywise_secret_fellowship_challenge_2026_super_secure_key")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", "")
    DEMO_MODE: bool = os.getenv("DEMO_MODE", "true").lower() in ("true", "1", "yes")
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "*")

    model_config = SettingsConfigDict(env_file=".env", extra="allow")

settings = Settings()
