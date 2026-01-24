import React from 'react';
import { Sprout, Instagram, Twitter, Facebook, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-emerald-950 text-white pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-2 text-2xl font-black">
              <Sprout className="text-emerald-400 w-8 h-8" />
              <span>Antigravity<span className="text-emerald-400">Agro</span></span>
            </div>
            <p className="text-emerald-100/60 leading-relaxed max-w-xs">
              Directly connecting sustainable farms with conscious consumers. Freshness you can trace back to the soil.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-emerald-500 transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-2">
            <h3 className="font-black text-emerald-400 mb-6 uppercase tracking-widest text-xs">The Market</h3>
            <ul className="space-y-4 text-emerald-100/70 font-medium">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">About Our Farms</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Certifications</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Impact Report</a></li>
            </ul>
          </div>
          
          <div className="md:col-span-2">
            <h3 className="font-black text-emerald-400 mb-6 uppercase tracking-widest text-xs">For Farmers</h3>
            <ul className="space-y-4 text-emerald-100/70 font-medium">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Start Selling</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Growth Tools</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Logistics Support</a></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="font-black text-emerald-400 mb-6 uppercase tracking-widest text-xs">Direct Support</h3>
            <div className="bg-white/5 p-6 rounded-[32px] border border-white/10">
              <p className="text-sm mb-4 text-emerald-100/70 font-medium">Need help with an order?</p>
              <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" /> Contact Support
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-emerald-100/40 font-medium">
          <p>&copy; {new Date().getFullYear()} Antigravity Agro. Cultivating a better future.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Harvest</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;