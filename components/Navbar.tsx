import React, { useState, useEffect } from 'react';
import { NAV_ITEMS } from '../constants';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState('https://www.farmersmeenchatti.in/img/logo-sm.jpg');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const docRef = doc(db, 'settings', 'general');
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists() && doc.data().logoUrl) {
        setLogoUrl(doc.data().logoUrl);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsMobileMenuOpen(false); // Close mobile menu when a link is clicked
    if (href === '#menu') {
      e.preventDefault();
      onMenuClick();
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-4' : 'bg-transparent py-6'
      }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md group-hover:scale-110 transition-transform duration-300 border border-sky-100 bg-white">
            <img
              src={logoUrl}
              alt="Farmers Meenchatti Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <span className={`font-serif text-2xl font-bold tracking-tight transition-colors text-slate-900`}>
            Farmers <span className="text-[#941B1B]">Meenchatti</span>
          </span>
        </a>

        <div className="hidden md:flex gap-8 items-center">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleLinkClick(e, item.href)}
              className="text-slate-600 hover:text-[#941B1B] font-medium transition-colors text-sm uppercase tracking-wider"
            >
              {t(`nav_${item.label.toLowerCase().replace(' ', '_')}`)}
            </a>
          ))}


          <button
            onClick={onMenuClick}
            className="bg-[#941B1B] text-white px-6 py-2.5 rounded-full hover:bg-[#7a1616] transition-all shadow-lg hover:shadow-[#941B1B]/20 active:scale-95"
          >
            Order Now
          </button>
        </div>

        <button 
          className="md:hidden text-slate-900 focus:outline-none z-50 relative" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white flex flex-col pt-24 px-6 animate-in fade-in slide-in-from-right duration-300">
          <div className="flex flex-col space-y-6">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className="text-slate-900 border-b border-sky-50 pb-4 font-serif font-bold transition-colors text-2xl tracking-wide block"
              >
                {t(`nav_${item.label.toLowerCase().replace(' ', '_')}`)}
              </a>
            ))}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onMenuClick();
              }}
              className="bg-[#941B1B] text-white px-6 py-4 rounded-xl hover:bg-[#7a1616] transition-all font-bold mt-8 shadow-lg w-full text-center text-lg shadow-[#941B1B]/20 active:scale-95"
            >
              Order Now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
