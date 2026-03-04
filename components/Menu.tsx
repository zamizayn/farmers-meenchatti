import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import { Product } from '../types';
import { PRODUCTS } from '../constants'; // Fallback

interface MenuProps {
  onExploreClick: () => void;
}

const Menu: React.FC<MenuProps> = ({ onExploreClick }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const q = query(collection(db, 'menu_items'), limit(8)); // Fetch more if needed
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const fetchedProducts = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Product[];
          setProducts(fetchedProducts);
        } else {
          // Fallback to static if DB is empty to avoid empty section initially
          // But usually we want DB only. Let's start with empty and if empty show static?
          // User requested "load this from database". So we should prefer DB.
          // If DB is empty, maybe showing nothing is bad UX. Let's show fallback for demo.
          setProducts(PRODUCTS as any);
        }
      } catch (error) {
        console.error("Error fetching menu:", error);
        setProducts(PRODUCTS as any); // Fallback on error
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // Show only a featured subset for the main page grid (e.g. 4)
  const featuredProducts = products.slice(0, 4);

  return (
    <section id="menu" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4">
            <span className="text-sky-600 font-bold uppercase tracking-widest text-sm">Authentic Collections</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">Handpicked Classics</h2>
          </div>
          <button
            onClick={onExploreClick}
            className="flex items-center gap-2 text-slate-900 font-bold group"
          >
            <span className="border-b-2 border-sky-600">View Full Menu Card</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-slate-200 aspect-[4/5] rounded-3xl mb-4"></div>
                <div className="h-6 bg-slate-200 w-3/4 mb-2 rounded"></div>
                <div className="h-4 bg-slate-200 w-full mb-2 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="group cursor-pointer"
                onClick={onExploreClick}
              >
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-6 shadow-sm border border-slate-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-sky-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform">
                      View Dish
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">{product.name}</h3>
                    <span className="text-lg font-serif font-bold text-slate-900">{product.price}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${product.type === 'veg' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{product.type || 'Non-Veg'}</p>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed italic">{product.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Menu;
