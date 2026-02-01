import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Main app layout with header and back button
 */
export default function AppLayout({ children, title = '', showBack = true }) {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 font-sans">
            {/* Modern Card Frame */}
            <div className="relative w-full max-w-[420px] h-[850px] max-h-[90vh] bg-white rounded-[2rem] shadow-2xl border border-neutral-200 overflow-hidden ring-1 ring-neutral-900/5">

                {/* Decorative Frame Outline */}
                <div className="absolute inset-0 border-[6px] border-neutral-100 rounded-[2rem] pointer-events-none z-50"></div>

                {/* Inner Content Scroller */}
                <div className="w-full h-full overflow-y-auto overflow-x-hidden scrollbar-hide">
                    {/* Header */}
                    <header className="bg-white/80 backdrop-blur-md border-b border-neutral-100 sticky top-0 z-30 pt-4">
                        <div className="px-4 py-3 flex items-center justify-between">
                            {/* Back button */}
                            {showBack && (
                                <motion.button
                                    onClick={() => navigate(-1)}
                                    className="p-2 -ml-2 hover:bg-neutral-50 rounded-full transition-colors text-neutral-600"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </motion.button>
                            )}

                            {/* Title */}
                            <h1 className="text-base font-semibold text-neutral-900 flex-1 text-center truncate px-2">
                                {title}
                            </h1>

                            {/* Spacer for symmetry */}
                            {showBack && <div className="w-9" />}
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="px-4 py-6 pb-12 min-h-[calc(100%-60px)]">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
