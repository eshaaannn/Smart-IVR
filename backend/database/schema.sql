-- Smart-IVR Call Logs Table
-- This table stores all call processing results for transparency and debugging

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

-- Index for faster queries by timestamp
CREATE INDEX IF NOT EXISTS idx_call_logs_created_at ON call_logs(created_at DESC);

-- Index for filtering by category
CREATE INDEX IF NOT EXISTS idx_call_logs_category ON call_logs(issue_category);

-- Index for analyzing confidence scores
CREATE INDEX IF NOT EXISTS idx_call_logs_confidence ON call_logs(confidence);

-- Comments for documentation
COMMENT ON TABLE call_logs IS 'Stores all IVR call processing results including language detection, transcription, and routing decisions';
COMMENT ON COLUMN call_logs.audio_url IS 'URL or reference to the audio file';
COMMENT ON COLUMN call_logs.detected_language IS 'Language detected from the audio';
COMMENT ON COLUMN call_logs.transcript IS 'Transcribed text from the audio';
COMMENT ON COLUMN call_logs.issue_category IS 'Classified issue category';
COMMENT ON COLUMN call_logs.confidence IS 'Confidence score of the classification (0.0-1.0)';
COMMENT ON COLUMN call_logs.routed_to IS 'Final routing destination';
COMMENT ON COLUMN call_logs.raw_ai_response IS 'Complete AI response for debugging and analysis';
