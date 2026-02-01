import os
import json
import logging
import shutil
from typing import Optional

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import speech_recognition as sr
from openai import OpenAI
from dotenv import load_dotenv
from langdetect import detect, LangDetectException
from pydub import AudioSegment

# Hardcode FFmpeg path for Hackathon MVP stability (since Env PATH is flaky)
FFMPEG_PATH = r"C:\Users\HP\AppData\Local\Microsoft\Winget\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.0.1-full_build\bin\ffmpeg.exe"
AudioSegment.converter = FFMPEG_PATH
AudioSegment.ffmpeg = FFMPEG_PATH


# Load environment variables
load_dotenv()

# Configure Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(title="Smart IVR AI Logic")

# CORS (Allow everything for hackathon demo)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize xAI (Grok) Client
XAI_API_KEY = os.getenv("XAI_API_KEY")
if not XAI_API_KEY:
    logger.warning("XAI_API_KEY is missing! Logic will fail unless set.")
    XAI_API_KEY = "missing_key_placeholder" # Prevent crash on init

client = OpenAI(
    api_key=XAI_API_KEY,
    base_url="https://api.x.ai/v1",
)

# Defined Categories
ALLOWED_CATEGORIES = [
    "Billing",
    "Technical Issue",
    "Account Access",
    "Password Reset",
    "Service Request",
    "General Support"
]

class AnalysisResponse(BaseModel):
    language: str
    transcript: str
    intent: str
    confidence: float

def get_fallback_response():
    return AnalysisResponse(
        language="Unknown",
        transcript="Unable to clearly understand the spoken issue",
        intent="General Support",
        confidence=0.0
    )

@app.post("/analyze_audio", response_model=AnalysisResponse)
async def analyze_audio(file: UploadFile = File(...)):
    """
    Receives an audio file, transcribes it, and determines the intent using Grok.
    """
    temp_filename = f"temp_{file.filename}"
    temp_wav = f"temp_converted_{file.filename}.wav" # standardized wav path
    
    try:
        # Save uploaded file temporarily
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # 1. Convert to WAV using Pydub (Robustness for MP3/M4A/etc)
        try:
             # ffmpeg must be installed on the system for this to work for non-wav
            audio = AudioSegment.from_file(temp_filename)
            audio.export(temp_wav, format="wav")
            source_file = temp_wav
        except Exception as e:
            logger.warning(f"Pydub conversion failed (ffmpeg missing?): {e}. Trying raw file.")
            source_file = temp_filename

        # 2. Transcribe Audio using SpeechRecognition (Google Web Speech API)
        recognizer = sr.Recognizer()
        
        transcript_text = ""
        detected_lang = "Unknown"
        
        try:
            with sr.AudioFile(source_file) as source:
                audio_data = recognizer.record(source)
                try:
                    # Recognize speech using Google Web Speech API
                    transcript_text = recognizer.recognize_google(audio_data)
                except sr.UnknownValueError:
                    logger.warning("Speech Recognition could not understand audio")
                    return get_fallback_response()
                except sr.RequestError as e:
                    logger.error(f"Speech Recognition error: {e}")
                    return get_fallback_response()
                
        except Exception as e:
            logger.error(f"Audio processing failed: {e}")
            return get_fallback_response()

        if not transcript_text:
             return get_fallback_response()

        # 3. Detect Language (using langdetect on the text)
        try:
            detected_lang = detect(transcript_text)
        except LangDetectException:
            detected_lang = "Unknown"

        # 4. Analyze with Grok
        system_prompt = f"""
You are the intelligence layer for an IVR system.
Your task is to analyze the following user transcript and extract structured data.

Allowed issue categories: {', '.join(ALLOWED_CATEGORIES)}

Rules:
1. Detect the intent and map it to EXACTLY ONE category.
2. Estimate confidence (0.0 to 1.0). Be conservative.
3. If unclear, use "General Support".
4. Output MUST be valid JSON only. No markdown. No comments.

JSON Structure:
{{
  "language": "{detected_lang}", 
  "transcript": "{transcript_text}",
  "intent": "category",
  "confidence": 0.5
}}
Note: Use the detected language code I provided, or correct it if the text is clearly another language.
"""
        
        try:
            completion = client.chat.completions.create(
                model="grok-beta",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": transcript_text},
                ],
                temperature=0.0,
            )

            content = completion.choices[0].message.content
            
            # Clean up markdown code blocks if present
            clean_content = content.replace("```json", "").replace("```", "").strip()
            data = json.loads(clean_content)
            
            # Return strict response
            return AnalysisResponse(
                language=data.get("language", detected_lang),
                transcript=data.get("transcript", transcript_text),
                intent=data.get("intent", "General Support"),
                confidence=float(data.get("confidence", 0.0))
            )

        except Exception as e:
            logger.error(f"LLM/Parsing error: {e}")
            # If LLM fails, we fall back to general support but keep the transcript
            return AnalysisResponse(
                language=detected_lang,
                transcript=transcript_text,
                intent="General Support",
                confidence=0.0
            )

    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return get_fallback_response()
    
    finally:
        # Cleanup temp files
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
        if os.path.exists(temp_wav):
            os.remove(temp_wav)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
