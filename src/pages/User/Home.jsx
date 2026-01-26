import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/user/ProductCard';
import { ArrowRight, Leaf, Sprout, ShieldCheck, Zap, ChevronRight, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../../services/firebase';
import { collection, onSnapshot, limit, query, where } from 'firebase/firestore';

const UserHome = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [filterCategory, setFilterCategory] = useState(null); // Filter state

    useEffect(() => {
        // Seed categories if needed
        import('../../utils/seedCategories').then(({ seedCategories }) => {
            seedCategories();
        });

        const productsRef = collection(db, 'products');

        // Dynamic query based on selected category
        let q = query(productsRef, limit(12));
        if (filterCategory) {
            // Filter by tag attribute as requested
            q = query(productsRef, where('tag', '==', filterCategory), limit(12));
        }

        const unsubscribeProducts = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data()
            }));
            setProducts(items);
        });

        const categoriesRef = collection(db, 'categories');
        const unsubscribeCategories = onSnapshot(categoriesRef, (snapshot) => {
            const items = snapshot.docs.map(doc => doc.data());
            if (items.length > 0) {
                setCategories(items);
            } else {
                setCategories([]);
            }
            setLoadingCategories(false);
        });

        return () => {
            if (unsubscribeProducts) unsubscribeProducts();
            if (unsubscribeCategories) unsubscribeCategories();
        };
    }, [filterCategory]); // Re-run when filter changes

    return (
        <div className="bg-[#FCFDFB] min-h-screen font-sans text-emerald-900">

            {/* 1. Immersive Hero Section */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden">
                {/* Abstract Background Elements */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-50/50 rounded-l-[100px] -z-10 hidden lg:block" />
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl -z-10" />

                <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-sm">
                            <Sprout className="w-4 h-4" />
                            <span>100% Organic & Farm Fresh</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-black text-emerald-950 leading-[1.1]">
                            Freshness <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-500">
                                From Root
                            </span><br />
                            To Table.
                        </h1>

                        <p className="text-xl text-emerald-800/80 max-w-lg leading-relaxed border-l-4 border-emerald-500 pl-6">
                            Empowering local farmers and bringing the finest harvest directly to your doorstep with zero-waste packaging.
                        </p>

                        <div className="flex flex-wrap gap-5">
                            <button className="px-10 py-5 bg-emerald-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3">
                                Start Shopping <ArrowRight className="w-5 h-5" />
                            </button>
                            <button className="px-10 py-5 bg-white text-emerald-700 border-2 border-emerald-100 rounded-2xl font-bold text-lg hover:bg-emerald-50 transition-all">
                                Our Story
                            </button>
                        </div>
                    </div>

                    {/* Interactive Hero Image */}
                    <div className="relative">
                        <div className="relative z-10 rounded-[40px] overflow-hidden rotate-2 hover:rotate-0 transition-transform duration-500 shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2074&auto=format&fit=crop"
                                alt="Agriculture"
                                className="w-full h-[600px] object-cover scale-110 hover:scale-100 transition-transform duration-700"
                            />
                        </div>
                        {/* Floating UI Elements */}
                        <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl z-20 border border-emerald-50 animate-bounce-slow">
                            <div className="flex items-center gap-4">
                                <div className="bg-green-500 p-3 rounded-2xl text-white">
                                    <Leaf className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-emerald-600 font-bold">Eco-Certified</p>
                                    <p className="text-xl font-black text-emerald-950">100% Natural</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Glassmorphism Trust Bar */}
            <section className="py-10">
                <div className="container mx-auto px-6">
                    <div className="bg-white/60 backdrop-blur-md border border-white rounded-[32px] p-8 grid grid-cols-2 md:grid-cols-4 gap-8 shadow-sm">
                        {[
                            { icon: Zap, title: 'Express Delivery', desc: 'Fresh in 12 hours' },
                            { icon: ShieldCheck, title: 'Quality Assured', desc: 'Direct from farms' },
                            { icon: Sprout, title: 'Sustainable', desc: 'Plastic-free' },
                            { icon: Leaf, title: 'Support Farmers', desc: 'Fair trade prices' }
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center gap-3 group cursor-default">
                                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                                    <item.icon className="w-7 h-7" />
                                </div>
                                <h3 className="font-bold text-emerald-950">{item.title}</h3>
                                <p className="text-xs text-emerald-700/60 uppercase font-bold tracking-widest">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Organic Category Grid */}
            <section className="py-24 container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-xl">
                        <h2 className="text-4xl md:text-5xl font-black text-emerald-950 mb-4">Nature's Categories</h2>
                        <div className="h-1.5 w-24 bg-emerald-500 rounded-full mb-6"></div>
                        <p className="text-emerald-800/70 text-lg font-medium">Sourced directly from certified organic farms across the country.</p>
                    </div>
                    <Link to="/products" className="px-6 py-3 bg-emerald-50 text-emerald-700 rounded-full font-bold hover:bg-emerald-600 hover:text-white flex items-center gap-2 transition-all group">
                        Browse All <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* All Categories Option */}
                    <div
                        onClick={() => setFilterCategory(null)}
                        className={`group relative h-[400px] overflow-hidden rounded-[40px] cursor-pointer border-4 transition-all ${!filterCategory ? 'border-emerald-500 shadow-2xl scale-105' : 'border-transparent shadow-sm'}`}
                    >
                        <div className="absolute inset-0 bg-emerald-900 group-hover:bg-emerald-800 transition-colors" />
                        <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                            <h3 className="text-2xl font-black mb-2">All Treasures</h3>
                            <p className="text-emerald-200 text-sm font-bold">Discover everything fresh</p>
                            <span className="flex items-center gap-2 font-bold mt-4">
                                Shop All <ArrowRight className="w-4 h-4" />
                            </span>
                        </div>
                    </div>

                    {categories.map((cat, idx) => (
                        <div
                            key={idx}
                            onClick={() => setFilterCategory(cat.name)}
                            className={`group relative h-[400px] overflow-hidden rounded-[40px] cursor-pointer border-4 transition-all ${filterCategory === cat.name ? 'border-emerald-500 shadow-2xl scale-105' : 'border-transparent shadow-sm'}`}
                        >
                            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-60 transition-all duration-700" />
                            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white bg-gradient-to-t from-emerald-950/80 to-transparent">
                                <h3 className="text-2xl font-black mb-2">{cat.name}</h3>
                                <div className="w-0 group-hover:w-full h-1 bg-white/50 transition-all duration-500 mb-4" />
                                <span className="flex items-center gap-2 font-bold text-emerald-200">
                                    Explore <ArrowRight className="w-4 h-4" />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. Soft-Card Featured Products */}
            <section className="py-24 bg-emerald-50/30 rounded-[60px]">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16 space-y-4">
                        <span className="text-emerald-600 font-black tracking-widest uppercase text-xs px-4 py-1 bg-emerald-100 rounded-full">Weekly Picks</span>
                        <h2 className="text-5xl font-black text-emerald-950">
                            {filterCategory ? `${filterCategory} Collection` : 'Bestselling Harvest'}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                        {products.map((product) => (
                            <div key={product.id} className="hover:-translate-y-2 transition-transform duration-300">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Minimalist Newsletter */}
            <section className="py-24 container mx-auto px-6">
                <div className="bg-emerald-950 rounded-[50px] overflow-hidden relative p-12 md:p-24">
                    <div className="absolute top-0 right-0 p-12 text-emerald-800/20">
                        <Sprout className="w-64 h-64 rotate-12" />
                    </div>

                    <div className="relative z-10 max-w-3xl">
                        <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-8">
                            Stay Fresh. <br />
                            Join the Community.
                        </h2>
                        <p className="text-emerald-100/70 text-xl mb-10">
                            Get seasonal harvesting updates and 15% off your first organic basket.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-300 w-5 h-5" />
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-emerald-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 backdrop-blur-md"
                                />
                            </div>
                            <button className="px-10 py-5 bg-emerald-500 text-white font-black rounded-2xl hover:bg-emerald-400 transition-colors shadow-xl shadow-emerald-900/20">
                                Subscribe Now
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default UserHome;
