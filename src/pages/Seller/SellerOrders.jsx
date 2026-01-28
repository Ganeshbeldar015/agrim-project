import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, where } from 'firebase/firestore';
import { ShoppingCart, User, Store, Clock, CheckCircle, Truck, XCircle, Search, Filter, Eye, MapPin, Package, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SellerOrders = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const ordersRef = collection(db, 'orders');
    // Removed orderBy to avoid composite index requirements which might cause silent failures
    const q = query(
      ordersRef,
      where('sellerId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));

      // Sort by date manually to bypass index requirement
      items.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || 0;
        const dateB = b.createdAt?.toDate?.() || 0;
        return dateB - dateA;
      });

      setOrders(items);
      setLoading(false);
    }, (err) => {
      console.error("Seller Orders Fetch Error:", err);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

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
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6 relative min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors mb-2 text-sm font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Dashboard
          </button>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Orders Management</h1>
          <p className="text-gray-500 font-medium">Manage your sales, track deliveries, and update order statuses.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
          <div className="bg-emerald-100 p-2 rounded-xl">
            <Package className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="pr-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Orders</p>
            <p className="text-lg font-black text-emerald-900">{orders.length}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats & Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by Order ID, Product, or Customer..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative w-full md:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              className="w-full pl-9 pr-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none appearance-none font-bold text-gray-700"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="bg-emerald-600 p-4 rounded-2xl shadow-lg shadow-emerald-200 flex items-center justify-between text-white">
          <div>
            <p className="text-xs font-bold text-emerald-100 uppercase tracking-widest">Total Revenue</p>
            <p className="text-2xl font-black">₹{orders.filter(o => o.status !== 'cancelled').reduce((acc, curr) => acc + (curr.total || 0), 0).toFixed(2)}</p>
          </div>
          <div className="bg-emerald-500/30 p-3 rounded-xl">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Info</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Qty</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="font-bold text-gray-400 uppercase tracking-widest text-xs">Syncing with store...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-4 opacity-40">
                      <Package className="w-16 h-16 text-emerald-900" />
                      <p className="font-black uppercase tracking-tighter text-2xl">No Orders Found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-emerald-50/30 transition-colors cursor-pointer group"
                    onClick={() => openOrderDetails(order)}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        {order.productImage ? (
                          <img src={order.productImage} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="" />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-emerald-700 font-black text-xs">#{order.orderId?.split('-')[1] || order.id.slice(0, 8)}</span>
                          <span className="text-gray-900 font-bold text-sm truncate max-w-[200px]">{order.productName}</span>
                          <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                            {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : 'Processing'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-900 font-bold">{order.customerName}</span>
                          <span className="text-gray-400 text-[10px] font-bold tracking-widest">{order.customerPhone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg font-black text-sm">x{order.quantity}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-gray-900 font-black text-base">₹{(order.total || 0).toFixed(2)}</span>

                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
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
            className="fixed inset-0 bg-emerald-950/40 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-900 text-white">
              <div>
                <h2 className="text-2xl font-black tracking-tight">Order Details</h2>
                <p className="text-emerald-400 text-xs font-black uppercase tracking-[0.2em] mt-1">Transaction ID: {selectedOrder.orderId || selectedOrder.id}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors transition-transform hover:rotate-90 duration-300"
              >
                <XCircle className="w-8 h-8" />
              </button>
            </div>

            <div className="p-8 max-h-[75vh] overflow-y-auto space-y-8 scrollbar-hide">
              {/* Product Summary */}
              <div className="flex gap-8 items-start p-8 bg-emerald-50/50 rounded-[32px] border-2 border-dashed border-emerald-100">
                {selectedOrder.productImage ? (
                  <img
                    src={selectedOrder.productImage}
                    alt={selectedOrder.productName}
                    className="w-32 h-32 object-cover rounded-[24px] shadow-xl border-4 border-white"
                  />
                ) : (
                  <div className="w-32 h-32 bg-emerald-100 rounded-[24px] flex items-center justify-center border-4 border-white shadow-lg">
                    <Package className="w-12 h-12 text-emerald-600" />
                  </div>
                )}
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 leading-tight">{selectedOrder.productName}</h3>
                    <p className="text-emerald-700 font-bold text-lg mt-1">₹{selectedOrder.price} <span className="text-gray-400 text-sm font-medium">per unit</span></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-emerald-50 flex-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Quantity</p>
                      <p className="text-xl font-black text-emerald-950">{selectedOrder.quantity}</p>
                    </div>
                    <div className="bg-emerald-600 px-5 py-3 rounded-2xl shadow-lg shadow-emerald-100 flex-1">
                      <p className="text-[10px] font-black text-emerald-50 uppercase tracking-widest mb-1">Total Pay</p>
                      <p className="text-xl font-black text-white">₹{selectedOrder.total?.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
                {/* Customer Summary */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-400 uppercase tracking-widest font-black text-[10px]">
                    <div className="p-1.5 bg-gray-100 rounded-lg"><User className="w-3 h-3" /></div>
                    Shipped To
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-900 font-black text-lg">{selectedOrder.customerName}</p>
                    <p className="text-gray-500 font-medium text-sm italic">{selectedOrder.customerEmail}</p>
                    <p className="text-emerald-600 font-black text-sm mt-2 tracking-widest">{selectedOrder.customerPhone}</p>
                  </div>
                </div>

                {/* Delivery Status Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-400 uppercase tracking-widest font-black text-[10px]">
                    <div className="p-1.5 bg-gray-100 rounded-lg"><Truck className="w-3 h-3" /></div>
                    Order Status
                  </div>
                  <div className="space-y-3">
                    <span className={`inline-block px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-[0.15em] border ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                    <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                      Current status of this item. You can update this below to inform the customer.
                    </p>
                  </div>
                </div>

                {/* Detailed Address */}
                <div className="space-y-4 md:col-span-2">
                  <div className="flex items-center gap-2 text-gray-400 uppercase tracking-widest font-black text-[10px]">
                    <div className="p-1.5 bg-gray-100 rounded-lg"><MapPin className="w-3 h-3" /></div>
                    Delivery Address Details
                  </div>
                  <div className="p-6 bg-gray-50 rounded-[24px] border border-gray-100/50 group hover:border-emerald-200 transition-colors">
                    <p className="text-gray-800 font-bold text-lg leading-relaxed">
                      {selectedOrder.shippingAddress?.address}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="bg-white px-3 py-1.5 rounded-xl text-xs font-black text-gray-500 border border-gray-100 uppercase tracking-widest">{selectedOrder.shippingAddress?.city}</span>
                      <span className="bg-white px-3 py-1.5 rounded-xl text-xs font-black text-gray-500 border border-gray-100 uppercase tracking-widest">{selectedOrder.shippingAddress?.zip}</span>
                      <span className="bg-white px-3 py-1.5 rounded-xl text-xs font-black text-emerald-600 border border-emerald-100 uppercase tracking-widest">PIN: {selectedOrder.shippingAddress?.zip}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seller Action Zone */}
              <div className="pt-8 border-t border-gray-100 space-y-6 px-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-gray-900 text-lg uppercase tracking-tight">Update Progression</h4>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-emerald-300"></div>
                    <div className="w-2 h-2 rounded-full bg-emerald-100"></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['Pending', 'Processing', 'Shipped', 'Delivered'].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(selectedOrder.id, status)}
                      className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${selectedOrder.status?.toLowerCase() === status.toLowerCase()
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100'
                        : 'bg-white border-gray-100 text-gray-400 hover:border-emerald-200 hover:text-emerald-600'
                        }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-center p-4 bg-red-50 rounded-2xl border border-red-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg"><XCircle className="w-4 h-4 text-red-600" /></div>
                    <div>
                      <p className="text-xs font-black text-red-900 uppercase tracking-widest">Problem with order?</p>
                      <p className="text-[10px] text-red-700 font-bold uppercase tracking-tighter">Cancel only if item is out of stock</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'Cancelled')}
                    className="px-6 py-2 bg-white border-2 border-red-200 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
                  >
                    Cancel Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerOrders;
