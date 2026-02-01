import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Main app layout with header and back button
 */
export default function AppLayout({ children, title = '', showBack = true }) {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header */}
            <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
                    {/* Back button */}
                    {showBack && (
                        <motion.button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                            whileTap={{ scale: 0.95 }}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </motion.button>
                    )}

                    {/* Title */}
                    <h1 className="text-lg font-semibold text-neutral-900 flex-1 text-center">
                        {title}
                    </h1>

                    {/* Spacer for symmetry */}
                    {showBack && <div className="w-10" />}
                </div>
            </header>

            {/* Content */}
            <main className="max-w-2xl mx-auto px-4 py-6">
                {children}
            </main>
        </div>
    );
}
