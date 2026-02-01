import logging
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from models import AnalysisResponse
from services.audio import process_audio_file, get_fallback_response
from services.llm import analyze_intent

# Configure Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(title="Smart IVR AI Logic")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze_audio", response_model=AnalysisResponse)
async def analyze_audio(file: UploadFile = File(...)):
    """
    Receives an audio file, transcribes it, and determines the intent using Grok/Groq.
    """
    try:
        # Step 1: Process Audio (Convert & Transcribe)
        transcript_text, detected_lang = await process_audio_file(file)
        
        if not transcript_text:
            logger.warning("Transcription failed or empty.")
            return get_fallback_response()

        # Step 2: Analyze Intent (LLM)
        analysis_result = analyze_intent(transcript_text, detected_lang)
        
        return analysis_result

    except Exception as e:
        logger.error(f"Unexpected endpoint error: {e}")
        return get_fallback_response()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.host, port=settings.port)
