
import React from 'react';



import { db } from '../firebase';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';

const DEFAULT_HIGHLIGHTS = [

];

interface SignatureHighlightsProps {
  onSeeAllClick: () => void;
}

const SignatureHighlights: React.FC<SignatureHighlightsProps> = ({ onSeeAllClick }) => {
  const [highlights, setHighlights] = React.useState<any[]>(DEFAULT_HIGHLIGHTS);

  React.useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const q = query(collection(db, 'menu_items'), where('isHighlighted', '==', true), limit(3));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const fetchedDocs = querySnapshot.docs.map(doc => doc.data());
          setHighlights(fetchedDocs);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchHighlights();
  }, []);
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
          <div className="text-left">
            <span className="text-sky-600 font-bold uppercase tracking-[0.2em] text-sm mb-4 block">Signature Catch</span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 leading-tight">
              Major Highlights
            </h2>
          </div>
          <button
            onClick={onSeeAllClick}
            className="group flex items-center gap-4 bg-sky-50 text-sky-700 px-8 py-4 rounded-2xl font-bold hover:bg-sky-600 hover:text-white transition-all shadow-sm active:scale-95"
          >
            See Full Menu Image
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {highlights.map((item, i) => (
            <div key={i} className="group relative bg-slate-50 rounded-[3rem] p-4 transition-all hover:bg-white hover:shadow-2xl hover:shadow-sky-100 border border-transparent hover:border-sky-50">
              <div className="aspect-[4/5] overflow-hidden rounded-[2.5rem] mb-8 relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg">
                  <span className="text-slate-900 font-bold font-serif">{item.price}</span>
                </div>
                {/* Overlay for interaction */}
                <div className="absolute inset-0 bg-sky-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={onSeeAllClick} className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    Quick Look
                  </button>
                </div>
              </div>
              <div className="px-4 pb-4">
                <p className="text-sky-600 text-xs font-bold uppercase tracking-widest mb-1">{item.highlightTagline || "Signature Dish"}</p>
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">{item.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SignatureHighlights;
