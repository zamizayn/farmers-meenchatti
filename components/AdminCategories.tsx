import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Category } from '../types';
import { Plus, Trash2, Tag } from 'lucide-react';

const AdminCategories: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'categories'), orderBy('name'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Category[];
            setCategories(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        try {
            await addDoc(collection(db, 'categories'), {
                name: newCategory.trim()
            });
            setNewCategory('');
        } catch (error) {
            console.error("Error adding category:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Delete this category?')) {
            await deleteDoc(doc(db, 'categories', id));
        }
    };

    return (
        <div className="p-6 md:p-8 h-full overflow-y-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Category Management</h2>
                <p className="text-slate-500">Create new categories for your menu items.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 max-w-xl">
                <form onSubmit={handleAdd} className="flex gap-4">
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="e.g. Starters, Beverages"
                        className="flex-1 bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:border-sky-500 transition-all font-semibold"
                    />
                    <button
                        type="submit"
                        disabled={!newCategory.trim()}
                        className="bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center gap-2"
                    >
                        <Plus size={20} /> Add
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 sc:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {loading ? (
                    <p className="text-slate-400">Loading categories...</p>
                ) : categories.length === 0 ? (
                    <p className="text-slate-400 italic col-span-full">No categories found. Add your first one above!</p>
                ) : (
                    categories.map((cat) => (
                        <div key={cat.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
                                    <Tag size={18} />
                                </div>
                                <span className="font-bold text-slate-700 capitalize">{cat.name}</span>
                            </div>
                            <button
                                onClick={() => handleDelete(cat.id)}
                                className="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-slate-50 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminCategories;
