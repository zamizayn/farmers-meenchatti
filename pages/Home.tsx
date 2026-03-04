import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Menu from '../components/Menu';
import Process from '../components/Process';
import HealthBenefits from '../components/HealthBenefits';

import Reviews from '../components/Reviews';
import VideoReviews from '../components/VideoReviews';
import Footer from '../components/Footer';
import { isOpenNow } from '../utils/timeUtils';
import MenuCard from '../components/MenuCard';
import SignatureHighlights from '../components/SignatureHighlights';
import MenuImageModal from '../components/MenuImageModal';
import ReservationForm from '../components/ReservationForm';

import SplashScreen from '../components/SplashScreen';

const Home: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [showSplash, setShowSplash] = useState(true);
    const [timings, setTimings] = useState({
        openingTime: '11:00 AM',
        closingTime: '10:30 PM',
        weekendOpeningTime: '11:00 AM',
        weekendClosingTime: '11:00 PM'
    });

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, 'settings', 'general'), (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setTimings({
                    openingTime: data.openingTime || '11:00 AM',
                    closingTime: data.closingTime || '10:30 PM',
                    weekendOpeningTime: data.weekendOpeningTime || '11:00 AM',
                    weekendClosingTime: data.weekendClosingTime || '11:00 PM'
                });
            }
        });
        return () => unsubscribe();
    }, []);

    const open = isOpenNow(timings);

    if (showSplash) {
        return <SplashScreen onComplete={() => setShowSplash(false)} />;
    }

    return (
        <div className="min-h-screen selection:bg-sky-100 selection:text-sky-900 overflow-x-hidden">
            <Navbar onMenuClick={() => setIsMenuOpen(true)} />

            <main>
                {/* Section 1: Hero */}
                <Hero onMenuClick={() => setIsMenuOpen(true)} />

                {/* Section 2: Signature Highlights */}
                <SignatureHighlights onSeeAllClick={() => setIsImageModalOpen(true)} />

                {/* Section 3: Process Journey */}
                <Process />

                {/* Section 4: Our Story */}
                <section id="story" className="py-24 bg-[#f0f9ff] relative">
                    <div className="container mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
                        <div className="order-2 md:order-1 relative">
                            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-[10px] border-white">
                                <img
                                    src="https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800&auto=format&fit=crop"
                                    alt="Traditional Kerala Seafood Preparation"
                                    className="w-full h-[600px] object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-sky-950 rounded-full flex items-center justify-center text-white text-center p-6 shadow-2xl rotate-12 group hover:rotate-0 transition-transform duration-500">
                                <span className="text-sm font-bold uppercase tracking-widest leading-tight">Fresh <br /> <span className="text-3xl font-serif text-sky-400">Daily</span></span>
                            </div>
                        </div>
                        <div className="order-1 md:order-2 space-y-8">
                            <span className="text-sky-700 font-bold uppercase tracking-[0.2em] text-sm">Coastal Legacy</span>
                            <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 leading-tight">From the Sea, <br />To the Clay.</h2>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                We specialize in one thing: the perfect fish curry. Sourced from the daily morning catch at the Neendakara docks, our seafood is treated with the reverence it deserves—cooked slowly in hand-fired clay to preserve every delicate note of the ocean.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { t: "Ocean-to-Plate", d: "Seafood delivered and prepped within 4 hours of being caught." },
                                    { t: "The Meenchatti Secret", d: "Porous clay helps the Kudampuli infuse deeper into the fish." },
                                    { t: "Spice Mastery", d: "Custom blends of pepper, ginger, and garlic, ground fresh for every pot." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-6 items-start group">
                                        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex-shrink-0 flex items-center justify-center text-sky-900 font-bold group-hover:bg-sky-900 group-hover:text-sky-400 transition-colors duration-300 border border-slate-100">
                                            0{i + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-slate-900 font-bold text-xl">{item.t}</h4>
                                            <p className="text-slate-500">{item.d}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 5: Menu Grid (Interactive) */}
                <Menu onExploreClick={() => setIsMenuOpen(true)} />

                {/* Section 6: Reviews (Text) */}
                <Reviews />

                {/* Section 7: Video Reviews (Grid) */}
                <VideoReviews />

                {/* Section 8: Health Benefits */}
                <HealthBenefits />



                {/* Section 10: Marquee Divider */}
                <section className="py-20 bg-sky-950 text-sky-400 overflow-hidden border-y border-sky-900/50">
                    <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite] gap-12 text-5xl md:text-7xl font-serif font-bold italic opacity-40">
                        <span>WILD CAUGHT • FRESH CATCH • KUDAMPULI • BANANA LEAF • SEA SALT • CLAY POT MATURITY • </span>
                        <span>WILD CAUGHT • FRESH CATCH • KUDAMPULI • BANANA LEAF • SEA SALT • CLAY POT MATURITY • </span>
                    </div>
                </section>

                {/* Section 11: Contact */}
                <section id="contact" className="py-24 bg-white">
                    <div className="container mx-auto px-6 max-w-6xl">
                        <div className="bg-sky-50 rounded-[4rem] p-10 md:p-20 flex flex-col md:flex-row gap-20">
                            <div className="md:w-5/12 space-y-8">
                                <h2 className="text-5xl font-serif font-bold text-slate-900">Join our Table.</h2>
                                <p className="text-slate-500 text-lg">We are located in the heart of Kottayam. Come experience the true soul of Kerala seafood.</p>

                                <div className="space-y-6 pt-6">
                                    <div className="flex items-center gap-6 group">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm border border-slate-200 group-hover:border-sky-200 transition-colors">📍</div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">The Kitchen</p>
                                            <p className="text-slate-700 font-bold">Kottayam Coastal Hwy, Kerala</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 group">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm border border-slate-200 group-hover:border-sky-200 transition-colors">📱</div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Reservations</p>
                                            <p className="text-slate-700 font-bold">+91 98765 43210</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4 pt-4 border-t border-slate-200/60">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">Opening Hours</p>
                                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${open ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${open ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></span>
                                                {open ? 'Open Now' : 'Closed'}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm group hover:border-sky-200 transition-all hover:shadow-md">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Mon - Fri</p>
                                                <p className="text-slate-700 font-bold">{timings.openingTime} - {timings.closingTime}</p>
                                            </div>
                                            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm group hover:border-sky-200 transition-all hover:shadow-md">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Sat - Sun</p>
                                                <p className="text-slate-700 font-bold">{timings.weekendOpeningTime} - {timings.weekendClosingTime}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="md:w-7/12">
                                <ReservationForm />
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <MenuCard isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
            <MenuImageModal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} />
            <Footer />

            <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        ::selection {
          background-color: #e0f2fe;
          color: #0369a1;
        }
        html {
          scrollbar-width: thin;
          scrollbar-color: #0369a1 #f0f9ff;
        }
      `}</style>
        </div>
    );
};

export default Home;
