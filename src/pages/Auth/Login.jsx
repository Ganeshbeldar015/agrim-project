import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Store, User, Truck } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation(); // For redirect logic
    const { login, devLogin, userProfile } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showDevAuth, setShowDevAuth] = useState(false);

    // Redirect based on role when userProfile is loaded
    useEffect(() => {
        if (userProfile) {
            if (userProfile.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (userProfile.role === 'seller') {
                navigate('/seller/dashboard');
            } else if (userProfile.role === 'delivery') {
                navigate('/delivery/dashboard');
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
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
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
                <div className="mt-8 border-t pt-4">
                    <button 
                        onClick={() => setShowDevAuth(!showDevAuth)}
                        className="text-xs text-gray-400 hover:text-gray-600 underline w-full text-center"
                    >
                        {showDevAuth ? 'Hide Dev Options' : 'Show Dev Options (Mock Login)'}
                    </button>
                    
                    {showDevAuth && (
                        <div className="mt-4 grid grid-cols-2 gap-3">
                             <button onClick={() => devLogin('user')} className="p-2 text-xs bg-gray-100 hover:bg-gray-200 rounded">User</button>
                             <button onClick={() => devLogin('seller')} className="p-2 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded">Seller</button>
                             <button onClick={() => devLogin('admin')} className="p-2 text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 rounded">Admin</button>
                             <button onClick={() => devLogin('delivery')} className="p-2 text-xs bg-green-50 hover:bg-green-100 text-green-700 rounded">Delivery</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;

