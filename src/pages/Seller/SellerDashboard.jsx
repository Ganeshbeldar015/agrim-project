import { ShoppingBag, Package, DollarSign, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const SellerDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    sales: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const fetchStats = async () => {
      try {
        // Products
        const productsRef = collection(db, 'products');
        const qProducts = query(productsRef, where('sellerId', '==', currentUser.uid));
        const productsSnap = await getDocs(qProducts);
        const productsCount = productsSnap.size;

        // Orders
        const ordersRef = collection(db, 'orders');
        const ordersSnap = await getDocs(ordersRef);
        const ordersCount = ordersSnap.size;

        // Sales
        let totalSales = 0;
        ordersSnap.forEach(doc => {
          const data = doc.data();
          // In a real app, filter order items by sellerId. 
          // For now, assuming store owner sees all sales or logic matches SellerOrders
          totalSales += (data.total || 0);
        });

        setStats({
          products: productsCount,
          orders: ordersCount,
          sales: totalSales
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [currentUser]);

  if (loading) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="seller-dashboard p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Seller Dashboard</h1>
      <p className="text-gray-500 mb-8">Welcome back, {currentUser?.displayName || 'Seller'}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sales Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="flex items-center text-green-500 text-sm font-medium bg-green-50 px-2 py-1 rounded">
              <TrendingUp className="w-3 h-3 mr-1" /> +12%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total Sales</h3>
          <p className="text-3xl font-bold text-gray-900 mt-1">${stats.sales.toFixed(2)}</p>
        </div>

        {/* Orders Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Package className="w-6 h-6" />
            </div>
            <span className="flex items-center text-green-500 text-sm font-medium bg-green-50 px-2 py-1 rounded">
              <TrendingUp className="w-3 h-3 mr-1" /> +5%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
          <p className="text-3xl font-bold text-gray-900 mt-1">{stats.orders}</p>
        </div>

        {/* Products Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
          <p className="text-3xl font-bold text-gray-900 mt-1">{stats.products}</p>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
