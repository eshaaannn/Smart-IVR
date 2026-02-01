import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    """Configuration settings for AI Logic service."""
    
    # Server
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8001"))
    
    # Groq (Switched from xAI because user provided Groq key)
    # Accepts key with or without xai- prefix for compatibility
    _raw_key: str = os.getenv("XAI_API_KEY", "")
    xai_api_key: str = _raw_key.replace("xai-", "") if _raw_key.startswith("xai-") else _raw_key
    
    xai_base_url: str = "https://api.groq.com/openai/v1"
    xai_model: str = "llama-3.3-70b-versatile"
    
    # External Tools
    ffmpeg_path: str = r"C:\Users\HP\AppData\Local\Microsoft\Winget\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.0.1-full_build\bin\ffmpeg.exe"

    # Application Logic
    allowed_categories: list[str] = [
        "Billing",
        "Technical Issue",
        "Account Access",
        "Password Reset",
        "Service Request",
        "General Support"
    ]

    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
