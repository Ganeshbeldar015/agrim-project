import React, { useState } from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const [adding, setAdding] = useState(false);
  const isInCart = cartItems.some(item => item.productId === product.id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (isInCart) {
      navigate('/cart');
      return;
    }
    setAdding(true);
    const res = await addToCart(product);
    if (!res.success) {
      alert(res.error || 'Failed to add to cart');
    }
    setAdding(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
      
      {/* Image Section */}
      <Link to={`/product/${product.id}`} className="relative group">
        <div className="h-44 bg-gray-50 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded-md shadow text-xs font-semibold flex items-center gap-1">
          <Star className="w-3 h-3 text-green-600 fill-green-600" />
          <span>{product.rating}</span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-gray-500 mt-1">
          {product.reviews} ratings
        </p>

        {/* Price + CTA */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Price</p>
            <p className="text-lg font-bold text-gray-900">
              ₹{product.price.toFixed(2)}
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={adding}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2
              ${
                isInCart
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : adding
                  ? 'bg-gray-300 text-white'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }
            `}
          >
            <ShoppingCart className="w-4 h-4" />
            {adding ? 'Adding' : isInCart ? 'Added' : 'ADD'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
