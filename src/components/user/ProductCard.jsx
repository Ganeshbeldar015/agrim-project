import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border border-gray-100">
      <div className="relative pt-[100%] overflow-hidden bg-gray-50 group">
        <img 
          src={product.image} 
          alt={product.name}
          className="absolute top-0 left-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
        />
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <Link to={`/product/${product.id}`} className="hover:text-primary-600 transition-colors">
            <h3 className="text-black font-bold line-clamp-2 mb-1">{product.name}</h3>
        </Link>
        
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400">
             {[...Array(5)].map((_, i) => (
                <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`} 
                />
             ))}
          </div>
          <span className="text-xs text-primary-700 ml-2 hover:underline cursor-pointer">{product.reviews}</span>
        </div>

        <div className="mt-auto">
             <div className="flex items-baseline gap-2 mb-3">
                <span className="text-xs text-gray-800 font-bold">USD</span>
                <span className="text-xl font-bold text-black">${product.price.toFixed(2)}</span>
            </div>
            
            <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-full text-sm transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow">
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
