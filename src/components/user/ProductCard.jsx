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
    e.stopPropagation(); // Prevent card click
    if (isInCart) {
      navigate('/cart');
      return;
    }
    setAdding(true);
    const res = await addToCart(product);
    if (!res.success) {
      alert(res.error || "Failed to add to cart");
    }
    setAdding(false);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border border-gray-100 cursor-pointer"
    >
      {/* ... previous content ... */}
      <div className="relative pt-[100%] overflow-hidden bg-gray-50 group">
        <img
          src={product.image}
          alt={product.name}
          className="absolute top-0 left-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
        />
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-black font-bold line-clamp-2 mb-1 hover:text-primary-600 transition-colors">{product.name}</h3>



        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xs text-gray-800 font-bold">INR</span>
            <span className="text-xl font-bold text-black">₹{product.price.toFixed(2)}</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={adding}
            className={`w-full ${isInCart ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : adding ? 'bg-gray-400 text-white' : 'bg-primary-600 hover:bg-primary-700 text-white'} font-semibold py-2 px-4 rounded-full text-sm transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow`}
          >
            <ShoppingCart className="w-4 h-4" />
            {adding ? 'Adding...' : isInCart ? 'In Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
