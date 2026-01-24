import React, { useState } from 'react';
import { CreditCard, MapPin, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();
  const [complete, setComplete] = useState(false);

  const handlePayment = (e) => {
    e.preventDefault();
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
                            <input type="text" placeholder="First Name" className="w-full px-4 py-2 border rounded-lg" />
                            <input type="text" placeholder="Last Name" className="w-full px-4 py-2 border rounded-lg" />
                            <input type="text" placeholder="Address" className="w-full px-4 py-2 border rounded-lg col-span-2" />
                            <input type="text" placeholder="City" className="w-full px-4 py-2 border rounded-lg" />
                            <input type="text" placeholder="ZIP Code" className="w-full px-4 py-2 border rounded-lg" />
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
                        <div className="flex justify-between"><span>Items (3)</span><span>$458.99</span></div>
                        <div className="flex justify-between"><span>Shipping</span><span>$0.00</span></div>
                        <div className="flex justify-between"><span>Tax</span><span>$36.72</span></div>
                    </div>
                    <div className="flex justify-between font-bold text-lg text-gray-900 mb-6">
                        <span>Total:</span>
                        <span>$495.71</span>
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
