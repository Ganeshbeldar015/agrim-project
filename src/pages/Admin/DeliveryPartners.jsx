import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, MapPin, Package, Search, Filter, Phone, User as UserIcon, ArrowLeft } from 'lucide-react';
import { db } from '../../services/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const DeliveryPartners = () => {
    const navigate = useNavigate();
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "users"), where("role", "==", "delivery"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const loadedPartners = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPartners(loadedPartners);
            setLoading(false);
        }, (err) => {
            console.error("Error fetching delivery partners:", err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) return <div className="p-8">Loading delivery partners...</div>;

    return (
        <div className="space-y-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-2 text-sm font-medium group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back
            </button>
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Delivery Dashboard</h1>
                    <p className="text-sm text-gray-500">Monitor and manage all delivery personnel and transport logistics.</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search partners..." className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none w-64" />
                    </div>
                    <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <Filter className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {partners.length > 0 ? partners.map((partner) => (
                    <div key={partner.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                                        <UserIcon className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{partner.displayName || 'No Name'}</h3>
                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                            <Phone className="w-3 h-3" /> {partner.phoneNumber || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${partner.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {partner.status || 'active'}
                                </span>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-gray-50">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <MapPin className="w-4 h-4" /> Current Area
                                    </div>
                                    <span className="font-medium text-gray-900">{partner.city || 'Kalyan'}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Package className="w-4 h-4" /> Active Deliveries
                                    </div>
                                    <span className="font-bold text-blue-600">0</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Truck className="w-4 h-4" /> Vehicle Type
                                    </div>
                                    <span className="font-medium text-gray-900">E-Bike</span>
                                </div>
                            </div>

                            <button className="w-full mt-6 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors border border-gray-100">
                                View Full Profile
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-20 bg-white rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                        <Truck className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-medium">No delivery partners found in the system.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeliveryPartners;
