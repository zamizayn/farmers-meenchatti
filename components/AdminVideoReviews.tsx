import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { VideoReview } from '../types';
import { Plus, Trash2, Youtube, ExternalLink } from 'lucide-react';

const AdminVideoReviews: React.FC = () => {
    const [videos, setVideos] = useState<VideoReview[]>([]);
    const [name, setName] = useState('');
    const [link, setLink] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'video_reviews'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as VideoReview[];
            setVideos(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !link.trim()) return;

        try {
            await addDoc(collection(db, 'video_reviews'), {
                name: name.trim(),
                youtubeLink: link.trim(),
                createdAt: serverTimestamp()
            });
            setName('');
            setLink('');
        } catch (error) {
            console.error("Error adding video:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Delete this video review?')) {
            await deleteDoc(doc(db, 'video_reviews', id));
        }
    };

    return (
        <div className="p-6 md:p-8 h-full overflow-y-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Video Reviews Management</h2>
                <p className="text-slate-500">Add YouTube links to display customer reviews on the dashboard.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 max-w-2xl">
                <form onSubmit={handleAdd} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase">Reviewer Name / Title</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Foodie Kerala Review"
                                className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:border-sky-500 transition-all font-semibold"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase">YouTube Link</label>
                            <input
                                type="text"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder="https://youtu.be/..."
                                className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:border-sky-500 transition-all font-mono text-xs"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={!name.trim() || !link.trim()}
                        className="w-full bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Plus size={20} /> Add Video Review
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="text-slate-400">Loading videos...</p>
                ) : videos.length === 0 ? (
                    <p className="text-slate-400 italic col-span-full">No video reviews found.</p>
                ) : (
                    videos.map((video) => (
                        <div key={video.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm group">
                            <div className="bg-slate-100 p-4 border-b border-slate-100 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                                    <Youtube size={20} />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <h4 className="font-bold text-slate-900 truncate">{video.name}</h4>
                                    <a href={video.youtubeLink} target="_blank" rel="noreferrer" className="text-xs text-sky-600 hover:underline flex items-center gap-1 truncate">
                                        {video.youtubeLink} <ExternalLink size={10} />
                                    </a>
                                </div>
                            </div>
                            <div className="p-3 bg-slate-50 flex justify-end">
                                <button
                                    onClick={() => handleDelete(video.id)}
                                    className="text-slate-400 hover:text-red-500 text-sm font-bold flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all"
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminVideoReviews;
