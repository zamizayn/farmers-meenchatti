
import React from 'react';

interface MenuImageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuImageModal: React.FC<MenuImageModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Image Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 md:-right-12 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="w-full bg-white rounded-3xl overflow-hidden shadow-2xl overflow-y-auto max-h-full scrollbar-hide">
          {/* Using a high-quality vertical menu mockup or placeholder */}
          <img 
            src="https://images.unsplash.com/photo-1546241072-48010ad28c2c?q=80&w=1200&auto=format&fit=crop" 
            alt="Farmers Meenchatti Food Menu" 
            className="w-full h-auto object-contain"
          />
          {/* Content overlay just for styling if it was a real image */}
          <div className="p-8 text-center bg-sky-950 text-white">
            <h3 className="text-xl font-serif italic mb-2">Our Full Authentic Catch</h3>
            <p className="text-sky-300 text-sm opacity-60">Prices and availability may vary based on the daily catch.</p>
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default MenuImageModal;
