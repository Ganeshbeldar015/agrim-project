import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
            await signup(formData.email, formData.password, 'customer', {
                displayName: formData.fullName
            });
            navigate('/');
        } catch (err) {
            console.error(err);
            setError(getFriendlyAuthError(err));
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
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Create Account</h1>
                    <p className="text-gray-500">Join Agrim as a customer</p>
                </div>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input name="fullName" type="text" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input name="email" type="email" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 pr-10"
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <div className="relative">
                            <input
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 pr-10"
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition-colors disabled:opacity-50 mt-2"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <span onClick={() => navigate('/login')} className="text-primary-600 hover:text-primary-700 font-medium cursor-pointer">
                            Sign In
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
