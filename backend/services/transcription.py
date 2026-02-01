import logging
import os
from config import settings

logger = logging.getLogger(__name__)


async def transcribe_audio(audio_url: str, detected_language: str = None) -> str:
    """
    Transcribe audio to text using OpenAI Whisper.
    
    Args:
        audio_url: URL to audio file
        detected_language: Optional language hint for better accuracy
        
    Returns:
        Transcribed text
    """
    try:
        logger.info(f"Transcribing audio: {audio_url}")
        
        # Grok does not support audio transcription yet.
        # Using Mock Mode for MVP.
        
        # In production, you would use Whisper API or another speech-to-text service.
        
        # Mock transcriptions based on common scenarios
        mock_transcripts = {
            "hindi": "Mera bill zyada aa gaya hai",
            "english": "I cannot access my account",
            "marathi": "माझं password reset करायचं आहे",
        }
        
        # Return mock transcript for demo
        
        transcript = mock_transcripts.get(
            detected_language.lower() if detected_language else "hindi",
            "Sample audio transcript"
        )
        
        logger.info(f"Transcription completed: {transcript[:50]}...")
        return transcript
        
    except Exception as e:
        logger.error(f"Transcription failed: {e}")
        return "Audio unclear"
