import React from 'react';
import { DollarSign, Users, ShoppingBag, TrendingUp, Activity, Store } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { title: 'Total Revenue', value: '$124,592.00', icon: DollarSign, color: 'text-primary-700', bg: 'bg-primary-50' },
    { title: 'Active Sellers', value: '48', icon: Store, color: 'text-gray-700', bg: 'bg-gray-100' }, 
    { title: 'Total Orders', value: '1,294', icon: ShoppingBag, color: 'text-gray-700', bg: 'bg-gray-100' },
    { title: 'Growth', value: '+12.5%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-sm text-gray-500">Welcome back, Admin. Here is what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">Last 30 Days</span>
            </div>
            <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity & Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Revenue Analytics</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-300">
                <div className="text-center text-gray-400">
                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Chart Visualization Component</p>
                </div>
            </div>
        </div>

        {/* Recent Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
            <div className="space-y-4">
                 {[1, 2, 3, 4, 5].map((i) => (
                     <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                        <div className="w-2 h-2 mt-2 rounded-full bg-primary-500"></div>
                        <div>
                            <p className="text-sm text-black font-bold">New seller registration request</p>
                            <p className="text-xs text-gray-800">2 hours ago</p>
                        </div>
                     </div>
                 ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
