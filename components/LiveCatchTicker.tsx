import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const LiveCatchTicker: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [text, setText] = useState('');

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, 'settings', 'general'), (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                if (data.liveCatchActive && data.liveCatchText) {
                    setText(data.liveCatchText);
                    setIsVisible(true);
                } else {
                    setIsVisible(false);
                }
            }
        });
        return () => unsubscribe();
    }, []);

    if (!isVisible) return null;

    return (
        <div className="bg-sky-950 text-sky-200 py-2 overflow-hidden border-b border-sky-900 relative z-[60]">
            <div className="flex whitespace-nowrap animate-ticker">
                <div className="flex gap-12 px-12 group-hover:pause">
                    {[...Array(10)].map((_, i) => (
                        <span key={i} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest">
                            <span className="text-sky-500">◆</span>
                            {text}
                        </span>
                    ))}
                </div>
            </div>
            <style>{`
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-ticker {
                    animation: ticker 30s linear infinite;
                    display: flex;
                    width: fit-content;
                }
            `}</style>
        </div>
    );
};

export default LiveCatchTicker;
