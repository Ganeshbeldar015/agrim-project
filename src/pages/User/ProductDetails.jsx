import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Star, ShoppingCart, ArrowLeft, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { mockProducts } from '../../utils/mockData';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Simulate API fetch
    const found = mockProducts.find(p => p.id === parseInt(id)) || mockProducts[0];
    setProduct(found);
  }, [id]);

  if (!product) return <div>Loading...</div>;

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
                   <div className="flex items-center gap-4">
                       <div className="flex text-yellow-400">
                           {[...Array(5)].map((_, i) => (
                               <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`} />
                           ))}
                       </div>
                       <span className="text-blue-600 font-medium">{product.reviews} reviews</span>
                   </div>
                </div>

                <div className="border-t border-b border-gray-100 py-4">
                    <p className="text-sm text-gray-500 mb-1">Price:</p>
                    <p className="text-4xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
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
                <div className="pt-6 space-y-3">
                    <button 
                        onClick={() => {
                            if (!currentUser) {
                                navigate('/login', { state: { from: location } });
                            } else {
                                alert('Added to cart!');
                            }
                        }} 
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg shadow-lg shadow-primary-200"
                    >
                        <ShoppingCart className="w-6 h-6" /> Add to Cart
                    </button>
                    <button 
                        onClick={() => {
                            if (!currentUser) {
                                navigate('/login', { state: { from: location } });
                            } else {
                                alert('Buying Now!');
                            }
                        }}
                        className="w-full bg-white border-2 border-primary-600 text-primary-700 hover:bg-primary-50 font-bold py-3 rounded-lg transition-colors text-lg"
                    >
                        Buy Now
                    </button>
                </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
