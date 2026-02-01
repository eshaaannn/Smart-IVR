from config import settings
from urllib.parse import urlparse

print(f"Loaded DATABASE_URL: '{settings.database_url}'")

if settings.database_url:
    parsed = urlparse(settings.database_url)
    print(f"Hostname: '{parsed.hostname}'")
else:
    print("DATABASE_URL is empty")
