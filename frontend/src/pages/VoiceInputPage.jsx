import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppLayout from '../layouts/AppLayout';
import VoiceRecorder from '../components/VoiceRecorder';
import Button from '../components/shared/Button';
import StepIndicator from '../components/shared/StepIndicator';
import PageTransition from '../components/shared/PageTransition';
import { uploadAudio } from '../services/audioService';
import { ROUTES } from '../utils/constants';

/**
 * Voice Input Page - Main entry point
 * User can record voice or type text
 */
export default function VoiceInputPage() {
    const navigate = useNavigate();
    const [audioBlob, setAudioBlob] = useState(null);
    const [textInput, setTextInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const handleRecordingComplete = (blob) => {
        setAudioBlob(blob);
        setError('');
    };

    const handleRecordingError = (err) => {
        setError(err.message || 'Failed to record audio. Please try again.');
    };

    const handleAnalyze = async () => {
        try {
            setIsProcessing(true);
            setError('');

            // Upload audio (or use mock URL in demo mode)
            let audioUrl = '';
            if (audioBlob) {
                audioUrl = await uploadAudio(audioBlob);
            } else if (textInput.trim()) {
                // For text input, we'll use a placeholder URL
                audioUrl = 'https://example.com/audio/text-input.webm';
            } else {
                setError('Please record audio or type your issue');
                setIsProcessing(false);
                return;
            }

            // Store audio URL and navigate to processing screen
            sessionStorage.setItem('audioUrl', audioUrl);
            navigate(ROUTES.PROCESSING);
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
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                            Tell us what's going wrong
                        </h1>
                        <p className="text-neutral-600">
                            You can speak or type in any language
                        </p>
                    </div>

                    {/* Voice Recorder */}
                    <div className="mb-8">
                        <VoiceRecorder
                            onRecordingComplete={handleRecordingComplete}
                            onError={handleRecordingError}
                        />
                    </div>

                    {/* Text Input Fallback */}
                    <div className="w-full max-w-md mb-6">
                        <div className="relative">
                            <input
                                type="text"
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                placeholder="Example: My internet is not working"
                                className="w-full px-4 py-3 pr-12 border border-neutral-300 rounded-full text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
                            />
                            <button
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary-500 hover:text-primary-600 transition-colors"
                                onClick={handleAnalyze}
                                aria-label="Analyze text"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
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
                        disabled={!audioBlob && !textInput.trim()}
                        className="w-full max-w-md shadow-xl shadow-primary-500/20"
                    >
                        {isProcessing ? 'Processing...' : 'Analyze Issue'}
                    </Button>
                </div>
            </PageTransition>
        </AppLayout>
    );
}
