import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, ShoppingBag, Truck, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
    // Mock user for now if context not fully ready
    // const { logout } = useAuth(); // TODO: Implement logout
    
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-primary-900 text-white flex flex-col">
                <div className="p-4 border-b border-primary-800">
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <LayoutDashboard className="w-6 h-6 text-white" />
                        Admin ERP
                    </h1>
                </div>
                
                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-primary-100 hover:bg-primary-800 hover:text-white rounded-lg transition-colors">
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link to="/admin/sellers" className="flex items-center gap-3 px-4 py-3 text-primary-100 hover:bg-primary-800 hover:text-white rounded-lg transition-colors">
                        <ShoppingBag className="w-5 h-5" />
                        Sellers & Shops
                    </Link>
                    <Link to="/admin/users" className="flex items-center gap-3 px-4 py-3 text-primary-100 hover:bg-primary-800 hover:text-white rounded-lg transition-colors">
                        <Users className="w-5 h-5" />
                        Users Management
                    </Link>
                    <Link to="/admin/deliveries" className="flex items-center gap-3 px-4 py-3 text-primary-100 hover:bg-primary-800 hover:text-white rounded-lg transition-colors">
                        <Truck className="w-5 h-5" />
                        Delivery Partners
                    </Link>
                    <Link to="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-primary-100 hover:bg-primary-800 hover:text-white rounded-lg transition-colors">
                        <Settings className="w-5 h-5" />
                        Settings
                    </Link>
                </nav>

                <div className="p-4 border-t border-primary-800">
                    <button className="flex items-center gap-3 px-4 py-3 w-full text-red-300 hover:bg-primary-800 hover:text-red-100 rounded-lg transition-colors">
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Overview</h2>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <span className="text-sm font-medium">Admin User</span>
                    </div>
                </header>
                <div className="p-6">
                   <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
