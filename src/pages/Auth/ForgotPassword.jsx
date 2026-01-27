import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { auth } from '../../services/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await sendPasswordResetEmail(auth, email);
            setSuccess(true);
        } catch (err) {
            console.error('Password reset error:', err);
            if (err.code === 'auth/user-not-found') {
                setError('No account found with this email address.');
            } else if (err.code === 'auth/invalid-email') {
                setError('Invalid email address.');
            } else {
                setError('Failed to send reset email. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-primary-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border-t-4 border-emerald-600">
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 mb-3">Check Your Email</h1>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            We've sent a password reset link to <span className="font-bold text-gray-900">{email}</span>.
                            Please check your inbox and follow the instructions to reset your password.
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                            <p className="text-sm text-blue-800 font-medium mb-2">📧 Didn't receive the email?</p>
                            <ul className="text-xs text-blue-700 space-y-1 ml-4">
                                <li>• Check your spam or junk folder</li>
                                <li>• Make sure you entered the correct email</li>
                                <li>• Wait a few minutes and check again</li>
                            </ul>
                        </div>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full py-3 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition-colors"
                        >
                            Back to Login
                        </button>
                        <button
                            onClick={() => setSuccess(false)}
                            className="w-full mt-3 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                        >
                            Send Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border-t-4 border-primary-600">
                <button
                    onClick={() => navigate('/login')}
                    className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Login
                </button>

                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                        <Mail className="w-8 h-8 text-primary-600" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Forgot Password?</h1>
                    <p className="text-gray-600">No worries! Enter your email and we'll send you reset instructions.</p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleResetPassword} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-primary-600 text-white rounded-lg font-black text-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Sending...
                            </div>
                        ) : (
                            'Send Reset Link'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Remember your password?{' '}
                        <span
                            onClick={() => navigate('/login')}
                            className="text-primary-600 hover:text-primary-700 font-bold cursor-pointer"
                        >
                            Sign In
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
