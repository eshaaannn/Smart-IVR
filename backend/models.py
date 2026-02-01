from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict, Any
from datetime import datetime


class ProcessIssueRequest(BaseModel):
    """Request model for /process-issue endpoint."""
    audio_url: str
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "audio_url": "https://example.com/audio.wav"
            }
        }
    )


class ProcessIssueResponse(BaseModel):
    """Response model for /process-issue endpoint."""
    language: str
    transcript: str
    issue_category: str
    confidence: float
    routing_to: str
    fallback: bool
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "language": "Hindi",
                "transcript": "Mera bill zyada aa gaya hai",
                "issue_category": "billing",
                "confidence": 0.82,
                "routing_to": "Billing Support",
                "fallback": False
            }
        }
    )


class HealthResponse(BaseModel):
    """Response model for /health endpoint."""
    status: str
    timestamp: datetime
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "status": "ok",
                "timestamp": "2026-02-01T10:00:00"
            }
        }
    )


class CallLog(BaseModel):
    """Model for call log database entry."""
    id: Optional[str] = None
    created_at: Optional[datetime] = None
    audio_url: str
    detected_language: str
    transcript: str
    issue_category: str
    confidence: float
    routed_to: str
    raw_ai_response: Optional[Dict[str, Any]] = None
    
    model_config = ConfigDict(from_attributes=True)
