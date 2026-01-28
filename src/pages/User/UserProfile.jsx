import React, { useEffect, useState } from 'react';
import { User, Package, MapPin, CreditCard, LogOut, Settings, Store, ArrowLeft, Star, MessageSquare, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../services/firebase';
import { collection, onSnapshot, query, where, orderBy, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';

const UserProfile = () => {
    const { currentUser, userProfile, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [reviewData, setReviewData] = useState({
        rating: 5,
        comment: ''
    });
    const [submittingReview, setSubmittingReview] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/', { replace: true });
    };

    const openReviewModal = (order) => {
        setSelectedOrder(order);
        setReviewData({
            rating: order.review?.rating || 5,
            comment: order.review?.comment || ''
        });
        setReviewModalOpen(true);
    };

    const closeReviewModal = () => {
        setReviewModalOpen(false);
        setSelectedOrder(null);
        setReviewData({ rating: 5, comment: '' });
    };

    const submitReview = async () => {
        if (!selectedOrder || !reviewData.comment.trim()) {
            alert('Please write a review comment');
            return;
        }

        setSubmittingReview(true);
        try {
            const orderRef = doc(db, 'orders', selectedOrder.id);
            await updateDoc(orderRef, {
                review: {
                    rating: reviewData.rating,
                    comment: reviewData.comment.trim(),
                    customerName: currentUser.displayName || 'Anonymous',
                    customerId: currentUser.uid,
                    createdAt: serverTimestamp()
                },
                reviewedAt: serverTimestamp()
            });
            alert('Review submitted successfully!');
            closeReviewModal();
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review: ' + error.message);
        } finally {
            setSubmittingReview(false);
        }
    };

    useEffect(() => {
        if (!currentUser) {
            setOrders([]);
            setLoadingOrders(false);
            return;
        }
        const ordersRef = collection(db, 'orders');
        // Removed orderBy to avoid composite index requirements which might cause silent failures
        const q = query(
            ordersRef,
            where('customerId', '==', currentUser.uid)
        );
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const items = snapshot.docs.map((docSnap) => ({
                    id: docSnap.id,
                    ...docSnap.data()
                }));
                // Sort by date manually to bypass index requirement
                items.sort((a, b) => {
                    const dateA = a.createdAt?.toDate?.() || 0;
                    const dateB = b.createdAt?.toDate?.() || 0;
                    return dateB - dateA;
                });
                setOrders(items);
                setLoadingOrders(false);
            },
            (err) => {
                console.error("Order Fetch Error:", err);
                setLoadingOrders(false);
            }
        );
        return unsubscribe;
    }, [currentUser]);

    return (
        <div className="bg-gray-100 min-h-screen py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-4 text-sm font-medium group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar Navigation */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden text-sm font-medium text-gray-600">
                            <div className="p-6 bg-primary-900 text-white">
                                <div className="w-16 h-16 bg-primary-700 rounded-full flex items-center justify-center mb-4 text-2xl font-bold mx-auto">
                                    {currentUser?.displayName?.[0] || 'U'}
                                </div>
                                <p className="text-center font-bold text-lg">{currentUser?.displayName || 'User'}</p>
                                <p className="text-center text-primary-200 text-xs">{currentUser?.email || 'user@example.com'}</p>
                            </div>

                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`w-full flex items-center gap-3 px-6 py-4 border-b hover:bg-gray-50 transition ${activeTab === 'orders' ? 'text-primary-600 bg-primary-50 border-l-4 border-l-primary-600' : ''}`}
                            >
                                <Package className="w-5 h-5" /> Your Orders
                            </button>
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`w-full flex items-center gap-3 px-6 py-4 border-b hover:bg-gray-50 transition ${activeTab === 'profile' ? 'text-primary-600 bg-primary-50 border-l-4 border-l-primary-600' : ''}`}
                            >
                                <User className="w-5 h-5" /> Login & Security
                            </button>


                            {userProfile?.role === 'seller' && (
                                <button
                                    onClick={() => {
                                        const status = userProfile.status;
                                        // Precise check based on DB schema map
                                        const hasIdentity = userProfile.documents?.identity;
                                        const hasLicense = userProfile.documents?.license;

                                        if (status === 'rejected') {
                                            navigate('/seller/rejected');
                                        } else if (status === 'approved') {
                                            navigate('/seller');
                                        } else if (hasIdentity && hasLicense) {
                                            navigate('/seller/waiting');
                                        } else {
                                            navigate('/seller/verification');
                                        }
                                    }}
                                    className={`w-full flex items-center gap-3 px-6 py-4 border-b hover:bg-gray-50 transition text-emerald-700 bg-emerald-50`}
                                >
                                    <Store className="w-5 h-5" /> Seller Dashboard
                                </button>
                            )}


                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-6 py-4 text-red-500 hover:bg-red-50 transition"
                            >
                                <LogOut className="w-5 h-5" /> Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="md:col-span-3">
                        {activeTab === 'orders' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-800">Your Orders</h2>
                                {loadingOrders && (
                                    <p className="text-gray-500 text-sm">Loading orders...</p>
                                )}
                                {!loadingOrders && orders.length === 0 && (
                                    <p className="text-gray-500 text-sm">You have not placed any orders yet.</p>
                                )}
                                <div className="space-y-4">
                                    {orders.map(order => (
                                        <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center text-sm text-gray-500">
                                                <div className="flex gap-8">
                                                    <div>
                                                        <span className="block text-xs uppercase font-bold text-gray-400">Order Placed</span>
                                                        <span className="text-gray-800">
                                                            {order.createdAt?.toDate
                                                                ? order.createdAt.toDate().toLocaleDateString()
                                                                : ''}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-xs uppercase font-bold text-gray-400">Total</span>
                                                        <span className="text-gray-800">
                                                            ₹{Number(order.total || 0).toFixed(2)}
                                                        </span>
                                                    </div>

                                                </div>
                                            </div>
                                            <div className="p-6 flex justify-between items-center gap-4">
                                                <div
                                                    className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity flex-1"
                                                    onClick={() => navigate(`/product/${order.productId}`)}
                                                >
                                                    {order.productImage && (
                                                        <img src={order.productImage} alt={order.productName} className="w-16 h-16 object-cover rounded-lg border" />
                                                    )}
                                                    <div>
                                                        <h3 className="font-bold text-gray-800">{order.productName}</h3>
                                                        <p className="text-sm text-primary-600 font-medium">Status: {order.status}</p>
                                                        <p className="text-xs text-gray-500 mt-1">Quantity: {order.quantity}</p>
                                                    </div>
                                                </div>
                                                {order.status?.toLowerCase() === 'delivered' && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openReviewModal(order);
                                                        }}
                                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${order.review
                                                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                                            : 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm'
                                                            }`}
                                                    >
                                                        <MessageSquare className="w-4 h-4" />
                                                        {order.review ? 'Edit Review' : 'Write Review'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-xl shadow-sm p-8 max-w-2xl">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Login & Security</h2>
                                <div className="space-y-6">

                                    <div className="flex justify-between items-center border-b pb-4">
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">Email</p>
                                            <p className="text-gray-600">{currentUser?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center border-b pb-4">
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">Password</p>
                                            <p className="text-gray-600">********</p>
                                        </div>
                                        <button className="text-primary-600 border border-primary-600 px-4 py-1 rounded hover:bg-primary-50 text-sm">Change</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'addresses' && (
                            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
                                <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                <p>No addresses saved yet.</p>
                                <button className="mt-4 text-blue-600 font-medium hover:underline">Add New Address</button>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* Review Modal */}
            {reviewModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm"
                        onClick={closeReviewModal}
                    ></div>
                    <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-primary-900 text-white">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">Write a Review</h2>
                                <p className="text-primary-200 text-sm font-bold mt-1">{selectedOrder.productName}</p>
                            </div>
                            <button
                                onClick={closeReviewModal}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            {/* Star Rating */}
                            <div className="space-y-3">
                                <label className="block text-sm font-black text-gray-700 uppercase tracking-widest">
                                    Rating
                                </label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setReviewData({ ...reviewData, rating: star })}
                                            className="transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`w-10 h-10 ${star <= reviewData.rating
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 font-medium">
                                    {reviewData.rating === 5 && 'Excellent!'}
                                    {reviewData.rating === 4 && 'Very Good'}
                                    {reviewData.rating === 3 && 'Good'}
                                    {reviewData.rating === 2 && 'Fair'}
                                    {reviewData.rating === 1 && 'Poor'}
                                </p>
                            </div>

                            {/* Comment */}
                            <div className="space-y-3">
                                <label className="block text-sm font-black text-gray-700 uppercase tracking-widest">
                                    Your Feedback
                                </label>
                                <textarea
                                    rows="5"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-none"
                                    placeholder="Share your experience with this product..."
                                    value={reviewData.comment}
                                    onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                                ></textarea>
                                <p className="text-xs text-gray-400 font-medium">
                                    {reviewData.comment.length} characters
                                </p>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={submitReview}
                                disabled={submittingReview || !reviewData.comment.trim()}
                                className="w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-2xl font-black text-lg shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                {submittingReview ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <MessageSquare className="w-5 h-5" />
                                        Submit Review
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
