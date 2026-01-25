import React, { useEffect, useState } from 'react';
import { CreditCard, MapPin, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import { collection, onSnapshot, addDoc, serverTimestamp, writeBatch, doc } from 'firebase/firestore';

const Checkout = () => {
  const navigate = useNavigate();
  const [complete, setComplete] = useState(false);
   const { currentUser } = useAuth();
   const [cartItems, setCartItems] = useState([]);
   const [shipping, setShipping] = useState({
     firstName: '',
     lastName: '',
     address: '',
     city: '',
     zip: ''
   });

   useEffect(() => {
     if (!currentUser) {
       setCartItems([]);
       return;
     }
     const itemsRef = collection(db, 'carts', currentUser.uid, 'items');
     const unsubscribe = onSnapshot(itemsRef, (snapshot) => {
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
      return;
    }
    const ordersRef = collection(db, 'orders');
    const itemsForOrder = cartItems.map((item) => ({
      productId: item.productId || item.id,
      name: item.name,
      quantity: item.quantity || 1,
      price: item.price || 0
    }));
    await addDoc(ordersRef, {
      userId: currentUser.uid,
      userEmail: currentUser.email,
      customerName:
        `${shipping.firstName} ${shipping.lastName}`.trim() ||
        currentUser.displayName ||
        currentUser.email,
      items: itemsForOrder,
      total,
      status: 'Pending',
      shippingAddress: shipping,
      createdAt: serverTimestamp()
    });

    const batch = writeBatch(db);
    cartItems.forEach((item) => {
      const ref = doc(db, 'carts', currentUser.uid, 'items', item.id);
      batch.delete(ref);
    });
    await batch.commit();

    setComplete(true);
    setTimeout(() => {
        navigate('/orders'); // Redirect to orders after success
    }, 3000);
  };

  if (complete) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="text-center">
                <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4 animate-bounce" />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Places Successfully!</h1>
                <p className="text-gray-500">Thank you for shopping with Antigravity. Redirecting...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Forms */}
                <div className="md:col-span-2 space-y-6">
                    {/* Shipping Address */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5" /> Shipping Address
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                              type="text"
                              placeholder="First Name"
                              className="w-full px-4 py-2 border rounded-lg"
                              value={shipping.firstName}
                              onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })}
                            />
                            <input
                              type="text"
                              placeholder="Last Name"
                              className="w-full px-4 py-2 border rounded-lg"
                              value={shipping.lastName}
                              onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })}
                            />
                            <input
                              type="text"
                              placeholder="Address"
                              className="w-full px-4 py-2 border rounded-lg col-span-2"
                              value={shipping.address}
                              onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                            />
                            <input
                              type="text"
                              placeholder="City"
                              className="w-full px-4 py-2 border rounded-lg"
                              value={shipping.city}
                              onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                            />
                            <input
                              type="text"
                              placeholder="ZIP Code"
                              className="w-full px-4 py-2 border rounded-lg"
                              value={shipping.zip}
                              onChange={(e) => setShipping({ ...shipping, zip: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <CreditCard className="w-5 h-5" /> Payment Details
                        </h2>
                        <div className="space-y-4">
                            <input type="text" placeholder="Card Number" className="w-full px-4 py-2 border rounded-lg" />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="MM/YY" className="w-full px-4 py-2 border rounded-lg" />
                                <input type="text" placeholder="CVC" className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
                    <div className="space-y-2 text-sm text-gray-600 border-b border-gray-100 pb-4 mb-4">
                        <div className="flex justify-between">
                          <span>Items ({cartItems.length})</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between"><span>Shipping</span><span>$0.00</span></div>
                        <div className="flex justify-between">
                          <span>Tax</span>
                          <span>${tax.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="flex justify-between font-bold text-lg text-gray-900 mb-6">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <button onClick={handlePayment} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-primary-200">
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Checkout;
