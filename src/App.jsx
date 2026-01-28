import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/common/MainLayout';
import AdminLayout from './components/admin/AdminLayout';
import SellerLayout from './components/seller/SellerLayout';

import AdminDashboard from './pages/Admin/AdminDashboard';
import SellerApprovals from './pages/Admin/SellerApprovals';
import RegisteredSellers from './pages/Admin/RegisteredSellers';
import UserManagement from './pages/Admin/UserManagement';
import DeliveryPartners from './pages/Admin/DeliveryPartners';
import AdminOrders from './pages/Admin/AdminOrders';


import SellerDashboard from './pages/Seller/SellerDashboard';
import SellerProducts from './pages/Seller/SellerProducts';
import AddProduct from './pages/Seller/AddProduct';
import SellerOrders from './pages/Seller/SellerOrders';
import SellerVerification from './pages/Seller/SellerVerification';
import SellerWaiting from './pages/Seller/SellerWaiting';
import SellerRejected from './pages/Seller/SellerRejected';

import UserHome from './pages/User/Home';
import ProductDetails from './pages/User/ProductDetails';
import Cart from './pages/User/Cart';
import Checkout from './pages/User/Checkout';
import UserProfile from './pages/User/UserProfile';
import SeasonalDeals from './pages/User/SeasonalDeals';
import FarmingAdvice from './pages/User/FarmingAdvice';
import TopHarvest from './pages/User/TopHarvest';
import BulkOrders from './pages/User/BulkOrders';

import DeliveryDashboard from './pages/Delivery/DeliveryDashboard';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import SellerRegistration from './pages/Auth/SellerRegistration';
import ForgotPassword from './pages/Auth/ForgotPassword';

import { SearchProvider } from './context/SearchContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <SearchProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/seller-register" element={<SellerRegistration />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />

              {/* User Routes */}
              <Route path="/" element={<MainLayout><UserHome /></MainLayout>} />
              <Route path="/product/:id" element={<MainLayout><ProductDetails /></MainLayout>} />
              <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
              <Route path="/checkout" element={<MainLayout><Checkout /></MainLayout>} />
              <Route path="/profile" element={<MainLayout><UserProfile /></MainLayout>} />
              <Route path="/orders" element={<MainLayout><UserProfile /></MainLayout>} />

              {/* Content Pages */}
              <Route path="/deals" element={<MainLayout><SeasonalDeals /></MainLayout>} />
              <Route path="/service" element={<MainLayout><FarmingAdvice /></MainLayout>} />
              <Route path="/registry" element={<MainLayout><TopHarvest /></MainLayout>} />
              <Route path="/gift-cards" element={<MainLayout><BulkOrders /></MainLayout>} />

              {/* Protected Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="sellers" element={<SellerApprovals />} />
                <Route path="registered-sellers" element={<RegisteredSellers />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="deliveries" element={<DeliveryPartners />} />

              </Route>

              {/* Protected Seller Routes */}
              <Route path="/seller/verification" element={
                <ProtectedRoute allowedRoles={['seller']}>
                  <SellerVerification />
                </ProtectedRoute>
              } />

              <Route path="/seller/waiting" element={
                <ProtectedRoute allowedRoles={['seller']}>
                  <SellerWaiting />
                </ProtectedRoute>
              } />

              <Route path="/seller/rejected" element={
                <ProtectedRoute allowedRoles={['seller']}>
                  <SellerRejected />
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
                <Route path="products/edit/:productId" element={<AddProduct />} />
                <Route path="orders" element={<SellerOrders />} />
              </Route>

              {/* Protected Delivery Routes */}
              <Route path="/delivery/*" element={
                <ProtectedRoute allowedRoles={['delivery']}>
                  <DeliveryDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </SearchProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
