import React, { useState, useEffect } from 'react';
import { Leaf, Timer, ArrowRight, Calendar, ShoppingBasket, Tag, Star } from 'lucide-react';
import PageLayout from '../../components/user/PageLayout';

const SeasonalDeals = () => {
    const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 0, seconds: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { hours, minutes, seconds } = prev;
                if (seconds > 0) seconds--;
                else {
                    seconds = 59;
                    if (minutes > 0) minutes--;
                    else {
                        minutes = 59;
                        if (hours > 0) hours--;
                        else return { hours: 0, minutes: 0, seconds: 0 };
                    }
                }
                return { hours, minutes, seconds };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <PageLayout title="Seasonal Deals" icon={Leaf}>
            {/* Intro Text */}
            <div className="max-w-2xl mx-auto text-center mb-12">
                <p className="text-lg text-emerald-800/70 leading-relaxed">
                    Explore our exclusive seasonal offers and discounts on fresh produce. <br />
                    We bring you the best prices when nature is at its most generous!
                </p>
            </div>

            {/* 2. Flash Sales Section (FOMO Element) */}
            <div className="p-8 bg-white rounded-[40px] shadow-sm border border-emerald-100 mb-16">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
                            <Timer className="w-8 h-8 animate-pulse" />
                        </div>
                        <div className="text-left">
                            <h2 className="text-2xl font-black text-emerald-950 uppercase tracking-tighter">Harvest Flash Sale</h2>
                            <p className="text-emerald-600 font-bold text-sm">
                                Sale ends in: <span className="font-mono bg-emerald-100 px-2 py-1 rounded text-emerald-800">{timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</span>
                            </p>
                        </div>
                    </div>
                    <button className="px-6 py-2 bg-emerald-50 text-emerald-700 font-bold rounded-full hover:bg-emerald-100 transition-colors text-sm">
                        View All Offers
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { name: 'Red Strawberries', price: '₹120', old: '₹180', img: '/images/Fruits.avif', off: '30% OFF', rating: 4.8 },
                        { name: 'Golden Honey', price: '₹450', old: '₹600', img: '/images/Organic Honey.avif', off: '25% OFF', rating: 4.9 },
                        { name: 'Organic Spices', price: '₹85', old: '₹110', img: '/images/spices.avif', off: '20% OFF', rating: 4.7 }
                    ].map((deal, idx) => (
                        <div key={idx} className="group relative bg-emerald-50/30 rounded-[32px] overflow-hidden p-4 border border-emerald-100/50 hover:bg-white hover:shadow-xl transition-all duration-500">
                            <div className="absolute top-6 left-6 z-10 bg-orange-500 text-white font-black text-[10px] px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                                <Tag className="w-3 h-3" /> {deal.off}
                            </div>
                            <div className="h-48 rounded-[24px] overflow-hidden mb-6 relative">
                                <img src={deal.img} alt={deal.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-emerald-800 shadow-sm">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {deal.rating}
                                </div>
                            </div>
                            <div className="px-2">
                                <h3 className="text-lg font-black text-emerald-950 mb-1">{deal.name}</h3>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-xl font-black text-emerald-600">{deal.price}</span>
                                    <span className="text-xs font-bold text-emerald-400 line-through">{deal.old}</span>
                                </div>
                                <button className="w-full py-3 bg-emerald-950 text-white rounded-xl font-bold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2 group-hover:shadow-lg shadow-emerald-900/20">
                                    Claim Deal <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Harvest Calendar (Educational Content) */}
            <div className="mt-16 text-left">
                <div className="flex items-center gap-4 mb-8">
                     <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <h3 className="text-3xl font-black text-emerald-950">In Season Right Now</h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {['Apple', 'Potato', 'Spinach', 'Carrot', 'Onion', 'Guava'].map((crop, i) => (
                        <div key={i} className="bg-white border border-emerald-50 p-6 rounded-[32px] text-center hover:border-emerald-500 transition-all cursor-default group hover:-translate-y-1 hover:shadow-lg">
                            <div className="w-12 h-12 bg-emerald-50 rounded-xl mx-auto mb-4 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                                <Leaf className="w-6 h-6" />
                            </div>
                            <h4 className="font-bold text-emerald-900">{crop}</h4>
                            <p className="text-[9px] uppercase font-black text-emerald-400 tracking-widest mt-1 group-hover:text-emerald-500">Peak Flavor</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. Peak Flavor Bundles (High Ticket Items) */}
            <div className="mt-24 grid md:grid-cols-2 gap-8">
                {[
                    { 
                        name: 'The Winter Root Box', 
                        items: 'Potato, Carrot, Beetroot, Onion (4kg)', 
                        price: '₹499', 
                        bg: 'bg-emerald-900',
                        icon: ShoppingBasket,
                        tag: 'FAMILY SIZE'
                    },
                    { 
                        name: 'Morning Orchard Mix', 
                        items: 'Apple, Banana, Guava, Honey (2kg)', 
                        price: '₹699', 
                        bg: 'bg-emerald-600',
                        icon: Leaf,
                        tag: 'BREAKFAST SPECIAL'
                    }
                ].map((bundle, i) => (
                    <div key={i} className={`${bundle.bg} p-10 rounded-[40px] text-white relative overflow-hidden group shadow-xl hover:shadow-2xl transition-shadow cursor-pointer`}>
                        <bundle.icon className="absolute -top-10 -right-10 w-64 h-64 opacity-10 rotate-12 group-hover:rotate-[20deg] transition-transform duration-700" />
                        <div className="relative z-10 flex flex-col h-full items-start text-left">
                            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] text-white mb-6 border border-white/10">{bundle.tag}</span>
                            <h3 className="text-3xl font-black mb-2">{bundle.name}</h3>
                            <p className="text-emerald-100/80 text-base font-medium mb-10 leading-relaxed max-w-sm">{bundle.items}</p>
                            <div className="mt-auto flex items-center justify-between w-full border-t border-white/10 pt-8">
                                <div>
                                    <p className="text-xs text-white/60 font-bold uppercase tracking-wider mb-1">Bundle Price</p>
                                    <p className="text-4xl font-black">{bundle.price}</p>
                                </div>
                                <button className="px-8 py-4 bg-white text-emerald-950 rounded-2xl font-black hover:bg-emerald-50 transition-all text-sm shadow-xl flex items-center gap-2 group/btn">
                                    Add <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </PageLayout>
    );
};

export default SeasonalDeals;