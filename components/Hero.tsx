import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { isOpenNow } from '../utils/timeUtils';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
  onMenuClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onMenuClick }) => {
  const { language, t } = useLanguage();
  const [tagline, setTagline] = useState("");
  const [subTagline, setSubTagline] = useState("");
  const [timings, setTimings] = useState({
    openingTime: '11:00 AM',
    closingTime: '10:30 PM',
    weekendOpeningTime: '11:00 AM',
    weekendClosingTime: '11:00 PM'
  });

  const open = isOpenNow(timings);

  React.useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'general'), (doc) => {
      if (doc.exists()) {
        if (doc.data().tagline) setTagline(doc.data().tagline);
        if (doc.data().subTagline) setSubTagline(doc.data().subTagline);
        if (doc.data().openingTime) setTimings(prev => ({ ...prev, openingTime: doc.data().openingTime }));
        if (doc.data().closingTime) setTimings(prev => ({ ...prev, closingTime: doc.data().closingTime }));
        if (doc.data().weekendOpeningTime) setTimings(prev => ({ ...prev, weekendOpeningTime: doc.data().weekendOpeningTime }));
        if (doc.data().weekendClosingTime) setTimings(prev => ({ ...prev, weekendClosingTime: doc.data().weekendClosingTime }));
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#f0f9ff]">
      {/* Dynamic Background Elements - Light Blue Tones */}
      <div className="absolute top-20 right-[-5%] w-[600px] h-[600px] bg-sky-200/40 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-20 left-[-5%] w-[500px] h-[500px] bg-blue-100/60 rounded-full blur-[100px] -z-10 animate-bounce [animation-duration:12s]" />

      {/* Animated Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-sky-50 to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 relative z-10">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 bg-white border ${open ? 'border-green-100 text-green-800' : 'border-slate-200 text-slate-500'} rounded-full text-sm font-semibold tracking-wide uppercase shadow-sm`}>
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${open ? 'bg-green-400' : 'bg-slate-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${open ? 'bg-green-600' : 'bg-slate-600'}`}></span>
            </span>
            {open ? `Open Now • Until ${timings.closingTime}` : `Closed Now • opens at ${timings.openingTime}`}
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold leading-[1.2] text-slate-900">
            {(language === 'en' && tagline ? tagline : t('hero_tagline')).split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {i === 1 ? (
                  <span className="text-sky-600 italic relative block mt-2">
                    {line}
                    <svg className="absolute -bottom-4 left-0 w-full max-w-[400px]" viewBox="0 0 300 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 15C50 5 250 5 295 15" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" strokeDasharray="10 5" />
                    </svg>
                  </span>
                ) : (
                  <>{line} <br /></>
                )}
              </React.Fragment>
            ))}
          </h1>

          <p className="text-xl text-slate-600 leading-relaxed max-w-lg pt-4">
            {language === 'en' && subTagline ? subTagline : t('hero_subtagline')}
          </p>

          <div className="flex flex-wrap gap-5 items-center">
            <button
              onClick={onMenuClick}
              className="group bg-sky-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-sky-700 transition-all shadow-2xl shadow-sky-600/30 flex items-center gap-4"
            >
              {t('hero_cta')}
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </button>

          </div>

          <div className="flex items-center gap-8 pt-10 border-t border-sky-200/60">
            <div>
              <p className="text-3xl font-serif font-bold text-slate-900">100%</p>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Wild Caught</p>
            </div>
            <div className="w-px h-10 bg-sky-200"></div>
            <div>
              <p className="text-3xl font-serif font-bold text-slate-900">7 Day</p>
              <div className="flex items-center gap-1">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Pot Seasoning</p>
                <img src="https://cdn-icons-png.flaticon.com/128/785/785116.png" alt="Fire" className="w-4 h-4 opacity-80" />
              </div>
            </div>
            <div className="w-px h-10 bg-sky-200"></div>
            <div>
              <p className="text-3xl font-serif font-bold text-slate-900">4.9/5</p>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Fresh Rating</p>
            </div>
          </div>
        </div>

        <div className="relative lg:h-[700px] flex items-center justify-center">
          <div className="relative z-10 w-full max-w-[550px] animate-[float_6s_infinite_ease-in-out]">
            <div className="absolute inset-0 bg-sky-400 rounded-full blur-[80px] opacity-20 -z-10 scale-90"></div>
            <img
              src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop"
              className="rounded-full w-full aspect-square object-cover border-[12px] border-white shadow-2xl meenchatti-glow ring-1 ring-sky-100"
              alt="Authentic Meenchatti Fish Curry"
            />

            {/* Floating Seafood Badges */}
            <div className="absolute -top-4 right-10 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl border border-sky-50 animate-bounce">
              <p className="text-slate-900 font-bold flex items-center gap-2">
                <span className="text-sky-600">🦐</span> Coastal Fresh
              </p>
            </div>
            <div className="absolute bottom-20 -left-10 bg-sky-600 text-white px-6 py-3 rounded-2xl shadow-xl border border-white/10 animate-[pulse_4s_infinite]">
              <p className="font-bold flex items-center gap-2">
                <span className="text-sky-300">🍲</span> Clay Infused
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Dive In</span>
        <div className="w-px h-12 bg-gradient-to-b from-sky-400 to-transparent"></div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(1deg); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
