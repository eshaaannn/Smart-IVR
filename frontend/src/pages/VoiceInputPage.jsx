import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '../layouts/AppLayout';
import Button from '../components/shared/Button';
import PageTransition from '../components/shared/PageTransition';
import { ROUTES } from '../utils/constants';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

const LANGUAGES = [
    { code: 'en-US', label: 'English', flag: '🇺🇸', sub: 'Global' },
    { code: 'hi-IN', label: 'Hindi', flag: '🇮🇳', sub: 'हिंदी' },
    { code: 'mr-IN', label: 'Marathi', flag: '', sub: 'मराठी' },
];

/**
 * Voice Input Page - Main entry point
 * Dark Theme UI
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

            let audioUrl = '';
            if (audioBlob) {
                try {
                    audioUrl = await import('../services/audioService').then(m => m.uploadAudio(audioBlob));
                    sessionStorage.setItem('audioUrl', audioUrl);
                } catch (uploadError) {
                    console.error("Audio upload failed", uploadError);
                    if (!textInput.trim()) {
                        throw new Error("Failed to upload voice recording");
                    }
                }
            } else {
                sessionStorage.removeItem('audioUrl');
            }

            sessionStorage.setItem('transcript', textInput);
            sessionStorage.setItem('language', selectedLang);

            setTimeout(() => {
                navigate(ROUTES.PROCESSING);
            }, 500);

        } catch (err) {
            console.error('Analysis error:', err);
            setError('Failed to process. Please try again.');
            setIsProcessing(false);
        }
    };

    return (
        <AppLayout title="Smart Assistant" showBack={false}>
            <PageTransition>

                {/* Step Indicator on Secondary Surface */}
                <div className="w-full bg-theme-surface rounded-full h-1 mb-8 overflow-hidden">
                    <motion.div
                        className="h-full bg-blue-500 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "33%" }}
                    />
                </div>

                <div className="flex flex-col h-full">

                    {/* Content Column */}
                    <div className="flex-1 flex flex-col justify-center items-center text-center space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-3">
                                How can we help?
                            </h2>
                            <p className="text-gray-400 text-sm max-w-xs mx-auto">
                                Select your language and tap the microphone to explain your issue.
                            </p>
                        </div>

                        {/* Language Selection - Cards on Secondary Surface */}
                        <div className="w-full grid grid-cols-3 gap-3">
                            {LANGUAGES.map((lang) => (
                                <motion.button
                                    key={lang.code}
                                    onClick={() => setSelectedLang(lang.code)}
                                    whileTap={{ scale: 0.95 }}
                                    className={`
                                        flex flex-col items-center justify-center py-4 rounded-2xl transition-all
                                        ${selectedLang === lang.code
                                            ? 'bg-blue-600 text-white ring-2 ring-blue-400/50'
                                            : 'bg-theme-surface text-gray-300 hover:bg-theme-surface/80'}
                                    `}
                                >
                                    {/* Only show flag if it exists, otherwise explicit empty or fallback logic without specific 'voice man' if undesired.
                                        User said "remove the voice men icon".
                                        If flag is empty (Marathi), we render nothing or just the label. */}
                                    {lang.flag && <span className="text-2xl mb-2 grayscale opacity-80">{lang.flag}</span>}
                                    {!lang.flag && <div className="h-2 mb-2"></div>}

                                    <span className="text-xs font-semibold tracking-wide">
                                        {lang.label}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Primary Voice Interaction - Lower Middle */}
                    <div className="flex-1 flex flex-col items-center justify-center py-8">
                        <div className="relative w-48 h-48 flex items-center justify-center">

                            {/* Listening Radar Animation */}
                            <AnimatePresence>
                                {isListening && (
                                    <>
                                        {[...Array(3)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="absolute inset-0 rounded-full border border-blue-500/30"
                                                initial={{ scale: 1, opacity: 0.5, borderWidth: "1px" }}
                                                animate={{
                                                    scale: 2.5,
                                                    opacity: 0,
                                                    borderWidth: "0px"
                                                }}
                                                transition={{
                                                    duration: 2.5,
                                                    repeat: Infinity,
                                                    delay: i * 0.8,
                                                    ease: "anticipate"
                                                }}
                                            />
                                        ))}
                                        {/* Static Outer Rings for "Radar" look */}
                                        <div className="absolute inset-0 rounded-full border border-theme-surface/30 scale-125"></div>
                                        <div className="absolute inset-0 rounded-full border border-theme-surface/20 scale-150"></div>
                                    </>
                                )}
                            </AnimatePresence>

                            {/* Main Button */}
                            <motion.button
                                onClick={handleToggleRecording}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`
                                    relative z-20 w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300
                                    ${isListening
                                        ? 'bg-red-500 shadow-red-500/20'
                                        : 'bg-blue-600 shadow-blue-600/20'}
                                `}
                            >
                                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {isListening ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    )}
                                </svg>
                            </motion.button>
                        </div>

                        <p className={`mt-6 text-sm font-medium tracking-wide ${isListening ? 'text-blue-400 animate-pulse' : 'text-gray-500'}`}>
                            {isListening ? 'Listening...' : 'Tap to Speak'}
                        </p>
                    </div>

                    {/* Bottom Area - Text fallback */}
                    <div className="w-full bg-theme-surface rounded-2xl p-1 mb-6 flex items-center">
                        <input
                            type="text"
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            placeholder="Type to explain..."
                            className="flex-1 bg-transparent border-none text-white px-4 py-3 placeholder-gray-500 focus:ring-0 text-sm"
                        />
                        <button
                            onClick={handleAnalyze}
                            disabled={!textInput.trim() && !audioBlob}
                            className="p-3 bg-blue-600 rounded-xl text-white disabled:opacity-50 disabled:bg-gray-700"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </div>

                </div>
            </PageTransition>
        </AppLayout>
    );
}
