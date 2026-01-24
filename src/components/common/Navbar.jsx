import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, LogOut, Sprout, Leaf } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  return (
    <header className="bg-white/80 backdrop-blur-md text-emerald-900 sticky top-0 z-50 border-b border-emerald-50 font-sans">
      {/* Top Bar */}
      <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-2 group">
          <div className="bg-emerald-600 p-1.5 rounded-xl rotate-3 group-hover:rotate-0 transition-transform">
             <Sprout className="w-6 h-6 text-white" />
          </div>
          <span className="text-emerald-950">Antigravity<span className="text-emerald-500">Agro</span></span>
        </Link>
        
        {/* Search Bar - Modern Organic Style */}
        <div className="flex-1 max-w-2xl hidden md:flex">
          <div className="flex w-full bg-emerald-50/50 rounded-2xl border-2 border-transparent focus-within:border-emerald-200 focus-within:bg-white transition-all overflow-hidden p-1">
            <select className="px-4 text-sm bg-transparent font-bold text-emerald-800 focus:outline-none cursor-pointer border-r border-emerald-100">
              <option>All Produce</option>
              <option>Vegetables</option>
              <option>Organic Fruits</option>
              <option>Seeds & Tools</option>
            </select>
            <input 
              type="text" 
              className="flex-1 px-4 py-2 bg-transparent text-emerald-950 focus:outline-none placeholder-emerald-300 font-medium"
              placeholder="Search fresh harvest..."
            />
            <button className="bg-emerald-600 px-5 py-2 rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center text-white shadow-lg shadow-emerald-100">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          {currentUser ? (
              <div className="flex items-center gap-4">
                  <Link to="/profile" className="text-right hidden sm:block">
                      <div className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Farmer Profile</div>
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
              <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[10px] font-black rounded-lg w-5 h-5 flex items-center justify-center border-2 border-emerald-50 group-hover:bg-white group-hover:text-emerald-700 transition-colors">2</span>
            </div>
            <span className="font-bold text-emerald-800 hidden md:block group-hover:text-white transition-colors">Basket</span>
          </Link>
        </div>
      </div>

      {/* Sub Menu - Clean & Minimal */}
      <div className="bg-emerald-950 text-emerald-100/80 text-sm py-3 px-6 flex items-center gap-8 overflow-x-auto no-scrollbar">
        <button className="flex items-center gap-2 font-black text-white hover:text-emerald-400 transition-colors">
          <Menu className="w-5 h-5" /> 
          <span>Marketplace</span>
        </button>
        <Link to="/deals" className="hover:text-white transition-colors flex items-center gap-1.5"><Leaf className="w-4 h-4" /> Seasonal Deals</Link>
        <Link to="/service" className="hover:text-white transition-colors">Farming Advice</Link>
        <Link to="/registry" className="hover:text-white transition-colors">Top Harvest</Link>
        <Link to="/gift-cards" className="hover:text-white transition-colors">Bulk Orders</Link>
        <Link to="/sell" className="ml-auto bg-emerald-500 text-white px-4 py-1 rounded-full font-bold hover:bg-emerald-400 transition-colors">Sell Your Harvest</Link>
      </div>
    </header>
  );
};

export default Navbar;