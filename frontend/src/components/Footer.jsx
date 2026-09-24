import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ShieldCheck, Clock, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-[#2F6F4E] flex items-center justify-center text-white">
                <Wrench size={16} />
              </div>
              <span className="font-extrabold text-xl text-white">
                Care<span className="text-[#7DB8DA]">Connect</span>
              </span>
            </div>
            <p className="text-sm text-stone-400">
              Reliable, verified home maintenance and repair services at transparent upfront pricing.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/services" className="hover:text-white transition">Browse Services</Link></li>
              <li><a href="/#how-it-works" className="hover:text-white transition">How It Works</a></li>
              <li><a href="/#why-us" className="hover:text-white transition">Why Choose Us</a></li>
            </ul>
          </div>

          {/* Trust points */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Our Standards</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li className="flex items-center space-x-2">
                <ShieldCheck size={16} className="text-[#2F6F4E]" />
                <span>Verified Professionals</span>
              </li>
              <li className="flex items-center space-x-2">
                <Clock size={16} className="text-[#2F6F4E]" />
                <span>Punctual Service Slots</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin size={16} className="text-[#2F6F4E]" />
                <span>Doorstep Service Delivery</span>
              </li>
            </ul>
          </div>

          {/* Platform note */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Platform Scope</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Exclusively dedicated to property care, residential cleaning, electrical repairs, and plumbing maintenance.
            </p>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-10 pt-6 text-center text-xs text-stone-500">
          © {new Date().getFullYear()} CareConnect Technologies Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;