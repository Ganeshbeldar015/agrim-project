import React from 'react';
import { Gift, Truck, CheckCircle, Mail, DollarSign, Package, CreditCard, Star } from 'lucide-react';
import PageLayout from '../../components/user/PageLayout';

const BulkOrders = () => {
    return (
        <PageLayout title="Bulk Orders & Corporate Gifting" icon={Gift}>
            <div className="max-w-3xl mx-auto text-center mb-16">
                <p className="text-xl text-emerald-800/70 leading-relaxed font-medium">
                    From farm-fresh corporate hampers to restaurant supplies, we handle large-scale orders with precision and care.
                </p>
            </div>

            {/* Value Props Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-20 text-left">
                {[
                    { icon: DollarSign, title: 'Wholesale Pricing', desc: 'Get up to 30% off on bulk quantities.' },
                    { icon: Truck, title: 'Priority Logistics', desc: 'Scheduled deliveries for businesses.' },
                    { icon: Package, title: 'Custom Packaging', desc: 'Eco-friendly branding options available.' }
                ].map((item, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[32px] border border-emerald-50 hover:border-emerald-200 hover:shadow-lg transition-all group">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                <item.icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-black text-emerald-950 text-lg leading-tight">{item.title}</h3>
                        </div>
                        <p className="text-emerald-800/60 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>

            {/* Gift Cards Section - Visual Highlight */}
            <div className="bg-emerald-900 rounded-[48px] p-8 md:p-16 mb-20 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                    <div className="text-left">
                        <span className="inline-block px-4 py-1.5 bg-emerald-800 text-emerald-200 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                            New Arrival
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                            The Gift of <br/> <span className="text-emerald-400">Good Health.</span>
                        </h2>
                        <p className="text-emerald-100/70 text-lg mb-8 max-w-md">
                            Give your loved ones the freedom to choose their own fresh harvest. Perfect for festivals, birthdays, and employee rewards.
                        </p>
                        <button className="bg-emerald-400 text-emerald-950 px-8 py-4 rounded-2xl font-black hover:bg-white transition-colors shadow-lg shadow-emerald-900/50 flex items-center gap-2">
                            Buy Gift Cards <CreditCard className="w-5 h-5" />
                        </button>
                    </div>
                    
                    {/* Mock Gift Card Visual */}
                    <div className="relative group perspective-1000">
                        <div className="w-[340px] h-[220px] bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl shadow-2xl mx-auto rotate-3 group-hover:rotate-0 transition-transform duration-500 relative overflow-hidden border border-white/20">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                            <div className="absolute top-6 left-8 text-white/90">
                                <Gift className="w-8 h-8 mb-2" />
                            </div>
                            <div className="absolute bottom-6 left-8 text-white">
                                <p className="text-xs uppercase tracking-widest opacity-75 mb-1">Gift Card</p>
                                <p className="font-mono text-lg tracking-wider">**** **** **** 4022</p>
                            </div>
                            <div className="absolute bottom-6 right-8 text-white font-black text-2xl">
                                ₹500
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Form for Bulk */}
            <div className="bg-white border border-emerald-100 rounded-[40px] p-8 md:p-12 text-left max-w-4xl mx-auto shadow-sm">
                 <div className="flex items-center gap-4 mb-8">
                     <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600">
                        <Mail className="w-6 h-6" />
                    </div>
                    <h3 className="text-3xl font-black text-emerald-950">Bulk Inquiry</h3>
                </div>

                <form className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-emerald-800 ml-1">Organization Name</label>
                        <input type="text" placeholder="e.g. Green Earth Corp" className="w-full p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-emerald-800 ml-1">Contact Person</label>
                        <input type="text" placeholder="Your Name" className="w-full p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-emerald-800 ml-1">Email Address</label>
                        <input type="email" placeholder="name@company.com" className="w-full p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all" />
                    </div>
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-emerald-800 ml-1">Estimated Quantity (kg)</label>
                        <input type="number" placeholder="100" className="w-full p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-bold text-emerald-800 ml-1">Requirements</label>
                        <textarea rows="4" placeholder="Describe your needs..." className="w-full p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all resize-none"></textarea>
                    </div>
                    <div className="md:col-span-2">
                        <button className="w-full bg-emerald-950 text-white font-black py-5 rounded-2xl hover:bg-emerald-800 transition-colors shadow-xl">
                            Request Quote
                        </button>
                    </div>
                </form>
            </div>
        </PageLayout>
    );
};

export default BulkOrders;
