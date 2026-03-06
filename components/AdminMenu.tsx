import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Product, Category } from '../types';
import { Plus, Edit2, Trash2, X, Save, Image as ImageIcon, Upload, Loader2, LayoutGrid, List } from 'lucide-react';

const AdminMenu: React.FC = () => {
    const [items, setItems] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]); // Dynamic Categories
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [currentItem, setCurrentItem] = useState<Partial<Product>>({
        name: '',
        price: '',
        description: '',
        image: '',
        category: '',
        type: 'non-veg',
        isHighlighted: false,
        highlightTagline: '',
        startTime: '',
        endTime: ''
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

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const storageRef = ref(storage, `menu_items/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            setCurrentItem({ ...currentItem, image: downloadURL });
        } catch (error: any) {
            console.error("Error uploading image:", error);
            if (error.code === 'storage/unauthorized') {
                alert("Upload failed: Permission denied. Please check your Firebase Storage Rules.");
            } else {
                alert(`Failed to upload image: ${error.message || 'Unknown error'}`);
            }
        } finally {
            setUploading(false);
        }
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
            highlightTagline: '',
            startTime: '',
            endTime: ''
        });
    };

    return (
        <div className="p-6 md:p-8 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Menu Management</h2>
                    <p className="text-slate-500">Add, edit, or remove dishes from the website.</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            title="Grid View"
                        >
                            <LayoutGrid size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            title="List View"
                        >
                            <List size={20} />
                        </button>
                    </div>
                    <button
                        onClick={() => { resetForm(); setIsEditing(true); }}
                        className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-sky-600/20 whitespace-nowrap"
                    >
                        <Plus size={20} /> Add New Dish
                    </button>
                </div>
            </div>

            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-auto flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-900">{currentItem.id ? 'Edit Dish' : 'New Dish'}</h3>
                            <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
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
                                <label className="text-xs font-bold text-slate-400 uppercase">Dish Image</label>
                                <div className="flex gap-4 items-center">
                                    <div className="flex-1">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all group overflow-hidden relative">
                                            {uploading ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
                                                    <span className="text-xs font-bold text-sky-600 uppercase">Uploading...</span>
                                                </div>
                                            ) : currentItem.image ? (
                                                <img src={currentItem.image} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-sky-600 transition-colors mb-2" />
                                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Click to upload image</p>
                                                </div>
                                            )}
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                                        </label>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Or Paste URL</label>
                                        <input
                                            value={currentItem.image}
                                            onChange={e => setCurrentItem({ ...currentItem, image: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-sky-500 focus:bg-white outline-none transition-all font-mono text-xs"
                                            placeholder="https://..."
                                        />
                                    </div>
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

                            <div className="grid grid-cols-2 gap-6 pb-4 border-b border-slate-100">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Available From (Optional)</label>
                                    <input
                                        type="time"
                                        value={currentItem.startTime || ''}
                                        onChange={e => setCurrentItem({ ...currentItem, startTime: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-sky-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Available Until (Optional)</label>
                                    <input
                                        type="time"
                                        value={currentItem.endTime || ''}
                                        onChange={e => setCurrentItem({ ...currentItem, endTime: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-sky-500 outline-none transition-all"
                                    />
                                </div>
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
                viewMode === 'grid' ? (
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
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dish</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Type</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Price</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {items.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                                                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 flex items-center gap-2">
                                                        {item.name}
                                                        {item.isHighlighted && (
                                                            <span className="inline-flex w-2 h-2 rounded-full bg-amber-500" title="Featured"></span>
                                                        )}
                                                    </p>
                                                    <p className="text-xs text-slate-400 line-clamp-1 max-w-[200px]">{item.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-block w-2 h-2 rounded-full ${item.type === 'veg' ? 'bg-green-500' : 'bg-red-500'}`} title={item.type}></span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="font-bold text-slate-900 font-serif">{item.price}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-sky-600 hover:border-sky-100 transition-all shadow-sm"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-red-500 hover:border-red-100 transition-all shadow-sm"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            )}
        </div>
    );
};

export default AdminMenu;
