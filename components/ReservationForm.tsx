import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const ReservationForm: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: '2',
        type: 'Table Reservation', // Default
        requests: '',
        foodItems: [] as string[]
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [lastReservation, setLastReservation] = useState<typeof formData | null>(null);
    const [menuItems, setMenuItems] = useState<{ id: string; name: string; price: string; type: 'veg' | 'non-veg' }[]>([]);
    const [loadingMenu, setLoadingMenu] = useState(true);

    // Fetch Menu Items
    React.useEffect(() => {
        const fetchMenu = async () => {
            try {
                const querySnapshot = await import('firebase/firestore').then(mod => mod.getDocs(mod.collection(db, 'menu_items')));
                const items = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                    price: doc.data().price,
                    type: doc.data().type,
                }));
                // Sort by name
                items.sort((a, b) => a.name.localeCompare(b.name));
                setMenuItems(items);
            } catch (error) {
                console.error("Error fetching menu:", error);
            } finally {
                setLoadingMenu(false);
            }
        };
        fetchMenu();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFoodToggle = (itemName: string) => {
        setFormData(prev => {
            const currentItems = prev.foodItems || [];
            if (currentItems.includes(itemName)) {
                return { ...prev, foodItems: currentItems.filter(i => i !== itemName) };
            } else {
                return { ...prev, foodItems: [...currentItems, itemName] };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await addDoc(collection(db, 'reservations'), {
                ...formData,
                createdAt: Timestamp.now(),
                status: 'pending' // 'pending', 'confirmed', 'rejected'
            });
            setLastReservation(formData);
            setStatus('success');
            setFormData({
                name: '',
                email: '',
                phone: '',
                date: '',
                time: '',
                guests: '2',
                type: 'Table Reservation',
                requests: '',
                foodItems: []
            });
        } catch (error) {
            console.error("Error adding reservation: ", error);
            setStatus('error');
        }
    };

    const sendWhatsAppNotification = () => {
        if (!lastReservation) return;

        const phoneNumber = "919778702863"; // Farmers Meenchatti
        let text = `Hello, I just made a reservation at Farmers Meenchatti!
        
Name: ${lastReservation.name}
Date: ${lastReservation.date}
Time: ${lastReservation.time}
Guests: ${lastReservation.guests}
Type: ${lastReservation.type}`;

        if (lastReservation.foodItems && lastReservation.foodItems.length > 0) {
            text += `\nFood Pre-order: ${lastReservation.foodItems.join(', ')}`;
        }

        if (lastReservation.requests) {
            text += `\nRequests: ${lastReservation.requests}`;
        }

        const encodedText = encodeURIComponent(text);
        window.open(`https://wa.me/${phoneNumber}?text=${encodedText}`, '_blank');
    };

    return (
        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/50">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Book a Table</h3>
            {status === 'success' ? (
                <div className="bg-green-50 text-green-800 p-6 rounded-2xl text-center">
                    <p className="font-bold text-xl mb-2">Reservation Received!</p>
                    <p className="mb-6">We will contact you shortly to confirm your table.</p>

                    <button
                        onClick={sendWhatsAppNotification}
                        className="w-full bg-[#25D366] text-white py-3 rounded-xl font-bold mb-4 hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-200"
                    >
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 fill-white stroke-none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                        Notify on WhatsApp
                    </button>

                    <button
                        onClick={() => setStatus('idle')}
                        className="mt-2 text-sm font-bold underline text-slate-500 hover:text-slate-700"
                    >
                        Make another reservation
                    </button>
                </div>
            ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-sky-50 border border-slate-200 px-6 py-4 rounded-2xl outline-none focus:border-sky-700 focus:bg-white transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full bg-sky-50 border border-slate-200 px-6 py-4 rounded-2xl outline-none focus:border-sky-700 focus:bg-white transition-all"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Date</label>
                            <input
                                type="date"
                                name="date"
                                required
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full bg-sky-50 border border-slate-200 px-6 py-4 rounded-2xl outline-none focus:border-sky-700 focus:bg-white transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Time</label>
                            <input
                                type="time"
                                name="time"
                                required
                                value={formData.time}
                                onChange={handleChange}
                                className="w-full bg-sky-50 border border-slate-200 px-6 py-4 rounded-2xl outline-none focus:border-sky-700 focus:bg-white transition-all"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Guests</label>
                            <select
                                name="guests"
                                value={formData.guests}
                                onChange={handleChange}
                                className="w-full bg-sky-50 border border-slate-200 px-6 py-4 rounded-2xl outline-none focus:border-sky-700 focus:bg-white transition-all"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, '10+'].map(g => (
                                    <option key={g} value={g}>{g} {g === 1 ? 'Person' : 'People'}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Inquiry Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full bg-sky-50 border border-slate-200 px-6 py-4 rounded-2xl outline-none focus:border-sky-700 focus:bg-white transition-all"
                            >
                                <option value="Table Reservation">Table Reservation</option>
                                <option value="Bulk Pot Order">Bulk Pot Order</option>
                                <option value="Catering Event">Catering Event</option>
                            </select>
                        </div>
                    </div>

                    {/* Food Pre-order Section */}
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex justify-between items-center">
                            <span>Pre-order Food (Optional)</span>
                            <span className="text-[10px] text-slate-400 normal-case font-normal">Select items to have them ready</span>
                        </label>
                        <div className="bg-sky-50/50 border border-slate-200 rounded-2xl p-4 max-h-60 overflow-y-auto">
                            {loadingMenu ? (
                                <div className="text-center py-4 text-slate-400 text-sm">Loading menu...</div>
                            ) : menuItems.length === 0 ? (
                                <div className="text-center py-4 text-slate-400 text-sm">No menu items available</div>
                            ) : (
                                <div className="grid grid-cols-1 gap-2">
                                    {menuItems.map(item => (
                                        <label key={item.id} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl hover:border-sky-200 cursor-pointer transition-all group">
                                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${formData.foodItems.includes(item.name) ? 'bg-sky-600 border-sky-600' : 'border-slate-300 bg-white group-hover:border-sky-400'
                                                }`}>
                                                {formData.foodItems.includes(item.name) && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={formData.foodItems.includes(item.name)}
                                                onChange={() => handleFoodToggle(item.name)}
                                            />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center">
                                                    <span className={`text-sm font-semibold transition-colors ${formData.foodItems.includes(item.name) ? 'text-sky-900' : 'text-slate-700'}`}>{item.name}</span>
                                                    <span className="text-xs font-bold text-sky-600">{item.price}</span>
                                                </div>
                                                <div className="flex items-center gap-1 mt-0.5">
                                                    <span className={`w-2 h-2 rounded-full ${item.type === 'veg' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                    <span className="text-[10px] text-slate-400 uppercase font-medium">{item.type}</span>
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Special Requests</label>
                        <textarea
                            name="requests"
                            rows={2}
                            value={formData.requests}
                            onChange={handleChange}
                            className="w-full bg-sky-50 border border-slate-200 px-6 py-4 rounded-2xl outline-none focus:border-sky-700 focus:bg-white transition-all"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-sky-950 text-white py-5 rounded-2xl font-bold text-lg hover:bg-sky-900 transition-all shadow-xl hover:shadow-sky-900/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === 'loading' ? 'Sending...' : 'Confirm Reservation'}
                    </button>
                    {status === 'error' && (
                        <p className="text-red-500 text-center text-sm font-bold">Something went wrong. Please try again.</p>
                    )}
                </form>
            )}
        </div>
    );
};

export default ReservationForm;
