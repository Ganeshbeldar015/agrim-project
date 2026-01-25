import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRole } from '../../context/RoleContext';
import { Shield, Store, User, Truck } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { setRole } = useRole();

    const handleLogin = (role, redirectPath) => {
        login(role); // Sets user in AuthContext
        setRole(role); // Sets role in RoleContext
        navigate(redirectPath);
    };

    return (
        <div className="min-h-screen bg-primary-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border-t-4 border-primary-600">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-500">Select a role to login (Dev Mode)</p>
                </div>

                <div className="space-y-4">
                    <button 
                        onClick={() => handleLogin('user', '/')}
                        className="w-full flex items-center p-4 border-2 border-transparent bg-gray-50 hover:bg-primary-50 hover:border-primary-400 rounded-xl transition-all group"
                    >
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-primary-200 transaction-colors">
                            <User className="w-6 h-6 text-primary-700" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-gray-900">Customer</h3>
                            <p className="text-sm text-gray-500">Browse and buy products</p>
                        </div>
                    </button>

                    <button 
                         onClick={() => handleLogin('seller', '/seller')}
                         className="w-full flex items-center p-4 border-2 border-transparent bg-gray-50 hover:bg-blue-50 hover:border-blue-400 rounded-xl transition-all group"
                    >
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-blue-200 transaction-colors">
                            <Store className="w-6 h-6 text-blue-700" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-gray-900">Seller</h3>
                            <p className="text-sm text-gray-500">Manage shop and orders</p>
                        </div>
                    </button>

                    <button 
                         onClick={() => handleLogin('admin', '/admin')}
                         className="w-full flex items-center p-4 border-2 border-transparent bg-gray-50 hover:bg-purple-50 hover:border-purple-400 rounded-xl transition-all group"
                    >
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-purple-200 transaction-colors">
                            <Shield className="w-6 h-6 text-purple-700" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-gray-900">Admin</h3>
                            <p className="text-sm text-gray-500">ERP verification & control</p>
                        </div>
                    </button>

                    <button 
                        onClick={() => handleLogin('delivery', '/delivery')}
                        className="w-full flex items-center p-4 border-2 border-transparent bg-gray-50 hover:bg-green-50 hover:border-green-400 rounded-xl transition-all group"
                    >
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-green-200 transaction-colors">
                            <Truck className="w-6 h-6 text-green-700" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-gray-900">Delivery Partner</h3>
                            <p className="text-sm text-gray-500">Verify OTP & Deliveries</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;

