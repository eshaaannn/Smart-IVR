import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppLayout from '../layouts/AppLayout';
import VoiceRecorder from '../components/VoiceRecorder';
import Button from '../components/shared/Button';
import StepIndicator from '../components/shared/StepIndicator';
import PageTransition from '../components/shared/PageTransition';
import { ROUTES } from '../utils/constants';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

const LANGUAGES = [
    { code: 'en-US', label: 'English', flag: '🇺🇸' },
    { code: 'hi-IN', label: 'Hindi (हिंदी)', flag: '🇮🇳' },
    { code: 'mr-IN', label: 'Marathi (मराठी)', flag: '' },
];

/**
 * Voice Input Page - Main entry point
 * User can record voice (with STT) or type text
 */
export default function VoiceInputPage() {
    const navigate = useNavigate();
    const [selectedLang, setSelectedLang] = useState('en-US');
    const [textInput, setTextInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const [audioBlob, setAudioBlob] = useState(null);
    const {
        isListening,
        transcript,
        startListening,
        stopListening,
        hasSupport
    } = useSpeechRecognition();

    // Import audio recorder dynamically or assume it's available. 
    // We need to import it at the top, let's assume it is imported.
    // Wait, I need to add the import first.

    // Sync transcript with text input
    useEffect(() => {
        if (transcript) {
            setTextInput(transcript);
        }
    }, [transcript]);

    const handleToggleRecording = async () => {
        if (isListening) {
            stopListening();
            try {
                const blob = await import('../services/audioService').then(m => m.audioRecorder.stopRecording());
                setAudioBlob(blob);
            } catch (e) {
                console.error("Failed to stop audio recorder", e);
            }
        } else {
            setAudioBlob(null);
            setTextInput('');
            try {
                await import('../services/audioService').then(m => m.audioRecorder.startRecording());
                startListening(selectedLang);
            } catch (e) {
                console.error("Failed to start audio recorder", e);
                // Fallback to just STT if audio recorder fails
                startListening(selectedLang);
            }
        }
    };

    const handleAnalyze = async () => {
        try {
            if (!textInput.trim() && !audioBlob) {
                setError('Please record audio or type your issue');
                return;
            }

            setIsProcessing(true);
            setError('');

            // If we have an audioBlob (recorded voice), upload it to get the URL
            let audioUrl = '';
            if (audioBlob) {
                try {
                    audioUrl = await uploadAudio(audioBlob);
                    sessionStorage.setItem('audioUrl', audioUrl);
                } catch (uploadError) {
                    console.error("Audio upload failed", uploadError);
                    // If upload fails, we can either stop or try to proceed with just text (if backend allowed it)
                    // For now, let's treat it as a hard error for Voice Flow
                    if (!textInput.trim()) {
                        throw new Error("Failed to upload voice recording");
                    }
                }
            } else {
                // Clear any previous audioUrl if this is a text-only attempt
                sessionStorage.removeItem('audioUrl');
            }

            // Store text for local reference
            sessionStorage.setItem('transcript', textInput);
            sessionStorage.setItem('language', selectedLang);

            // Artificial delay to show "processing" state
            setTimeout(() => {
                navigate(ROUTES.PROCESSING);
            }, 500);

        } catch (err) {
            console.error('Analysis error:', err);
            setError('Failed to process your request. Please try again.');
            setIsProcessing(false);
        }
    };

    return (
        <AppLayout title="Voice Assistant" showBack={false}>
            <PageTransition>
                <StepIndicator currentStep={1} />

                <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                            Tell us what's going wrong
                        </h1>
                        <p className="text-neutral-600">
                            Select your language and tap the microphone
                        </p>
                    </div>

                    {/* Language Selector */}
                    <div className="flex gap-2 mb-8 bg-white p-1 rounded-xl border border-neutral-200 shadow-sm">
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => setSelectedLang(lang.code)}
                                className={`
                                    px-4 py-2 rounded-lg text-sm font-medium transition-all
                                    ${selectedLang === lang.code
                                        ? 'bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-200'
                                        : 'text-neutral-600 hover:bg-neutral-50'}
                                `}
                            >
                                <span className="mr-2">{lang.flag}</span>
                                {lang.label}
                            </button>
                        ))}
                    </div>

                    {/* Voice Recorder Control */}
                    <div className="mb-8 relative">
                        {/* Custom pulsing UI handled inside VoiceRecorder, but we control logic here */}
                        <div className="relative w-40 h-40 flex items-center justify-center">
                            {isListening && (
                                <motion.div
                                    className="absolute inset-0 rounded-full bg-red-100"
                                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                            )}
                            <button
                                onClick={handleToggleRecording}
                                className={`
                                    relative z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all
                                    ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-primary-600 hover:bg-primary-700'}
                                `}
                            >
                                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {isListening ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    )}
                                </svg>
                            </button>
                        </div>
                        <p className="text-center mt-4 text-sm font-medium text-neutral-500">
                            {isListening ? 'Listening...' : 'Tap to Speak'}
                        </p>
                    </div>

                    {/* Live Transcript / Text Input */}
                    <div className="w-full max-w-md mb-6">
                        <div className="relative">
                            <textarea
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                placeholder="Or type your issue here..."
                                className="w-full px-4 py-3 border border-neutral-300 rounded-2xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm min-h-[100px] resize-none"
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Analyze Button */}
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={handleAnalyze}
                        isLoading={isProcessing}
                        disabled={!textInput.trim()}
                        className="w-full max-w-md shadow-xl shadow-primary-500/20"
                    >
                        {isProcessing ? 'Processing...' : 'Analyze Issue'}
                    </Button>
                </div>
            </PageTransition>
        </AppLayout>
    );
}
