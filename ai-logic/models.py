from pydantic import BaseModel

class AnalysisResponse(BaseModel):
    """Response model for audio analysis."""
    language: str
    transcript: str
    intent: str
    confidence: float
