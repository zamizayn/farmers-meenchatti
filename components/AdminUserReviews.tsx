import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Plus, Edit2, Trash2, X, Save, MessageCircle, Star } from 'lucide-react';

export interface Review {
    id: string;
    name: string;
    location: string;
    rating: number;
    text: string;
    dish: string;
    avatar: string;
}

const AdminUserReviews: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentReview, setCurrentReview] = useState<Partial<Review>>({
        name: '',
        location: '',
        rating: 5,
        text: '',
        dish: '',
        avatar: 'https://i.pravatar.cc/150'
    });

    useEffect(() => {
        const q = query(collection(db, 'reviews'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Review[];
            setReviews(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (currentReview.id) {
                const docRef = doc(db, 'reviews', currentReview.id);
                const { id, ...data } = currentReview;
                await updateDoc(docRef, data as any);
            } else {
                await addDoc(collection(db, 'reviews'), currentReview);
            }
            setIsEditing(false);
            resetForm();
        } catch (error) {
            console.error("Error saving review:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Delete this review?')) {
            await deleteDoc(doc(db, 'reviews', id));
        }
    };

    const resetForm = () => {
        setCurrentReview({
            name: '',
            location: '',
            rating: 5,
            text: '',
            dish: '',
            avatar: `https://i.pravatar.cc/150?u=${Math.random()}`
        });
    };

    return (
        <div className="p-6 md:p-8 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">User Reviews</h2>
                    <p className="text-slate-500">Manage customer testimonials.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsEditing(true); }}
                    className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-sky-600/20"
                >
                    <Plus size={20} /> Add Review
                </button>
            </div>

            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-900">{currentReview.id ? 'Edit Review' : 'New Review'}</h3>
                            <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Customer Name</label>
                                    <input
                                        required
                                        value={currentReview.name}
                                        onChange={e => setCurrentReview({ ...currentReview, name: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-sky-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Location</label>
                                    <input
                                        required
                                        value={currentReview.location}
                                        onChange={e => setCurrentReview({ ...currentReview, location: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-sky-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Dish Ordered</label>
                                    <input
                                        required
                                        value={currentReview.dish}
                                        onChange={e => setCurrentReview({ ...currentReview, dish: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-sky-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Rating (1-5)</label>
                                    <select
                                        value={currentReview.rating}
                                        onChange={e => setCurrentReview({ ...currentReview, rating: Number(e.target.value) })}
                                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-sky-500 outline-none"
                                    >
                                        {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Stars</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase">Review Text</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={currentReview.text}
                                    onChange={e => setCurrentReview({ ...currentReview, text: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-sky-500 outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase">Avatar URL</label>
                                <input
                                    value={currentReview.avatar}
                                    onChange={e => setCurrentReview({ ...currentReview, avatar: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-sky-500 outline-none text-xs font-mono"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="submit" className="flex-1 bg-sky-900 text-white py-3 rounded-xl font-bold hover:bg-sky-800 transition-all">Save Review</button>
                                <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-all">Cancel</button>
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
                    {reviews.map(review => (
                        <div key={review.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4 group hover:shadow-md transition-all">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full bg-slate-100 object-cover" />
                                    <div>
                                        <h3 className="font-bold text-slate-900">{review.name}</h3>
                                        <p className="text-xs text-slate-500">{review.location}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => { setCurrentReview(review); setIsEditing(true); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-sky-600 transition-all"><Edit2 size={14} /></button>
                                    <button onClick={() => handleDelete(review.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
                                </div>
                            </div>

                            <div className="flex text-amber-400 text-sm">
                                {Array.from({ length: review.rating }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                            </div>

                            <p className="text-slate-600 text-sm leading-relaxed italic">"{review.text}"</p>

                            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center gap-2">
                                <span className="bg-sky-50 text-sky-700 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">{review.dish}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminUserReviews;
