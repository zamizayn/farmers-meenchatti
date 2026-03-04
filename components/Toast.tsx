
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';

interface ToastProps {
    isVisible: boolean;
    title: string;
    message: string;
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ isVisible, title, message, onClose }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(onClose, 5000); // Auto hide after 5s
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="fixed top-6 right-6 z-50 w-full max-w-sm"
                >
                    <div className="bg-white/90 backdrop-blur-md border border-sky-100 p-4 rounded-2xl shadow-2xl flex items-start gap-4">
                        <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center shrink-0 text-sky-600">
                            <Bell className="w-6 h-6 animate-bounce" />
                        </div>
                        <div className="flex-1 pt-1">
                            <h4 className="font-bold text-slate-900 text-base">{title}</h4>
                            <p className="text-slate-500 text-sm leading-snug">{message}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    {/* Progress bar */}
                    <motion.div
                        initial={{ width: "100%" }}
                        animate={{ width: "0%" }}
                        transition={{ duration: 5, ease: "linear" }}
                        className="absolute bottom-0 left-4 right-4 h-1 bg-sky-500 rounded-full opacity-20"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;
