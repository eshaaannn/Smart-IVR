import os
from dotenv import load_dotenv
from urllib.parse import urlparse, unquote

load_dotenv()

db_url = os.getenv("DATABASE_URL")
print(f"Raw DATABASE_URL: {db_url}")

if db_url:
    try:
        parsed = urlparse(db_url)
        print(f"Hostname: '{parsed.hostname}'")
        print(f"Username: '{parsed.username}'")
        print(f"Password (Raw): '{parsed.password}'")
        if parsed.password:
            print(f"Password (Decoded): '{unquote(parsed.password)}'")
        print(f"Port: {parsed.port}")
        print(f"Path: '{parsed.path}'")
    except Exception as e:
        print(f"Parsing error: {e}")
else:
    print("DATABASE_URL is empty")
