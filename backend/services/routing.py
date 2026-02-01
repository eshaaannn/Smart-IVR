import logging
from typing import Dict, Any
from config import settings

logger = logging.getLogger(__name__)


async def determine_routing(issue_category: str, confidence: float) -> Dict[str, Any]:
    """
    Determine routing destination based on issue category and confidence.
    
    Uses hardcoded routing rules (MVP decision).
    Applies fallback when confidence is below threshold.
    
    Args:
        issue_category: Classified issue category
        confidence: Classification confidence score
        
    Returns:
        Dict with routing_to and fallback flag
    """
    try:
        logger.info(f"Determining routing for category: {issue_category}, confidence: {confidence}")
        
        # Check confidence threshold
        if confidence < settings.confidence_threshold:
            logger.warning(f"Low confidence ({confidence}), routing to fallback")
            return {
                "routing_to": settings.fallback_routing,
                "fallback": True
            }
        
        # Look up routing rule
        routing_to = settings.routing_rules.get(
            issue_category,
            settings.fallback_routing
        )
        
        # If category not found in rules, use fallback
        fallback = issue_category not in settings.routing_rules
        
        if fallback:
            logger.warning(f"Unknown category: {issue_category}, using fallback")
        
        result = {
            "routing_to": routing_to,
            "fallback": fallback
        }
        
        logger.info(f"Routing decision: {result}")
        return result
        
    except Exception as e:
        logger.error(f"Routing determination failed: {e}")
        # Always return a valid routing decision
        return {
            "routing_to": settings.fallback_routing,
            "fallback": True
        }
