import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ progress = 0, label }) => {
    return (
        <div className="w-full">
            {label && (
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-neutral-600">{label}</span>
                    <span className="text-sm font-bold text-primary-600">{Math.round(progress)}%</span>
                </div>
            )}
            <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
