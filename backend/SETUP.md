# Quick Setup Guide

## ✅ Completed Steps
- [x] Virtual environment created
- [x] Dependencies installed (FastAPI, Supabase, OpenAI)
- [x] .env file created

## 📝 Configuration Required

**Before running the server, you need to update `.env` with your credentials:**

### 1. Supabase Configuration
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key-here
```

**How to get these:**
1. Go to [supabase.com](https://supabase.com)
2. Open your project (or create one)
3. Go to Settings → API
4. Copy "Project URL" → `SUPABASE_URL`
5. Copy "anon/public" key → `SUPABASE_KEY`

### 2. OpenAI Configuration
```bash
OPENAI_API_KEY=your-openai-api-key
```

**How to get this:**
1. Go to [platform.openai.com](https://platform.openai.com)
2. Go to API keys
3. Create new secret key
4. Copy and paste into `.env`

### 3. Setup Supabase Database

Run this SQL in Supabase SQL Editor:

```sql
-- Copy the contents from database/schema.sql
CREATE TABLE IF NOT EXISTS call_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    audio_url TEXT NOT NULL,
    detected_language TEXT NOT NULL,
    transcript TEXT NOT NULL,
    issue_category TEXT NOT NULL,
    confidence REAL NOT NULL,
    routed_to TEXT NOT NULL,
    raw_ai_response JSONB
);

CREATE INDEX IF NOT EXISTS idx_call_logs_created_at ON call_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_call_logs_category ON call_logs(issue_category);
CREATE INDEX IF NOT EXISTS idx_call_logs_confidence ON call_logs(confidence);
```

## 🚀 Run the Server

```bash
# Activate virtual environment
.\venv\Scripts\activate

# Run the server
python main.py
```

Server will start at: http://localhost:8000
Interactive docs: http://localhost:8000/docs

## 🧪 Test the API

### Test Health Endpoint
```bash
curl http://localhost:8000/health
```

### Test Process Issue Endpoint
```bash
curl -X POST http://localhost:8000/process-issue \
  -H "Content-Type: application/json" \
  -d "{\"audio_url\": \"https://example.com/test.wav\"}"
```

## ⚠️ Important Notes

1. **Mock Mode**: The backend currently runs in demo mode with:
   - Keyword-based classification  
   - Mock transcriptions
   - Works without OpenAI API key for testing

2. **Production Mode**: To enable real AI processing:
   - Add your OpenAI API key to `.env`
   - Uncomment the actual API calls in the service files

3. **No Supabase?** The server will run without Supabase, but call logging won't work. Add credentials when ready.
