import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ShieldCheck, Link as LinkIcon, AlertCircle, Clock, Save } from 'lucide-react';

const SellerVerification = () => {
    const { userProfile, currentUser } = useAuth();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [urls, setUrls] = useState({
        identityUrl: '',
        licenseUrl: '',
        taxId: ''
    });

    // Redirect if already approved
    useEffect(() => {
        if (userProfile && userProfile.status === 'approved') {
            navigate('/seller');
        }
    }, [userProfile, navigate]);

    const handleChange = (e) => {
        setUrls({ ...urls, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) return;

        setSubmitting(true);
        setError('');

        try {
            // Use a batch to update both users and sellers collections
            const { writeBatch, doc: fireDoc } = await import('firebase/firestore');
            const batch = writeBatch(db);

            const userRef = fireDoc(db, "users", currentUser.uid);
            const sellerRef = fireDoc(db, "sellers", currentUser.uid);

            const updates = {
                documents: {
                    identity: urls.identityUrl,
                    license: urls.licenseUrl
                },
                taxId: urls.taxId,
                status: 'pending_verification', // Mark as ready for admin review
                updatedAt: serverTimestamp()
            };

            batch.update(userRef, updates);
            batch.update(sellerRef, {
                verifiedDocs: updates.documents,
                taxId: urls.taxId,
                status: 'pending_verification',
                updatedAt: serverTimestamp()
            });

            await batch.commit();

            alert("Verification details submitted successfully! Admin will review your shop shortly.");
            navigate('/seller/waiting');
        } catch (err) {
            console.error("Verification error:", err);
            setError("Failed to submit details. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!userProfile) return <div className="p-8 text-center">Loading Profile...</div>;

    const isPending = userProfile.status === 'pending_verification';
    const isRejected = userProfile.status === 'rejected';

    if (isPending) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                    <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Pending Review</h1>
                    <p className="text-gray-600 mb-6">
                        Your verification details have been received and are currently being reviewed by our team.
                        We'll notify you once your shop is active.
                    </p>
                    <button onClick={() => navigate('/')} className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 flex flex-col items-center justify-center">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4 border border-primary-100">
                        <ShieldCheck className="w-8 h-8 text-primary-600" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Seller Verification</h1>
                    <p className="text-gray-600">
                        Please provide your business document links and Tax ID to activate your shop.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">Identity Proof URL (Google Drive/Dropbox)</label>
                        <div className="relative">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                name="identityUrl"
                                type="url"
                                required
                                value={urls.identityUrl}
                                onChange={handleChange}
                                placeholder="https://drive.google.com/..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                            />
                        </div>
                        <p className="text-xs text-gray-500">Aadhar, PAN, or Passport link (Make sure link is shared/public)</p>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">Shop License / Farm Registration URL</label>
                        <div className="relative">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                name="licenseUrl"
                                type="url"
                                required
                                value={urls.licenseUrl}
                                onChange={handleChange}
                                placeholder="https://drive.google.com/..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">Tax ID / GST Number</label>
                        <input
                            name="taxId"
                            type="text"
                            required
                            value={urls.taxId}
                            onChange={handleChange}
                            placeholder="GSTIN12345678"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                        />
                    </div>

                    <div className="pt-4 flex flex-col gap-3">
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`w-full py-4 bg-primary-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-primary-700 transition-all flex items-center justify-center gap-2 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {submitting ? 'Submitting...' : <><Save className="w-5 h-5" /> Submit for Review</>}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="w-full py-3 bg-white text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>

                {isRejected && (
                    <div className="mt-8 p-4 bg-red-50 rounded-xl border border-red-200">
                        <h3 className="text-red-800 font-bold mb-1 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" /> Application Rejected
                        </h3>
                        <p className="text-red-700 text-sm">
                            Your previous application was rejected. Please review your document links and resubmit if necessary.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerVerification;
