import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { ShoppingCart, User, Store, Clock, CheckCircle, Truck, XCircle, Search, Filter, Eye, MapPin } from 'lucide-react';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(docSnap => ({
                id: docSnap.id,
                ...docSnap.data()
            }));
            setOrders(items);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const orderRef = doc(db, 'orders', orderId);
            await updateDoc(orderRef, {
                status: newStatus,
                updatedAt: new Date()
            });
            if (selectedOrder?.id === orderId) {
                setSelectedOrder(prev => ({ ...prev, status: newStatus }));
            }
        } catch (err) {
            console.error("Error updating order status:", err);
            alert("Failed to update status");
        }
    };

    const openOrderDetails = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.sellerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.orderId?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6 relative">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Orders Management</h1>
                    <p className="text-gray-500 text-sm">Monitor and manage all customer purchases across the platform.</p>
                </div>
                <div className="bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100">
                    <span className="text-emerald-700 font-bold text-sm">Total Orders: {orders.length}</span>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by Order ID, Product, Seller or Customer..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-48">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <select
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white appearance-none"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Order Info</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Seller</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Customer</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-center">Qty</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Price</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Status</th>

                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                            <span>Loading orders...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <ShoppingCart className="w-12 h-12 text-gray-200" />
                                            <span>No orders found matching your criteria.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                                        onClick={() => openOrderDetails(order)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-emerald-700 font-bold text-sm">#{order.orderId?.split('-')[1] || order.id.slice(0, 8)}</span>
                                                <span className="text-gray-800 font-medium text-sm truncate max-w-[150px]">{order.productName}</span>
                                                <span className="text-gray-400 text-[10px] uppercase font-bold tracking-tighter">
                                                    {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Recent'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                                    <Store className="w-4 h-4 text-emerald-600" />
                                                </div>
                                                <span className="text-gray-700 text-sm font-medium">{order.sellerName || 'Fresh Harvest'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <User className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-gray-700 font-medium">{order.customerName}</span>
                                                    <span className="text-gray-400 text-[10px]">{order.customerPhone}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-gray-700 font-bold">{order.quantity}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-gray-900 font-black">₹{order.total?.toFixed(2)}</span>
                                                <span className="text-[10px] text-gray-400 font-bold uppercase">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openOrderDetails(order);
                                                }}
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Modal */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)}
                    ></div>
                    <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-emerald-950 text-white">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">Order Details</h2>
                                <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest mt-1">ID: #{selectedOrder.orderId || selectedOrder.id}</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-emerald-900 rounded-full transition-colors"
                            >
                                <XCircle className="w-8 h-8" />
                            </button>
                        </div>

                        <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8">
                            {/* Product Info */}
                            <div className="flex gap-6 items-start p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100">
                                {selectedOrder.productImage && (
                                    <img
                                        src={selectedOrder.productImage}
                                        alt={selectedOrder.productName}
                                        className="w-24 h-24 object-cover rounded-2xl shadow-lg"
                                    />
                                )}
                                <div className="flex-1">
                                    <h3 className="text-xl font-black text-emerald-950">{selectedOrder.productName}</h3>
                                    <p className="text-emerald-700 font-bold">₹{selectedOrder.price} per unit</p>
                                    <div className="mt-4 flex gap-4">
                                        <div className="bg-white px-4 py-2 rounded-xl shadow-sm">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quantity</p>
                                            <p className="text-lg font-black text-emerald-900">{selectedOrder.quantity}</p>
                                        </div>
                                        <div className="bg-white px-4 py-2 rounded-xl shadow-sm">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Price</p>
                                            <p className="text-lg font-black text-emerald-900">₹{selectedOrder.total?.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Customer Info */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <User className="w-4 h-4" /> Customer Information
                                    </h4>
                                    <div className="space-y-2">
                                        <p className="text-gray-800 font-black">{selectedOrder.customerName}</p>
                                        <p className="text-gray-600 font-medium text-sm">{selectedOrder.customerEmail}</p>
                                        <p className="text-gray-600 font-bold text-sm tracking-wider">{selectedOrder.customerPhone}</p>
                                    </div>
                                </div>

                                {/* Seller Info */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Store className="w-4 h-4" /> Seller Information
                                    </h4>
                                    <div className="space-y-2">
                                        <p className="text-emerald-900 font-black">{selectedOrder.sellerName || 'Fresh Harvest'}</p>
                                        <p className="text-gray-500 text-xs font-bold uppercase">ID: {selectedOrder.sellerId}</p>
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                <div className="space-y-4 md:col-span-2">
                                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <MapPin className="w-4 h-4" /> Delivery Address
                                    </h4>
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <p className="text-gray-800 font-bold leading-relaxed">
                                            {selectedOrder.shippingAddress?.address}<br />
                                            {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.zip}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Status and Payment */}
                            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6">
                                <div className="flex gap-4 items-center">
                                    <div className="bg-gray-50 px-4 py-2 rounded-xl">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Payment</p>
                                        <span className="font-black text-gray-700 uppercase tracking-wider">{selectedOrder.paymentMethod}</span>
                                    </div>
                                    <div className={`px-4 py-2 rounded-xl border ${getStatusColor(selectedOrder.status)}`}>
                                        <p className="text-[10px] font-black uppercase tracking-widest mb-1">Current Status</p>
                                        <span className="font-black uppercase tracking-wider">{selectedOrder.status}</span>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
