import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ml';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
    en: {
        nav_our_story: "Our Story",
        nav_menu: "Menu",
        nav_process: "Process",
        nav_reviews: "Reviews",
        nav_contact: "Contact",
        hero_tagline: "From the Sea,\nTo the Clay.",
        hero_subtagline: "We specialize in one thing: the perfect fish curry. Sourced from the daily morning catch, cooked slowly in hand-fired clay.",
        hero_cta: "Explore Our Catch",
        section_story: "Coastal Legacy",
        section_highlight: "Signature Catch",
        section_process: "The Journey",
        process_title: "From Earth to Table",
        process_step1_title: "Hand-Molded",
        process_step1_desc: "Sourced from the riverbeds of Kerala, our clay is purified and hand-spun by master artisans.",
        process_step2_title: "Fire Seasoned",
        process_step2_desc: "Vessels are slow-fired in traditional kilns and seasoned with rice water and bran oil for 7 days.",
        process_step3_title: "Slow Cooked",
        process_step3_desc: "The porous clay allows steam to circulate, keeping the fish moist and intensifying every spice.",
        section_wellness: "Wellness First",
        wellness_title: "Why Clay is Better for Your Body",
        wellness_desc: "Traditional wisdom meets modern science. Cooking in clay isn't just about taste—it's a lifestyle choice for better digestion and health.",
        wellness_benefit1_title: "Alkaline Property",
        wellness_benefit1_desc: "Clay is alkaline in nature, which interacts with the acidity of the food and neutralizes the pH balance.",
        wellness_benefit2_title: "Oil Reduction",
        wellness_benefit2_desc: "Clay pots are heat-resistant and slow-cooking allows food to retain its natural oils, requiring less added fat.",
        wellness_benefit3_title: "Mineral Rich",
        wellness_benefit3_desc: "Cooking in clay adds essential minerals like calcium, phosphorus, iron, and magnesium to your diet.",
        wellness_benefit4_title: "Nutrient Retention",
        wellness_benefit4_desc: "The porous nature of clay allows heat and moisture to circulate evenly, preserving 100% of nutrients.",
        wellness_leadfree: "100% Lead Free",
        wellness_leadfree_desc: "Tested and certified for food safety and non-toxicity."
    },
    ml: {
        nav_our_story: "ചരിത്രം",
        nav_menu: "രുചിക്കൂട്ടുകൾ",
        nav_process: "രീതി",
        nav_reviews: "അഭിപ്രായങ്ങൾ",
        nav_contact: "ബന്ധപ്പെടുക",
        hero_tagline: "കടലിൽ നിന്ന്,\nമൺചട്ടിയിലേക്ക്.",
        hero_subtagline: "ഏറ്റവും മികച്ച മീൻ കറി - അതാണ് ഞങ്ങളുടെ പ്രത്യേകത. പുലർച്ചെ ലഭിക്കുന്ന ഫ്രഷ് മീൻ മൺചട്ടിയിൽ പാകം ചെയ്തത്.",
        hero_cta: "രുചികൾ അറിയൂ",
        section_story: "പാരമ്പര്യം",
        section_highlight: "പ്രധാന വിഭവങ്ങൾ",
        section_process: "രീതി",
        process_title: "മണ്ണിൽ നിന്ന് മേശയിലേക്ക്",
        process_step1_title: "കൈകൊണ്ട് നിർമ്മിച്ചത്",
        process_step1_desc: "കേരളത്തിലെ പുഴയോരങ്ങളിൽ നിന്ന് ശേഖരിച്ച കളിമണ്ണ് വിദഗ്ധർ കൈകൊണ്ട് രൂപപ്പെടുത്തിയത്.",
        process_step2_title: "തീയിൽ പാകപ്പെടുത്തിയത്",
        process_step2_desc: "മൺപാത്രങ്ങൾ പരമ്പരാഗത ചൂളകളിൽ ചുട്ടെടുത്തു, 7 ദിവസം പാകപ്പെടുത്തിയെടുത്തത്.",
        process_step3_title: "സാവധാനം പാകപ്പെടുത്തിയത്",
        process_step3_desc: "മൺപാത്രങ്ങളിലെ സുഷിരങ്ങൾ ആവി തടഞ്ഞുനിർത്തുകയും മീൻ കറിക്ക് കൂടുതൽ രുചി നൽകുകയും ചെയ്യുന്നു.",
        section_wellness: "ആരോഗ്യത്തിന് പ്രധാന്യം",
        wellness_title: "എന്തുകൊണ്ട് മൺചട്ടി മികച്ചതാകുന്നു?",
        wellness_desc: "പുരാതന അറിവും ആധുനിക ശാസ്ത്രവും ചേരുന്നു. മൺചട്ടിയിലെ പാചകം ദഹനത്തിനും ആരോഗ്യത്തിനും മികച്ചതാണ്.",
        wellness_benefit1_title: "ആൽക്കലൈൻ ഗുണങ്ങൾ",
        wellness_benefit1_desc: "കളിമണിന് ആൽക്കലൈൻ സ്വഭാവമുണ്ട്, ഇത് ഭക്ഷണത്തിലെ അസിഡിറ്റി കുറച്ചു പി.എച്ച് ബാലൻസ് നിലനിർത്തുന്നു.",
        wellness_benefit2_title: "കുറഞ്ഞ എണ്ണ ഉപയോഗം",
        wellness_benefit2_desc: "മൺപാത്രങ്ങളിലെ പാചകം ഭക്ഷണത്തിലെ സ്വാഭാവിക എണ്ണ നിലനിർത്തുന്നതിനാൽ അധികം എണ്ണ ആവശ്യമില്ല.",
        wellness_benefit3_title: "ധാതു സമ്പുഷ്ടം",
        wellness_benefit3_desc: "മൺചട്ടിയിലെ പാചകം കാൽസ്യം, ഫോസ്ഫറസ്, ഇരുമ്പ് തുടങ്ങിയ അവശ്യ ധാതുക്കൾ ഭക്ഷണത്തിന് നൽകുന്നു.",
        wellness_benefit4_title: "പോഷകങ്ങൾ നിലനിർത്തുന്നു",
        wellness_benefit4_desc: "ഭക്ഷണത്തിലെ പോഷകങ്ങൾ 100% സംരക്ഷിക്കപ്പെടുന്നു.",
        wellness_leadfree: "100% ഈയം മുക്തം",
        wellness_leadfree_desc: "ഭക്ഷണ സുരക്ഷയ്ക്കും വിഷാംശം ഇല്ലാത്തതിനും പരിശോധിച്ചു സാക്ഷ്യപ്പെടുത്തിയത്."
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('en');

    const t = (key: string) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
