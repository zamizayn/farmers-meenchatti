import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Globe,
    FileText,
    Save,
    X,
    ExternalLink,
    AlertCircle
} from 'lucide-react';

interface Page {
    id: string;
    slug: string;
    title: string;
    description: string;
    content: string;
    lastmod: string;
}

const AdminPages: React.FC = () => {
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingPage, setEditingPage] = useState<Partial<Page> | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const q = query(collection(db, 'pages'), orderBy('lastmod', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const pageData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Page[];
            setPages(pageData);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPage?.slug || !editingPage?.title) {
            alert("Slug and Title are required!");
            return;
        }

        // Basic slug validation
        const slugRegex = /^[a-z0-9-]+$/;
        if (!slugRegex.test(editingPage.slug)) {
            alert("Slug must contain only lowercase letters, numbers, and hyphens.");
            return;
        }

        setSaving(true);
        try {
            const pageData = {
                ...editingPage,
                lastmod: new Date().toISOString().split('T')[0]
            };

            if (editingPage.id) {
                const { id, ...data } = pageData;
                await updateDoc(doc(db, 'pages', id), data);
            } else {
                await addDoc(collection(db, 'pages'), pageData);
            }
            setIsEditing(false);
            setEditingPage(null);
        } catch (error) {
            console.error("Error saving page:", error);
            alert("Failed to save page.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this page? This cannot be undone.")) {
            try {
                await deleteDoc(doc(db, 'pages', id));
            } catch (error) {
                console.error("Error deleting page:", error);
                alert("Failed to delete page.");
            }
        }
    };

    const filteredPages = pages.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-slate-50 relative">
            {/* Header */}
            <header className="bg-white px-8 py-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">SEO Pages</h1>
                    <p className="text-slate-500 text-sm">Create and manage dynamic landing pages with custom SEO</p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search pages..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-100 border-none pl-10 pr-4 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                        />
                    </div>
                    <button
                        onClick={() => {
                            setEditingPage({ title: '', slug: '', description: '', content: '' });
                            setIsEditing(true);
                        }}
                        className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95 shrink-0"
                    >
                        <Plus size={18} /> Add Page
                    </button>
                </div>
            </header>

            {/* List View */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredPages.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400 bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem]">
                            <FileText size={48} className="mb-4 opacity-50" />
                            <p className="font-medium">No pages found. Start by creating your first landing page!</p>
                        </div>
                    ) : (
                        filteredPages.map((page) => (
                            <div key={page.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden flex flex-col">
                                <div className="p-6 flex-1">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                                            <Globe size={24} />
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => {
                                                    setEditingPage(page);
                                                    setIsEditing(true);
                                                }}
                                                className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                                                title="Edit Page"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(page.id)}
                                                className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                                                title="Delete Page"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-slate-900 text-lg mb-1 truncate">{page.title}</h3>
                                    <div className="flex items-center gap-2 text-sky-600 font-mono text-xs mb-4">
                                        <span className="truncate">/p/{page.slug}</span>
                                        <a
                                            href={`/p/${page.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:bg-sky-100 p-1 rounded transition-colors"
                                        >
                                            <ExternalLink size={12} />
                                        </a>
                                    </div>

                                    <p className="text-slate-500 text-sm line-clamp-2 mb-4 h-10">
                                        {page.description || "No description set. This is important for SEO metadata."}
                                    </p>
                                </div>

                                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    <span>Last Modified</span>
                                    <span>{page.lastmod}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal Drawer for Add/Edit */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-sm p-4 md:p-6 animate-in fade-in duration-300">
                    <div
                        className="bg-white h-full w-full max-w-2xl rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-500"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <header className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    {editingPage?.id ? 'Edit SEO Page' : 'New SEO Page'}
                                </h2>
                                <p className="text-slate-500 text-xs">Configure path, metadata, and content</p>
                            </div>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="w-10 h-10 bg-white shadow-sm border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all hover:rotate-90"
                            >
                                <X size={20} />
                            </button>
                        </header>

                        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">URL Slug</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">/p/</span>
                                        <input
                                            required
                                            value={editingPage?.slug}
                                            onChange={e => setEditingPage({ ...editingPage, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                            className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-xl focus:border-sky-500 focus:bg-white outline-none transition-all font-mono text-sm"
                                            placeholder="my-landing-page"
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400">Unique identifier used in the URL.</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">SEO Title</label>
                                    <input
                                        required
                                        value={editingPage?.title}
                                        onChange={e => setEditingPage({ ...editingPage, title: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-sky-500 focus:bg-white outline-none transition-all font-bold"
                                        placeholder="Page Title"
                                    />
                                    <p className="text-[10px] text-slate-400">Appears in Google search and browser tabs.</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block flex justify-between">
                                    <span>Meta Description</span>
                                    <span className={`text-[10px] ${editingPage?.description?.length && editingPage?.description?.length > 160 ? 'text-amber-600' : 'text-slate-400'}`}>
                                        Character count: {editingPage?.description?.length || 0} (Recommended: 150-160)
                                    </span>
                                </label>
                                <textarea
                                    rows={3}
                                    value={editingPage?.description}
                                    onChange={e => setEditingPage({ ...editingPage, description: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:border-sky-500 focus:bg-white outline-none transition-all"
                                    placeholder="Enter short description for search engines..."
                                />
                            </div>

                            <div className="space-y-4 pt-6 border-t border-slate-100">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Page Content (HTML)</label>
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full text-amber-600 border border-amber-100">
                                        <AlertCircle size={12} />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Supports HTML tags</span>
                                    </div>
                                </div>
                                <textarea
                                    rows={12}
                                    value={editingPage?.content}
                                    onChange={e => setEditingPage({ ...editingPage, content: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 p-6 rounded-2xl focus:ring-4 focus:ring-sky-500/20 outline-none transition-all font-mono text-sm text-sky-400 leading-relaxed shadow-inner"
                                    placeholder="<section class='py-12'>\n  <h2 class='text-3xl font-bold'>Hello</h2>\n  <p>Your content here...</p>\n</section>"
                                />
                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-sky-600 shrink-0">
                                        <AlertCircle size={20} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Writing Guide</p>
                                        <p className="text-[11px] text-slate-500 leading-relaxed">
                                            For best results, use standard Tailwind CSS classes. Example: <code>text-4xl text-sky-600 p-12 bg-slate-100 rounded-3xl</code>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </form>

                        <footer className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                            >
                                {saving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-sky-200 border-t-white rounded-full animate-spin"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} /> {editingPage?.id ? 'Update Page' : 'Create Page'}
                                    </>
                                )}
                            </button>
                        </footer>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPages;
