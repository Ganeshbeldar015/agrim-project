import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, doc, onSnapshot, query, where, setDoc, getDoc, updateDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            setCartItems([]);
            setLoading(false);
            return;
        }

        const cartsRef = collection(db, 'carts');
        const q = query(cartsRef, where('userId', '==', currentUser.uid));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(docSnap => ({
                id: docSnap.id,
                ...docSnap.data()
            }));
            setCartItems(items);
            setLoading(false);
        }, (err) => {
            console.error("Cart fetch error:", err);
            setLoading(false);
        });

        return unsubscribe;
    }, [currentUser]);

    const addToCart = async (product) => {
        if (!currentUser) {
            return { success: false, error: 'Please login to add items to cart' };
        }

        try {
            const cartItemId = `${currentUser.uid}_${product.id}`;
            const itemRef = doc(db, 'carts', cartItemId);
            const snap = await getDoc(itemRef);

            if (snap.exists()) {
                const data = snap.data();
                await updateDoc(itemRef, {
                    quantity: (data.quantity || 1) + 1,
                    updatedAt: serverTimestamp()
                });
            } else {
                await setDoc(itemRef, {
                    userId: currentUser.uid,
                    productId: product.id,
                    sellerId: product.sellerId || '',
                    sellerName: product.sellerName || 'Seller',
                    name: product.name,
                    price: product.price || 0,
                    image: product.image || '',
                    category: product.category || '',
                    quantity: 1,
                    createdAt: serverTimestamp()
                });
            }
            return { success: true };
        } catch (err) {
            console.error("Add to cart error:", err);
            return { success: false, error: err.message };
        }
    };

    const updateQuantity = async (id, delta) => {
        const item = cartItems.find(i => i.id === id);
        if (!item) return;

        const newQty = Math.max(1, (item.quantity || 1) + delta);
        const ref = doc(db, 'carts', id);

        try {
            await updateDoc(ref, { quantity: newQty });
        } catch (err) {
            console.error("Update quantity error:", err);
        }
    };

    const removeItem = async (id) => {
        const ref = doc(db, 'carts', id);
        try {
            await deleteDoc(ref);
        } catch (err) {
            console.error("Remove item error:", err);
        }
    };

    const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const subtotal = cartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);

    const value = {
        cartItems,
        cartCount,
        subtotal,
        loading,
        addToCart,
        updateQuantity,
        removeItem
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
