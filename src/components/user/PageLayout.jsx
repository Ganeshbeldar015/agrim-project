import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sprout } from 'lucide-react';

const PageLayout = ({ title, icon: Icon, children, maxWidth = "max-w-7xl" }) => (
    <div className="min-h-screen bg-[#FCFDFB] relative overflow-hidden font-sans text-emerald-950 selection:bg-emerald-100">
        {/* Background Decorations */}
        <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-emerald-50/80 to-transparent -z-10" />
        <div className="fixed -top-24 -right-24 w-96 h-96 bg-emerald-100/50 rounded-full blur-[100px] -z-10" />
        <div className="fixed top-1/2 -left-24 w-72 h-72 bg-yellow-50/50 rounded-full blur-[80px] -z-10" />

        <div className={`container mx-auto px-6 py-12 ${maxWidth} relative z-10`}>
            {/* Header Navigation */}
            <nav className="flex items-center justify-between mb-16">
                <Link to="/" className="group flex items-center gap-2 text-emerald-900/60 font-bold hover:text-emerald-600 transition-colors">
                    <div className="p-2 bg-white border border-emerald-100 rounded-xl group-hover:border-emerald-300 transition-all shadow-sm">
                        <ArrowLeft className="w-5 h-5" />
                    </div>
                    <span>Back to Home</span>
                </Link>
                {/* <div className="flex items-center gap-2">
                    <Sprout className="w-5 h-5 text-emerald-500" />
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-900/40">Agrim Demo</span>
                </div> */}
            </nav>

            {/* Page Header */}
            <header className="text-center max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="inline-flex items-center justify-center p-4 bg-white border border-emerald-50 rounded-[2rem] shadow-sm mb-6">
                    {Icon && <Icon className="w-8 h-8 text-emerald-600" />}
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-emerald-950 tracking-tight leading-tight mb-6">
                    {title}
                </h1>
                <div className="h-1 w-24 bg-gradient-to-r from-emerald-400 to-emerald-200 rounded-full mx-auto" />
            </header>

            {/* Main Content */}
            <main className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                {children}
            </main>
        </div>
    </div>
);

export default PageLayout;
