import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db, storage } from '../../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Upload, CheckCircle, AlertCircle, Clock } from 'lucide-react';

const SellerVerification = () => {
    const { userProfile, currentUser } = useAuth();
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    
    // Redirect if already approved
    useEffect(() => {
        if (userProfile && userProfile.status === 'approved') {
             navigate('/seller/dashboard');
        }
    }, [userProfile, navigate]);

    const handleFileUpload = async (e, docType) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const storageRef = ref(storage, `verification/${currentUser.uid}/${docType}_${Date.now()}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            // Update user document
            const userRef = doc(db, "users", currentUser.uid);
            await updateDoc(userRef, {
                [`documents.${docType}`]: downloadURL,
                status: 'pending_verification' // Update status to indicate docs are uploaded
            });

            setMessage(`${docType} uploaded successfully!`);
        } catch (error) {
            console.error("Error uploading:", error);
            setMessage("Failed to upload document.");
        } finally {
            setUploading(false);
        }
    };

    if (!userProfile) return <div className="p-8">Loading...</div>;

    const isRejected = userProfile.status === 'rejected';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
             <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
                 <div className="text-center mb-8">
                     {isRejected ? (
                         <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                         </div>
                     ) : (
                         <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                            <Clock className="w-8 h-8 text-yellow-600" />
                         </div>
                     )}
                     
                     <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {isRejected ? 'Application Rejected' : 'Verification Pending'}
                     </h1>
                     <p className="text-gray-600">
                        {isRejected 
                            ? "Your seller application was rejected. Please contact support." 
                            : "Please upload the required documents to verify your shop."}
                     </p>
                 </div>

                 {!isRejected && (
                     <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold text-blue-800 mb-2">Required Documents</h3>
                            <ul className="list-disc list-inside text-blue-700 text-sm">
                                <li>Government Issued Identity Proof (Aadhar/PAN)</li>
                                <li>Shop License or Farm Registration Document</li>
                            </ul>
                        </div>

                        {message && <div className="text-center text-green-600 font-medium mb-4">{message}</div>}

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-500 transition-colors">
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <h4 className="font-medium text-gray-900 mb-1">Identity Proof</h4>
                                <input 
                                    type="file" 
                                    onChange={(e) => handleFileUpload(e, 'identity')}
                                    disabled={uploading}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 mt-2"
                                />
                            </div>

                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-500 transition-colors">
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <h4 className="font-medium text-gray-900 mb-1">Shop/Farm License</h4>
                                <input 
                                    type="file" 
                                    onChange={(e) => handleFileUpload(e, 'license')}
                                    disabled={uploading}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 mt-2"
                                />
                            </div>
                        </div>

                        <div className="mt-8 text-center text-sm text-gray-500">
                            Once documents are uploaded, our admin team will review them within 24 hours.
                        </div>
                        
                         <div className="mt-4 text-center">
                            <button onClick={() => navigate('/')} className="text-gray-600 hover:text-gray-900 underline">Back to Home</button>
                        </div>
                     </div>
                 )}
             </div>
        </div>
    );
};

export default SellerVerification;
