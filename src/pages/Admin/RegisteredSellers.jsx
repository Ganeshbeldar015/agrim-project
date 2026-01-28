import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../services/firebase';
import { collection, query, where, onSnapshot, doc, writeBatch } from 'firebase/firestore';
import { Ban, User, Store, Mail, Phone, FileText, ExternalLink, ArrowLeft } from 'lucide-react';
import SellerModal from '../../components/user/SellerModal';

const RegisteredSellers = () => {
    const navigate = useNavigate();
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSellerId, setSelectedSellerId] = useState(null);
    const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);

    useEffect(() => {
        // Fetch only 'active' sellers from the formal 'sellers' collection
        const q = query(collection(db, "sellers"), where("status", "==", "active"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const loadedSellers = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setSellers(loadedSellers);
            setLoading(false);
        }, (err) => {
            console.error("Error fetching sellers:", err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const openSellerModal = (id) => {
        setSelectedSellerId(id);
        setIsSellerModalOpen(true);
    };

    const handleSuspend = async (sellerId) => {
        if (window.confirm("Are you sure you want to suspend this seller? They will be removed from the marketplace and forced to re-verify their documents.")) {
            try {
                const batch = writeBatch(db);

                // 1. Move user status back to 'pending' and clear their documents
                const userRef = doc(db, "users", sellerId);
                batch.update(userRef, {
                    status: 'pending',
                    documents: null // This forces them back to the verification page
                });

                // 2. Remove them from the formal 'sellers' collection
                const sellerRecordRef = doc(db, "sellers", sellerId);
                batch.delete(sellerRecordRef);

                await batch.commit();
                alert("Seller suspended and moved back to verification queue.");
            } catch (error) {
                console.error("Error suspending seller:", error);
                alert("Failed to suspend seller: " + error.message);
            }
        }
    };

    if (loading) return <div className="p-8">Loading registered sellers...</div>;

    return (
        <div className="space-y-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-2 text-sm font-medium group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back
            </button>
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Registered Sellers</h1>
                <p className="text-sm text-gray-500">Manage active marketplace vendors and their permissions.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Shop & Owner</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Verification Docs</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {sellers.length > 0 ? sellers.map((seller) => (
                                <tr
                                    key={seller.id}
                                    onClick={() => openSellerModal(seller.id)}
                                    className="hover:bg-gray-50 transition-colors cursor-pointer group/row"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 group-hover/row:bg-emerald-600 transition-colors">
                                                <Store className="w-5 h-5 text-emerald-600 group-hover/row:text-white transition-colors" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">{seller.shopName || 'N/A'}</div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                                    <User className="w-3 h-3" /> {seller.displayName || 'Seller Name'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="text-gray-800 flex items-center gap-1 font-medium">
                                            <Mail className="w-3 h-3 text-gray-400" /> {seller.email}
                                        </div>
                                        {seller.phoneNumber && (
                                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                <Phone className="w-3 h-3 text-gray-400" /> {seller.phoneNumber}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {(seller.verifiedDocs || seller.documents) ? (
                                            <div className="flex flex-col gap-1">
                                                {Object.entries(seller.verifiedDocs || seller.documents).map(([key, url]) => (
                                                    <a
                                                        key={key}
                                                        href={url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="inline-flex items-center gap-1 text-primary-600 hover:underline text-xs"
                                                    >
                                                        <FileText className="w-3 h-3" />
                                                        <span className="capitalize">{key}</span>
                                                        <ExternalLink className="w-2 h-2" />
                                                    </a>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">No docs found</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSuspend(seller.id);
                                            }}
                                            className="inline-flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs font-bold gap-2"
                                            title="Suspend and Re-verify"
                                        >
                                            <Ban className="w-4 h-4" /> Suspend & Reset
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                        No active sellers registered in the marketplace.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Seller Modal */}
            <SellerModal
                sellerId={selectedSellerId}
                isOpen={isSellerModalOpen}
                onClose={() => setIsSellerModalOpen(false)}
            />
        </div>
    );
};

export default RegisteredSellers;
