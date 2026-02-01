import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', delay = 0, onClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: delay * 0.1, ease: "easeOut" }}
            className={`
        bg-white border border-neutral-100 rounded-2xl shadow-xl shadow-neutral-200/50 overflow-hidden
        ${onClick ? 'cursor-pointer hover:border-primary-200 hover:shadow-primary-500/10 transition-all duration-300' : ''}
        ${className}
      `}
            onClick={onClick}
        >
            {children}
        </motion.div>
    );
};

export default Card;
