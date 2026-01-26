import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Ban, Check, MoreVertical, Mail, Phone, ShoppingBag, ArrowLeft } from 'lucide-react';
import { db } from '../../services/firebase';
import { collection, query, onSnapshot, doc, updateDoc, orderBy } from 'firebase/firestore';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedUsers = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        // Filter out admin and seller roles dynamically
        .filter(user => user.role !== 'admin' && user.role !== 'seller');

      setUsers(loadedUsers);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching users:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' || currentStatus === 'approved' ? 'suspended' : 'active';
    if (window.confirm(`Are you sure you want to change this user status to ${newStatus}?`)) {
      try {
        await updateDoc(doc(db, "users", id), {
          status: newStatus
        });
      } catch (err) {
        console.error("Error toggling status:", err);
        alert("Failed to update status.");
      }
    }
  };

  if (loading) return <div className="p-8">Loading users...</div>;

  return (
    <div className="space-y-6 text-gray-800">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-2 text-sm font-medium group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back
      </button>
      <div>
        <h1 className="text-2xl font-bold text-gray-800">User & Marketplace Management</h1>
        <p className="text-sm text-gray-500">Monitor and manage all customer and delivery accounts.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Identity</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center border border-primary-100">
                        <User className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="flex flex-col">
                        <div className="font-bold text-gray-900">{user.displayName || user.name || 'Anonymous User'}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {user.email}
                        </div>
                        {user.phoneNumber && (
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {user.phoneNumber}
                          </div>
                        )}
                        {user.shopName && (
                          <div className="text-xs text-primary-600 font-medium flex items-center gap-1 mt-0.5">
                            <ShoppingBag className="w-3 h-3" /> {user.shopName}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize
                                            ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                        user.role === 'seller' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                          user.role === 'delivery' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                            'bg-gray-50 text-gray-600 border-gray-100'
                      }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize
                                            ${(user.status === 'active' || user.status === 'approved') ? 'bg-green-100 text-green-700' :
                        user.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${(user.status === 'active' || user.status === 'approved') ? 'bg-green-500' : user.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                      {user.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => toggleStatus(user.id, user.status)}
                        className={`p-2 rounded-lg transition-colors border ${(user.status === 'active' || user.status === 'approved')
                          ? 'text-red-500 hover:bg-red-50 border-white'
                          : 'text-green-600 hover:bg-green-50 border-white'
                          }`}
                        title={(user.status === 'active' || user.status === 'approved') ? 'Suspend Account' : 'Activate Account'}
                      >
                        {(user.status === 'active' || user.status === 'approved') ? <Ban className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && (
          <div className="p-20 text-center text-gray-500">
            No users found in the system.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
