import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Truck, Check, Eye, ArrowLeft } from 'lucide-react';
import { db } from '../../services/firebase';
import { collection, onSnapshot, doc, updateDoc, query, where } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

const SellerOrders = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('sellerId', '==', currentUser.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setOrders(items);
    });
    return unsubscribe;
  }, [currentUser]);

  const updateStatus = async (id, newStatus) => {
    const ref = doc(db, 'orders', id);
    await updateDoc(ref, { status: newStatus });
  };

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-4 text-sm font-medium group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back
      </button>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Order Management</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Order ID</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Items</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Total</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-sm">{order.id}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.customerName}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {order.productName} (x{order.quantity})
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">₹{(order.total || 0).toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'Shipped' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-green-100 text-green-800'
                    }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {order.status === 'Pending' && (
                    <button onClick={() => updateStatus(order.id, 'Processing')} className="bg-blue-50 text-blue-600 p-2 rounded hover:bg-blue-100" title="Mark Processing">
                      <Package className="w-4 h-4" />
                    </button>
                  )}
                  {order.status === 'Processing' && (
                    <button onClick={() => updateStatus(order.id, 'Shipped')} className="bg-indigo-50 text-indigo-600 p-2 rounded hover:bg-indigo-100" title="Ship Order">
                      <Truck className="w-4 h-4" />
                    </button>
                  )}
                  <button className="bg-gray-50 text-gray-600 p-2 rounded hover:bg-gray-100" title="View Details">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerOrders;
