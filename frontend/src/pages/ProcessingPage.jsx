import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppLayout from '../layouts/AppLayout';
import ProgressBar from '../components/shared/ProgressBar';
import StepIndicator from '../components/shared/StepIndicator';
import PageTransition from '../components/shared/PageTransition';
import { ROUTES } from '../utils/constants';

const PROCESSING_STEPS = [
    { label: 'Transcribing your voice...', duration: 2000 },
    { label: 'Translating to English...', duration: 1500 },
    { label: 'Analyzing issue category...', duration: 1500 },
    { label: 'Matching with support team...', duration: 1000 },
];

export default function ProcessingPage() {
    const navigate = useNavigate();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let mounted = true;
        let stepStartTime = Date.now();
        let animationFrame;

        const animateProgress = () => {
            if (!mounted) return;

            const now = Date.now();
            const currentStep = PROCESSING_STEPS[currentStepIndex];
            const elapsed = now - stepStartTime;
            const stepProgress = Math.min((elapsed / currentStep.duration) * 100, 100);

            setProgress(stepProgress);

            if (elapsed < currentStep.duration) {
                animationFrame = requestAnimationFrame(animateProgress);
            } else {
                // Step complete
                if (currentStepIndex < PROCESSING_STEPS.length - 1) {
                    setCurrentStepIndex(prev => prev + 1);
                    stepStartTime = Date.now();
                    animationFrame = requestAnimationFrame(animateProgress);
                } else {
                    // All steps complete
                    setTimeout(() => {
                        navigate(ROUTES.RESULTS);
                    }, 500);
                }
            }
        };

        animationFrame = requestAnimationFrame(animateProgress);

        return () => {
            mounted = false;
            cancelAnimationFrame(animationFrame);
        };
    }, [currentStepIndex, navigate]);

    return (
        <AppLayout title="Processing" showBack={false}>
            <PageTransition>
                <StepIndicator currentStep={2} />

                <div className="flex flex-col items-center justify-center min-h-[400px] mt-10">
                    {/* Animated Illustration or Icon */}
                    <motion.div
                        className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mb-10"
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.8, 1, 0.8]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <svg className="w-16 h-16 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                    </motion.div>

                    <div className="w-full max-w-md space-y-8">
                        <div className="text-center">
                            <motion.h2
                                key={currentStepIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-2xl font-bold text-neutral-800 mb-2"
                            >
                                {PROCESSING_STEPS[currentStepIndex].label}
                            </motion.h2>
                            <p className="text-neutral-500">Please wait while our AI analyzes your request</p>
                        </div>

                        <ProgressBar progress={progress} />
                    </div>
                </div>
            </PageTransition>
        </AppLayout>
    );
}
