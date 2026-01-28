import React, { useEffect, useState } from 'react';
import { db } from '../../services/firebase';
import { collection, query, where, doc, getDoc, onSnapshot } from 'firebase/firestore';
import ProductCard from './ProductCard';
import { X, Store, MapPin, Star, Calendar, Package } from 'lucide-react';

const SellerModal = ({ sellerId, isOpen, onClose }) => {
    const [seller, setSeller] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isOpen || !sellerId) return;

        const fetchSellerData = async () => {
            setLoading(true);
            try {
                // 1. Fetch Seller Info
                const sellerRef = doc(db, 'users', sellerId);
                const sellerSnap = await getDoc(sellerRef);

                if (sellerSnap.exists()) {
                    setSeller(sellerSnap.data());
                } else {
                    setSeller({
                        displayName: 'Local Farmer',
                        email: 'Verified seller',
                        role: 'seller'
                    });
                }

                // 2. Fetch Seller's Products
                const productsRef = collection(db, 'products');
                const q = query(productsRef, where('sellerId', '==', sellerId));

                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const items = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setProducts(items);
                    setLoading(false);
                });

                return () => unsubscribe();
            } catch (error) {
                console.error("Error fetching seller details:", error);
                setLoading(false);
            }
        };

        fetchSellerData();
    }, [sellerId, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-emerald-950/60 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="bg-[#FCFDFB] w-full max-w-5xl max-h-[90vh] rounded-[40px] shadow-2xl relative z-10 overflow-hidden flex flex-col animate-in zoom-in duration-300">
                {/* Close Button Overlay */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white z-50 transition-all active:scale-90"
                >
                    <X className="w-6 h-6" />
                </button>

                {loading ? (
                    <div className="h-96 flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="overflow-y-auto custom-scrollbar">
                        {/* Header Area */}
                        <div className="bg-emerald-950 text-white p-12 pt-16">
                            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                                <div className="w-24 h-24 bg-emerald-800 rounded-3xl flex items-center justify-center text-4xl font-black shadow-2xl border-2 border-emerald-700/50">
                                    {seller?.displayName?.[0] || 'S'}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-4xl font-black tracking-tight">{seller?.displayName || 'Organic Farmer'}</h1>
                                        <span className="bg-emerald-500 text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md">Verified Seller</span>
                                    </div>
                                    <div className="flex flex-wrap gap-6 text-emerald-300/80 text-sm font-medium">
                                        <div className="flex items-center gap-2">
                                            <Store className="w-4 h-4" />
                                            <span>{seller?.role?.toUpperCase() || 'PRODUCER'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            <span>{seller?.address || 'Direct from Farm'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-yellow-400">
                                            < Star className="w-4 h-4 fill-yellow-400" />
                                            <span className="font-bold">4.9 Seller Rating</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Bar */}
                        <div className="px-12 -mt-10">
                            <div className="bg-white rounded-[32px] shadow-xl border border-emerald-50 p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                                <div className="space-y-1">
                                    <p className="text-xs text-emerald-600 font-black uppercase tracking-widest">Experience</p>
                                    <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                                        <Calendar className="w-4 h-4 text-emerald-500" />
                                        <span>8+ Years</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-emerald-600 font-black uppercase tracking-widest">Listings</p>
                                    <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                                        <Package className="w-4 h-4 text-emerald-500" />
                                        <span>{products.length} Items</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-emerald-600 font-black uppercase tracking-widest">Response</p>
                                    <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                        <span>&lt; 2 Hours</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-emerald-600 font-black uppercase tracking-widest">Rank</p>
                                    <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                                        <span className="text-emerald-600 font-black">A+++</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Products Collection */}
                        <div className="p-12 pb-20">
                            <div className="flex items-end justify-between mb-8 border-b-2 border-emerald-50 pb-4">
                                <h2 className="text-2xl font-black text-emerald-950 uppercase tracking-tight">Shop Collection</h2>
                                <p className="text-emerald-600 text-sm font-bold">{products.length} Products</p>
                            </div>

                            {products.length === 0 ? (
                                <div className="py-20 text-center bg-gray-50 rounded-[32px]">
                                    <Package className="w-12 h-12 text-emerald-200 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-emerald-900">No active listings</h3>
                                    <p className="text-emerald-600 text-sm mt-1">This seller hasn't added any products yet.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {products.map(product => (
                                        <div key={product.id} className="hover:-translate-y-2 transition-all duration-300">
                                            <ProductCard product={product} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerModal;
