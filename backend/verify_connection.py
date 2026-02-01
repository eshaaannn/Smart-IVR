import psycopg2
import os
from dotenv import load_dotenv
from urllib.parse import urlparse, unquote

# Load .env manually
load_dotenv()

db_url = os.getenv("DATABASE_URL")
print(f"DATABASE_URL: {db_url}")

try:
    parsed = urlparse(db_url)
    params = {
        'host': parsed.hostname,
        'port': parsed.port or 5432,
        'database': parsed.path.lstrip('/') or 'postgres',
        'user': parsed.username or 'postgres',
        'password': unquote(parsed.password) if parsed.password else None,
    }
    print(f"Connecting with params: host={params['host']}, port={params['port']}, user={params['user']}, db={params['database']}")
    
    conn = psycopg2.connect(**params)
    print("✅ Connection successful!")
    conn.close()
    
except Exception as e:
    print(f"❌ Connection failed: {e}")
