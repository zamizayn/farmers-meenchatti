import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Loader2, Save, Image as ImageIcon, Upload } from 'lucide-react';

const AdminSettings: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [settings, setSettings] = useState({
        tagline: '',
        subTagline: '',
        dailySpecialActive: false,
        dailySpecialText: '',
        openingTime: '',
        closingTime: '',
        weekendOpeningTime: '',
        weekendClosingTime: '',
        liveCatchActive: false,
        liveCatchText: '',
        logoUrl: '',
        menuImageUrl: '',
        seoTitle: '',
        seoDescription: '',
        seoKeywords: ''
    });

    useEffect(() => {
        const fetchSettings = async () => {
            const docRef = doc(db, 'settings', 'general');
            const unsubscribe = onSnapshot(docRef, (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setSettings({
                        tagline: data.tagline || '',
                        subTagline: data.subTagline || '',
                        dailySpecialActive: data.dailySpecialActive || false,
                        dailySpecialText: data.dailySpecialText || '',
                        openingTime: data.openingTime || '11:00 AM',
                        closingTime: data.closingTime || '10:30 PM',
                        weekendOpeningTime: data.weekendOpeningTime || '11:00 AM',
                        weekendClosingTime: data.weekendClosingTime || '11:00 PM',
                        liveCatchActive: data.liveCatchActive || false,
                        liveCatchText: data.liveCatchText || '',
                        logoUrl: data.logoUrl || 'https://www.farmersmeenchatti.in/img/logo-sm.jpg',
                        menuImageUrl: data.menuImageUrl || '',
                        seoTitle: data.seoTitle || '',
                        seoDescription: data.seoDescription || '',
                        seoKeywords: data.seoKeywords || ''
                    });
                } else {
                    // Initialize default if not exists
                    setSettings(prev => ({
                        ...prev,
                        tagline: "കടലിന്റെ രുചി. \nകളിമണ്ണിന്റെ മണം.",
                        subTagline: "Rediscover the ancestral art of Kerala seafood.",
                    }));
                }
                setLoading(false);
            });
            return () => unsubscribe();
        };
        fetchSettings();
    }, []);

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const storageRef = ref(storage, `branding/logo_${Date.now()}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            setSettings(prev => ({ ...prev, logoUrl: downloadURL }));
            alert('Logo uploaded successfully! Don\'t forget to save settings.');
        } catch (error: any) {
            console.error("Error uploading logo:", error);
            if (error.code === 'storage/unauthorized') {
                alert("Upload failed: Permission denied. Please check your Firebase Storage Rules.");
            } else {
                alert(`Failed to upload logo: ${error.message || 'Unknown error'}`);
            }
        } finally {
            setUploading(false);
        }
    };

    const handleMenuUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const storageRef = ref(storage, `branding/menu_${Date.now()}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            setSettings(prev => ({ ...prev, menuImageUrl: downloadURL }));
            alert('Menu image uploaded successfully! Don\'t forget to save settings.');
        } catch (error: any) {
            console.error("Error uploading menu image:", error);
            alert(`Failed to upload menu: ${error.message || 'Unknown error'}`);
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateDoc(doc(db, 'settings', 'general'), {
                tagline: settings.tagline,
                subTagline: settings.subTagline,
                dailySpecialActive: settings.dailySpecialActive,
                dailySpecialText: settings.dailySpecialText,
                openingTime: settings.openingTime,
                closingTime: settings.closingTime,
                weekendOpeningTime: settings.weekendOpeningTime,
                weekendClosingTime: settings.weekendClosingTime,
                liveCatchActive: settings.liveCatchActive,
                liveCatchText: settings.liveCatchText,
                logoUrl: settings.logoUrl,
                menuImageUrl: settings.menuImageUrl,
                seoTitle: settings.seoTitle,
                seoDescription: settings.seoDescription,
                seoKeywords: settings.seoKeywords
            });
            alert('Settings saved!');
        } catch (error) {
            console.error("Error saving settings:", error);
            alert('Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8">Loading settings...</div>;

    return (
        <div className="p-6 md:p-8 h-full overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">General Settings</h2>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 max-w-2xl">
                <div className="space-y-6">
                    <div className="space-y-4 pb-6 border-b border-slate-100">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Brand Logo</label>
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative group">
                                {uploading ? (
                                    <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
                                ) : settings.logoUrl ? (
                                    <img src={settings.logoUrl} alt="Logo Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon className="w-8 h-8 text-slate-300" />
                                )}
                                <label className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                                    <Upload className="text-white w-6 h-6" />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} disabled={uploading} />
                                </label>
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-slate-700">Appbar Logo</p>
                                    <p className="text-xs text-slate-500">Recommended: Square PNG/JPG, min 200x200px</p>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        value={settings.logoUrl}
                                        onChange={e => setSettings({ ...settings, logoUrl: e.target.value })}
                                        className="flex-1 bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-sky-500 focus:bg-white outline-none transition-all font-mono text-xs"
                                        placeholder="Or paste image URL here..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pb-6 border-b border-slate-100">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Menu Image</label>
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative group">
                                {uploading ? (
                                    <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
                                ) : settings.menuImageUrl ? (
                                    <img src={settings.menuImageUrl} alt="Menu Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon className="w-8 h-8 text-slate-300" />
                                )}
                                <label className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                                    <Upload className="text-white w-6 h-6" />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleMenuUpload} disabled={uploading} />
                                </label>
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-slate-700">Detailed Menu Image</p>
                                    <p className="text-xs text-slate-500">This appears when users click "See Full Menu" on homepage.</p>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        value={settings.menuImageUrl}
                                        onChange={e => setSettings({ ...settings, menuImageUrl: e.target.value })}
                                        className="flex-1 bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-sky-500 focus:bg-white outline-none transition-all font-mono text-xs"
                                        placeholder="Or paste menu image URL here..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Main Tagline (Malayalam/English)</label>
                        <textarea
                            rows={3}
                            value={settings.tagline}
                            onChange={(e) => setSettings(prev => ({ ...prev, tagline: e.target.value }))}
                            className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:border-sky-500 focus:bg-white outline-none transition-all font-bold text-lg"
                            placeholder="Enter main tagline..."
                        />
                        <p className="text-xs text-slate-400">Use \n or Enter for new line.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sub-Tagline / Description</label>
                        <textarea
                            rows={3}
                            value={settings.subTagline}
                            onChange={(e) => setSettings(prev => ({ ...prev, subTagline: e.target.value }))}
                            className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:border-sky-500 focus:bg-white outline-none transition-all"
                            placeholder="Enter description..."
                        />
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Global SEO Settings</label>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Default Browser Title</label>
                                <input
                                    value={settings.seoTitle}
                                    onChange={(e) => setSettings(prev => ({ ...prev, seoTitle: e.target.value }))}
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-sky-500 focus:bg-white outline-none transition-all"
                                    placeholder="e.g. Farmers Meenchatti | Best Fish Curry in Kottayam"
                                />
                                <p className="text-[10px] text-slate-400">Used when a page doesn't have a specific title.</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Default Meta Description</label>
                                <textarea
                                    rows={2}
                                    value={settings.seoDescription}
                                    onChange={(e) => setSettings(prev => ({ ...prev, seoDescription: e.target.value }))}
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-sky-500 focus:bg-white outline-none transition-all text-sm"
                                    placeholder="Describe your brand for search engines..."
                                />
                                <p className="text-[10px] text-slate-400">Target 150-160 characters for best Google results.</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">SEO Keywords (Comma separated)</label>
                                <input
                                    value={settings.seoKeywords}
                                    onChange={(e) => setSettings(prev => ({ ...prev, seoKeywords: e.target.value }))}
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-sky-500 focus:bg-white outline-none transition-all"
                                    placeholder="fish curry, kerala seafood, kottayam restaurants..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Enable Daily Special Banner</label>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.dailySpecialActive}
                                    onChange={e => setSettings(prev => ({ ...prev, dailySpecialActive: e.target.checked }))}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                            </label>
                        </div>
                        {settings.dailySpecialActive && (
                            <div className="animate-in fade-in slide-in-from-top-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Special Message</label>
                                <input
                                    value={settings.dailySpecialText}
                                    onChange={(e) => setSettings(prev => ({ ...prev, dailySpecialText: e.target.value }))}
                                    className="w-full bg-amber-50 border border-amber-200 p-4 rounded-xl focus:border-amber-500 focus:bg-white outline-none transition-all mt-2"
                                    placeholder="e.g. Sunday Special: Crab Roast Available!"
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Live Catch Ticker</label>
                                <p className="text-[10px] text-slate-400 mt-1">Scrolling announcement bar (e.g. today's fresh harbor arrivals)</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.liveCatchActive}
                                    onChange={e => setSettings(prev => ({ ...prev, liveCatchActive: e.target.checked }))}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                            </label>
                        </div>
                        {settings.liveCatchActive && (
                            <div className="animate-in fade-in slide-in-from-top-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Ticker Message</label>
                                <input
                                    value={settings.liveCatchText}
                                    onChange={(e) => setSettings(prev => ({ ...prev, liveCatchText: e.target.value }))}
                                    className="w-full bg-sky-50 border border-sky-200 p-4 rounded-xl focus:border-sky-500 focus:bg-white outline-none transition-all mt-2"
                                    placeholder="e.g. 🏮 Fresh Tiger Prawns & Crab arrived from the morning harbor catch!"
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Shop Timings</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Weekday Opening</label>
                                <input
                                    value={settings.openingTime}
                                    onChange={(e) => setSettings(prev => ({ ...prev, openingTime: e.target.value }))}
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-sky-500 outline-none"
                                    placeholder="e.g. 11:00 AM"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Weekday Closing</label>
                                <input
                                    value={settings.closingTime}
                                    onChange={(e) => setSettings(prev => ({ ...prev, closingTime: e.target.value }))}
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-sky-500 outline-none"
                                    placeholder="e.g. 10:30 PM"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Weekend Opening</label>
                                <input
                                    value={settings.weekendOpeningTime}
                                    onChange={(e) => setSettings(prev => ({ ...prev, weekendOpeningTime: e.target.value }))}
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-sky-500 outline-none"
                                    placeholder="e.g. 11:00 AM"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Weekend Closing</label>
                                <input
                                    value={settings.weekendClosingTime}
                                    onChange={(e) => setSettings(prev => ({ ...prev, weekendClosingTime: e.target.value }))}
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-sky-500 outline-none"
                                    placeholder="e.g. 11:00 PM"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-sky-600/20 disabled:opacity-50"
                    >
                        <Save size={18} /> {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </div>

            {/* <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 max-w-2xl mt-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Database Tools</h3>
                <p className="text-sm text-slate-500 mb-4">Use this to populate the database with initial dummy data (Menu Items & Reviews).</p>
                <button
                    onClick={async () => {
                        if (confirm("This will add dummy data to your database. Continue?")) {
                            setSaving(true);
                            try {
                                const { seedDatabase } = await import('../utils/seeder');
                                await seedDatabase();
                                alert('Database seeded successfully!');
                            } catch (e) {
                                console.error(e);
                                alert('Error seeding database.');
                            } finally {
                                setSaving(false);
                            }
                        }
                    }}
                    className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg"
                    disabled={saving}
                >
                    🌱 Seed Database
                </button>
            </div> */}
        </div >
    );
};

export default AdminSettings;
