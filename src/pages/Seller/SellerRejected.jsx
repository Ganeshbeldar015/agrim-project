import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, RefreshCw, Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SellerRejected = () => {
    const navigate = useNavigate();
    const { userProfile } = useAuth();

    const handleReapply = () => {
        navigate('/seller/verification');
    };

    const handleContactSupport = () => {
        window.location.href = 'mailto:support@agrim.com?subject=Seller Application Rejected - Need Assistance';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <button
                    onClick={() => navigate('/')}
                    className="mb-6 inline-flex items-center gap-2 text-gray-400 hover:text-gray-600 font-bold transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
                </button>

                <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-red-100">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-red-600 to-orange-600 p-8 text-white text-center">
                        <div className="mx-auto w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 animate-pulse">
                            <XCircle className="w-12 h-12" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight mb-2">Application Rejected</h1>
                        <p className="text-red-100 font-medium">Your seller verification was not approved</p>
                    </div>

                    {/* Content */}
                    <div className="p-10 space-y-8">
                        <div className="bg-red-50 border-2 border-red-100 rounded-3xl p-6">
                            <h2 className="text-lg font-black text-red-900 mb-3 uppercase tracking-tight">Why was my application rejected?</h2>
                            <div className="space-y-2 text-sm text-red-800">
                                <p className="font-bold leading-relaxed">
                                    Your application may have been rejected for one or more of the following reasons:
                                </p>
                                <ul className="list-disc list-inside space-y-1.5 ml-2 text-red-700">
                                    <li>Incomplete or unclear documentation</li>
                                    <li>Invalid identity proof or business license</li>
                                    <li>Incorrect Tax ID / GST Number format</li>
                                    <li>Documents do not match the information provided</li>
                                    <li>Business does not meet our platform requirements</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-emerald-50 border-2 border-emerald-100 rounded-3xl p-6">
                            <h2 className="text-lg font-black text-emerald-900 mb-3 uppercase tracking-tight">What can I do next?</h2>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-sm flex-shrink-0">1</div>
                                    <div>
                                        <p className="font-bold text-emerald-900">Review your documents</p>
                                        <p className="text-sm text-emerald-700">Ensure all documents are clear, valid, and match your registration details</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-sm flex-shrink-0">2</div>
                                    <div>
                                        <p className="font-bold text-emerald-900">Verify your information</p>
                                        <p className="text-sm text-emerald-700">Double-check that your Tax ID/GST number is correct and active</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-sm flex-shrink-0">3</div>
                                    <div>
                                        <p className="font-bold text-emerald-900">Resubmit your application</p>
                                        <p className="text-sm text-emerald-700">Once you've corrected the issues, you can apply again</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4 pt-4">
                            <button
                                onClick={handleReapply}
                                className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[24px] font-black text-lg shadow-xl shadow-emerald-100 transition-all flex items-center justify-center gap-3 group"
                            >
                                <RefreshCw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                                Reapply for Verification
                            </button>

                            <button
                                onClick={handleContactSupport}
                                className="w-full py-5 bg-white border-2 border-gray-200 hover:border-emerald-500 text-gray-700 hover:text-emerald-700 rounded-[24px] font-black text-lg transition-all flex items-center justify-center gap-3"
                            >
                                <Mail className="w-6 h-6" />
                                Contact Support
                            </button>
                        </div>

                        {/* Info Footer */}
                        <div className="pt-6 border-t border-gray-100">
                            <p className="text-center text-xs text-gray-500 font-bold leading-relaxed">
                                Need help? Our support team is available Monday-Friday, 9 AM - 6 PM IST.<br />
                                Email us at <span className="text-emerald-600 font-black">support@agrim.com</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerRejected;
