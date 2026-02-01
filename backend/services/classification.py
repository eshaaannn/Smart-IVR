import logging
from typing import Dict, Any
from openai import OpenAI
from config import settings
import json

logger = logging.getLogger(__name__)


async def classify_issue(transcript: str, language: str) -> Dict[str, Any]:
    """
    Classify the issue from transcript using OpenAI GPT.
    
    Args:
        transcript: Transcribed text
        language: Detected language
        
    Returns:
        Dict with issue_category and confidence score
    """
    try:
        logger.info(f"Classifying issue from transcript: {transcript[:50]}...")
        
        # Initialize OpenAI client
        client = OpenAI(api_key=settings.openai_api_key)
        
        # Build classification prompt
        prompt = f"""You are an IVR classification system. Analyze the following customer statement and classify it into ONE of these categories:
- billing
- technical_issue
- password_reset
- account_access
- service_request

Customer statement (in {language}): "{transcript}"

Respond ONLY with valid JSON in this exact format:
{{
    "category": "one_of_the_categories_above",
    "confidence": 0.85,
    "reasoning": "brief explanation"
}}"""

        # For MVP: Use GPT-3.5-turbo for fast classification
        # TODO: Replace mock with actual API call
        
        # Mock classification based on keywords
        transcript_lower = transcript.lower()
        
        if any(word in transcript_lower for word in ["bill", "payment", "charge", "zyada", "paisa"]):
            category = "billing"
            confidence = 0.82
        elif any(word in transcript_lower for word in ["password", "reset", "bhool", "gaya"]):
            category = "password_reset"
            confidence = 0.78
        elif any(word in transcript_lower for word in ["access", "login", "account", "khata"]):
            category = "account_access"
            confidence = 0.75
        elif any(word in transcript_lower for word in ["not working", "error", "problem", "technical"]):
            category = "technical_issue"
            confidence = 0.70
        else:
            category = "service_request"
            confidence = 0.60
        
        result = {
            "category": category,
            "confidence": confidence,
            "reasoning": f"Detected keywords related to {category}"
        }
        
        # TODO: Actual OpenAI API call (commented for demo)
        # response = client.chat.completions.create(
        #     model="gpt-3.5-turbo",
        #     messages=[{"role": "user", "content": prompt}],
        #     temperature=0.3,
        #     max_tokens=150
        # )
        # result = json.loads(response.choices[0].message.content)
        
        logger.info(f"Issue classified: {result['category']} (confidence: {result['confidence']})")
        return result
        
    except Exception as e:
        logger.error(f"Classification failed: {e}")
        # Fallback to general support
        return {
            "category": "service_request",
            "confidence": 0.30,
            "reasoning": "Classification error - defaulting to general support"
        }
