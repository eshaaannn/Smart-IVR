import os
import shutil
import logging
import speech_recognition as sr
from pydub import AudioSegment
from langdetect import detect, LangDetectException
from fastapi import UploadFile
from config import settings
from models import AnalysisResponse

logger = logging.getLogger(__name__)

# Configure Pydub with FFmpeg path from settings
AudioSegment.converter = settings.ffmpeg_path
AudioSegment.ffmpeg = settings.ffmpeg_path

def get_fallback_response(transcript="Unable to clearly understand the spoken issue", intent="General Support"):
    return AnalysisResponse(
        language="Unknown",
        transcript=transcript,
        intent=intent,
        confidence=0.0
    )

async def process_audio_file(file: UploadFile) -> tuple[str, str]:
    """
    Saves the uploaded file, converts it to WAV, and performs transcription.
    Returns: (transcript_text, detected_language)
    """
    temp_filename = f"temp_{file.filename}"
    temp_wav = f"temp_converted_{file.filename}.wav" # standardized wav path
    
    transcript_text = ""
    detected_lang = "Unknown"

    try:
        # Save uploaded file temporarily
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # 1. Convert to WAV using Pydub
        try:
            audio = AudioSegment.from_file(temp_filename)
            audio.export(temp_wav, format="wav")
            source_file = temp_wav
        except Exception as e:
            logger.warning(f"Pydub conversion failed (ffmpeg missing?): {e}. Trying raw file.")
            source_file = temp_filename

        # 2. Transcribe Audio
        recognizer = sr.Recognizer()
        
        try:
            with sr.AudioFile(source_file) as source:
                audio_data = recognizer.record(source)
                try:
                    transcript_text = recognizer.recognize_google(audio_data)
                except sr.UnknownValueError:
                    logger.warning("Speech Recognition could not understand audio")
                    return "", "Unknown"
                except sr.RequestError as e:
                    logger.error(f"Speech Recognition error: {e}")
                    return "", "Unknown"
                
        except Exception as e:
            logger.error(f"Audio processing failed: {e}")
            return "", "Unknown"

        if not transcript_text:
             return "", "Unknown"

        # 3. Detect Language
        try:
            detected_lang = detect(transcript_text)
        except LangDetectException:
            detected_lang = "Unknown"
            
        return transcript_text, detected_lang

    except Exception as e:
        logger.error(f"Unexpected error in audio processing: {e}")
        return "", "Unknown"
    
    finally:
        # Cleanup temp files
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
        if os.path.exists(temp_wav):
            os.remove(temp_wav)
