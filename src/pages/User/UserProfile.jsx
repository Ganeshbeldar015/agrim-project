import React, { useEffect, useState } from 'react';
import { User, Package, MapPin, CreditCard, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../../services/firebase';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';

const UserProfile = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/', { replace: true });
    };

    useEffect(() => {
        if (!currentUser) {
            setOrders([]);
            setLoadingOrders(false);
            return;
        }
        const ordersRef = collection(db, 'orders');
        const q = query(
            ordersRef,
            where('customerId', '==', currentUser.uid),
            orderBy('createdAt', 'desc')
        );
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const items = snapshot.docs.map((docSnap) => ({
                    id: docSnap.id,
                    ...docSnap.data()
                }));
                setOrders(items);
                setLoadingOrders(false);
            },
            () => {
                setLoadingOrders(false);
            }
        );
        return unsubscribe;
    }, [currentUser]);

    return (
        <div className="bg-gray-100 min-h-screen py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar Navigation */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden text-sm font-medium text-gray-600">
                            <div className="p-6 bg-primary-900 text-white">
                                <div className="w-16 h-16 bg-primary-700 rounded-full flex items-center justify-center mb-4 text-2xl font-bold mx-auto">
                                    {currentUser?.displayName?.[0] || 'U'}
                                </div>
                                <p className="text-center font-bold text-lg">{currentUser?.displayName || 'User'}</p>
                                <p className="text-center text-primary-200 text-xs">{currentUser?.email || 'user@example.com'}</p>
                            </div>

                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`w-full flex items-center gap-3 px-6 py-4 border-b hover:bg-gray-50 transition ${activeTab === 'orders' ? 'text-primary-600 bg-primary-50 border-l-4 border-l-primary-600' : ''}`}
                            >
                                <Package className="w-5 h-5" /> Your Orders
                            </button>
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`w-full flex items-center gap-3 px-6 py-4 border-b hover:bg-gray-50 transition ${activeTab === 'profile' ? 'text-primary-600 bg-primary-50 border-l-4 border-l-primary-600' : ''}`}
                            >
                                <User className="w-5 h-5" /> Login & Security
                            </button>
                            <button
                                onClick={() => setActiveTab('addresses')}
                                className={`w-full flex items-center gap-3 px-6 py-4 border-b hover:bg-gray-50 transition ${activeTab === 'addresses' ? 'text-primary-600 bg-primary-50 border-l-4 border-l-primary-600' : ''}`}
                            >
                                <MapPin className="w-5 h-5" /> Your Addresses
                            </button>
                            <button
                                onClick={() => setActiveTab('payments')}
                                className={`w-full flex items-center gap-3 px-6 py-4 border-b hover:bg-gray-50 transition ${activeTab === 'payments' ? 'text-primary-600 bg-primary-50 border-l-4 border-l-primary-600' : ''}`}
                            >
                                <CreditCard className="w-5 h-5" /> Payment Methods
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-6 py-4 text-red-500 hover:bg-red-50 transition"
                            >
                                <LogOut className="w-5 h-5" /> Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="md:col-span-3">
                        {activeTab === 'orders' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-800">Your Orders</h2>
                                {loadingOrders && (
                                    <p className="text-gray-500 text-sm">Loading orders...</p>
                                )}
                                {!loadingOrders && orders.length === 0 && (
                                    <p className="text-gray-500 text-sm">You have not placed any orders yet.</p>
                                )}
                                <div className="space-y-4">
                                    {orders.map(order => (
                                        <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center text-sm text-gray-500">
                                                <div className="flex gap-8">
                                                    <div>
                                                        <span className="block text-xs uppercase font-bold text-gray-400">Order Placed</span>
                                                        <span className="text-gray-800">
                                                            {order.createdAt?.toDate
                                                                ? order.createdAt.toDate().toLocaleDateString()
                                                                : ''}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-xs uppercase font-bold text-gray-400">Total</span>
                                                        <span className="text-gray-800">
                                                            ${Number(order.total || 0).toFixed(2)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-xs uppercase font-bold text-gray-400">Order #</span>
                                                        <span className="text-gray-800">{order.id}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-6 flex justify-between items-center gap-4">
                                                <div className="flex items-center gap-4">
                                                    {order.productImage && (
                                                        <img src={order.productImage} alt={order.productName} className="w-16 h-16 object-cover rounded-lg border" />
                                                    )}
                                                    <div>
                                                        <h3 className="font-bold text-gray-800">{order.productName}</h3>
                                                        <p className="text-sm text-primary-600 font-medium">Status: {order.status}</p>
                                                        <p className="text-xs text-gray-500 mt-1">Quantity: {order.quantity}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3">
                                                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Track</button>
                                                    <button
                                                        onClick={() => navigate(`/product/${order.productId}`)}
                                                        className="px-4 py-2 bg-primary-600 rounded-lg text-sm font-bold text-white hover:bg-primary-700 shadow-sm"
                                                    >Buy Again</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-xl shadow-sm p-8 max-w-2xl">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Login & Security</h2>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center border-b pb-4">
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">Name</p>
                                            <p className="text-gray-600">{currentUser?.displayName}</p>
                                        </div>
                                        <button className="text-primary-600 border border-primary-600 px-4 py-1 rounded hover:bg-primary-50 text-sm">Edit</button>
                                    </div>
                                    <div className="flex justify-between items-center border-b pb-4">
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">Email</p>
                                            <p className="text-gray-600">{currentUser?.email}</p>
                                        </div>
                                        <button className="text-primary-600 border border-primary-600 px-4 py-1 rounded hover:bg-primary-50 text-sm">Edit</button>
                                    </div>
                                    <div className="flex justify-between items-center border-b pb-4">
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">Password</p>
                                            <p className="text-gray-600">********</p>
                                        </div>
                                        <button className="text-primary-600 border border-primary-600 px-4 py-1 rounded hover:bg-primary-50 text-sm">Change</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'addresses' && (
                            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
                                <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                <p>No addresses saved yet.</p>
                                <button className="mt-4 text-blue-600 font-medium hover:underline">Add New Address</button>
                            </div>
                        )}

                        {activeTab === 'payments' && (
                            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
                                <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                <p>No payment methods saved.</p>
                                <button className="mt-4 text-blue-600 font-medium hover:underline">Add Payment Method</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
