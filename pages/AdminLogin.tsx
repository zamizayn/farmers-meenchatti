import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/admin/dashboard');
        } catch (err: any) {
            console.error(err);
            setError('Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f0f9ff] flex items-center justify-center p-6">
            <div className="bg-white p-10 rounded-[2rem] shadow-2xl max-w-md w-full">
                <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2 text-center">Admin Access</h1>
                <p className="text-slate-500 text-center mb-8">Please login to manage reservations</p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm flex items-center gap-2">
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-sky-50 border border-slate-200 px-6 py-4 rounded-2xl outline-none focus:border-sky-700 focus:bg-white transition-all"
                            placeholder="admin@restaurant.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-sky-50 border border-slate-200 px-6 py-4 rounded-2xl outline-none focus:border-sky-700 focus:bg-white transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-sky-950 text-white py-4 rounded-2xl font-bold text-lg hover:bg-sky-900 transition-all shadow-xl hover:shadow-sky-900/20 active:scale-95 disabled:opacity-50"
                    >
                        {loading ? 'Verifying...' : 'Login to Dashboard'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <a href="/" className="text-sky-600 hover:text-sky-800 text-sm font-semibold">← Back to Website</a>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
