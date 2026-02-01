import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppLayout from '../layouts/AppLayout';
import StepIndicator from '../components/shared/StepIndicator';
import PageTransition from '../components/shared/PageTransition';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import { ROUTES } from '../utils/constants';

// Mock outcome generator
const getMockResult = () => {
    // 80% chance of success
    const isSuccess = Math.random() > 0.2;
    return {
        category: isSuccess ? 'Internet Connectivity' : 'Unsure',
        confidence: isSuccess ? Math.floor(Math.random() * (99 - 80) + 80) : Math.floor(Math.random() * (60 - 30) + 30),
        department: isSuccess ? 'Technical Support' : 'General Inquiry',
        waitTime: '2 min',
        language: 'English'
    };
};

export default function ResultsPage() {
    const navigate = useNavigate();
    const [result, setResult] = useState(null);

    useEffect(() => {
        // Simulate fetching result from Session or API
        const mockData = getMockResult();
        setResult(mockData);
    }, []);

    const handleConfirm = () => {
        // In real app, this would route the call
        alert(`Routing to ${result.department}...`);
        navigate(ROUTES.HOME);
    };

    const handleManualSelect = () => {
        navigate(ROUTES.MANUAL_SELECTION);
    };

    const handleRetry = () => {
        navigate(ROUTES.HOME);
    };

    if (!result) return null;

    const isHighConfidence = result.confidence > 70;

    return (
        <AppLayout title="Analysis Complete" showBack={false}>
            <PageTransition>
                <StepIndicator currentStep={3} />

                <div className="flex flex-col items-center mt-6">
                    {/* Status Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 
                            ${isHighConfidence ? 'bg-success-100 text-success-600' : 'bg-orange-100 text-orange-600'}`}
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

                    <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                        {isHighConfidence ? 'Issue Identify!' : 'We need clarification'}
                    </h2>
                    <p className="text-neutral-500 mb-8 text-center max-w-xs">
                        {isHighConfidence
                            ? `We've analyzed your voice input with ${result.confidence}% confidence.`
                            : `We were only ${result.confidence}% sure about your request.`}
                    </p>

                    {/* Result Card */}
                    <Card className="w-full p-6 mb-8 bg-gradient-to-br from-white to-neutral-50">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                                <span className="text-neutral-500 font-medium">Detected Issue</span>
                                <span className="font-bold text-neutral-800">{result.category}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                                <span className="text-neutral-500 font-medium">Department</span>
                                <span className="font-bold text-primary-600">{result.department}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-neutral-500 font-medium">Estimated Wait</span>
                                <span className="font-bold text-success-600">{result.waitTime}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Actions */}
                    <div className="w-full space-y-3">
                        {isHighConfidence ? (
                            <>
                                <Button variant="primary" size="lg" className="w-full" onClick={handleConfirm}>
                                    Connect to Agent
                                </Button>
                                <Button variant="secondary" className="w-full" onClick={handleManualSelect}>
                                    Wrong category? Select manually
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="primary" size="lg" className="w-full" onClick={handleManualSelect}>
                                    Select Manual Category
                                </Button>
                                <Button variant="ghost" className="w-full" onClick={handleRetry}>
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
