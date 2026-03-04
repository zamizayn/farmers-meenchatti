import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { Save } from 'lucide-react';

const AdminSettings: React.FC = () => {
    const [tagline, setTagline] = useState('');
    const [subTagline, setSubTagline] = useState('');
    const [dailySpecialActive, setDailySpecialActive] = useState(false);
    const [dailySpecialText, setDailySpecialText] = useState('');
    const [openingTime, setOpeningTime] = useState('');
    const [closingTime, setClosingTime] = useState('');
    const [weekendOpeningTime, setWeekendOpeningTime] = useState('');
    const [weekendClosingTime, setWeekendClosingTime] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            const docRef = doc(db, 'settings', 'general');
            const unsubscribe = onSnapshot(docRef, (doc) => {
                if (doc.exists()) {
                    setTagline(doc.data().tagline || '');
                    setSubTagline(doc.data().subTagline || '');
                    setDailySpecialActive(doc.data().dailySpecialActive || false);
                    setDailySpecialText(doc.data().dailySpecialText || '');
                    setOpeningTime(doc.data().openingTime || '11:00 AM');
                    setClosingTime(doc.data().closingTime || '10:30 PM');
                    setWeekendOpeningTime(doc.data().weekendOpeningTime || '11:00 AM');
                    setWeekendClosingTime(doc.data().weekendClosingTime || '11:00 PM');
                } else {
                    // Initialize default if not exists
                    setTagline("കടലിന്റെ രുചി. \nകളിമണ്ണിന്റെ മണം.");
                    setSubTagline("Rediscover the ancestral art of Kerala seafood.");
                }
                setLoading(false);
            });
            return () => unsubscribe();
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'settings', 'general'), {
                tagline,
                subTagline,
                dailySpecialActive,
                dailySpecialText,
                openingTime,
                closingTime,
                weekendOpeningTime,
                weekendClosingTime
            }, { merge: true });
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
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Main Tagline (Malayalam/English)</label>
                        <textarea
                            rows={3}
                            value={tagline}
                            onChange={(e) => setTagline(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:border-sky-500 focus:bg-white outline-none transition-all font-bold text-lg"
                            placeholder="Enter main tagline..."
                        />
                        <p className="text-xs text-slate-400">Use \n or Enter for new line.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sub-Tagline / Description</label>
                        <textarea
                            rows={3}
                            value={subTagline}
                            onChange={(e) => setSubTagline(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:border-sky-500 focus:bg-white outline-none transition-all"
                            placeholder="Enter description..."
                        />
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Enable Daily Special Banner</label>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={dailySpecialActive}
                                    onChange={e => setDailySpecialActive(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                            </label>
                        </div>
                        {dailySpecialActive && (
                            <div className="animate-in fade-in slide-in-from-top-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Special Message</label>
                                <input
                                    value={dailySpecialText}
                                    onChange={(e) => setDailySpecialText(e.target.value)}
                                    className="w-full bg-amber-50 border border-amber-200 p-4 rounded-xl focus:border-amber-500 focus:bg-white outline-none transition-all mt-2"
                                    placeholder="e.g. Sunday Special: Crab Roast Available!"
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Shop Timings</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Weekday Opening</label>
                                <input
                                    value={openingTime}
                                    onChange={(e) => setOpeningTime(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-sky-500 outline-none"
                                    placeholder="e.g. 11:00 AM"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Weekday Closing</label>
                                <input
                                    value={closingTime}
                                    onChange={(e) => setClosingTime(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-sky-500 outline-none"
                                    placeholder="e.g. 10:30 PM"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Weekend Opening</label>
                                <input
                                    value={weekendOpeningTime}
                                    onChange={(e) => setWeekendOpeningTime(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-sky-500 outline-none"
                                    placeholder="e.g. 11:00 AM"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Weekend Closing</label>
                                <input
                                    value={weekendClosingTime}
                                    onChange={(e) => setWeekendClosingTime(e.target.value)}
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

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 max-w-2xl mt-8">
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
            </div>
        </div>
    );
};

export default AdminSettings;
