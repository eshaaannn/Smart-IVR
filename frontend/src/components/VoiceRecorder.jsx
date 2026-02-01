import { useState } from 'react';
import { motion } from 'framer-motion';
import { audioRecorder } from '../services/audioService';

/**
 * Voice recorder component with pulsing animation
 */
export default function VoiceRecorder({ onRecordingComplete, onError }) {
    const [isRecording, setIsRecording] = useState(false);

    const handleToggleRecording = async () => {
        try {
            if (isRecording) {
                // Stop recording
                const audioBlob = await audioRecorder.stopRecording();
                setIsRecording(false);

                if (onRecordingComplete) {
                    onRecordingComplete(audioBlob);
                }
            } else {
                // Start recording
                await audioRecorder.startRecording();
                setIsRecording(true);
            }
        } catch (error) {
            console.error('Recording error:', error);
            setIsRecording(false);

            if (onError) {
                onError(error);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            {/* Pulsing rings */}
            <div className="relative w-64 h-64 flex items-center justify-center">
                {isRecording && (
                    <>
                        {/* Outer ring */}
                        <motion.div
                            className="absolute w-64 h-64 rounded-full border-2 border-primary-300"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                                opacity: [0.6, 0.2, 0],
                                scale: [0.8, 1, 1.2]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeOut'
                            }}
                        />

                        {/* Middle ring */}
                        <motion.div
                            className="absolute w-56 h-56 rounded-full border-2 border-primary-400"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                                opacity: [0.7, 0.3, 0],
                                scale: [0.85, 1, 1.15]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeOut',
                                delay: 0.3
                            }}
                        />

                        {/* Inner ring */}
                        <motion.div
                            className="absolute w-48 h-48 rounded-full bg-primary-100"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{
                                opacity: [0.5, 0.2, 0],
                                scale: [0.9, 1, 1.1]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeOut',
                                delay: 0.6
                            }}
                        />
                    </>
                )}

                {/* Microphone button */}
                <motion.button
                    onClick={handleToggleRecording}
                    className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center shadow-xl transition-all ${isRecording
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-primary-500 hover:bg-primary-600'
                        }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {isRecording ? (
                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <rect x="6" y="6" width="8" height="8" rx="1" />
                        </svg>
                    ) : (
                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                        </svg>
                    )}
                </motion.button>
            </div>

            {/* Status text */}
            <motion.p
                className="mt-6 text-primary-600 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {isRecording ? 'Listening...' : 'Tap to start'}
            </motion.p>
        </div>
    );
}
