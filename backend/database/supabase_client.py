from supabase import create_client, Client
from config import settings
from models import CallLog
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)


class SupabaseClient:
    """Supabase client wrapper for database operations."""
    
    def __init__(self):
        """Initialize Supabase client."""
        try:
            self.client: Client = create_client(
                settings.supabase_url,
                settings.supabase_key
            )
            logger.info("Supabase client initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Supabase client: {e}")
            raise
    
    async def log_call(self, call_log: CallLog) -> Optional[Dict[str, Any]]:
        """
        Log a call to the database.
        
        Args:
            call_log: CallLog model instance
            
        Returns:
            Inserted record or None on failure
        """
        try:
            data = {
                "audio_url": call_log.audio_url,
                "detected_language": call_log.detected_language,
                "transcript": call_log.transcript,
                "issue_category": call_log.issue_category,
                "confidence": call_log.confidence,
                "routed_to": call_log.routed_to,
                "raw_ai_response": call_log.raw_ai_response
            }
            
            response = self.client.table("call_logs").insert(data).execute()
            logger.info(f"Call logged successfully: {call_log.issue_category}")
            return response.data[0] if response.data else None
            
        except Exception as e:
            logger.error(f"Failed to log call: {e}")
            # Don't raise - logging failure shouldn't break the API
            return None
    
    async def get_recent_calls(self, limit: int = 10) -> list:
        """
        Get recent call logs.
        
        Args:
            limit: Number of records to retrieve
            
        Returns:
            List of call logs
        """
        try:
            response = self.client.table("call_logs")\
                .select("*")\
                .order("created_at", desc=True)\
                .limit(limit)\
                .execute()
            
            return response.data if response.data else []
            
        except Exception as e:
            logger.error(f"Failed to retrieve calls: {e}")
            return []


# Global Supabase client instance
supabase_client = SupabaseClient()
