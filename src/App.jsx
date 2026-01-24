import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RoleProvider } from './context/RoleContext';

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
import ShopRegistration from './pages/Seller/ShopRegistration';
import UserHome from './pages/User/Home';
import ProductDetails from './pages/User/ProductDetails';
import Cart from './pages/User/Cart';
import Checkout from './pages/User/Checkout';
import UserProfile from './pages/User/UserProfile';
import DeliveryDashboard from './pages/Delivery/DeliveryDashboard';
import Login from './pages/Auth/Login';

function App() {
  return (
    <Router>
      <AuthProvider>
        <RoleProvider>
          <Routes>
            {/* Auth Route */}
            <Route path="/login" element={<Login />} />

            {/* User Routes (Main Layout) */}
            <Route path="/" element={<MainLayout><UserHome /></MainLayout>} />
            <Route path="/product/:id" element={<MainLayout><ProductDetails /></MainLayout>} />
            <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
            <Route path="/checkout" element={<MainLayout><Checkout /></MainLayout>} />
            <Route path="/profile" element={<MainLayout><UserProfile /></MainLayout>} />
            <Route path="/orders" element={<MainLayout><UserProfile /></MainLayout>} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="sellers" element={<SellerApprovals />} />
              <Route path="users" element={<UserManagement />} />
              {/* Add sub-routes here later */}
            </Route>

            {/* Seller Routes */}
            <Route path="/seller" element={<SellerLayout />}>
              <Route index element={<SellerDashboard />} />
              <Route path="products" element={<SellerProducts />} />
              <Route path="products/new" element={<AddProduct />} />
              <Route path="orders" element={<SellerOrders />} />
              {/* Add sub-routes here later */}
            </Route>
            <Route path="/seller/register" element={<ShopRegistration />} />

            {/* Delivery Routes (TODO: Delivery Layout) */}
            <Route path="/delivery/*" element={<DeliveryDashboard />} />
          </Routes>
        </RoleProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
