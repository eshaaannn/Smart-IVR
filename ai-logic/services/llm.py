import json
import logging
from openai import OpenAI
from config import settings
from models import AnalysisResponse

logger = logging.getLogger(__name__)

# Initialize xAI (Grok) Client
if not settings.xai_api_key:
    logger.warning("XAI_API_KEY is missing! Logic will fail unless set.")

client = OpenAI(
    api_key=settings.xai_api_key or "missing_key_placeholder",
    base_url=settings.xai_base_url,
)
logger.info(f"LLM Client Initialized with Base URL: {settings.xai_base_url}")
logger.info(f"API Key Prefix: {str(settings.xai_api_key)[:8]}...")

def analyze_intent(transcript_text: str, detected_lang: str) -> AnalysisResponse:
    """
    Analyzes the transcript using Grok to determine intent and confidence.
    """
    if not transcript_text:
        return AnalysisResponse(
            language=detected_lang,
            transcript="",
            intent="General Support",
            confidence=0.0
        )

    system_prompt = f"""
You are the intelligence layer for an IVR system.
Your task is to analyze the following user transcript and extract structured data.

Allowed issue categories: {', '.join(settings.allowed_categories)}

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
            model=settings.xai_model,
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
