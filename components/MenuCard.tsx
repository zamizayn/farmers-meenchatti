import React, { useEffect, useState, useMemo } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Product } from '../types';
import { PRODUCTS } from '../constants'; // Fallback
import { X, ShoppingBasket, Plus, Minus, Send } from 'lucide-react';
import { isProductAvailable } from '../utils/timeUtils';

interface MenuCardProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ isOpen, onClose }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<{ product: Product, quantity: number }[]>([]);
  const [showCart, setShowCart] = useState(false);

  // Fetch products when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchMenu = async () => {
        setLoading(true);
        try {
          // Fetch all menu items
          const q = query(collection(db, 'menu_items'), orderBy('category'));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const fetchedProducts = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as Product[];
            setProducts(fetchedProducts);
          } else {
            // Fallback handled nicely by showing empty state or existing static if you preferred, 
            // but user wants DB data. We will show empty state if DB is empty.
            setProducts([]);
          }
        } catch (error) {
          console.error("Error fetching menu for card:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchMenu();
    }
  }, [isOpen]);

  const categories = useMemo(() => {
    const grouped = products.reduce((acc, item) => {
      // Capitalize first letter of category for display key if needed, or just use as is
      const cat = item.category || 'Other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {} as Record<string, Product[]>);

    // Convert to array and sort categories if needed (e.g. customized order)
    // For now, Object.entries is sufficient, maybe sorting keys alphabetically or predefined order
    return Object.entries(grouped).sort((a, b) => a[0].localeCompare(b[0]));
  }, [products]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map(item =>
          item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter(item => item.product.id !== productId);
    });
  };

  const cartTotal = cart.reduce((total, item) => {
    const price = parseInt(item.product.price.replace(/[^\d]/g, '')) || 0;
    return total + (price * item.quantity);
  }, 0);

  const handleCheckout = () => {
    const phoneNumber = "919778702863"; // Same as reservation phone
    let message = `* Order from Website *\n\nItems: \n`;
    cart.forEach(item => {
      message += `- ${item.product.name} x ${item.quantity} (${item.product.price})\n`;
    });
    message += `\n*Total: ₹${cartTotal}*\n\nPlease confirm availability and let me know the estimated time!`;

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/90 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Menu Modal */}
      <div className="relative w-full max-w-6xl h-full max-h-[90vh] bg-[#f0f9ff] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">

        {/* Header */}
        <div className="p-8 md:p-8 border-b border-sky-100 flex justify-between items-center bg-white sticky top-0 z-10 shrink-0">
          <div className="space-y-1">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900">Grand Menu</h2>
            <p className="text-sky-600 font-bold uppercase tracking-[0.2em] text-xs">Farmers Meenchatti Heritage</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative p-3 bg-sky-50 rounded-2xl text-sky-700 hover:bg-sky-600 hover:text-white transition-all group"
            >
              <ShoppingBasket size={24} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-sky-950 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white scale-110 group-hover:scale-125 transition-transform">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>
            <button
              onClick={onClose}
              className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-16 custom-scrollbar bg-slate-50/50">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
              <p className="text-slate-400 font-medium animate-pulse">Loading menu...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-slate-500 text-lg">Our menu is currently being updated.</p>
              <p className="text-slate-400 text-sm">Please check back soon.</p>
            </div>
          ) : (
            categories.map(([category, items]) => (
              <div key={category} className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-6 sticky top-0 bg-[#f0f9ff]/95 backdrop-blur py-4 z-10 border-b border-sky-100/50">
                  <h3 className="text-2xl font-serif font-bold text-slate-900 capitalize italic flex items-center gap-3">
                    {category === 'curry' && '🥘'}
                    {category === 'claypot' && '🏺'}
                    {category === 'sides' && '🍚'}
                    {category === 'dessert' && '🍰'}
                    {category === 'special' && '✨'}
                    {category}
                  </h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-sky-200 to-transparent"></div>
                </div>

                <div className="grid md:grid-cols-2 gap-x-12 gap-y-12">
                  {items.map((item) => (
                    <div key={item.id} className="group flex gap-5 items-start bg-white p-4 rounded-3xl shadow-sm border border-slate-100/50 hover:shadow-md hover:border-sky-100 transition-all duration-300">
                      <div className="w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0 shadow-md relative">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                        <div className="absolute top-2 left-2">
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center bg-white/90 backdrop-blur shadow-sm border ${item.type === 'veg' ? 'border-green-200' : 'border-red-200'}`}>
                            <div className={`w-2.5 h-2.5 rounded-full ${item.type === 'veg' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 space-y-2 min-h-[7rem] flex flex-col">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors leading-tight">{item.name}</h4>
                          <span className="font-serif font-bold text-slate-900 text-lg whitespace-nowrap">{item.price}</span>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed italic line-clamp-2">{item.description}</p>

                        {item.startTime && item.endTime && (
                          <p className="text-[10px] font-bold text-sky-600/60 uppercase tracking-widest">
                            Available: {item.startTime} - {item.endTime}
                          </p>
                        )}

                        {!isProductAvailable(item) && (
                          <div className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded-md border border-red-100 mt-1 self-start animate-pulse">
                            Currently Unavailable
                          </div>
                        )}

                        <div className="mt-auto pt-4 flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none bg-slate-50 px-2 py-1 rounded-md">{item.category}</span>
                          <button
                            onClick={() => addToCart(item)}
                            disabled={!isProductAvailable(item)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-2 ${isProductAvailable(item)
                              ? 'bg-sky-600 hover:bg-sky-950 text-white'
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                              }`}
                          >
                            <Plus size={14} /> {isProductAvailable(item) ? 'Add' : 'Unavailable'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}

          {/* Special Footer Note */}
          {!loading && products.length > 0 && (
            <div className="pt-10 text-center">
              <div className="inline-block bg-white border border-sky-100 px-8 py-4 rounded-3xl shadow-sm">
                <p className="text-slate-600 text-sm">
                  <span className="text-sky-700 font-bold">Chef's Note:</span> Our curries are best enjoyed with hot Appam or Kerala Parotta. All dishes are slow-cooked in traditional clay pots.
                </p>
              </div>
            </div>
          )}
        </div>


        {/* Cart Overlay / Drawer */}
        {showCart && (
          <div className="absolute inset-0 z-20 flex justify-end animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowCart(false)}></div>
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right-10 duration-500">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-sky-50 text-sky-700 rounded-xl flex items-center justify-center">
                    <ShoppingBasket size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 leading-none">Your Basket</h3>
                    <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-widest">Confirm your selection</p>
                  </div>
                </div>
                <button onClick={() => setShowCart(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                  <X className="text-slate-400" size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                      <ShoppingBasket size={40} />
                    </div>
                    <div>
                      <p className="text-slate-900 font-bold">Your basket is empty</p>
                      <p className="text-slate-400 text-sm">Add some clay pot deliciousness!</p>
                    </div>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.product.id} className="flex gap-4 items-center">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 text-sm truncate">{item.product.name}</h4>
                        <p className="text-sky-600 font-bold text-sm tracking-tight">{item.product.price}</p>
                      </div>
                      <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-1 px-2">
                        <button onClick={() => removeFromCart(item.product.id)} className="p-1 hover:bg-white hover:text-red-500 rounded-lg transition-all">
                          <Minus size={14} />
                        </button>
                        <span className="font-bold text-sm min-w-[1rem] text-center">{item.quantity}</span>
                        <button onClick={() => addToCart(item.product)} className="p-1 hover:bg-white hover:text-sky-600 rounded-lg transition-all">
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 bg-slate-50 border-t border-slate-100 space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Estimated Total</span>
                    <span className="text-2xl font-serif font-bold text-slate-900">₹{cartTotal}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-5 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-green-100 flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                    <Send size={20} /> Checkout on WhatsApp
                  </button>
                  <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">Available for Home Delivery & Takeaway</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-6 md:p-8 bg-sky-950 text-white flex justify-between items-center shrink-0">
          <p className="text-xs md:text-sm font-medium opacity-60 italic">Authentic Heritage • Handcrafted Spices • Coastal Tradition</p>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-sky-400 font-bold uppercase tracking-[0.2em] hidden md:block">Est. 2024</span>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #bae6fd;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #7dd3fc;
        }
      `}</style>
    </div >
  );
};

export default MenuCard;
