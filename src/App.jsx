import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/common/MainLayout';
import AdminLayout from './components/admin/AdminLayout';
import SellerLayout from './components/seller/SellerLayout';

import AdminDashboard from './pages/Admin/AdminDashboard';
import SellerApprovals from './pages/Admin/SellerApprovals';
import UserManagement from './pages/Admin/UserManagement';

import SellerDashboard from './pages/Seller/SellerDashboard';
import SellerProducts from './pages/Seller/SellerProducts';
import AddProduct from './pages/Seller/AddProduct';
import SellerOrders from './pages/Seller/SellerOrders';
import SellerVerification from './pages/Seller/SellerVerification';

import UserHome from './pages/User/Home';
import ProductDetails from './pages/User/ProductDetails';
import Cart from './pages/User/Cart';
import Checkout from './pages/User/Checkout';
import UserProfile from './pages/User/UserProfile';

import DeliveryDashboard from './pages/Delivery/DeliveryDashboard';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import SellerRegistration from './pages/Auth/SellerRegistration';

function App() {
  return (
    <Router>
      <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/seller-register" element={<SellerRegistration />} />
            
            {/* User Routes (Accessed by all, but can be protected if needed) */}
            <Route path="/" element={<MainLayout><UserHome /></MainLayout>} />
            <Route path="/product/:id" element={<MainLayout><ProductDetails /></MainLayout>} />
            <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
            <Route path="/checkout" element={<MainLayout><Checkout /></MainLayout>} />
            <Route path="/profile" element={<MainLayout><UserProfile /></MainLayout>} />
            <Route path="/orders" element={<MainLayout><UserProfile /></MainLayout>} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout />
                </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="sellers" element={<SellerApprovals />} />
              <Route path="users" element={<UserManagement />} />
            </Route>

            {/* Protected Seller Routes */}
            <Route path="/seller/verification" element={
                <ProtectedRoute allowedRoles={['seller']}>
                    <SellerVerification />
                </ProtectedRoute>
            } />

            <Route path="/seller" element={
                <ProtectedRoute allowedRoles={['seller']} requireApproval={true}>
                    <SellerLayout />
                </ProtectedRoute>
            }>
              <Route index element={<SellerDashboard />} />
              <Route path="products" element={<SellerProducts />} />
              <Route path="products/new" element={<AddProduct />} />
              <Route path="orders" element={<SellerOrders />} />
            </Route>

            {/* Protected Delivery Routes */}
            <Route path="/delivery/*" element={
                <ProtectedRoute allowedRoles={['delivery']}>
                    <DeliveryDashboard />
                </ProtectedRoute>
            } />
          </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
