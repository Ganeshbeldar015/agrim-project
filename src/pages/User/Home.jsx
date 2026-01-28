import React, { useEffect, useState, useRef } from 'react';
import ProductCard from '../../components/user/ProductCard';
import { ArrowRight, Leaf, Sprout, ShieldCheck, ChevronLeft, Zap, ChevronRight, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../../services/firebase';
import { collection, onSnapshot, limit, query, where } from 'firebase/firestore';

const UserHome = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [filterCategory, setFilterCategory] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showNotFound, setShowNotFound] = useState(false);
    const productsSectionRef = useRef(null);
    const [displayLimit, setDisplayLimit] = useState(20);
    const [hasMore, setHasMore] = useState(false);

    const slides = [
        {
            image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop",
            tag: "Sustainable Farming",
            title: "Freshness From Root.",
            desc: "Empowering local farmers and bringing the finest harvest directly to your doorstep."
        },
        {
            image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2000&auto=format&fit=crop",
            tag: "100% Organic",
            title: "Purely Natural.",
            desc: "Sourced directly from certified organic farms with zero-waste packaging."
        },
        {
            image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2000&auto=format&fit=crop",
            tag: "Seasonal Picks",
            title: "Taste the Season.",
            desc: "Discover hand-picked seasonal bounty delivered fresh to your table every day."
        }
    ];

    const handleNext = () => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    const handlePrev = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const handleCategoryClick = (categoryName) => {
        setFilterCategory(categoryName);
        setDisplayLimit(20);
        setShowNotFound(false);
        setTimeout(() => {
            productsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    // 2. Separate timer effect for auto-sliding every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            handleNext();
        }, 5000);
        return () => clearInterval(timer);
    }, [currentSlide]);

    // 3. Data fetching effect
    useEffect(() => {
        import('../../utils/seedCategories').then(({ seedCategories }) => {
            seedCategories();
        });

        const productsRef = collection(db, 'products');
        let q = query(productsRef, limit(displayLimit + 1));
        if (filterCategory) {
            q = query(productsRef, where('category', '==', filterCategory), limit(displayLimit + 1));
        }

        const unsubscribeProducts = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data()
            }));

            if (items.length === 0 && filterCategory) {
                setShowNotFound(true);
                const timer = setTimeout(() => {
                    setFilterCategory(null);
                    setDisplayLimit(20);
                    setShowNotFound(false);
                }, 2000);
                setProducts([]);
                return () => clearTimeout(timer);
            } else {
                if (items.length > displayLimit) {
                    setHasMore(true);
                    setProducts(items.slice(0, displayLimit));
                } else {
                    setHasMore(false);
                    setProducts(items);
                }
            }
        });

        const categoriesRef = collection(db, 'categories');
        const unsubscribeCategories = onSnapshot(categoriesRef, (snapshot) => {
            const items = snapshot.docs.map(doc => doc.data());
            setCategories(items.length > 0 ? items : []);
            setLoadingCategories(false);
        });

        return () => {
            if (unsubscribeProducts) unsubscribeProducts();
            if (unsubscribeCategories) unsubscribeCategories();
        };
    }, [filterCategory, displayLimit]);

    return (
        <div className="bg-[#FCFDFB] min-h-screen font-sans text-emerald-900">
            {/* 1. Immersive Hero Section */}
            <section className="relative h-[90vh] w-full overflow-hidden flex items-center">
                {/* Background Image Layers */}
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 z-0" : "opacity-0 -z-10"
                            }`}
                    >
                        <div className="absolute inset-0 bg-emerald-950/40 z-10" />
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className={`h-full w-full object-cover transition-transform duration-[5000ms] ${index === currentSlide ? "scale-110" : "scale-100"
                                }`}
                        />
                    </div>
                ))}

                {/* 2. Manual Navigation Arrows */}
                <div className="absolute inset-0 z-30 flex items-center justify-between px-6 pointer-events-none">
                    <button
                        onClick={handlePrev}
                        className="pointer-events-auto p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-emerald-600 transition-all group"
                    >
                        <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="pointer-events-auto p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-emerald-600 transition-all group"
                    >
                        <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* 3. Floating Content Layer */}
                {/* 3. Floating Content Layer - Centered Layout */}
                {/* 3. Floating Content Layer - Centered Minimalism */}
                <div className="container mx-auto px-6 relative z-20 h-full flex flex-col items-center justify-center">
                    <div className="max-w-4xl flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in duration-1000">

                        {/* Transparent Tag Layout (Reflecting image_bb80f6.png) */}
                        <div className="flex items-center gap-3 py-2 text-white border-b border-emerald-400/30">
                            <Sprout className="w-6 h-6 text-emerald-400" />
                            <span className="text-xl font-black tracking-[0.2em] uppercase">
                                {slides[currentSlide].tag}
                            </span>
                        </div>

                        {/* Hero Title and Description */}
                        <div className="space-y-4">
                            <h1 className="text-7xl md:text-[110px] font-black text-white leading-[0.85] tracking-tighter drop-shadow-2xl">
                                {slides[currentSlide].title.split('.')[0]}
                                <span className="text-emerald-400">.</span>
                            </h1>

                            <p className="text-xl md:text-2xl text-emerald-50/90 max-w-2xl mx-auto leading-relaxed drop-shadow-lg font-medium">
                                {slides[currentSlide].desc}
                            </p>
                        </div>

                        {/* Primary and Secondary Action Buttons */}
                        {/* Updated Buttons with Scroll Logic */}
                        <div className="flex flex-col sm:flex-row items-center gap-6 pt-8">
                            <button
                                onClick={() => productsSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                                className="px-12 py-6 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-2xl font-black text-xl shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                            >
                                Start Shopping <ArrowRight className="w-6 h-6" />
                            </button>
                            <button className="px-12 py-6 bg-transparent text-white border-2 border-white/40 rounded-2xl font-bold text-xl hover:bg-white hover:text-emerald-950 transition-all backdrop-blur-sm">
                                Our Story
                            </button>
                        </div>
                    </div>

                </div>


                {/* 5. Progress Indicators */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentSlide(i)}
                            className={`transition-all duration-500 rounded-full ${i === currentSlide ? "w-10 h-2 bg-emerald-400" : "w-2 h-2 bg-white/40"
                                }`}
                        />
                    ))}
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

            {/* 3. Organic Category Grid - Fixed 2 Rows of 6 */}
            <section className="py-24 container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-xl text-center md:text-left">
                        <h2 className="text-4xl md:text-5xl font-black text-emerald-950 mb-4">Nature's Categories</h2>
                        <div className="h-1.5 w-24 bg-emerald-500 rounded-full mb-6 mx-auto md:mx-0"></div>
                        <p className="text-emerald-800/70 text-lg font-medium">Sourced directly from certified organic farms across the country.</p>
                    </div>
                    <Link to="/products" className="px-6 py-3 bg-emerald-50 text-emerald-700 rounded-full font-bold hover:bg-emerald-600 hover:text-white flex items-center gap-2 transition-all group shadow-sm">
                        Browse All <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Grid configured for 6 columns on large screens */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">

                    {/* Card 1: Static "All Treasures" */}
                    <div
                        onClick={() => handleCategoryClick(null)}
                        className={`group relative h-[320px] overflow-hidden rounded-[32px] cursor-pointer border-2 transition-all duration-500 ${!filterCategory ? 'border-emerald-500 shadow-xl -translate-y-2' : 'border-transparent shadow-sm'}`}
                    >
                        <div className="absolute inset-0 bg-emerald-900 group-hover:bg-emerald-800 transition-colors duration-500" />
                        <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                            <h3 className="text-lg font-black mb-1 leading-tight">All Treasures</h3>
                            <p className="text-emerald-200 text-xs font-bold opacity-80">Everything Fresh</p>
                            <span className="flex items-center gap-2 text-xs font-bold mt-3 group-hover:gap-3 transition-all">
                                Shop All <ArrowRight className="w-4 h-4" />
                            </span>
                        </div>
                    </div>

                    {/* Cards 2-12: Dynamic Categories */}
                    {categories
                        .filter((value, index, self) =>
                            index === self.findIndex((t) => t.name === value.name)
                        )
                        .slice(0, 11) // Limit to 11 to fill the 2 rows exactly
                        .map((cat, idx) => (
                            <div
                                key={cat.name}
                                onClick={() => handleCategoryClick(cat.name)}
                                className={`group relative h-[320px] overflow-hidden rounded-[32px] cursor-pointer border-2 transition-all duration-500 ${filterCategory === cat.name ? 'border-emerald-500 shadow-xl -translate-y-2' : 'border-transparent shadow-sm hover:shadow-md'}`}
                            >
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="w-full h-full object-cover opacity-90 group-hover:scale-110 group-hover:opacity-70 transition-all duration-700"
                                />

                                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white bg-gradient-to-t from-emerald-950/90 via-emerald-950/20 to-transparent">
                                    <h3 className="text-lg font-black mb-1 leading-tight">{cat.name}</h3>
                                    <div className="w-0 group-hover:w-full h-0.5 bg-emerald-400 transition-all duration-500 mb-3" />
                                    <span className="flex items-center gap-2 text-xs font-bold text-emerald-200 group-hover:text-white transition-colors">
                                        Explore <ArrowRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </section>
            {/* 4. Soft-Card Featured Products */}
            <section ref={productsSectionRef} id="products-section" className="py-24 bg-emerald-50/30 rounded-[60px]">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16 space-y-4">
                        <span className="text-emerald-600 font-black tracking-widest uppercase text-xs px-4 py-1 bg-emerald-100 rounded-full">Weekly Picks</span>
                        <h2 className="text-5xl font-black text-emerald-950">
                            {showNotFound ? 'Searching...' : (filterCategory ? `${filterCategory} Collection` : 'Bestselling Harvest')}
                        </h2>
                    </div>

                    {showNotFound ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
                            <div className="p-6 bg-emerald-100 rounded-full mb-6">
                                <Sprout className="w-12 h-12 text-emerald-600" />
                            </div>
                            <h3 className="text-3xl font-bold text-emerald-900 mb-2">Currently Out of Stock</h3>
                            <p className="text-emerald-700 text-lg">
                                We couldn't find any {filterCategory} products at the moment.
                                <br />Showing all available products in 2 seconds...
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                                {products.map((product) => (
                                    <div key={product.id} className="hover:-translate-y-2 transition-transform duration-300">
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>

                            {hasMore && (
                                <div className="mt-16 flex justify-center">
                                    <button
                                        onClick={() => setDisplayLimit(prev => prev + 20)}
                                        className="px-10 py-4 bg-white border-2 border-emerald-600 text-emerald-600 rounded-2xl font-black text-lg hover:bg-emerald-600 hover:text-white transition-all shadow-md active:scale-95 flex items-center gap-2 group"
                                    >
                                        See more results
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* 5. Minimalist Newsletter */}

        </div>
    );
};

export default UserHome;