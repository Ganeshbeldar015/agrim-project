import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../services/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { Check, X, FileText, ExternalLink, Store, ArrowLeft } from 'lucide-react';

const SellerApprovals = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, "users"),
            where("role", "==", "seller"),
            where("status", "in", ["pending", "pending_verification"])
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const loadedRequests = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRequests(loadedRequests);
            setLoading(false);
        }, (err) => {
            console.error("Error fetching requests:", err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleAction = async (sellerData, action) => {
        const status = action === 'Approve' ? 'approved' : 'rejected';
        const id = sellerData.id;

        if (window.confirm(`Are you sure you want to ${action} this request?`)) {
            try {
                const batch = writeBatch(db);

                // 1. Update status in users table
                const userRef = doc(db, "users", id);
                batch.update(userRef, { status: status });

                // 2. If approved, create/update formal record in 'sellers' table
                if (action === 'Approve') {
                    const sellerRef = doc(db, "sellers", id); // Use same ID as user for consistency
                    batch.set(sellerRef, {
                        sellerId: id,
                        email: sellerData.email,
                        shopName: sellerData.shopName || 'N/A',
                        ownerName: sellerData.displayName || 'N/A',
                        phoneNumber: sellerData.phoneNumber || 'N/A',
                        taxId: sellerData.taxId || '', // Now syncing taxId
                        status: 'active',
                        rating: 0,
                        totalSales: 0,
                        joinedAt: serverTimestamp(),
                        verifiedDocs: sellerData.documents || {},
                        updatedAt: serverTimestamp()
                    }, { merge: true }); // Use merge to avoid losing verification links if any
                }

                await batch.commit();
                alert(`Seller has been ${status}.`);
            } catch (error) {
                console.error("Error updating status:", error);
                alert("Failed to process action: " + error.message);
            }
        }
    };

    if (loading) return <div className="p-8">Loading requests...</div>;

    return (
        <div className="space-y-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-2 text-sm font-medium group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
            </button>
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Franchise Requests</h1>
                <p className="text-sm text-gray-500">Review and approve new seller applications.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Shop Name</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Owner</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Documents</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {requests.length > 0 ? requests.map((req) => (
                            <tr key={req.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{req.shopName || 'N/A'}</div>
                                    <div className="text-xs text-gray-500">{req.email}</div>
                                    <div className="text-xs text-blue-500 mt-1 uppercase">{req.status.replace('_', ' ')}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {req.displayName || 'N/A'}
                                    <div className="text-xs text-gray-400">{req.phoneNumber}</div>
                                </td>
                                <td className="px-6 py-4">
                                    {req.documents ? (
                                        <div className="flex flex-col gap-2">
                                            {Object.entries(req.documents).map(([key, url]) => (
                                                <a
                                                    key={key}
                                                    href={url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1 text-primary-600 hover:underline text-xs"
                                                >
                                                    <FileText className="w-3 h-3" />
                                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                                    <ExternalLink className="w-3 h-3 ml-1" />
                                                </a>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-400">No docs uploaded</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        onClick={() => handleAction(req, 'Approve')}
                                        className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                                    >
                                        <Check className="w-4 h-4 mr-1" /> Approve
                                    </button>
                                    <button
                                        onClick={() => handleAction(req, 'Reject')}
                                        className="inline-flex items-center px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                                    >
                                        <X className="w-4 h-4 mr-1" /> Reject
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                    No pending requests found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SellerApprovals;
