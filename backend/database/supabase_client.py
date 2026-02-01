import psycopg2
from psycopg2.extras import RealDictCursor, Json
from config import settings
from models import CallLog
from typing import Optional, Dict, Any, List
import logging
from contextlib import contextmanager
from urllib.parse import urlparse, unquote

logger = logging.getLogger(__name__)


class DatabaseClient:
    """PostgreSQL database client for Supabase using connection string."""
    
    def __init__(self):
        """Initialize database connection pool."""
        self.database_url = settings.database_url
        if not self.database_url:
            logger.warning("DATABASE_URL not set. Database operations will fail gracefully.")
            self.connection_params = None
        else:
            # Parse the connection string and decode password
            try:
                parsed = urlparse(self.database_url)
                self.connection_params = {
                    'host': parsed.hostname,
                    'port': parsed.port or 5432,
                    'database': parsed.path.lstrip('/') or 'postgres',
                    'user': parsed.username or 'postgres',
                    'password': unquote(parsed.password) if parsed.password else None,
                }
                logger.info("Database client initialized with connection string")
            except Exception as e:
                logger.error(f"Failed to parse DATABASE_URL: {e}")
                self.connection_params = None
    
    @contextmanager
    def get_connection(self):
        """
        Context manager for database connections.
        Automatically handles connection closing.
        """
        if not self.connection_params:
            logger.error("DATABASE_URL not configured or invalid")
            yield None
            return
            
        conn = None
        try:
            conn = psycopg2.connect(**self.connection_params)
            yield conn
            conn.commit()
        except Exception as e:
            if conn:
                conn.rollback()
            logger.error(f"Database connection error: {e}")
            yield None
        finally:
            if conn:
                conn.close()
    
    async def log_call(self, call_log: CallLog) -> Optional[Dict[str, Any]]:
        """
        Log a call to the database.
        
        Args:
            call_log: CallLog model instance
            
        Returns:
            Inserted record or None on failure
        """
        if not self.connection_params:
            logger.warning("Skipping database logging - DATABASE_URL not configured")
            return None
            
        try:
            with self.get_connection() as conn:
                if conn is None:
                    return None
                
                cursor = conn.cursor(cursor_factory=RealDictCursor)
                
                query = """
                    INSERT INTO call_logs 
                    (audio_url, detected_language, transcript, issue_category, 
                     confidence, routed_to, raw_ai_response)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    RETURNING *
                """
                
                cursor.execute(query, (
                    call_log.audio_url,
                    call_log.detected_language,
                    call_log.transcript,
                    call_log.issue_category,
                    call_log.confidence,
                    call_log.routed_to,
                    Json(call_log.raw_ai_response) if call_log.raw_ai_response else None
                ))
                
                result = cursor.fetchone()
                cursor.close()
                
                if result:
                    logger.info(f"Call logged successfully: {call_log.issue_category}")
                    return dict(result)
                return None
                
        except Exception as e:
            logger.error(f"Failed to log call: {e}")
            # Don't raise - logging failure shouldn't break the API
            return None
    
    async def get_recent_calls(self, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Get recent call logs.
        
        Args:
            limit: Number of records to retrieve
            
        Returns:
            List of call logs
        """
        if not self.connection_params:
            logger.warning("Skipping database query - DATABASE_URL not configured")
            return []
            
        try:
            with self.get_connection() as conn:
                if conn is None:
                    return []
                
                cursor = conn.cursor(cursor_factory=RealDictCursor)
                
                query = """
                    SELECT * FROM call_logs
                    ORDER BY created_at DESC
                    LIMIT %s
                """
                
                cursor.execute(query, (limit,))
                results = cursor.fetchall()
                cursor.close()
                
                if results:
                    return [dict(row) for row in results]
                return []
                
        except Exception as e:
            logger.error(f"Failed to retrieve calls: {e}")
            return []
    
    def test_connection(self) -> bool:
        """
        Test database connection.
        
        Returns:
            True if connection successful, False otherwise
        """
        try:
            with self.get_connection() as conn:
                if conn is None:
                    return False
                
                cursor = conn.cursor()
                cursor.execute("SELECT 1")
                result = cursor.fetchone()
                cursor.close()
                
                return result is not None
                
        except Exception as e:
            logger.error(f"Database connection test failed: {e}")
            return False


# Global database client instance
db_client = DatabaseClient()
