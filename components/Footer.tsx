
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 py-20 border-t border-slate-200">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-white">
                <img 
                  src="https://www.farmersmeenchatti.in/img/logo-sm.jpg" 
                  alt="Farmers Meenchatti Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-slate-900">Farmers Meenchatti</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Bringing the authentic taste of Kerala's heritage to your doorstep. Every bite tells a story of tradition, spices, and clay.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Navigation</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-sky-700 transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-sky-700 transition-colors">Menu</a></li>
              <li><a href="#" className="hover:text-sky-700 transition-colors">Sustainability</a></li>
              <li><a href="#" className="hover:text-sky-700 transition-colors">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Support</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-sky-700 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-sky-700 transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-sky-700 transition-colors">Return Policy</a></li>
              <li><a href="#" className="hover:text-sky-700 transition-colors">Wholesale</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Newsletter</h4>
            <p className="text-sm text-slate-500 mb-4">Subscribe to get spicy updates and recipes.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-white border border-slate-200 px-4 py-2 rounded-l-lg focus:outline-none focus:border-sky-700 flex-1"
              />
              <button className="bg-sky-700 text-white px-4 py-2 rounded-r-lg hover:bg-sky-800 transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-xs">
          <p>© 2024 Farmers Meenchatti. Handcrafted with love in Kerala.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-sky-700 transition-colors">Instagram</a>
            <a href="#" className="hover:text-sky-700 transition-colors">Facebook</a>
            <a href="#" className="hover:text-sky-700 transition-colors">YouTube</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
