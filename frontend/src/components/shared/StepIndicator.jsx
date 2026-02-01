import React from 'react';
import { motion } from 'framer-motion';

const steps = [
    { id: 1, label: 'Record' },
    { id: 2, label: 'Process' },
    { id: 3, label: 'Confirm' },
];

const StepIndicator = ({ currentStep = 1 }) => {
    return (
        <div className="w-full py-4 px-6 mb-6">
            <div className="relative flex justify-between items-center max-w-xs mx-auto">
                {/* Background Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-neutral-200 -z-10 -translate-y-1/2 rounded-full"></div>

                {/* Progress Line */}
                <motion.div
                    className="absolute top-1/2 left-0 h-1 bg-primary-500 -z-10 -translate-y-1/2 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${((Math.min(currentStep, steps.length) - 1) / (steps.length - 1)) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />

                {steps.map((step) => {
                    const isActive = step.id <= currentStep;
                    const isCurrent = step.id === currentStep;

                    return (
                        <div key={step.id} className="flex flex-col items-center">
                            <motion.div
                                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors duration-300
                  ${isActive
                                        ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/30'
                                        : 'bg-white border-neutral-300 text-neutral-400'
                                    }
                `}
                                animate={{ scale: isCurrent ? 1.1 : 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                {isActive ? (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    step.id
                                )}
                            </motion.div>
                            <span className={`mt-2 text-xs font-medium ${isCurrent ? 'text-primary-600' : 'text-neutral-400'}`}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StepIndicator;
