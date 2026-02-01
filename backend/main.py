from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import logging
from typing import Dict, Any

from models import ProcessIssueRequest, ProcessIssueResponse, HealthResponse, CallLog
from config import settings
from database.supabase_client import db_client
from services.language_detection import detect_language
from services.transcription import transcribe_audio
from services.classification import classify_issue
from services.routing import determine_routing

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Smart-IVR Backend",
    description="Multilingual IVR Routing System with Language + Intent Detection",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint - API information."""
    return {
        "name": "Smart-IVR Backend API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """
    Health check endpoint for demo safety and quick validation.
    
    Returns:
        Health status and timestamp
    """
    logger.info("Health check requested")
    return HealthResponse(
        status="ok",
        timestamp=datetime.now()
    )


@app.post("/process-issue", response_model=ProcessIssueResponse, tags=["IVR"])
async def process_issue(request: ProcessIssueRequest):
    """
    Main IVR processing endpoint.
    
    Flow:
    1. Detect language from audio
    2. Transcribe audio to text
    3. Classify issue into category
    4. Determine routing destination
    5. Log call to database
    
    Args:
        request: ProcessIssueRequest with audio_url
        
    Returns:
        ProcessIssueResponse with routing decision
    """
    logger.info(f"Processing issue for audio: {request.audio_url}")
    
    try:
        # Step 1: Detect Language
        language_result = await detect_language(request.audio_url)
        detected_language = language_result.get("language", "Unknown")
        
        # Step 2: Transcribe Audio
        transcript = await transcribe_audio(request.audio_url, detected_language)
        
        # Step 3: Classify Issue
        classification = await classify_issue(transcript, detected_language)
        issue_category = classification.get("category", "service_request")
        confidence = classification.get("confidence", 0.5)
        
        # Step 4: Determine Routing
        routing = await determine_routing(issue_category, confidence)
        routing_to = routing.get("routing_to")
        fallback = routing.get("fallback", False)
        
        # Prepare response
        response = ProcessIssueResponse(
            language=detected_language,
            transcript=transcript,
            issue_category=issue_category,
            confidence=confidence,
            routing_to=routing_to,
            fallback=fallback
        )
        
        # Step 5: Log to Database (async, don't block response)
        call_log = CallLog(
            audio_url=request.audio_url,
            detected_language=detected_language,
            transcript=transcript,
            issue_category=issue_category,
            confidence=confidence,
            routed_to=routing_to,
            raw_ai_response={
                "language_detection": language_result,
                "classification": classification,
                "routing": routing
            }
        )
        
        # Log asynchronously (failure won't affect response)
        await db_client.log_call(call_log)
        
        logger.info(f"Issue processed successfully: {issue_category} -> {routing_to}")
        return response
        
    except Exception as e:
        logger.error(f"Error processing issue: {e}", exc_info=True)
        
        # Return fallback response instead of error (demo safety)
        fallback_response = ProcessIssueResponse(
            language="Unknown",
            transcript="Audio processing failed",
            issue_category="general_support",
            confidence=0.0,
            routing_to=settings.fallback_routing,
            fallback=True
        )
        
        return fallback_response


@app.get("/recent-calls", tags=["Analytics"])
async def get_recent_calls(limit: int = 10):
    """
    Get recent call logs (optional analytics endpoint).
    
    Args:
        limit: Number of recent calls to retrieve
        
    Returns:
        List of recent call logs
    """
    try:
        calls = await db_client.get_recent_calls(limit)
        return {
            "count": len(calls),
            "calls": calls
        }
    except Exception as e:
        logger.error(f"Error retrieving calls: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve calls")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=True
    )
