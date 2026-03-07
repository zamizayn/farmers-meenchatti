
import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { X } from 'lucide-react';

const DailySpecialPopup: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [specialText, setSpecialText] = useState('');
    const [isDismissed, setIsDismissed] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        // Listen to settings changes
        const unsubscribe = onSnapshot(doc(db, 'settings', 'general'), (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                if (data.dailySpecialActive && data.dailySpecialText) {
                    setSpecialText(data.dailySpecialText);
                    setIsVisible(true);
                } else {
                    setIsVisible(false);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    if (!isVisible || isDismissed || user) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] animate-in slide-in-from-bottom-5 duration-500">
            <div className="bg-[#941B1B] text-white p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] border-t border-[#7A1313] relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

                <div className="container mx-auto px-6 flex items-center justify-between gap-4 relative z-10">
                    <div className="flex items-center gap-4">
                        <span className="bg-white text-[#941B1B] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest animate-pulse">Todays Special</span>
                        <p className="font-bold text-lg md:text-xl font-serif leading-none pt-1">{specialText}</p>
                    </div>

                    <button
                        onClick={() => setIsDismissed(true)}
                        className="p-2 hover:bg-white/20 rounded-full transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DailySpecialPopup;
