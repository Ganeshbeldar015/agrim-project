import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Star, ShoppingCart, ArrowLeft, Truck, ShieldCheck, RefreshCw, MessageSquare } from 'lucide-react';
import { db } from '../../services/firebase';
import { doc, getDoc, serverTimestamp, collection, query, where, onSnapshot } from 'firebase/firestore';
import { useCart } from '../../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const ref = doc(db, 'products', id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProduct({ id: snap.id, ...snap.data() });
        } else {
          setProduct(null);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('productId', '==', id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviewsData = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data().review,
          orderId: doc.id
        }))
        .filter(review => review.comment); // Filter out orders without reviews

      setReviews(reviewsData);
      setLoadingReviews(false);
    }, (error) => {
      console.error('Error fetching reviews:', error);
      setLoadingReviews(false);
    });

    return () => unsubscribe();
  }, [id]);

  const { addToCart, cartItems } = useCart();
  const isInCart = cartItems.some(item => item.productId === product?.id);

  const handleAddToCart = async () => {
    if (!currentUser || !product) {
      navigate('/login', { state: { from: location } });
      return;
    }

    if (isInCart) {
      navigate('/cart');
      return;
    }

    setSaving(true);
    const res = await addToCart(product);
    if (res.success) {
      alert('Added to cart');
    } else {
      alert(res.error || "Failed to add to cart");
    }
    setSaving(false);
  };

  const handleBuyNow = async () => {
    if (!currentUser || !product) {
      navigate('/login', { state: { from: location } });
      return;
    }
    setSaving(true);
    const res = await addToCart(product);
    if (res.success) {
      navigate('/checkout');
    } else {
      alert(res.error || "Failed to process Buy Now");
    }
    setSaving(false);
  };

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Results
        </button>

        <div className="bg-white rounded-xl shadow-sm p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="flex items-center justify-center bg-gray-50 rounded-xl p-8">
            <img src={product.image} alt={product.name} className="max-h-[400px] object-contain mix-blend-multiply" />
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

            </div>

            <div className="border-t border-b border-gray-100 py-4">
              <p className="text-sm text-gray-500 mb-1">Price:</p>
              <p className="text-4xl font-bold text-gray-900">₹{(product.price || 0).toFixed(2)}</p>
              <p className="text-sm text-gray-500 mt-1">Free delivery by <span className="font-bold text-gray-700">Tomorrow, Jan 26</span></p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck className="w-5 h-5 text-primary-600" />
                <span>Free Delivery Available</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <RefreshCw className="w-5 h-5 text-primary-600" />
                <span>30 Days Return Policy</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <ShieldCheck className="w-5 h-5 text-gray-600" />
                <span>2 Year Warranty</span>
              </div>
            </div>

            <div className="pt-6 space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={saving}
                className={`w-full ${isInCart ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-primary-600 hover:bg-primary-700 text-white'} font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg shadow-lg shadow-primary-200`}
              >
                <ShoppingCart className="w-6 h-6" /> {saving ? 'Adding...' : isInCart ? 'In Cart' : 'Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full bg-white border-2 border-primary-600 text-primary-700 hover:bg-primary-50 font-bold py-3 rounded-lg transition-colors text-lg"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mt-8">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
            <span className="text-gray-500 font-medium">({reviews.length})</span>
          </div>

          {loadingReviews ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No reviews yet</p>
              <p className="text-sm text-gray-400 mt-2">Be the first to review this product!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-primary-700 font-bold text-sm">
                            {review.customerName?.[0]?.toUpperCase() || 'A'}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{review.customerName || 'Anonymous'}</p>
                          <p className="text-xs text-gray-400">
                            {review.createdAt?.toDate?.()?.toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }) || 'Recently'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${star <= review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
