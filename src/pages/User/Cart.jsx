import React, { useEffect, useState } from 'react';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import { collection, doc, onSnapshot, updateDoc, deleteDoc } from 'firebase/firestore';

const Cart = () => {
    const { currentUser } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            setCartItems([]);
            setLoading(false);
            return;
        }

        const itemsRef = collection(db, 'carts', currentUser.uid, 'items');
        const unsubscribe = onSnapshot(
            itemsRef,
            (snapshot) => {
                const items = snapshot.docs.map((docSnap) => ({
                    id: docSnap.id,
                    ...docSnap.data()
                }));
                setCartItems(items);
                setLoading(false);
            },
            () => {
                setLoading(false);
            }
        );

        return unsubscribe;
    }, [currentUser]);

    const updateQuantity = (id, delta) => {
        if (!currentUser) return;
        const item = cartItems.find((i) => i.id === id);
        if (!item) return;
        const newQty = Math.max(1, (item.quantity || 1) + delta);
        const ref = doc(db, 'carts', currentUser.uid, 'items', id);
        updateDoc(ref, { quantity: newQty });
    };

    const removeItem = (id) => {
        if (!currentUser) return;
        const ref = doc(db, 'carts', currentUser.uid, 'items', id);
        deleteDoc(ref);
    };

    const subtotal = cartItems.reduce(
        (sum, item) => sum + ((item.price || 0) * (item.quantity || 1)),
        0
    );
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    return (
        <div className="bg-gray-100 min-h-screen py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <ShoppingBag className="w-6 h-6" /> Shopping Cart
                </h1>

                {!currentUser && (
                    <div className="bg-white p-12 rounded-xl text-center shadow-sm">
                        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h2 className="text-xl font-bold text-gray-700">Please sign in to view your cart</h2>
                        <a href="/login" className="text-primary-600 hover:underline mt-2 inline-block font-medium">Go to Login</a>
                    </div>
                )}

                {currentUser && loading && (
                    <div className="bg-white p-12 rounded-xl text-center shadow-sm">
                        <h2 className="text-xl font-bold text-gray-700">Loading your cart...</h2>
                    </div>
                )}

                {currentUser && !loading && cartItems.length === 0 ? (
                     <div className="bg-white p-12 rounded-xl text-center shadow-sm">
                        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h2 className="text-xl font-bold text-gray-700">Your cart is empty</h2>
                        <a href="/" className="text-primary-600 hover:underline mt-2 inline-block font-medium">Continue Shopping</a>
                     </div>
                ) : null}

                {currentUser && !loading && cartItems.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm flex gap-4 items-start">
                                    <img src={item.image} alt={item.name} className="w-24 h-24 object-contain bg-gray-50 rounded-lg p-2" />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-gray-800 line-clamp-1">{item.name}</h3>
                                            <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                                        <p className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</p>
                                        
                                        <div className="flex items-center gap-3 mt-3">
                                            <button 
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold"
                                            >-</button>
                                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold"
                                            >+</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
                                <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                                <div className="space-y-3 text-sm text-gray-600 border-b border-gray-100 pb-4 mb-4">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Estimated Tax (8%)</span>
                                        <span>${tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span className="text-green-600 font-medium">Free</span>
                                    </div>
                                </div>
                                <div className="flex justify-between font-bold text-xl text-gray-900 mb-6">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary-200 transition-colors flex items-center justify-center gap-2">
                                    Proceed to Checkout <ArrowRight className="w-5 h-5" />
                                </button>
                                <p className="text-xs text-center text-gray-400 mt-4">Secure Checkout enforced by Antigravity</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
