import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db, storage } from '../../services/firebase';
import { doc, updateDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ShieldCheck, FileText, AlertCircle, Clock, Save, Upload, CheckCircle2 } from 'lucide-react';

const SellerVerification = () => {
    const { userProfile, currentUser } = useAuth();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [files, setFiles] = useState({
        identityFile: null,
        licenseFile: null
    });
    const [taxId, setTaxId] = useState('');

    useEffect(() => {
        if (userProfile && userProfile.status === 'approved') {
            navigate('/seller');
        }
    }, [userProfile, navigate]);

    const handleFileChange = (e) => {
        const { name, files: selectedFiles } = e.target;
        if (selectedFiles && selectedFiles[0]) {
            setFiles(prev => ({ ...prev, [name]: selectedFiles[0] }));
        }
    };

    const uploadFile = async (file, folder) => {
        if (!file) return null;
        const storageRef = ref(storage, `verification/${currentUser.uid}/${folder}_${Date.now()}`);
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) return;
        if (!files.identityFile || !files.licenseFile) {
            setError("Please upload all required documents.");
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            // Upload files to Firebase Storage
            const identityUrl = await uploadFile(files.identityFile, 'identity');
            const licenseUrl = await uploadFile(files.licenseFile, 'license');

            const batch = writeBatch(db);
            const userRef = doc(db, "users", currentUser.uid);
            const sellerRef = doc(db, "sellers", currentUser.uid);

            const updates = {
                documents: {
                    identity: identityUrl,
                    license: licenseUrl
                },
                taxId: taxId,
                status: 'pending_verification',
                updatedAt: serverTimestamp()
            };

            batch.update(userRef, updates);
            batch.set(sellerRef, {
                sellerId: currentUser.uid,
                email: currentUser.email,
                shopName: userProfile.shopName || '',
                ownerName: userProfile.displayName || '',
                phoneNumber: userProfile.phoneNumber || '',
                verifiedDocs: updates.documents,
                taxId: taxId,
                status: 'pending_verification',
                updatedAt: serverTimestamp()
            }, { merge: true });

            await batch.commit();

            alert("Verification documents uploaded successfully! Admin will review your shop shortly.");
            navigate('/seller/waiting');
        } catch (err) {
            console.error("Verification error:", err);
            setError("Failed to upload documents. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!userProfile) return <div className="p-8 text-center text-gray-500">Loading Profile...</div>;

    const isPending = userProfile.status === 'pending_verification';
    const isRejected = userProfile.status === 'rejected';

    if (isPending) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-emerald-50">
                    <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Clock className="w-10 h-10 text-yellow-500 animate-pulse" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-4">Pending Review</h1>
                    <p className="text-gray-500 font-medium leading-relaxed mb-8">
                        Your verification documents have been received and are currently being reviewed by our team.
                        We'll activate your shop once everything is verified.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-200"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 flex flex-col items-center justify-center">
            <div className="max-w-2xl w-full bg-white rounded-[40px] shadow-2xl p-10 border border-emerald-50">
                <div className="text-center mb-10">
                    <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4 rotate-3">
                        <ShieldCheck className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Seller Verification</h1>
                    <p className="text-gray-500 font-medium">
                        Upload your business documents to start selling on Agrim.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 font-bold text-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Identity Doc */}
                    <div className="space-y-3">
                        <label className="block text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Identity Proof (Aadhar/PAN)</label>
                        <div className={`relative border-2 border-dashed rounded-3xl p-8 transition-all ${files.identityFile ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-200 hover:border-emerald-300'}`}>
                            <input
                                name="identityFile"
                                type="file"
                                required
                                accept="image/*,.pdf"
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center text-center">
                                {files.identityFile ? (
                                    <>
                                        <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2" />
                                        <p className="font-bold text-emerald-950 uppercase tracking-tight">{files.identityFile.name}</p>
                                        <p className="text-xs text-emerald-600 font-medium mt-1">Ready to upload</p>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-10 h-10 text-gray-300 mb-2" />
                                        <p className="font-bold text-gray-500 uppercase tracking-tight">Click to upload document</p>
                                        <p className="text-xs text-gray-400 font-medium mt-1">Supports JPG, PNG or PDF</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* License Doc */}
                    <div className="space-y-3">
                        <label className="block text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Shop License / Farm Registration</label>
                        <div className={`relative border-2 border-dashed rounded-3xl p-8 transition-all ${files.licenseFile ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-200 hover:border-emerald-300'}`}>
                            <input
                                name="licenseFile"
                                type="file"
                                required
                                accept="image/*,.pdf"
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center text-center">
                                {files.licenseFile ? (
                                    <>
                                        <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2" />
                                        <p className="font-bold text-emerald-950 uppercase tracking-tight">{files.licenseFile.name}</p>
                                        <p className="text-xs text-emerald-600 font-medium mt-1">Ready to upload</p>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-10 h-10 text-gray-300 mb-2" />
                                        <p className="font-bold text-gray-500 uppercase tracking-tight">Click to upload license</p>
                                        <p className="text-xs text-gray-400 font-medium mt-1">Supports JPG, PNG or PDF</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tax ID */}
                    <div className="space-y-3">
                        <label className="block text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Tax ID / GST Number</label>
                        <div className="relative">
                            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                required
                                value={taxId}
                                onChange={(e) => setTaxId(e.target.value)}
                                placeholder="e.g. 29AAAAA0000A1Z5"
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-gray-700"
                            />
                        </div>
                    </div>

                    <div className="pt-6 flex flex-col gap-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`w-full py-5 bg-emerald-600 text-white rounded-[24px] font-black text-lg shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {submitting ? (
                                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <><Save className="w-6 h-6" /> Submit Documents</>
                            )}
                        </button>
                    </div>
                </form>

                {isRejected && (
                    <div className="mt-10 p-5 bg-red-50 rounded-[24px] border border-red-100">
                        <h3 className="text-red-900 font-black mb-1 flex items-center gap-2 uppercase tracking-widest text-xs">
                            <AlertCircle className="w-4 h-4" /> Application Rejected
                        </h3>
                        <p className="text-red-700 text-xs font-bold leading-relaxed">
                            Your previous documents were not accepted. Please ensure all uploads are clear and valid before resubmitting.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerVerification;
