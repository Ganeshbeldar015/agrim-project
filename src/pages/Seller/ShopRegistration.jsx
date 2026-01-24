import React, { useState } from 'react';
import { Store, Upload, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ShopRegistration = () => {
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h1>
                    <p className="text-gray-600 mb-6">
                        Your shop registration request has been sent to the Admin team for approval. 
                        You will be notified once your account is activated.
                    </p>
                    <button onClick={() => navigate('/seller')} className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 font-medium">
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <div className="inline-flex p-4 rounded-full bg-primary-100 mb-4">
                        <Store className="w-10 h-10 text-primary-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Register Your Shop</h1>
                    <p className="text-gray-600 mt-2">Join Antigravity and reach millions of customers.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-8">
                    {/* Shop Details */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Shop Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Shop Name</label>
                                <input required type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="e.g. Acme Electronics" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Business Usage Category</label>
                                <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none">
                                    <option>Electronics</option>
                                    <option>Fashion</option>
                                    <option>Home & Garden</option>
                                    <option>Groceries</option>
                                </select>
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-sm font-medium text-gray-700">Description</label>
                                <textarea rows="3" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Tell us about your shop..."></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Contact Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Owner Name</label>
                                <input required type="text" className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Email Address</label>
                                <input required type="email" className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                <input required type="tel" className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Tax ID (GSTIN)</label>
                                <input required type="text" className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                        </div>
                    </div>

                    {/* Documents */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Verification Documents</h2>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 font-medium">Click to upload Business License or Drag & Drop</p>
                            <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 5MB</p>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 font-bold text-lg shadow-lg shadow-primary-200 transition-all">
                            Submit Application
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ShopRegistration;
