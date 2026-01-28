import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Star, ShoppingCart, ArrowLeft, Truck, ShieldCheck, RefreshCw, MessageSquare, Sprout } from 'lucide-react';
import { db } from '../../services/firebase';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { useCart } from '../../context/CartContext';
import SellerModal from '../../components/user/SellerModal';

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
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  if (!product) return <div>Product not found.</div>;

  return (
    <div className="bg-gray-100 min-h-screen py-8 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-bold uppercase tracking-widest text-xs">
          <ArrowLeft className="w-4 h-4" /> Back to Results
        </button>

        <div className="bg-white rounded-[32px] shadow-sm p-10 grid grid-cols-1 md:grid-cols-2 gap-12 border border-emerald-50">
          {/* Image */}
          <div className="flex items-center justify-center bg-emerald-50/30 rounded-[32px] p-8 border border-emerald-50">
            <img src={product.image} alt={product.name} className="max-h-[450px] object-contain mix-blend-multiply hover:scale-105 transition-transform duration-500" />
          </div>

          {/* Info */}
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">{product.name}</h1>
              <button
                onClick={() => setIsSellerModalOpen(true)}
                className="flex items-center gap-2 text-emerald-600 font-black text-sm tracking-tight hover:text-emerald-700 hover:gap-3 transition-all"
              >
                <Sprout className="w-4 h-4" />
                <span>Sold by: {product.sellerName || 'Local Farmer'}</span>
              </button>
            </div>

            <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
              <p className="text-xs text-emerald-600 font-black uppercase tracking-widest mb-1">Market Price</p>
              <p className="text-5xl font-black text-emerald-950 tracking-tighter">₹{(product.price || 0).toFixed(2)}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">Description</h3>
              <p className="text-gray-600 leading-relaxed text-sm lg:text-base font-medium">
                {product.description || 'No description provided for this fresh produce.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleAddToCart}
                disabled={saving}
                className={`w-full ${isInCart ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200' : 'bg-emerald-600 hover:bg-emerald-700 text-white'} font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-lg shadow-xl shadow-emerald-100 active:scale-95`}
              >
                <ShoppingCart className="w-6 h-6" /> {saving ? 'Adding...' : isInCart ? 'In Cart' : 'Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full bg-white border-2 border-emerald-600 text-emerald-700 hover:bg-primary-50 font-black py-4 rounded-2xl transition-all text-lg active:scale-95"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-[40px] shadow-sm p-12 mt-12 border border-emerald-50">
          <div className="flex items-center gap-4 mb-10 pb-6 border-b-2 border-emerald-50">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Customer Reviews</h2>
              <p className="text-emerald-600 text-sm font-bold uppercase tracking-widest">Feedback from our community ({reviews.length})</p>
            </div>
          </div>

          {loadingReviews ? (
            <div className="text-center py-12">
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-500 font-bold mt-4 uppercase tracking-widest text-xs">Fetching harvest notes...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-20 bg-emerald-50/20 rounded-[32px] border-2 border-dashed border-emerald-100">
              <MessageSquare className="w-16 h-16 text-emerald-200 mx-auto mb-4" />
              <p className="text-xl font-bold text-emerald-900">No reviews yet</p>
              <p className="text-sm text-emerald-500 font-medium mt-2">Become the first to share your experience!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {reviews.map((review) => (
                <div key={review.id} className="bg-gray-50/50 p-8 rounded-3xl border border-gray-100 hover:border-emerald-200 transition-colors">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-emerald-100">
                        {review.customerName?.[0]?.toUpperCase() || 'A'}
                      </div>
                      <div>
                        <p className="font-black text-gray-900 text-lg leading-tight">{review.customerName || 'Anonymous'}</p>
                        <p className="text-xs text-emerald-600 font-black uppercase tracking-widest mt-1">
                          {review.createdAt?.toDate?.()?.toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) || 'Recently'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1 bg-emerald-100/50 px-3 py-1.5 rounded-full">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${star <= review.rating
                            ? 'fill-emerald-500 text-emerald-500'
                            : 'text-emerald-200'
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed font-medium italic">"{review.comment}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <SellerModal
        sellerId={product.sellerId}
        isOpen={isSellerModalOpen}
        onClose={() => setIsSellerModalOpen(false)}
      />
    </div>
  );
};

export default ProductDetails;
