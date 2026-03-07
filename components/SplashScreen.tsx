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
            // Call onComplete after transition finishes
            setTimeout(onComplete, 500);
        }, 2500);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div
            className={`fixed inset-0 z-[100] bg-[#FDF9E3] flex flex-col items-center justify-center transition-opacity duration-1000 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
        >
            <div className="relative">
                <div className="text-center space-y-4">
                    {/* Logo Image Animation */}
                    <div className="mx-auto w-32 h-32 relative mb-8">
                        <div className="absolute inset-0 bg-[#941B1B] rounded-full blur-[40px] opacity-20 animate-pulse"></div>
                        <img
                            src="/logo-sm.jpg"
                            alt="Farmers Meenchatti"
                            className="w-full h-full object-contain rounded-full shadow-lg border-2 border-white animate-[float_3s_ease-in-out_infinite]"
                        />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#941B1B] tracking-wide animate-[fadeInUp_0.8s_ease-out_forwards] opacity-0 translate-y-4">
                        Farmers Meenchatti
                    </h1>
                    <div className="h-0.5 w-24 bg-[#D18E20] mx-auto animate-[widthGrow_1s_ease-out_1s_forwards] w-0"></div>
                    <p className="text-[#941B1B]/80 text-sm font-bold tracking-[0.3em] uppercase animate-[fadeInUp_0.8s_ease-out_0.5s_forwards] opacity-0 translate-y-4">
                        Authentic Kerala Flavors
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
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
        </div>
    );
};

export default SplashScreen;
