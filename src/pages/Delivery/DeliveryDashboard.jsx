import React, { useEffect, useState } from 'react';
import { Truck, MapPin, Watch, CheckCircle, Navigation } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../../services/firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';

const DeliveryDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [deliveries, setDeliveries] = useState([]);

  const [otp, setOtp] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const ordersRef = collection(db, 'orders');
    const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
      const items = snapshot.docs
        .map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        }))
        .filter((order) => order.status === 'Out for Delivery');
      setDeliveries(items);
    });
    return unsubscribe;
  }, []);

  const handleVerify = async (orderId) => {
      if (otp === '1234') {
          await updateDoc(doc(db, 'orders', orderId), { status: 'Delivered' });
          setOtp('');
          setSelectedOrder(null);
      } else {
          alert('Invalid OTP. Please ask customer for the correct code (Try 1234)');
      }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
        {/* Header */}
        <div className="bg-primary-700 text-white p-4 shadow-md sticky top-0 z-10">
            <div className="flex justify-between items-center container mx-auto">
                <div className="flex items-center gap-2">
                    <Truck className="w-6 h-6" />
                    <h1 className="font-bold text-lg">Delivery Partner App</h1>
                </div>
                <button onClick={() => { logout(); navigate('/', { replace: true }); }} className="text-sm bg-primary-800 px-3 py-1 rounded hover:bg-primary-900 transition-colors">Logout</button>
            </div>
        </div>

        <div className="container mx-auto p-4 max-w-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4 px-1">My Task List ({deliveries.length})</h2>

            {deliveries.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    <CheckCircle className="w-16 h-16 mx-auto mb-2 text-green-200" />
                    <p>No active deliveries. Good job!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {deliveries.map((order) => (
                        <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded uppercase">{order.status}</span>
                                    <span className="text-gray-500 text-xs font-mono">{order.id}</span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">{order.customer}</h3>
                                <div className="flex items-start gap-2 mt-2 text-gray-600">
                                    <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                                    <p className="text-sm">{order.address}</p>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 border-t border-gray-100 flex gap-2">
                                <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 hover:bg-gray-50">
                                    <Navigation className="w-4 h-4" /> Map
                                </button>
                                <button 
                                    onClick={() => setSelectedOrder(order.id === selectedOrder ? null : order.id)}
                                    className="flex-1 bg-primary-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition"
                                >
                                    Complete Delivery
                                </button>
                            </div>

                            {/* OTP Verification Panel */}
                            {selectedOrder === order.id && (
                                <div className="p-4 bg-primary-50 border-t border-primary-100 animate-in slide-in-from-top-2">
                                    <p className="text-sm text-primary-800 mb-2 font-medium">Ask customer for 4-digit OTP</p>
                                    <div className="flex gap-2">
                                        <input 
                                            type="number" 
                                            placeholder="XXXX" 
                                            className="flex-1 px-4 py-2 border border-primary-300 rounded-lg text-center tracking-widest font-bold text-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            maxLength={4}
                                        />
                                        <button 
                                            onClick={() => handleVerify(order.id)}
                                            className="bg-primary-700 text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-800"
                                        >
                                            Verify
                                        </button>
                                    </div>
                                    <p className="text-xs text-center text-gray-400 mt-2">Dev Hint: Use '1234'</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};

export default DeliveryDashboard;
