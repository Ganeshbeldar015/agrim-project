import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, LogOut, Sprout, Leaf } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useSearch } from '../../context/SearchContext';
import { useEffect, useState } from 'react';
import { db } from '../../services/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const Navbar = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, searchCategory, setSearchCategory, performSearch, triggerSearch } = useSearch();
  const [categories, setCategories] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const categoriesRef = collection(db, 'categories');
    const unsubscribe = onSnapshot(categoriesRef, (snapshot) => {
      const items = snapshot.docs.map(doc => doc.data().name);
      setCategories(items.length > 0 ? items : ['Vegetables', 'Organic Fruits', 'Seeds & Tools']);
    });
    return () => unsubscribe();
  }, []);

  // Reset isSearching state when triggerSearch changes globally
  useEffect(() => {
    setIsSearching(false);
  }, [triggerSearch]);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsSearching(true);
    performSearch();
    // If not on home page, navigate to home (optional, but good for UX)
    if (window.location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md text-emerald-900 sticky top-0 z-50 border-b border-emerald-50 font-sans">
      {/* Top Bar */}
      <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-2 group">
          <div className="bg-emerald-600 p-1.5 rounded-xl rotate-3 group-hover:rotate-0 transition-transform">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <span className="text-emerald-950"><span className="text-emerald-500">Agrim</span></span>
        </Link>

        {/* Search Bar - Modern Organic Style */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl hidden md:flex">
          <div className="flex w-full bg-emerald-50/50 rounded-2xl border-2 border-transparent focus-within:border-emerald-200 focus-within:bg-white transition-all overflow-hidden p-1">
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="px-4 text-sm bg-transparent font-bold text-emerald-800 focus:outline-none cursor-pointer border-r border-emerald-100"
            >
              <option value="All Produce">All Produce</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 bg-transparent text-emerald-950 focus:outline-none placeholder-emerald-300 font-medium"
              placeholder="Search fresh harvest..."
            />
            <button
              type="submit"
              disabled={isSearching}
              className={`${isSearching ? 'bg-emerald-400' : 'bg-emerald-600 hover:bg-emerald-700'} px-5 py-2 rounded-xl transition-all flex items-center justify-center text-white shadow-lg shadow-emerald-100 min-w-[50px]`}
            >
              {isSearching ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Search className="w-5 h-5" />}
            </button>
          </div>
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          {currentUser ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="text-right hidden sm:block">
                <div className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Profile</div>
                <div className="font-bold text-sm text-emerald-950">{currentUser.displayName}</div>
              </Link>
              <button onClick={handleLogout} className="bg-rose-50 text-rose-500 p-2.5 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="hidden sm:flex flex-col items-end group">
              <div className="text-[10px] text-emerald-500 font-black uppercase tracking-widest leading-none">Hello, Sign In</div>
              <div className="font-bold text-sm text-emerald-950 group-hover:text-emerald-600 transition-colors">Your Account</div>
            </Link>
          )}

          <Link to="/cart" className="flex items-center gap-3 bg-emerald-50 px-4 py-2.5 rounded-2xl group hover:bg-emerald-600 transition-all">
            <div className="relative">
              <ShoppingCart className="w-6 h-6 text-emerald-700 group-hover:text-white transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[10px] font-black rounded-lg w-5 h-5 flex items-center justify-center border-2 border-emerald-50 group-hover:bg-white group-hover:text-emerald-700 transition-colors">{cartCount}</span>
              )}
            </div>
            <span className="font-bold text-emerald-800 hidden md:block group-hover:text-white transition-colors">Basket</span>
          </Link>
        </div>
      </div>

      {/* Sub Menu - Clean & Minimal */}
      <div className="bg-emerald-950 text-emerald-100/80 text-sm py-3 px-6 flex items-center gap-8 overflow-x-auto no-scrollbar">
        <button className="flex items-center gap-2 font-black text-white hover:text-emerald-400 transition-colors">
          <Menu className="w-5 h-5" />
          <span>
            <Link to="/">
              Marketplace
            </Link>
          </span>
        </button>
        <Link to="/deals" className="hover:text-white transition-colors flex items-center gap-1.5"><Leaf className="w-4 h-4" /> Seasonal Deals</Link>
        <Link to="/service" className="hover:text-white transition-colors">Farming Advice</Link>
        <Link to="/registry" className="hover:text-white transition-colors">Top Harvest</Link>
        <Link to="/gift-cards" className="hover:text-white transition-colors">Bulk Orders</Link>
        <Link to={userProfile?.role === 'seller' ? '/seller' : '/auth/seller-register'} className="ml-auto bg-emerald-500 text-white px-4 py-1 rounded-full font-bold hover:bg-emerald-400 transition-colors">Sell Your Harvest</Link>
      </div>
    </header>
  );
};

export default Navbar;
