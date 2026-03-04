import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import {
    Calendar,
    CheckCircle,
    Clock,
    Coffee,
    LogOut,
    Settings,
    Trash2,
    Users,
    XCircle,
    Phone,
    MessageSquare,
    Tag,
    Youtube, // Added icon for Video Reviews
    Share2,
    ShoppingBag
} from 'lucide-react';
import AdminMenu from '../components/AdminMenu';
import AdminCategories from '../components/AdminCategories';
import AdminTableMap from '../components/AdminTableMap';
import AdminVideoReviews from '../components/AdminVideoReviews';
import AdminUserReviews from '../components/AdminUserReviews';
import AdminSettings from '../components/AdminSettings';
import Toast from '../components/Toast';
import { playNotificationSound, requestNotificationPermission, sendNotification } from '../utils/notifications';

interface Reservation {
    id: string;
    name: string;
    phone: string;
    date: string;
    time: string;
    guests: string;
    type: string;
    requests?: string;
    orderedItems?: string[];
    status: 'pending' | 'confirmed' | 'rejected' | 'completed';
    createdAt: any;
}

const AdminDashboard: React.FC = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'pending' | 'confirmed' | 'all'>('pending');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    // View state now includes 'categories' and 'videos'
    const [currentView, setCurrentView] = useState<'reservations' | 'menu' | 'categories' | 'videos' | 'reviews' | 'tables' | 'settings'>('reservations');

    // Notification State
    const [toast, setToast] = useState({ show: false, title: '', message: '' });

    const navigate = useNavigate();

    useEffect(() => {
        // Auth check
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            if (!user) {
                navigate('/admin/login');
            }
        });

        // Request permission on load
        requestNotificationPermission();

        // Fetch reservations
        const q = query(collection(db, 'reservations'), orderBy('date', 'desc'));
        let isInitialLoad = true;

        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
            const resData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Reservation[];

            // Check for new pending reservations if not initial load
            if (!isInitialLoad) {
                // Find potential new bookings (simple logic: seeing if we have more pending ones, or diffing IDs)
                // A robust way: check if any *added* change is 'pending'
                const changes = snapshot.docChanges();
                changes.forEach((change) => {
                    if (change.type === 'added') {
                        const newRes = change.doc.data() as Reservation;
                        if (newRes.status === 'pending') {
                            playNotificationSound();
                            // Show In-App Toast
                            setToast({
                                show: true,
                                title: "New Reservation Received! 🎉",
                                message: `${newRes.name} booked a table for ${newRes.guests} guests at ${newRes.time}.`
                            });
                            // Also send system notification as backup
                            sendNotification("New Reservation!", `${newRes.name} for ${newRes.guests} guests`);
                        }
                    }
                });
            }

            setReservations(resData);
            setLoading(false);
            isInitialLoad = false;
        });

        return () => {
            unsubscribeAuth();
            unsubscribeSnapshot();
        };
    }, [navigate]);

    const handleLogout = () => {
        signOut(auth);
    };

    const updateStatus = async (id: string, newStatus: Reservation['status']) => {
        try {
            await updateDoc(doc(db, 'reservations', id), { status: newStatus });
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const deleteReservation = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this reservation?')) {
            try {
                await deleteDoc(doc(db, 'reservations', id));
            } catch (error) {
                console.error("Error deleting:", error);
            }
        }
    };

    const shareReservation = (res: Reservation) => {
        const message = `*🍕 New Reservation Needed!*
        
👤 *${res.name}*
👥 Guests: ${res.guests}
📅 Date: ${res.date}
⏰ Time: ${res.time}
📞 Phone: ${res.phone}
${res.requests ? `📝 Note: ${res.requests}` : ''}
        
_Sent via Farmers Admin Panel_`;

        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const filteredReservations = reservations.filter(r => {
        if (activeTab === 'all') return true;
        return r.status === activeTab;
    });

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            <Toast
                isVisible={toast.show}
                title={toast.title}
                message={toast.message}
                onClose={() => setToast({ ...toast, show: false })}
            />

            {/* Sidebar */}
            <aside className={`w-64 bg-slate-900 text-white flex flex-col transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-64'} fixed md:relative z-20 h-full`}>
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center font-serif font-bold text-white">F</div>
                    <div>
                        <h2 className="font-bold text-lg leading-tight">Farmers</h2>
                        <p className="text-slate-400 text-xs uppercase tracking-wider">Admin Panel</p>
                    </div>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-1">
                    <button
                        onClick={() => setCurrentView('reservations')}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-colors ${currentView === 'reservations' ? 'bg-sky-600/20 text-sky-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                    >
                        <Calendar size={20} />
                        Reservations
                    </button>

                    <button
                        onClick={() => setCurrentView('categories')}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-colors ${currentView === 'categories' ? 'bg-sky-600/20 text-sky-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                    >
                        <Tag size={20} />
                        Categories
                    </button>

                    <button
                        onClick={() => setCurrentView('menu')}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-colors ${currentView === 'menu' ? 'bg-sky-600/20 text-sky-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                    >
                        <Coffee size={20} />
                        Menu Items
                    </button>

                    <button
                        onClick={() => setCurrentView('videos')}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-colors ${currentView === 'videos' ? 'bg-sky-600/20 text-sky-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                    >
                        <Youtube size={20} />
                        Video Reviews
                    </button>

                    <button
                        onClick={() => setCurrentView('reviews')}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-colors ${currentView === 'reviews' ? 'bg-sky-600/20 text-sky-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                    >
                        <MessageSquare size={20} />
                        User Reviews
                    </button>

                    {/* <button
                        onClick={() => setCurrentView('tables')}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-colors ${currentView === 'tables' ? 'bg-sky-600/20 text-sky-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                    >
                        <Users size={20} />
                        Table Map
                    </button> */}

                    <button
                        onClick={() => setCurrentView('settings')}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-colors ${currentView === 'settings' ? 'bg-sky-600/20 text-sky-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                    >
                        <Settings size={20} />
                        Settings
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-3 py-3">
                        <div className="w-8 h-8 rounded-full bg-sky-900 flex items-center justify-center text-xs font-bold text-sky-200">
                            {auth.currentUser?.email?.[0].toUpperCase()}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate">{auth.currentUser?.email}</p>
                            <p className="text-xs text-slate-500">Super Admin</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-slate-400 hover:text-red-400 transition-colors p-1"
                            title="Logout"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {currentView === 'menu' ? (
                    <AdminMenu />
                ) : currentView === 'categories' ? (
                    <AdminCategories />
                ) : currentView === 'videos' ? (
                    <AdminVideoReviews />
                ) : currentView === 'reviews' ? (
                    <AdminUserReviews />
                ) : currentView === 'tables' ? (
                    <AdminTableMap />
                ) : currentView === 'settings' ? (
                    <AdminSettings />
                ) : (
                    <>
                        {/* Header */}
                        <header className="bg-white px-8 py-5 border-b border-slate-200 flex justify-between items-center shrink-0">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Reservations</h1>
                                <p className="text-slate-500 text-sm">Manage incoming bookings and requests</p>
                            </div>

                            <div className="flex bg-slate-100 p-1 rounded-lg">
                                {(['pending', 'confirmed', 'all'] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all ${activeTab === tab
                                            ? 'bg-white text-slate-900 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </header>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-8">
                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="w-8 h-8 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                    {filteredReservations.length === 0 ? (
                                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-white/50">
                                            <Calendar size={48} className="mb-4 opacity-50" />
                                            <p className="font-medium">No reservations details found</p>
                                        </div>
                                    ) : (
                                        filteredReservations.map((res) => (
                                            <div key={res.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden flex flex-col">
                                                {/* Card Header */}
                                                <div className="p-5 border-b border-slate-50 flex justify-between items-start bg-gradient-to-r from-white to-slate-50/50">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="font-bold text-slate-900 text-lg">{res.name}</h3>
                                                            {res.status === 'pending' && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>}
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${res.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-100' :
                                                                res.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                                                                    'bg-amber-50 text-amber-700 border-amber-100'
                                                                }`}>
                                                                {res.status}
                                                            </span>
                                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                                                                {res.type}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-2xl font-bold text-slate-900 font-serif">{res.time}</p>
                                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{res.date}</p>
                                                    </div>
                                                </div>

                                                {/* Card Body */}
                                                <div className="p-5 space-y-4 flex-1">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center text-sky-600">
                                                                <Users size={16} />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Part Size</p>
                                                                <p className="text-sm font-semibold text-slate-900">{res.guests} Guests</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center text-sky-600">
                                                                <Phone size={16} />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Contact</p>
                                                                <p className="text-sm font-semibold text-slate-900">{res.phone}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {res.requests && (
                                                        <div className="bg-yellow-50 rounded-xl p-3 flex items-start gap-3 border border-yellow-100">
                                                            <MessageSquare size={16} className="text-yellow-600 mt-0.5 shrink-0" />
                                                            <p className="text-sm text-yellow-800 leading-snug">
                                                                <span className="font-bold block text-xs uppercase mb-0.5 text-yellow-600/80">Special Request</span>
                                                                {res.requests}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {res.orderedItems && res.orderedItems.length > 0 && (
                                                        <div className="bg-sky-50 rounded-xl p-3 border border-sky-100">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <ShoppingBag size={14} className="text-sky-600" />
                                                                <span className="font-bold text-xs uppercase text-sky-700">Pre-ordered Items</span>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {res.orderedItems.map((item, idx) => (
                                                                    <span key={idx} className="bg-white text-sky-800 text-xs px-2 py-1 rounded-md border border-sky-200 font-medium">
                                                                        {item}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Card Footer / Actions */}
                                                <div className="p-3 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-2">
                                                    {res.status === 'pending' ? (
                                                        <>
                                                            <button
                                                                onClick={() => updateStatus(res.id, 'confirmed')}
                                                                className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-bold transition-all"
                                                            >
                                                                <CheckCircle size={16} /> Confirm
                                                            </button>
                                                            <button
                                                                onClick={() => updateStatus(res.id, 'rejected')}
                                                                className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-600 border border-slate-200 hover:border-red-200 py-2 px-3 rounded-lg text-sm font-bold transition-all"
                                                            >
                                                                <XCircle size={16} /> Reject
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => updateStatus(res.id, 'pending')}
                                                                className="flex-1 flex items-center justify-center gap-2 text-slate-500 hover:text-sky-600 py-2 px-3 text-sm font-bold transition-all bg-white border border-slate-200 rounded-lg"
                                                            >
                                                                <Clock size={16} /> Reset
                                                            </button>
                                                            <button
                                                                onClick={() => deleteReservation(res.id)}
                                                                className="flex-1 flex items-center justify-center gap-2 text-slate-400 hover:text-red-500 py-2 px-3 text-sm font-bold transition-all hover:bg-red-50 rounded-lg"
                                                            >
                                                                <Trash2 size={16} /> Remove
                                                            </button>
                                                        </>
                                                    )}

                                                    {/* WhatsApp Share Button */}
                                                    <button
                                                        onClick={() => shareReservation(res)}
                                                        className="w-10 h-10 flex items-center justify-center bg-[#25D366] hover:bg-[#128C7E] text-white rounded-lg shadow-sm transition-all active:scale-95"
                                                        title="Forward via WhatsApp"
                                                    >
                                                        <Share2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
