import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Store, User, Truck, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation(); // For redirect logic
    const { login, userProfile } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    // Redirect based on role when userProfile is loaded
    useEffect(() => {
        if (userProfile) {
            if (userProfile.role === 'admin') {
                navigate('/admin');
            } else if (userProfile.role === 'seller') {
                navigate('/seller');
            } else if (userProfile.role === 'delivery') {
                navigate('/delivery');
            } else {
                // Check if there's a return url
                const from = location.state?.from?.pathname || '/';
                navigate(from, { replace: true });
            }
        }
    }, [userProfile, navigate, location]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            // Redirection handled by useEffect
        } catch (err) {
            console.error(err);
            setError('Failed to sign in. Please check your credentials.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-primary-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border-t-4 border-primary-600">
                <button
                    onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
                    className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-500">Sign in to your account</p>
                </div>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors pr-10"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        <div className="text-right mt-2">
                            <span
                                onClick={() => navigate('/auth/forgot-password')}
                                className="text-sm text-primary-600 hover:text-primary-700 font-medium cursor-pointer"
                            >
                                Forgot Password?
                            </span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <span
                            onClick={() => navigate('/auth/register')}
                            className="text-primary-600 hover:text-primary-700 font-medium cursor-pointer"
                        >
                            Sign Up
                        </span>
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                        Want to sell on Agrim?{' '}
                        <span
                            onClick={() => navigate('/auth/seller-register')}
                            className="text-primary-600 hover:text-primary-700 font-medium cursor-pointer"
                        >
                            Register as Seller
                        </span>
                    </p>
                </div>

                {/* Dev Mode Toggle */}

            </div>
        </div>
    );
};

export default Login;

