# Smart-IVR Backend

Multilingual IVR Routing System with Language + Intent Detection

## 🎯 Overview

This FastAPI backend processes spoken customer issues and automatically routes them to the appropriate support queue. It handles:

- **Language Detection** - Identifies the spoken language
- **Speech Transcription** - Converts audio to text
- **Issue Classification** - Categorizes the problem
- **Smart Routing** - Directs to the right support team

## 🏗️ Architecture

### Tech Stack
- **Framework**: FastAPI (Python)
- **Database**: Supabase (PostgreSQL)
- **AI/ML**: OpenAI (Whisper + GPT)
- **Deployment**: Railway/Render

### Design Principles
- **Backend owns all decisions** - Frontend only records & displays
- **Demo-safe** - Never crashes, always returns a response
- **Fallback-first** - Low confidence → General Support
- **Hardcoded routing** - Stable, predictable (MVP choice)

## 📁 Project Structure

```
backend/
├── main.py                 # FastAPI app with endpoints
├── config.py              # Settings & routing rules
├── models.py              # Pydantic schemas
├── requirements.txt       # Dependencies
├── .env.example          # Environment template
├── database/
│   ├── supabase_client.py # Database client
│   └── schema.sql        # Database schema
└── services/
    ├── language_detection.py
    ├── transcription.py
    ├── classification.py
    └── routing.py
```

## 🚀 Quick Start

### 1. Prerequisites
- Python 3.9+
- Supabase account
- OpenAI API key

### 2. Installation

```bash
# Navigate to backend directory
cd Smart-IVR/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials
```

Required environment variables:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_KEY` - Your Supabase anon key
- `OPENAI_API_KEY` - Your OpenAI API key

### 4. Database Setup

1. Go to your Supabase project
2. Open SQL Editor
3. Run the contents of `database/schema.sql`

### 5. Run the Server

```bash
# Development mode (with auto-reload)
python main.py

# Or using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Server will start at: `http://localhost:8000`

Interactive API docs: `http://localhost:8000/docs`

## 📡 API Endpoints

### `GET /health`
Health check endpoint for demo safety.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-01T10:00:00"
}
```

### `POST /process-issue`
Main endpoint - processes audio and returns routing decision.

**Request:**
```json
{
  "audio_url": "https://example.com/audio.wav"
}
```

**Response (Success):**
```json
{
  "language": "Hindi",
  "transcript": "Mera bill zyada aa gaya hai",
  "issue_category": "billing",
  "confidence": 0.82,
  "routing_to": "Billing Support",
  "fallback": false
}
```

**Response (Fallback):**
```json
{
  "language": "Unknown",
  "transcript": "Audio unclear",
  "issue_category": "general_support",
  "confidence": 0.40,
  "routing_to": "General Support",
  "fallback": true
}
```

### `GET /recent-calls`
Get recent call logs (analytics).

**Query Parameters:**
- `limit` (optional) - Number of calls to retrieve (default: 10)

## 🎛️ Configuration

### Issue Categories (Hardcoded)
- `billing`
- `technical_issue`
- `password_reset`
- `account_access`
- `service_request`

### Routing Rules (Hardcoded)
- Billing → Billing Support
- Technical Issue → Technical Support
- Password Reset → Account Security
- Account Access → Account Security
- Service Request → Customer Service
- Low Confidence → General Support

### Confidence Threshold
Default: `0.6` (configurable in `.env`)

## 🧪 Testing

### Using Swagger UI
1. Go to `http://localhost:8000/docs`
2. Click on `POST /process-issue`
3. Click "Try it out"
4. Enter test audio URL
5. Click "Execute"

### Using cURL
```bash
curl -X POST "http://localhost:8000/process-issue" \
  -H "Content-Type: application/json" \
  -d '{"audio_url": "https://example.com/test.wav"}'
```

### Health Check
```bash
curl http://localhost:8000/health
```

## 🔧 Development Notes

### Current Implementation
- **Language detection**: Mock implementation (returns "Hindi")
- **Transcription**: Mock implementation (keyword-based)
- **Classification**: Keyword-based with planned GPT integration

### Production TODO
1. Integrate actual OpenAI Whisper API for transcription
2. Enable GPT-based classification
3. Add audio file upload support
4. Implement rate limiting
5. Add authentication
6. Configure CORS for production frontend

## 🚢 Deployment

### Environment Variables
Make sure all required environment variables are set in your deployment platform.

### Recommended Platforms
- **Railway**: Automatic deployment from GitHub
- **Render**: Free tier available
- **Vercel**: Serverless functions (alternative)

### Deployment Steps (Railway)
1. Create new project on Railway
2. Connect GitHub repository
3. Add environment variables
4. Deploy automatically on push

## 📊 Database Schema

### `call_logs` Table
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| created_at | Timestamp | Call timestamp |
| audio_url | Text | Audio file reference |
| detected_language | Text | Detected language |
| transcript | Text | Transcribed text |
| issue_category | Text | Classified category |
| confidence | Float | Classification confidence |
| routed_to | Text | Routing destination |
| raw_ai_response | JSONB | Full AI response |

## 🎓 Hackathon Notes

### Why Hardcoded Categories?
- **Stability**: No unexpected categories during demo
- **Predictability**: Judges can test specific scenarios
- **Speed**: Faster implementation
- **Reliability**: No AI hallucinations

### Why No Authentication?
- **Scope**: MVP focused on core routing logic
- **Demo**: Easier for judges to test
- **Extensibility**: Can add Supabase Auth later

### Demo Safety Features
- All endpoints wrapped in try/catch
- Fallback responses for errors
- Health check endpoint
- Never crashes, always responds

## 🤝 Integration with Frontend

The frontend should:
1. Record audio from user
2. Upload audio and get URL
3. Call `POST /process-issue` with audio_url
4. Display the routing decision

The backend handles ALL decision-making.

## 📝 License

MIT License - Hackathon MVP

## 👥 Team

Backend Lead - Responsible for API design, business logic, and Supabase integration
