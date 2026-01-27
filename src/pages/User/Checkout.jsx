import React, { useEffect, useState } from 'react';
import { CreditCard, MapPin, CheckCircle, ArrowLeft, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, writeBatch, doc } from 'firebase/firestore';

const Checkout = () => {
  const navigate = useNavigate();
  const [complete, setComplete] = useState(false);
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [shipping, setShipping] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zip: '',
    phone: ''
  });

  useEffect(() => {
    if (!currentUser) {
      setCartItems([]);
      return;
    }
    const cartsRef = collection(db, 'carts');
    const q = query(cartsRef, where('userId', '==', currentUser.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setCartItems(items);
    });
    return unsubscribe;
  }, [currentUser]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + ((item.price || 0) * (item.quantity || 1)),
    0
  );
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (cartItems.length === 0) {
      alert("Cart is empty");
      return;
    }

    if (!shipping.address || !shipping.city || !shipping.zip || !shipping.phone) {
      alert("Please fill in all shipping details");
      return;
    }

    try {
      const ordersRef = collection(db, 'orders');
      const batch = writeBatch(db);

      // We generate a unique transaction ID for grouping
      const transactionId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Create a separate order entry for each product to satisfy seller/customer tracking requirements
      for (const item of cartItems) {
        const orderPayload = {
          orderId: transactionId, // Shared ID for items in same order
          customerId: currentUser.uid,
          customerEmail: currentUser.email,
          customerName: `${shipping.firstName} ${shipping.lastName}`.trim() || currentUser.displayName || 'Customer',
          customerPhone: shipping.phone,
          sellerId: item.sellerId || '',
          sellerName: item.sellerName || 'Fresh Harvest',
          productId: item.productId,
          productName: item.name,
          productImage: item.image || '',
          quantity: item.quantity || 1,
          price: item.price || 0,
          total: (item.price || 0) * (item.quantity || 1),
          status: 'pending',
          paymentMethod: paymentMethod, // 'cod' or other
          paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
          shippingAddress: shipping,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        const newOrderRef = doc(ordersRef);
        batch.set(newOrderRef, orderPayload);

        // Delete from cart
        const cartRef = doc(db, 'carts', item.id);
        batch.delete(cartRef);
      }

      await batch.commit();
      setComplete(true);
      setTimeout(() => {
        navigate('/orders');
      }, 3000);
    } catch (err) {
      console.error("Order error:", err);
      alert("Order placement failed: " + err.message);
    }
  };

  if (complete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-12 rounded-3xl shadow-xl max-w-lg w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600 animate-bounce" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Order Successful!</h1>
          <p className="text-gray-500 text-lg mb-8 leading-relaxed">
            Your fresh produce is being prepared. <br />
            Redirecting to your orders...
          </p>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 animate-[loading_3s_ease-in-out]" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 font-sans">
      <div className="container mx-auto px-4 max-w-5xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-emerald-700 transition-colors mb-6 text-sm font-bold uppercase tracking-widest group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Go Back
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="flex-1 space-y-8">
            <h1 className="text-4xl font-black text-emerald-950 tracking-tighter">Confirm Your Order</h1>

            {/* Shipping Address */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-50">
              <h2 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-xl">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                </div>
                Shipping Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-emerald-800 uppercase tracking-widest ml-1">First Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul"
                    className="w-full px-5 py-3 bg-emerald-50/30 border-2 border-transparent focus:border-emerald-200 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                    value={shipping.firstName}
                    onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-emerald-800 uppercase tracking-widest ml-1">Last Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sharma"
                    className="w-full px-5 py-3 bg-emerald-50/30 border-2 border-transparent focus:border-emerald-200 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                    value={shipping.lastName}
                    onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5 col-span-full">
                  <label className="text-xs font-black text-emerald-800 uppercase tracking-widest ml-1">Complete Address</label>
                  <input
                    type="text"
                    placeholder="House No, Street, Landmark..."
                    className="w-full px-5 py-3 bg-emerald-50/30 border-2 border-transparent focus:border-emerald-200 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                    value={shipping.address}
                    onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-emerald-800 uppercase tracking-widest ml-1">City</label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai"
                    className="w-full px-5 py-3 bg-emerald-50/30 border-2 border-transparent focus:border-emerald-200 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                    value={shipping.city}
                    onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-emerald-800 uppercase tracking-widest ml-1">PIN Code</label>
                  <input
                    type="text"
                    placeholder="6 digits"
                    className="w-full px-5 py-3 bg-emerald-50/30 border-2 border-transparent focus:border-emerald-200 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                    value={shipping.zip}
                    onChange={(e) => setShipping({ ...shipping, zip: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5 col-span-full">
                  <label className="text-xs font-black text-emerald-800 uppercase tracking-widest ml-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="10 digit mobile number"
                    className="w-full px-5 py-3 bg-emerald-50/30 border-2 border-transparent focus:border-emerald-200 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                    value={shipping.phone}
                    onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-50">
              <h2 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-xl">
                  <Wallet className="w-5 h-5 text-emerald-600" />
                </div>
                Payment Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${paymentMethod === 'cod' ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-100 hover:border-emerald-200'}`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'}`}>
                    {paymentMethod === 'cod' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-emerald-900">Cash on Delivery</p>
                    <p className="text-xs text-gray-500">Pay when you receive items</p>
                  </div>
                </button>

                <button
                  type="button"
                  disabled
                  className="flex items-center gap-4 p-5 rounded-2xl border-2 border-gray-100 opacity-50 cursor-not-allowed"
                >
                  <div className="w-6 h-6 rounded-full border-2 border-gray-200"></div>
                  <div className="text-left">
                    <p className="font-bold text-gray-400">Online Payment</p>
                    <p className="text-xs text-gray-400">Coming soon...</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="w-full md:w-[380px] space-y-6">
            <div className="bg-emerald-950 p-8 rounded-[40px] text-white shadow-2xl shadow-emerald-200">
              <h2 className="text-2xl font-black mb-6 tracking-tight">Order Summary</h2>

              <div className="space-y-4 mb-8">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-emerald-200/80 font-medium truncate max-w-[150px]">{item.name} <span className="text-emerald-400 ml-1">x{item.quantity}</span></span>
                    <span className="font-black text-emerald-100">₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 py-6 border-y border-emerald-900 text-sm mb-6">
                <div className="flex justify-between text-emerald-300">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-300">
                  <span>Shipping Fee</span>
                  <span className="text-emerald-400 uppercase font-black text-[10px] tracking-widest mt-0.5">Free</span>
                </div>
                <div className="flex justify-between text-emerald-300">
                  <span>Estimated Tax (8%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8">
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest text-emerald-500 mb-1">Final Amount</p>
                  <h3 className="text-4xl font-black tracking-tighter">₹{total.toFixed(2)}</h3>
                </div>
              </div>

              <button
                onClick={handlePayment}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black py-5 rounded-3xl transition-all active:scale-[0.98] shadow-xl shadow-emerald-500/20"
              >
                PLACE ORDER NOW
              </button>

              <p className="text-[10px] text-center text-emerald-500 font-bold mt-6 uppercase tracking-widest px-4 leading-relaxed">
                By placing an order, you agree to our terms of service and delivery policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
