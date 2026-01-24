import React, { useState } from 'react';
import { Package, Truck, Check, Eye } from 'lucide-react';

const SellerOrders = () => {
  const [orders, setOrders] = useState([
    { id: 'ORD-781', customer: 'Alice Johnson', items: 'Wireless Headphones (x1)', total: '$299.99', status: 'Pending', date: '2023-10-24' },
    { id: 'ORD-782', customer: 'Bob Miller', items: 'Smart Watch (x2)', total: '$318.00', status: 'Processing', date: '2023-10-23' },
    { id: 'ORD-783', customer: 'Charlie Davis', items: 'Office Chair (x1)', total: '$199.50', status: 'Shipped', date: '2023-10-22' },
  ]);

  const updateStatus = (id, newStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="p-6">
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
                       <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.customer}</td>
                       <td className="px-6 py-4 text-sm text-gray-600">{order.items}</td>
                       <td className="px-6 py-4 text-sm font-bold text-gray-900">{order.total}</td>
                       <td className="px-6 py-4">
                           <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                               order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
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
