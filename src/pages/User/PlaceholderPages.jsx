import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Leaf, Sprout, Gift } from 'lucide-react';

const PageLayout = ({ title, icon: Icon, children }) => (
    <div className="min-h-screen bg-emerald-50/30 py-12 px-6">
        <div className="container mx-auto max-w-4xl text-center">
            <div className="mb-8 flex justify-center">
                <div className="p-4 bg-emerald-100 rounded-full text-emerald-600">
                    {Icon && <Icon className="w-12 h-12" />}
                </div>
            </div>
            <h1 className="text-4xl font-black text-emerald-950 mb-6">{title}</h1>
            <div className="text-xl text-emerald-800/70 mb-12 max-w-2xl mx-auto leading-relaxed">
                {children}
            </div>
            <Link to="/" className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:underline">
                <ArrowLeft className="w-5 h-5" /> Back to Home
            </Link>
        </div>
    </div>
);

export const SeasonalDeals = () => (
    <PageLayout title="Seasonal Deals" icon={Leaf}>
        <p>Explore our exclusive seasonal offers and discounts on fresh produce. <br />Check back often for new harvest specials!</p>
        <div className="mt-8 p-8 bg-white rounded-3xl shadow-sm border border-emerald-100">
            <p className="font-bold text-gray-400">No active deals right now. Harvest season is coming soon!</p>
        </div>
    </PageLayout>
);

export const FarmingAdvice = () => (
    <PageLayout title="Farming Advice" icon={Sprout}>
        <p>Expert tips and guides for sustainable farming and gardening. <br />Learn how to grow your own organic produce.</p>
        <div className="mt-8 grid md:grid-cols-2 gap-6 text-left">
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="font-bold text-lg mb-2 text-emerald-900">Soil Health 101</h3>
                <p className="text-gray-600 text-sm">Understanding pH levels and organic composting.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="font-bold text-lg mb-2 text-emerald-900">Pest Management</h3>
                <p className="text-gray-600 text-sm">Natural ways to protect your crops without chemicals.</p>
            </div>
        </div>
    </PageLayout>
);

export const TopHarvest = () => (
    <PageLayout title="Top Harvest Registry" icon={Leaf}>
        <p>Discover the highest-rated crops and produce from our top-tier farmers. <br />Curated selections for the discerning buyer.</p>
    </PageLayout>
);

export const BulkOrders = () => (
    <PageLayout title="Bulk Orders & Gift Cards" icon={Gift}>
        <p>Planning a large event or looking for the perfect gift? <br />We offer bulk discounts and customizable gift cards.</p>
        <button className="mt-6 bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors">
            Contact Sales Team
        </button>
    </PageLayout>
);
