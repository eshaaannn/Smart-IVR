import os
from pydantic_settings import BaseSettings
from typing import Dict, List


class Settings(BaseSettings):
    """Application configuration settings."""
    
    # Supabase - Using PostgreSQL Connection String
    database_url: str = os.getenv("DATABASE_URL", "")
    
    # xAI (Grok)
    xai_api_key: str = os.getenv("XAI_API_KEY", "")
    xai_base_url: str = "https://api.x.ai/v1"
    xai_model: str = "grok-2-latest" 
    
    # Application
    confidence_threshold: float = float(os.getenv("CONFIDENCE_THRESHOLD", "0.6"))
    fallback_routing: str = os.getenv("FALLBACK_ROUTING", "General Support")
    
    # Server
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8000"))
    
    # Hardcoded Categories (MVP - Intentionally fixed)
    issue_categories: List[str] = [
        "billing",
        "technical_issue",
        "password_reset",
        "account_access",
        "service_request"
    ]
    
    # Hardcoded Routing Rules (MVP - Intentionally fixed)
    routing_rules: Dict[str, str] = {
        "billing": "Billing Support",
        "technical_issue": "Technical Support",
        "password_reset": "Account Security",
        "account_access": "Account Security",
        "service_request": "Customer Service",
        "general_support": "General Support"  # Fallback
    }
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()
