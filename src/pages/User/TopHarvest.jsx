import React from 'react';
import { Leaf, Award, Star, TrendingUp, MapPin, CheckCircle, ChevronRight } from 'lucide-react';
import PageLayout from '../../components/user/PageLayout';

const TopHarvest = () => {
    return (
        <PageLayout title="Top Harvest Registry" icon={Award}>
               <div className="max-w-3xl mx-auto text-center mb-16">
                <p className="text-xl text-emerald-800/70 leading-relaxed font-medium">
                    A curated showcase of this season's finest produce and the award-winning farmers behind them.
                </p>
            </div>

            {/* 1. Gold Tier Spotlight */}
            <div className="mb-24 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-yellow-50/50 to-transparent rounded-[50px] -z-10" />
                <div className="flex justify-center mb-8">
                     <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-orange-200 ring-4 ring-yellow-50">
                        Gold Tier Selection
                    </span>
                </div>

                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center bg-white p-4 rounded-[40px] shadow-xl border border-yellow-100/50">
                    <div className="h-[400px] rounded-[32px] overflow-hidden relative group">
                        <img 
                            src="https://images.unsplash.com/photo-1595855709915-445672d2c419?q=80&w=2000&auto=format&fit=crop" 
                            alt="Premium Alphonso Mango" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs font-black text-emerald-950">9.9/10 Quality Score</span>
                        </div>
                    </div>
                    
                    <div className="p-6 md:pr-12 text-left">
                        <h2 className="text-4xl font-black text-emerald-950 mb-4">Ratnagiri Alphonso Kings</h2>
                        <div className="flex items-center gap-2 text-emerald-600 font-bold mb-6 text-sm">
                            <MapPin className="w-4 h-4" /> Ratnagiri, Maharashtra
                        </div>
                        <p className="text-emerald-800/60 leading-relaxed mb-8">
                            Hand-picked at peak ripeness, these mangoes are grown using 100% organic compost and zero chemical pesticides. Known for their golden saffron hue and incredibly sweet pulp.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-emerald-50 p-4 rounded-2xl">
                                <p className="text-xs text-emerald-500 font-black uppercase mb-1">Harvest Date</p>
                                <p className="font-bold text-emerald-900">24th Jan 2026</p>
                            </div>
                            <div className="bg-emerald-50 p-4 rounded-2xl">
                                <p className="text-xs text-emerald-500 font-black uppercase mb-1">Farmer</p>
                                <p className="font-bold text-emerald-900">Rajesh Farms</p>
                            </div>
                        </div>

                        <button className="w-full bg-emerald-950 text-white font-black py-4 rounded-2xl hover:bg-emerald-800 transition-colors shadow-lg">
                            Reserve Box (Limited)
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Top Performing Farmers */}
            <div className="text-left max-w-6xl mx-auto">
                <h3 className="text-3xl font-black text-emerald-950 mb-10 flex items-center gap-3">
                    <Award className="text-emerald-500 w-8 h-8" />
                    Farmers of the Month
                </h3>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { name: 'Suman Organics', loc: 'Nashik', crop: 'Grapes', rating: '4.9', img: 'https://images.unsplash.com/photo-1595977926391-7f941f5e8845?q=80&w=800&auto=format&fit=crop' },
                        { name: 'Green Valley', loc: 'Pune', crop: 'Strawberries', rating: '4.8', img: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=800&auto=format&fit=crop' }, // Using fallback image
                        { name: 'Pure Earth', loc: 'Satara', crop: 'Turmeric', rating: '5.0', img: 'https://images.unsplash.com/photo-1615485925763-867862f8373b?q=80&w=800&auto=format&fit=crop' }
                    ].map((farmer, idx) => (
                        <div key={idx} className="bg-white border border-emerald-50 rounded-[32px] p-4 hover:shadow-xl transition-all group cursor-default">
                             <div className="h-48 rounded-[24px] overflow-hidden mb-6 relative">
                                <img src={farmer.img} alt={farmer.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-emerald-800 shadow-sm">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {farmer.rating}
                                </div>
                            </div>
                            <div className="px-2 pb-2">
                                <h4 className="text-xl font-black text-emerald-950 mb-1">{farmer.name}</h4>
                                <p className="text-emerald-500 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> {farmer.loc}
                                </p>
                                <div className="flex items-center justify-between border-t border-emerald-50 pt-4">
                                    <div>
                                        <p className="text-[10px] text-emerald-400 font-bold uppercase">Specialty</p>
                                        <p className="font-bold text-emerald-900">{farmer.crop}</p>
                                    </div>
                                    <button className="bg-emerald-50 p-2 rounded-full text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors">
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Trending Crops List */}
             <div className="mt-24 text-left max-w-6xl mx-auto">
                 <div className="bg-emerald-950 rounded-[40px] p-10 md:p-14 text-white flex flex-col md:flex-row items-center justify-between gap-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
                    <div>
                        <h3 className="text-3xl font-black mb-4 flex items-center gap-3">
                            <TrendingUp className="text-emerald-400" /> Market Trends
                        </h3>
                         <p className="text-emerald-100/70 max-w-lg">
                            Crops seeing the highest demand this week. Based on real-time purchase data from 10,000+ customers.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                        {['Avocados', 'Cherry Tomatoes', 'Kale', 'Blueberries'].map((item, i) => (
                            <div key={i} className="bg-white/10 backdrop-blur-md border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="font-bold tracking-wide">{item}</span>
                            </div>
                        ))}
                    </div>
                 </div>
            </div>

        </PageLayout>
    );
};

export default TopHarvest;
