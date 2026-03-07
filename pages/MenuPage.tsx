
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Product } from '../types';
import { DEFAULT_PRODUCT_IMAGE } from '../constants';
import { isProductAvailable } from '../utils/timeUtils';
import { ShoppingBasket, Plus, Minus, Send, ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MenuPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cart, setCart] = useState<{ product: Product, quantity: number }[]>([]);
    const [showCart, setShowCart] = useState(false);

    // Mouse Parallax Logic
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smoothen mouse movement
    const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
    const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        // Normalize to -0.5 to 0.5
        mouseX.set((clientX / innerWidth) - 0.5);
        mouseY.set((clientY / innerHeight) - 0.5);
    };

    // Parallax Transforms
    const layer1X = useTransform(springX, [-0.5, 0.5], [-20, 20]);
    const layer1Y = useTransform(springY, [-0.5, 0.5], [-20, 20]);
    const layer2X = useTransform(springX, [-0.5, 0.5], [-40, 40]);
    const layer2Y = useTransform(springY, [-0.5, 0.5], [-40, 40]);

    useEffect(() => {
        const fetchMenu = async () => {
            setLoading(true);
            try {
                const q = query(collection(db, 'menu_items'), orderBy('category'));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
                    setProducts(fetched);
                }
            } catch (error) {
                console.error("Error fetching menu:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, []);

    // Auto-play Logic
    useEffect(() => {
        if (products.length === 0 || showCart) return;

        const timer = setInterval(() => {
            nextSlide();
        }, 4000);

        return () => clearInterval(timer);
    }, [currentIndex, products, showCart]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % products.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
    };

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === productId);
            if (existing && existing.quantity > 1) {
                return prev.map(item => item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item);
            }
            return prev.filter(item => item.product.id !== productId);
        });
    };

    const cartTotal = cart.reduce((total, item) => {
        const price = parseInt(item.product.price.replace(/[^\d]/g, '')) || 0;
        return total + (price * item.quantity);
    }, 0);

    const handleCheckout = () => {
        const phoneNumber = "919778702863";
        let message = `* Order from Editorial Showcase *\n\nItems: \n`;
        cart.forEach(item => {
            message += `- ${item.product.name} x ${item.quantity} (${item.product.price})\n`;
        });
        message += `\n*Total: ₹${cartTotal}*\n\nPlease confirm availability!`;
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const activeItem = products[currentIndex];

    // Dynamic Theme Colors
    const themeColors = useMemo(() => {
        if (!activeItem) return { glow: 'rgba(148, 27, 27, 0.4)', text: '#941B1B' };
        const cat = activeItem.category?.toLowerCase() || '';
        if (cat.includes('sea') || cat.includes('fish')) return { glow: 'rgba(20, 184, 166, 0.4)', text: '#14b8a6' };
        if (cat.includes('veg')) return { glow: 'rgba(34, 197, 94, 0.4)', text: '#22c55e' };
        return { glow: 'rgba(148, 27, 27, 0.4)', text: '#941B1B' };
    }, [activeItem]);

    if (loading) return (
        <div className="h-screen w-full bg-[#0a0a0a] flex items-center justify-center">
            <motion.div
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 border-b-4 border-t-4 border-[#941B1B] rounded-full flex items-center justify-center"
            >
                <div className="w-8 h-8 bg-white/10 rounded-full blur-md" />
            </motion.div>
        </div>
    );

    const previewItems = [
        products[currentIndex],
        products[(currentIndex + 1) % products.length],
        products[(currentIndex + 2) % products.length]
    ];

    return (
        <div
            className="h-screen w-full overflow-hidden bg-[#050505] selection:bg-[#941B1B]/40"
            onMouseMove={handleMouseMove}
        >
            <Navbar onMenuClick={() => { }} />

            {/* Atmosphere Layer: Dynamic Glow */}
            <AnimatePresence mode='wait'>
                <motion.div
                    key={activeItem?.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{
                        background: `radial-gradient(circle at 60% 50%, ${themeColors.glow} 0%, transparent 60%)`
                    }}
                />
            </AnimatePresence>

            {/* Main Background Slider - Content Locked */}
            <div className="absolute inset-0 z-0 opacity-40">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
                        className="absolute inset-0"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
                        <img 
                            src={products[currentIndex]?.image || DEFAULT_PRODUCT_IMAGE} 
                            alt="" 
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Content Overlay */}
            <main className="relative h-full w-full z-20 flex items-center pointer-events-none">
                <div className="w-full px-6 md:px-20 grid grid-cols-1 lg:grid-cols-12 items-center h-[80%] gap-10 lg:gap-0">
                    
                    {/* Hero Text Section - Left Zone (Col 1-6) */}
                    <motion.div 
                        style={{ x: layer1X, y: layer1Y }}
                        className="col-span-1 lg:col-span-6 space-y-8 md:space-y-12 pointer-events-auto"
                    >
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                                transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <Sparkles size={16} className="text-[#941B1B] animate-pulse" />
                                    <span className="text-white/20 font-medium uppercase tracking-[0.6em] text-[10px] md:text-xs">
                                        Taste of Heritage // {products[currentIndex]?.category || 'Curated'}
                                    </span>
                                </div>
                                
                                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-black text-white leading-none tracking-tight filter drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                                    {products[currentIndex]?.name.split(' ').map((word, i) => (
                                        <span key={i} className={i === 1 ? 'block text-[#941B1B] font-serif italic font-medium tracking-normal' : 'block'}>
                                            {word}
                                        </span>
                                    ))}
                                </h1>

                                <div className="mt-8 max-w-xs">
                                    <p className="text-white/60 text-sm md:text-base font-serif italic leading-relaxed pl-6 border-l border-white/10 relative">
                                        <span className="absolute left-0 top-0 text-3xl text-[#941B1B]/40 font-serif">"</span>
                                        {products[currentIndex]?.description || 'Authentic flavors cooked to perfection in traditional clay pots.'}
                                    </p>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="flex flex-wrap items-center gap-8"
                        >
                            <motion.button 
                                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(148, 27, 27, 0.3)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => addToCart(products[currentIndex])}
                                disabled={!isProductAvailable(products[currentIndex])}
                                className="bg-[#941B1B] text-white px-10 py-5 rounded-[2rem] font-bold text-lg shadow-2xl flex items-center gap-6 transition-all group border border-white/10"
                            >
                                <ShoppingBasket size={22} className="group-hover:rotate-12 transition-transform" />
                                <span>Reserve— {products[currentIndex]?.price}</span>
                            </motion.button>
                            
                            <div className="flex flex-col">
                                <span className="text-white/30 text-[10px] uppercase tracking-widest font-bold">Chef's Choice</span>
                                <span className="text-white font-serif text-lg">Claypot Specialty</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Preview Cards Section - Right Zone (Col 9-12) */}
                    <div className="hidden lg:flex items-center justify-end gap-10 lg:col-span-4 lg:col-start-9 h-full pointer-events-auto pr-4">
                        <AnimatePresence mode='popLayout' initial={false}>
                            {previewItems.map((item, idx) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8, x: 50 }}
                                    animate={{ 
                                        opacity: idx === 0 ? 1 : 0.6 - (idx * 0.2), 
                                        x: 0, 
                                        scale: idx === 0 ? 1.2 : 0.9,
                                        zIndex: 10 - idx,
                                        filter: idx === 0 ? 'blur(0px)' : `blur(${idx * 2}px)`
                                    }}
                                    exit={{ opacity: 0, scale: 0.5, x: -100 }}
                                    transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                                    onClick={() => setCurrentIndex(products.findIndex(p => p.id === item.id))}
                                    className={`w-36 h-56 md:w-44 md:h-64 rounded-[3rem] overflow-hidden relative cursor-pointer group flex-shrink-0 bg-white/5 backdrop-blur-3xl border ${idx === 0 ? 'border-[#941B1B]/50' : 'border-white/10'} shadow-[0_40px_80px_rgba(0,0,0,0.5)]`}
                                >
                                    <img src={item.image || DEFAULT_PRODUCT_IMAGE} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out opacity-80 group-hover:opacity-100" alt="" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                                    <div className="absolute bottom-8 left-6 right-6 text-white z-10">
                                        {idx === 0 && <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#941B1B] mb-2 leading-none">Viewing Now</p>}
                                        <h4 className="font-serif font-bold text-lg leading-tight drop-shadow-lg">{item.name}</h4>
                                    </div>
                                    <div className="absolute inset-0 border-[1.5px] border-white/10 rounded-[3rem] pointer-events-none group-hover:border-[#941B1B]/40 transition-colors" />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            {/* Editorial Footer Navigation */}
            <div className="absolute bottom-12 left-6 md:left-20 right-6 md:right-20 z-30 flex items-center justify-between">
                <div className="flex items-center gap-10">
                    <div className="flex gap-4">
                        <motion.button
                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                            whileTap={{ scale: 0.9 }}
                            onClick={prevSlide}
                            className="w-16 h-16 rounded-full border border-white/10 backdrop-blur-xl flex items-center justify-center text-white transition-all shadow-xl"
                        >
                            <ChevronLeft size={28} />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                            whileTap={{ scale: 0.9 }}
                            onClick={nextSlide}
                            className="w-16 h-16 rounded-full border border-white/10 backdrop-blur-xl flex items-center justify-center text-white transition-all shadow-xl"
                        >
                            <ChevronRight size={28} />
                        </motion.button>
                    </div>

                    <div className="hidden md:flex flex-col">
                        <div className="flex items-center gap-3">
                            <span className="text-white font-mono text-3xl tracking-tighter">{String(currentIndex + 1).padStart(2, '0')}</span>
                            <div className="h-px w-16 bg-white/20"></div>
                            <span className="text-white/20 font-mono text-lg">{String(products.length).padStart(2, '0')}</span>
                        </div>
                        <span className="text-white/20 text-[9px] uppercase tracking-[0.4em] font-bold mt-2">Editorial Selection</span>
                    </div>
                </div>

                <div className="hidden lg:flex items-center gap-8">
                    <div className="text-right">
                        <p className="text-white/20 text-[9px] uppercase tracking-[0.4em] font-bold">Current Category</p>
                        <p className="text-white font-serif text-lg">{activeItem?.category || 'Collection'}</p>
                    </div>
                </div>
            </div>

            {/* Enhanced Shopping Basket Drawer */}
            <AnimatePresence>
                {showCart && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-[#0a0a0a]/80 backdrop-blur-2xl z-[100]"
                            onClick={() => setShowCart(false)}
                        />
                        <motion.div
                            initial={{ x: '100%', filter: 'blur(10px)' }}
                            animate={{ x: 0, filter: 'blur(0px)' }}
                            exit={{ x: '100%', filter: 'blur(10px)' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 180 }}
                            className="fixed top-4 right-4 bottom-4 w-full max-w-xl bg-[#0d0d0d] rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] z-[110] overflow-hidden flex flex-col border border-white/5"
                        >
                            <div className="p-12 pb-10 flex justify-between items-center border-b border-white/5">
                                <div>
                                    <h3 className="text-4xl font-serif font-black text-white tracking-tight">Your Cuisine</h3>
                                    <p className="text-[#941B1B] font-bold text-[10px] uppercase tracking-[0.3em] mt-2 italic">Handpicked Heritage Dishes</p>
                                </div>
                                <button onClick={() => setShowCart(false)} className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#941B1B] transition-all group">
                                    <X size={28} className="group-hover:rotate-90 transition-transform duration-500" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
                                {cart.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-30">
                                        <ShoppingBasket size={64} className="text-white" />
                                        <p className="text-white font-serif italic text-2xl text-center px-10">Your basket feels light. Explore the collection.</p>
                                    </div>
                                ) : (
                                    cart.map((item) => (
                                        <motion.div layout key={item.product.id} className="flex gap-8 items-center group">
                                            <div className="w-28 h-28 rounded-[2.5rem] overflow-hidden shadow-2xl flex-shrink-0 relative border border-white/5">
                                                <img src={item.product.image || DEFAULT_PRODUCT_IMAGE} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[#941B1B] text-[8px] font-bold uppercase tracking-[0.4em] mb-1">{item.product.category}</p>
                                                <h4 className="font-serif font-black text-white text-2xl group-hover:text-[#941B1B] transition-colors leading-tight">{item.product.name}</h4>
                                                <p className="text-white/40 font-bold text-lg mt-2">{item.product.price}</p>
                                            </div>
                                            <div className="flex flex-col items-center gap-4 bg-white/5 p-3 rounded-[2rem] border border-white/5">
                                                <button onClick={() => removeFromCart(item.product.id)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-red-500 transition-colors">
                                                    <Minus size={18} />
                                                </button>
                                                <span className="font-bold text-xl text-white min-w-[1.5rem] text-center">{item.quantity}</span>
                                                <button onClick={() => addToCart(item.product)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-[#941B1B] transition-colors">
                                                    <Plus size={18} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>

                            <div className="p-12 bg-white/5 backdrop-blur-3xl space-y-10 border-t border-white/5">
                                <div className="flex justify-between items-end">
                                    <div className="flex flex-col">
                                        <span className="text-white/30 text-[10px] uppercase tracking-[0.5em] font-bold mb-1">Estimated Total</span>
                                        <span className="text-6xl font-serif font-black text-white leading-none tracking-tighter">₹{cartTotal}</span>
                                    </div>
                                    <span className="text-white/30 text-xs italic opacity-60">Handcrafted per order</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    disabled={cart.length === 0}
                                    className="w-full bg-[#25D366] hover:bg-[#1fae53] text-white py-8 rounded-[2.5rem] font-black text-2xl transition-all shadow-[0_20px_50px_rgba(37,211,102,0.3)] flex items-center justify-center gap-6 active:scale-95 disabled:opacity-20 disabled:grayscale"
                                >
                                    <Send size={28} /> Confirm via WhatsApp
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Shopping Cart Floating Button - Editorial Style */}
            <AnimatePresence>
                {cart.length > 0 && !showCart && (
                    <motion.button
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 20 }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowCart(true)}
                        className="fixed bottom-12 right-12 z-[60] w-24 h-24 bg-[#941B1B] text-white rounded-full shadow-[0_30px_60px_rgba(148,27,27,0.4)] flex items-center justify-center border border-white/20"
                    >
                        <ShoppingBasket size={36} />
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 bg-white text-[#941B1B] text-sm font-black w-9 h-9 flex items-center justify-center rounded-full shadow-lg border-4 border-[#941B1B]"
                        >
                            {cart.reduce((a, b) => a + b.quantity, 0)}
                        </motion.span>
                    </motion.button>
                )}
            </AnimatePresence>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
                .font-serif { font-family: 'Playfair Display', serif; }
            `}</style>
        </div>
    );
};

export default MenuPage;
