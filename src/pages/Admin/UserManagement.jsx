import React, { useState } from 'react';
import { User, Shield, Ban, Check, MoreVertical } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Customer', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@seller.com', role: 'Seller', status: 'Active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@delivery.com', role: 'Delivery Partner', status: 'Suspended' },
    { id: 4, name: 'Admin User', email: 'admin@antigravity.com', role: 'Admin', status: 'Active' },
  ]);

  const toggleStatus = (id) => {
    setUsers(users.map(u => {
        if (u.id === id) {
            return { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' };
        }
        return u;
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <p className="text-sm text-gray-500">Manage all users across the platform.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border
                    ${user.role === 'Admin' ? 'bg-gray-100 text-gray-800 border-gray-200' : 
                      user.role === 'Seller' ? 'bg-primary-50 text-primary-700 border-primary-100' :
                      user.role === 'Delivery Partner' ? 'bg-primary-50 text-primary-700 border-primary-100' :
                      'bg-white text-gray-600 border-gray-200'
                    }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                   <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium
                    ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {user.status}
                   </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => toggleStatus(user.id)} className="text-gray-400 hover:text-gray-600">
                    {user.status === 'Active' ? <Ban className="w-4 h-4 text-red-400" /> : <Check className="w-4 h-4 text-green-400" />}
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

export default UserManagement;
