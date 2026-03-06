import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface SiteSettings {
    tagline: string;
    subTagline: string;
    logoUrl: string;
    menuImageUrl: string;
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string;
    openingTime: string;
    closingTime: string;
    weekendOpeningTime: string;
    weekendClosingTime: string;
}

interface SettingsContextType {
    settings: SiteSettings;
    loading: boolean;
}

const defaultSettings: SiteSettings = {
    tagline: "കടലിന്റെ രുചി. \nകളിമണ്ണിന്റെ മണം.",
    subTagline: "Rediscover the ancestral art of Kerala seafood.",
    logoUrl: 'https://www.farmersmeenchatti.in/img/logo-sm.jpg',
    menuImageUrl: '',
    seoTitle: 'Farmers Meenchatti | Authentic Kerala Seafood',
    seoDescription: 'Experience the soul of Kerala seafood with Farmers Meenchatti. Wild-caught fish curries cooked in traditional clay pots (Meenchatti) for authentic flavor.',
    seoKeywords: 'fish curry, kerala seafood, clay pot cooking, kottayam restaurants',
    openingTime: '11:00 AM',
    closingTime: '10:30 PM',
    weekendOpeningTime: '11:00 AM',
    weekendClosingTime: '11:00 PM'
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const docRef = doc(db, 'settings', 'general');
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setSettings({
                    tagline: data.tagline || defaultSettings.tagline,
                    subTagline: data.subTagline || defaultSettings.subTagline,
                    logoUrl: data.logoUrl || defaultSettings.logoUrl,
                    menuImageUrl: data.menuImageUrl || defaultSettings.menuImageUrl,
                    seoTitle: data.seoTitle || defaultSettings.seoTitle,
                    seoDescription: data.seoDescription || defaultSettings.seoDescription,
                    seoKeywords: data.seoKeywords || defaultSettings.seoKeywords,
                    openingTime: data.openingTime || defaultSettings.openingTime,
                    closingTime: data.closingTime || defaultSettings.closingTime,
                    weekendOpeningTime: data.weekendOpeningTime || defaultSettings.weekendOpeningTime,
                    weekendClosingTime: data.weekendClosingTime || defaultSettings.weekendClosingTime
                });
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, loading }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
