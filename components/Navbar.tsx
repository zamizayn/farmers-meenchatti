import React, { useState, useEffect } from 'react';
import { NAV_ITEMS } from '../constants';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoUrl, setLogoUrl] = useState('https://www.farmersmeenchatti.in/img/logo-sm.jpg');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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
    if (href === '#menu') {
      e.preventDefault();
      onMenuClick();
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm py-4' : 'bg-transparent py-6'
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
            Farmers <span className="text-sky-600">Meenchatti</span>
          </span>
        </a>

        <div className="hidden md:flex gap-8 items-center">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleLinkClick(e, item.href)}
              className="text-slate-600 hover:text-sky-600 font-medium transition-colors text-sm uppercase tracking-wider"
            >
              {item.label}
            </a>
          ))}
          <button
            onClick={onMenuClick}
            className="bg-sky-600 text-white px-6 py-2.5 rounded-full hover:bg-sky-700 transition-all shadow-lg hover:shadow-sky-600/20 active:scale-95"
          >
            Order Now
          </button>
        </div>

        <button className="md:hidden text-slate-900">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
