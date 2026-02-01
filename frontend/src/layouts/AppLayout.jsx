import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Main app layout with header and back button
 */
export default function AppLayout({ children, title = '', showBack = true }) {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center p-4 font-sans bg-white">
            {/* Mobile Frame Container */}
            <div className="relative w-full max-w-[400px] h-[850px] max-h-[90vh] bg-theme-dark text-white rounded-[3rem] shadow-2xl overflow-hidden border-[8px] border-neutral-900 ring-1 ring-neutral-900/5">

                {/* Status Bar / Notch Area Placeholder */}
                <div className="absolute top-0 left-0 w-full h-8 bg-neutral-900/10 z-20 pointer-events-none"></div>

                {/* Inner Content Scroller */}
                <div className="w-full h-full flex flex-col relative z-10 overflow-hidden">
                    {/* Header */}
                    <header className="px-6 py-5 flex items-center justify-between z-30 pt-10">
                        {/* Back button */}
                        {showBack ? (
                            <motion.button
                                onClick={() => navigate(-1)}
                                className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-all text-gray-300 hover:text-white"
                                whileTap={{ scale: 0.95 }}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </motion.button>
                        ) : (
                            <div className="w-10"></div> // Spacer
                        )}

                        {/* Title */}
                        <h1 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                            {title}
                        </h1>

                        {/* Profile/Spacer */}
                        <div className="w-10 flex justifying-end">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="flex-1 flex flex-col px-6 pb-8 overflow-y-auto scrollbar-hide">
                        {children}
                    </main>

                    {/* Bottom Navigation Removed as per user request to remove options */}
                    <div className="pb-6"></div>
                </div>
            </div>
        </div>
    );
}
