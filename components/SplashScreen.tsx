import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
    onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Start fade out after 2.5 seconds
        const timer = setTimeout(() => {
            setIsVisible(false);
            // Call onComplete after transition finishes (e.g., 500ms transition)
            setTimeout(onComplete, 500);
        }, 2500);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div
            className={`fixed inset-0 z-[100] bg-sky-950 flex flex-col items-center justify-center transition-opacity duration-1000 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
        >
            <div className="relative">
                <div className="text-center space-y-4">
                    {/* Logo / Icon Animation */}
                    <div className="mx-auto w-24 h-24 relative mb-6">
                        <div className="absolute inset-0 bg-sky-500 rounded-full blur-[40px] opacity-20 animate-pulse"></div>
                        <svg className="w-full h-full text-sky-100 animate-[float_3s_ease-in-out_infinite]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 009-9c0-4.97-4.03-9-9-9s-9 4.03-9 9 0 009 9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 11V7" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 17v-2" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 13c0 2.21-1.79 4-4 4s-4-1.79-4-4" />
                        </svg>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-wide animate-[fadeInUp_0.8s_ease-out_forwards] opacity-0 translate-y-4">
                        Farmers Meenchatti
                    </h1>
                    <div className="h-px w-24 bg-sky-600 mx-auto animate-[widthGrow_1s_ease-out_1s_forwards] w-0"></div>
                    <p className="text-sky-300 text-sm tracking-[0.3em] uppercase animate-[fadeInUp_0.8s_ease-out_0.5s_forwards] opacity-0 translate-y-4">
                        The Soul of Kerala
                    </p>
                </div>
            </div>

            <style>{`
        @keyframes widthGrow {
          from { width: 0; }
          to { width: 6rem; }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    );
};

export default SplashScreen;
