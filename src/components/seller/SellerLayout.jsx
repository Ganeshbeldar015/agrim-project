import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut } from 'lucide-react';

const SellerLayout = () => {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-xl font-bold text-primary-600">Seller Center</h1>
                    <p className="text-xs text-gray-500">Antigravity Platform</p>
                </div>
                
                <nav className="flex-1 p-4 space-y-1">
                    <Link to="/seller" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors">
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link to="/seller/products" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors">
                        <Package className="w-5 h-5" />
                        Products
                    </Link>
                    <Link to="/seller/orders" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors">
                        <ShoppingCart className="w-5 h-5" />
                        Orders
                    </Link>
                    <Link to="/seller/settings" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors">
                        <Settings className="w-5 h-5" />
                        Shop Settings
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button className="flex items-center gap-3 px-4 py-3 w-full text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default SellerLayout;
