# AI Logic Service

This service handles audio transcription and intent classification for the Smart IVR system using Groq's LLM API.

## Features

- **Audio Transcription**: Converts voice recordings to text using Google Speech Recognition
- **Intent Classification**: Uses Groq's Llama 3.3 70B model to categorize customer issues
- **Language Detection**: Automatically detects the language of the spoken input
- **RESTful API**: FastAPI-based endpoint for easy integration

## Setup

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Environment**:
   Create a `.env` file (use `.env.example` as reference):
   ```bash
   XAI_API_KEY=your_groq_api_key_here
   ```
   Get your Groq API key from: https://console.groq.com/keys

3. **Run the Server**:
   ```bash
   uvicorn main:app --reload --port 8001
   ```

## API Usage

### Endpoint: `POST /analyze_audio`

Upload an audio file (WAV, MP3, M4A) to get:
- Transcript of the audio
- Detected language
- Issue category (intent)
- Confidence score

**Example using cURL**:
```bash
curl -X POST "http://localhost:8001/analyze_audio" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@recording.wav"
```

**Response**:
```json
{
  "language": "en",
  "transcript": "I cannot access my account",
  "intent": "Account Access",
  "confidence": 0.85
}
```

## Issue Categories

- Billing
- Technical Issue
- Account Access
- Password Reset
- Service Request
- General Support

## Architecture

```
ai-logic/
├── main.py              # FastAPI application entry point
├── config.py            # Configuration and settings
├── models.py            # Pydantic response models
├── services/
│   ├── audio.py        # Audio processing and transcription
│   └── llm.py          # LLM-based intent classification
├── requirements.txt     # Python dependencies
└── .env.example        # Environment variable template
```

## Notes

- Runs on **port 8001** by default (separate from main backend on port 8000)
- Requires FFmpeg installed for audio format conversion
- Uses Groq API (not xAI) with `llama-3.3-70b-versatile` model
