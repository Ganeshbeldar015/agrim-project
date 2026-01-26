import React, { useState } from 'react';
import { Sprout, Sun, CloudRain, Wind, BookOpen, ChevronRight, Calculator } from 'lucide-react';
import PageLayout from '../../components/user/PageLayout';

const FarmingAdvice = () => {
    const [activeTab, setActiveTab] = useState('tips');

    return (
        <PageLayout title="Farming & Gardening Hub" icon={Sprout}>
            <div className="text-center max-w-2xl mx-auto mb-16">
                 <p className="text-xl text-emerald-800/70 leading-relaxed">
                    Expert knowledge for every step of your growing journey. <br/> From balcony gardens to acre farms.
                </p>
            </div>

            {/* Featured Article - Hero Style */}
            <div className="relative rounded-[40px] overflow-hidden bg-emerald-900 text-white mb-20 shadow-2xl group cursor-pointer">
                <div className="absolute inset-0">
                    <img 
                        src="https://images.unsplash.com/photo-1592419044706-39796d40f98c?q=80&w=2000&auto=format&fit=crop" 
                        alt="Soil Preparation" 
                        className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/40 to-transparent" />
                </div>
                
                <div className="relative z-10 p-10 md:p-16 flex flex-col items-start h-[500px] justify-end">
                    <span className="bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                        Featured Guide
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight max-w-3xl">
                        The Secret to <span className="text-emerald-400">Perfect Soil Health</span> Before Monsoon.
                    </h2>
                    <p className="text-emerald-100/80 text-lg mb-8 max-w-2xl line-clamp-2">
                        Discover the ancient technique of green manuring that can double your yield naturally without using a single drop of chemical fertilizer.
                    </p>
                    <button className="flex items-center gap-2 bg-white text-emerald-950 px-8 py-4 rounded-2xl font-black hover:bg-emerald-50 transition-all">
                        Read Full Article <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Tools & Resources Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 text-left">
                {[
                    { icon: Sun, title: 'Sunlight Calculator', desc: 'Find the right spot for your plants.' },
                    { icon: CloudRain, title: 'Watering Schedule', desc: 'Customized plans for your crop.' },
                    { icon: Calculator, title: 'Yield Estimator', desc: 'Predict harvest quantity.' },
                    { icon: Wind, title: 'Pest Identification', desc: 'AI-powered image detection.' }
                ].map((tool, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[32px] border border-emerald-50 hover:border-emerald-200 hover:shadow-lg transition-all cursor-pointer group">
                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                            <tool.icon className="w-7 h-7" />
                        </div>
                        <h3 className="font-black text-emerald-950 text-lg mb-2">{tool.title}</h3>
                        <p className="text-emerald-800/60 text-sm">{tool.desc}</p>
                    </div>
                ))}
            </div>

            {/* Articles Categories */}
            <div className="flex flex-col md:flex-row gap-8 text-left">
                <div className="w-full md:w-1/3 space-y-4">
                    <h3 className="text-2xl font-black text-emerald-950 mb-6 px-2">Categories</h3>
                    {['Beginner Guides', 'Organic Fertilizers', 'Pest Control', 'Irrigation Systems', 'Urban Farming', 'Hydroponics'].map((cat, i) => (
                        <div key={i} className="flex justify-between items-center p-4 bg-white border border-emerald-50 rounded-2xl cursor-pointer hover:border-emerald-300 hover:bg-emerald-50 transition-all group">
                            <span className="font-bold text-emerald-900">{cat}</span>
                            <ChevronRight className="w-4 h-4 text-emerald-300 group-hover:text-emerald-600" />
                        </div>
                    ))}
                </div>

                <div className="w-full md:w-2/3">
                     <h3 className="text-2xl font-black text-emerald-950 mb-6">Latest Articles</h3>
                     <div className="space-y-6">
                        {[
                            { title: 'Top 5 Indoor Plants for Air Purification', date: '2 days ago', read: '5 min read' },
                            { title: 'How to make compost at home in 30 days', date: '4 days ago', read: '8 min read' },
                            { title: 'Understanding NPK Ratios in Organic Fertilizers', date: '1 week ago', read: '12 min read' }
                        ].map((article, i) => (
                            <div key={i} className="p-6 bg-white border border-emerald-50 rounded-[24px] hover:shadow-md transition-shadow cursor-pointer">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase px-2 py-1 rounded-md">Guide</span>
                                    <span className="text-xs text-emerald-400 font-bold">{article.date}</span>
                                </div>
                                <h4 className="text-xl font-black text-emerald-950 mb-2 hover:text-emerald-600 transition-colors">{article.title}</h4>
                                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800/50">
                                    <BookOpen className="w-3 h-3" /> {article.read}
                                </div>
                            </div>
                        ))}
                     </div>
                </div>
            </div>

        </PageLayout>
    );
};

export default FarmingAdvice;
