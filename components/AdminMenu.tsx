import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Product, Category } from '../types';
import { Plus, Edit2, Trash2, X, Save, Image as ImageIcon } from 'lucide-react';

const AdminMenu: React.FC = () => {
    const [items, setItems] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]); // Dynamic Categories
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState<Partial<Product>>({
        name: '',
        price: '',
        description: '',
        image: '',
        category: '',
        type: 'non-veg',
        isHighlighted: false,
        highlightTagline: ''
    });

    useEffect(() => {
        // Fetch Menu Items
        const qItems = query(collection(db, 'menu_items'), orderBy('name'));
        const unsubscribeItems = onSnapshot(qItems, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Product[];
            setItems(data);
            setLoading(false);
        });

        // Fetch Categories
        const qCats = query(collection(db, 'categories'), orderBy('name'));
        const unsubscribeCats = onSnapshot(qCats, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Category[];
            setCategories(data);

            // Set default category if not set and categories exist
            if (data.length > 0) {
                setCurrentItem(prev => !prev.category ? { ...prev, category: data[0].name } : prev);
            }
        });

        return () => {
            unsubscribeItems();
            unsubscribeCats();
        };
    }, []);

    // Ensure currentItem has a default category if categories are loaded and it's empty
    useEffect(() => {
        if (!currentItem.category && categories.length > 0) {
            setCurrentItem(prev => ({ ...prev, category: categories[0].name }));
        }
    }, [categories, currentItem.category]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentItem.name || !currentItem.price) return;

        try {
            if (currentItem.id) {
                // Update
                const docRef = doc(db, 'menu_items', currentItem.id);
                const { id, ...data } = currentItem;
                await updateDoc(docRef, data as any);
            } else {
                // Create
                await addDoc(collection(db, 'menu_items'), currentItem);
            }
            setIsEditing(false);
            resetForm();
        } catch (error) {
            console.error("Error saving menu item:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Delete this menu item?')) {
            await deleteDoc(doc(db, 'menu_items', id));
        }
    };

    const handleEdit = (item: Product) => {
        setCurrentItem(item);
        setIsEditing(true);
    };

    const resetForm = () => {
        setCurrentItem({
            name: '',
            price: '',
            description: '',
            image: '',
            category: categories.length > 0 ? categories[0].name : '',
            type: 'non-veg',
            isHighlighted: false,
            highlightTagline: ''
        });
    };

    return (
        <div className="p-6 md:p-8 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Menu Management</h2>
                    <p className="text-slate-500">Add, edit, or remove dishes from the website.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsEditing(true); }}
                    className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-sky-600/20"
                >
                    <Plus size={20} /> Add New Dish
                </button>
            </div>

            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-900">{currentItem.id ? 'Edit Dish' : 'New Dish'}</h3>
                            <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Dish Name</label>
                                    <input
                                        required
                                        value={currentItem.name}
                                        onChange={e => setCurrentItem({ ...currentItem, name: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-sky-500 focus:bg-white outline-none transition-all font-semibold"
                                        placeholder="e.g. Fish Curry"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Price</label>
                                    <input
                                        required
                                        value={currentItem.price}
                                        onChange={e => setCurrentItem({ ...currentItem, price: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-sky-500 focus:bg-white outline-none transition-all font-semibold"
                                        placeholder="e.g. ₹549"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase">Image URL (Link)</label>
                                <div className="flex gap-2">
                                    <input
                                        required
                                        value={currentItem.image}
                                        onChange={e => setCurrentItem({ ...currentItem, image: e.target.value })}
                                        className="flex-1 bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-sky-500 focus:bg-white outline-none transition-all font-mono text-xs"
                                        placeholder="https://..."
                                    />
                                    {currentItem.image && (
                                        <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                                            <img src={currentItem.image} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase">Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={currentItem.description}
                                    onChange={e => setCurrentItem({ ...currentItem, description: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-sky-500 focus:bg-white outline-none transition-all text-sm"
                                    placeholder="Describe the ingredients and taste..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Category</label>
                                    <select
                                        value={currentItem.category}
                                        onChange={e => setCurrentItem({ ...currentItem, category: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-sky-500 focus:bg-white outline-none transition-all capitalize"
                                    >
                                        {categories.length === 0 ? (
                                            <option disabled>No categories available</option>
                                        ) : (
                                            categories.map((cat) => (
                                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                                            ))
                                        )}
                                    </select>
                                    {categories.length === 0 && <p className="text-xs text-red-500">Please add categories first!</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Type</label>
                                    <div className="flex gap-4 pt-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="type"
                                                checked={currentItem.type === 'veg'}
                                                onChange={() => setCurrentItem({ ...currentItem, type: 'veg' })}
                                                className="accent-green-600"
                                            />
                                            <span className="text-sm font-bold text-green-700">Veg</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="type"
                                                checked={currentItem.type === 'non-veg'}
                                                onChange={() => setCurrentItem({ ...currentItem, type: 'non-veg' })}
                                                className="accent-red-600"
                                            />
                                            <span className="text-sm font-bold text-red-700">Non-Veg</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={currentItem.isHighlighted || false}
                                            onChange={e => setCurrentItem({ ...currentItem, isHighlighted: e.target.checked })}
                                            className="peer sr-only"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                                    </div>
                                    <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">Feature as Major Highlight</span>
                                </label>

                                {currentItem.isHighlighted && (
                                    <div className="animate-in slide-in-from-top-2 fade-in duration-200">
                                        <label className="text-xs font-bold text-slate-400 uppercase">Highlight Tagline</label>
                                        <input
                                            value={currentItem.highlightTagline || ''}
                                            onChange={e => setCurrentItem({ ...currentItem, highlightTagline: e.target.value })}
                                            className="w-full bg-amber-50 border border-amber-200 p-3 rounded-xl focus:border-amber-500 focus:bg-white outline-none transition-all mt-1"
                                            placeholder="e.g. The Heart of Kottayam"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 bg-sky-900 text-white py-3 rounded-xl font-bold hover:bg-sky-800 transition-all flex items-center justify-center gap-2"
                                >
                                    <Save size={18} /> Save Item
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center p-20">
                    <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                            <div className="relative h-48 bg-slate-100 overflow-hidden">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-3 right-3 flex gap-2">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="w-8 h-8 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center text-slate-700 hover:text-sky-600 shadow-sm transition-colors"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="w-8 h-8 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center text-slate-700 hover:text-red-500 shadow-sm transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <div className="absolute bottom-3 left-3">
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${item.type === 'veg'
                                        ? 'bg-green-500/90 text-white border-green-600'
                                        : 'bg-red-500/90 text-white border-red-600'
                                        }`}>
                                        {item.type}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-slate-900 text-lg">{item.name}</h3>
                                    <span className="text-sky-700 font-bold font-serif">{item.price}</span>
                                </div>
                                <p className="text-slate-500 text-sm line-clamp-2 mb-4 h-10">{item.description}</p>
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <span className="bg-slate-100 px-2 py-1 rounded-md">{item.category}</span>
                                    {item.isHighlighted && (
                                        <span className="bg-amber-100 text-amber-600 px-2 py-1 rounded-md flex items-center gap-1 border border-amber-200">
                                            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                            Featured
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminMenu;
