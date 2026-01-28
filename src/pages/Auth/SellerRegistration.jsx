import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Eye, EyeOff, Store, ShieldCheck } from 'lucide-react';

const SellerRegistration = () => {
    const navigate = useNavigate();
    const { signup, userProfile, loading: authLoading } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        shopName: '',
        phone: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect if already a seller
    React.useEffect(() => {
        if (userProfile?.role === 'seller') {
            navigate('/seller');
        }
    }, [userProfile, navigate]);

    const getFriendlyAuthError = (err) => {
        const code = err?.code || '';
        if (code === 'auth/configuration-not-found') {
            return 'Firebase Authentication is not configured for this project. Enable Email/Password provider and ensure the API key belongs to a Firebase Web App.';
        }
        if (code === 'auth/email-already-in-use') {
            return 'This email is already registered.';
        }
        if (code === 'auth/weak-password') {
            return 'Password is too weak. Use a stronger password.';
        }
        if (code === 'auth/invalid-email') {
            return 'Invalid email format.';
        }
        return 'Failed to create account. Please try again.';
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await signup(formData.email, formData.password, 'seller', {
                displayName: formData.fullName,
                shopName: formData.shopName,
                phoneNumber: formData.phone
            });
            // Redirect to Seller Verification page to upload docs
            navigate('/seller/verification');
        } catch (err) {
            console.error(err);
            setError(getFriendlyAuthError(err));
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-10 rounded-[40px] shadow-2xl max-w-xl w-full border border-emerald-50">
                <button
                    onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
                    className="mb-8 inline-flex items-center gap-2 text-gray-400 hover:text-emerald-600 font-bold transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
                </button>

                <div className="text-center mb-10">
                    <div className="mx-auto w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mb-4 rotate-3 shadow-lg shadow-emerald-200" >
                        <Store className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Join as a Seller</h1>
                    <p className="text-gray-500 font-medium italic">Create your shop and reach thousands of customers</p>
                </div>

                {/* Important Notice */}
                <div className="mb-8 p-5 bg-emerald-50 rounded-3xl border border-emerald-100" >
                    <h3 className="text-emerald-900 font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2" >
                        <ShieldCheck className="w-4 h-4" /> Verification Required
                    </h3>
                    <p className="text-emerald-700 text-xs font-bold leading-relaxed" >
                        To activate your shop, you will need to upload:
                    </p>
                    <ul className="mt-2 space-y-1" >
                        <li className="text-[10px] text-emerald-600 font-black uppercase tracking-tighter flex items-center gap-1.5" >
                            <div className="w-1 h-1 rounded-full bg-emerald-400" ></div> Identity Proof (Aadhar/PAN Card)
                        </li>
                        <li className="text-[10px] text-emerald-600 font-black uppercase tracking-tighter flex items-center gap-1.5" >
                            <div className="w-1 h-1 rounded-full bg-emerald-400" ></div> Shop License or Farm Registration
                        </li>
                        <li className="text-[10px] text-emerald-600 font-black uppercase tracking-tighter flex items-center gap-1.5" >
                            <div className="w-1 h-1 rounded-full bg-emerald-400" ></div> Valid Tax ID / GST Number
                        </li>
                    </ul>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl mb-6 font-bold text-sm flex items-center gap-2" >
                        <div className="w-2 h-2 rounded-full bg-red-500" ></div> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5" >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5" >
                        <div className="space-y-1.5" >
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1" >Full Name</label>
                            <input
                                name="fullName"
                                type="text"
                                required
                                className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-gray-700"
                                onChange={handleChange}
                                placeholder="Enter your name"
                            />
                        </div>
                        <div className="space-y-1.5" >
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1" >Shop/Farm Name</label>
                            <input
                                name="shopName"
                                type="text"
                                required
                                className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-gray-700"
                                onChange={handleChange}
                                placeholder="My Fresh Store"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5" >
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1" >Phone Number</label>
                        <input
                            name="phone"
                            type="tel"
                            required
                            className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-gray-700"
                            onChange={handleChange}
                            placeholder="+91 00000 00000"
                        />
                    </div>

                    <div className="space-y-1.5" >
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1" >Email Address</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-gray-700"
                            onChange={handleChange}
                            placeholder="mail@example.com"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5" >
                        <div className="space-y-1.5" >
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1" >Password</label>
                            <div className="relative" >
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-gray-700 pr-12"
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-1.5" >
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1" >Confirm</label>
                            <div className="relative" >
                                <input
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-gray-700 pr-12"
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-emerald-600 text-white rounded-[24px] font-black text-lg shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all disabled:opacity-50 mt-4 uppercase tracking-widest"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-3" >
                                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" ></div>
                                <span>Verifying...</span>
                            </div>
                        ) : 'Register Shop'}
                    </button>
                </form>

                <div className="mt-8 text-center" >
                    <p className="text-sm font-bold text-gray-500" >
                        Already have a shop?{' '}
                        <span onClick={() => navigate('/login')} className="text-emerald-600 hover:underline cursor-pointer font-black underline-offset-4" >
                            Sign In
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SellerRegistration;
