

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppLayout from '../layouts/AppLayout';
import StepIndicator from '../components/shared/StepIndicator';
import PageTransition from '../components/shared/PageTransition';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import { ROUTES } from '../utils/constants';

export default function ResultsPage() {
    const navigate = useNavigate();
    const [result, setResult] = useState(null);

    useEffect(() => {
        // Retrieve result from session storage (set by ProcessingPage)
        const storedResult = sessionStorage.getItem('analysisResult');

        if (storedResult) {
            try {
                const parsedResult = JSON.parse(storedResult);
                setResult(parsedResult);
            } catch (e) {
                console.error("Failed to parse result", e);
                // Fallback mock if parse fails
                setResult({
                    issue_category: 'technical_issue',
                    confidence: 0.5,
                    routing_to: 'Technical Support',
                    waitTime: '5 min'
                });
            }
        } else {
            // Fallback mock if no result found
            setResult({
                category: 'Internet Connectivity',
                confidence: 85,
                department: 'Technical Support',
                waitTime: '2 min',
                language: 'English'
            });
        }
    }, []);

    const handleConfirm = () => {
        // In real app, this would route the call
        alert(`Routing to ${result.routing_to || result.department}...`);
        navigate(ROUTES.HOME);
    };

    const handleManualSelect = () => {
        navigate(ROUTES.MANUAL_SELECTION);
    };

    const handleRetry = () => {
        navigate(ROUTES.HOME);
    };

    if (!result) return null;

    // Backend returns 'confidence' as 0.0-1.0 or 0-100. Let's normalize to 0-100.
    const confidenceScore = result.confidence <= 1 ? Math.round(result.confidence * 100) : result.confidence;
    const isHighConfidence = confidenceScore > 70;

    // Normalize field names (backend uses 'issue_category', 'routing_to')
    const categoryLabel = result.issue_category || result.category || 'Issue';
    const departmentLabel = result.routing_to || result.department || 'Support';

    return (
        <AppLayout title="Analysis Complete" showBack={false}>
            <PageTransition>
                <StepIndicator currentStep={3} />

                <div className="flex flex-col items-center mt-6 w-full px-4">
                    {/* Status Icon */}
                    <div className="relative mb-6">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                            className={`w-20 h-20 rounded-full flex items-center justify-center relative z-10 
                                ${isHighConfidence ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-orange-500/10 text-orange-400 border border-orange-500/30'}`}
                        >
                            {isHighConfidence ? (
                                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            )}
                        </motion.div>
                        {/* Glow effect */}
                        <div className={`absolute inset-0 rounded-full blur-xl opacity-20 ${isHighConfidence ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2 text-center">
                        {isHighConfidence ? 'Issue Identified!' : 'Clarification Needed'}
                    </h2>
                    <p className="text-gray-400 mb-8 text-center max-w-xs text-sm">
                        {isHighConfidence
                            ? `Analyzed with ${confidenceScore}% confidence.`
                            : `Confidence is low (${confidenceScore}%). Please confirm.`}
                    </p>

                    {/* Result Card */}
                    <Card className="w-full p-6 mb-8 bg-theme-surface border border-white/5 shadow-xl rounded-2xl relative overflow-hidden">
                        {/* Ensure dark background is explicit if theme-surface isn't working or overridden */}
                        <div className="absolute inset-0 bg-[#1B222F] z-0"></div>
                        <div className="relative z-10 space-y-4">
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                <span className="text-gray-400 font-medium text-sm">Detected Issue</span>
                                <span className="font-bold text-white capitalize">{categoryLabel.replace('_', ' ')}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                <span className="text-gray-400 font-medium text-sm">Department</span>
                                <span className="font-bold text-blue-400">{departmentLabel}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 font-medium text-sm">Estimated Wait</span>
                                <span className="font-bold text-green-400">{result.waitTime || '2 min'}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Actions */}
                    <div className="w-full space-y-3">
                        {isHighConfidence ? (
                            <>
                                <Button variant="primary" size="lg" className="w-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 border-none" onClick={handleConfirm}>
                                    Connect to Agent
                                </Button>
                                <Button variant="secondary" className="w-full bg-theme-surface border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white" onClick={handleManualSelect}>
                                    Wrong category? Select manually
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="primary" size="lg" className="w-full bg-blue-600 hover:bg-blue-500" onClick={handleManualSelect}>
                                    Select Manual Category
                                </Button>
                                <Button variant="ghost" className="w-full text-gray-400 hover:text-white hover:bg-white/5" onClick={handleRetry}>
                                    Try Recording Again
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </PageTransition>
        </AppLayout>
    );
}
