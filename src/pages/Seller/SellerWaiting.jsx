import React, { useEffect } from 'react';
import { Clock, ShieldAlert, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SellerWaiting = () => {
    const { userProfile, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // If they get approved while on this page, redirect them automatically
        if (userProfile?.status === 'approved') {
            navigate('/seller');
        }
        // If they get rejected while on this page, redirect to rejection page
        if (userProfile?.status === 'rejected') {
            navigate('/seller/rejected');
        }
    }, [userProfile, navigate]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-emerald-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-xl w-full bg-white rounded-[40px] shadow-2xl p-12 border border-emerald-100 relative overflow-hidden">
                {/* Decorative background circle */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-50 rounded-full -z-0" />

                <div className="relative z-10">
                    <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                        <Clock className="w-12 h-12 text-yellow-600" />
                    </div>

                    <h1 className="text-4xl font-black text-emerald-950 mb-4">
                        Account Under Review
                    </h1>

                    <div className="h-1.5 w-24 bg-emerald-500 rounded-full mx-auto mb-8" />

                    <p className="text-emerald-800 text-lg mb-8 leading-relaxed">
                        Thank you for joining our community! Your shop registration has been successfully submitted.
                        Our admin team is currently reviewing your documents to ensure a safe marketplace for everyone.
                    </p>

                    <div className="bg-emerald-50 rounded-2xl p-6 mb-10 text-left border border-emerald-100">
                        <div className="flex gap-4 items-start">
                            <ShieldAlert className="w-6 h-6 text-emerald-600 shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-emerald-900 mb-1">What happens next?</h4>
                                <ul className="text-sm text-emerald-700 space-y-2">
                                    <li>• Identity & license verification (usually within 24 hours)</li>
                                    <li>• Once approved, you'll get full access to your Dashboard</li>
                                    <li>• You'll be able to start listing your products immediately</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/')}
                            className="px-8 py-3 bg-white border-2 border-emerald-100 text-emerald-700 rounded-2xl font-bold hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Home
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2"
                        >
                            <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                    </div>

                    <p className="mt-8 text-xs text-emerald-400 font-medium uppercase tracking-widest">
                        Status: {userProfile?.status?.replace('_', ' ') || 'Pending'}
                    </p>
                </div>
            </div>

            <p className="mt-8 text-emerald-600/50 text-sm italic">
                Agrim Marketplace • Empowering Local Harvest
            </p>
        </div>
    );
};

export default SellerWaiting;
