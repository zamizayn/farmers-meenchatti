import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface MenuImageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuImageModal: React.FC<MenuImageModalProps> = ({ isOpen, onClose }) => {
  const [menuImageUrl, setMenuImageUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const docRef = doc(db, 'settings', 'general');
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists() && docSnap.data().menuImageUrl) {
          setMenuImageUrl(docSnap.data().menuImageUrl);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [isOpen]);

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

        <div className="w-full bg-white rounded-3xl shadow-2xl overflow-y-auto max-h-full scrollbar-hide flex flex-col items-center justify-center min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Menu...</p>
            </div>
          ) : menuImageUrl ? (
            <img
              src={menuImageUrl}
              alt="Farmers Meenchatti Food Menu"
              className="w-full h-auto object-contain p-2"
            />
          ) : (
            <div className="p-20 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📜</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Menu Image Uploaded</h3>
              <p className="text-slate-500 max-w-xs mx-auto">Please upload a menu image from the Admin Settings to display it here.</p>
            </div>
          )}

          {menuImageUrl && (
            <div className="w-full p-8 text-center bg-sky-950 text-white mt-auto">
              <h3 className="text-xl font-serif italic mb-2">Our Full Authentic Catch</h3>
              <p className="text-sky-300 text-sm opacity-60">Prices and availability may vary based on the daily catch.</p>
            </div>
          )}
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
