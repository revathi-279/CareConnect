import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ServiceGrid from '../components/ServiceGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import { ShieldCheck, CheckCircle2, Award, CalendarCheck, Clock, Headphones } from 'lucide-react';

const Home = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services');
        if (res.data?.success) {
          setServices(res.data.data.slice(0, 4)); // Show top 4 featured
        }
      } catch (err) {
        setError(err.message || 'Unable to load services');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 md:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#2F6F4E]/10 border border-[#2F6F4E]/20 text-[#2F6F4E] text-xs font-bold uppercase tracking-wider">
                <ShieldCheck size={16} />
                <span>Verified Home Care Network</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1F2937] leading-[1.15] tracking-tight">
                Reliable Home Services, <br />
                <span className="text-[#2F6F4E]">Right When You Need Them.</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
                Book trusted professionals for cleaning, repairs, maintenance and more — all from one place.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/services"
                  className="px-6 py-3.5 bg-[#2F6F4E] hover:bg-[#25593e] text-white font-bold rounded-xl shadow-lg shadow-[#2F6F4E]/20 transition"
                >
                  Explore Services
                </Link>
                <Link
                  to="/services"
                  className="px-6 py-3.5 bg-white border border-stone-300 hover:border-stone-400 font-bold text-gray-800 rounded-xl transition"
                >
                  Book a Service
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-stone-200">
                <div className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <CheckCircle2 size={18} className="text-[#2F6F4E]" />
                  <span>Verified professionals</span>
                </div>
                <div className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <CheckCircle2 size={18} className="text-[#2F6F4E]" />
                  <span>Clear service scope</span>
                </div>
                <div className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <CheckCircle2 size={18} className="text-[#2F6F4E]" />
                  <span>Easy online booking</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80"
                  alt="Home professional at work"
                  className="w-full h-[420px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-white">
                  <p className="text-xs uppercase tracking-wider text-[#2F6F4E] font-bold">Guaranteed Safety</p>
                  <p className="text-sm font-bold text-gray-900">Background Checked Specialists</p>
                  <p className="text-xs text-gray-500">Every provider passes our 4-point verification check.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-[#1F2937] tracking-tight">Services for Your Home</h2>
            <p className="text-gray-600 mt-2 text-base">
              From everyday cleaning to essential repairs, find the help you need.
            </p>
          </div>
          <Link
            to="/services"
            className="text-sm font-bold text-[#2F6F4E] hover:underline"
          >
            View all 8 services →
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading service options..." />
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-xl text-center text-sm">{error}</div>
        ) : (
          <ServiceGrid services={services} />
        )}
      </section>

      {/* 3. HOW IT WORKS */}
      <section id="how-it-works" className="bg-white py-16 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#2F6F4E]">Simple 4-Step Process</span>
            <h2 className="text-3xl font-extrabold text-[#1F2937] mt-2">How CareConnect Works</h2>
            <p className="text-gray-600 mt-2">Get reliable home assistance in four straightforward steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-[#FAF6ED] border border-stone-200 relative">
              <span className="text-4xl font-extrabold text-[#2F6F4E]/30 mb-4 block">01</span>
              <h3 className="text-lg font-bold text-[#1F2937] mb-2">Choose a Service</h3>
              <p className="text-sm text-gray-600">Select the task you need help with from our transparent catalog.</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#FAF6ED] border border-stone-200 relative">
              <span className="text-4xl font-extrabold text-[#2F6F4E]/30 mb-4 block">02</span>
              <h3 className="text-lg font-bold text-[#1F2937] mb-2">Schedule a Visit</h3>
              <p className="text-sm text-gray-600">Pick your preferred date and convenient 2-hour arrival slot.</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#FAF6ED] border border-stone-200 relative">
              <span className="text-4xl font-extrabold text-[#2F6F4E]/30 mb-4 block">03</span>
              <h3 className="text-lg font-bold text-[#1F2937] mb-2">Get the Service</h3>
              <p className="text-sm text-gray-600">A verified specialist arrives punctually with required tools.</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#FAF6ED] border border-stone-200 relative">
              <span className="text-4xl font-extrabold text-[#2F6F4E]/30 mb-4 block">04</span>
              <h3 className="text-lg font-bold text-[#1F2937] mb-2">Done</h3>
              <p className="text-sm text-gray-600">Inspect the work and enjoy a well-maintained home.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY CARECONNECT */}
      <section id="why-us" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl font-extrabold text-[#1F2937]">Why CareConnect</h2>
          <p className="text-gray-600 mt-2">Built specifically around the expectations of modern homeowners.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#2F6F4E]/10 text-[#2F6F4E] flex items-center justify-center mb-4">
              <Award size={24} />
            </div>
            <h3 className="text-lg font-bold text-[#1F2937] mb-2">Trusted Professionals</h3>
            <p className="text-sm text-gray-600">Experienced service pros rigorously evaluated for quality work.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#7DB8DA]/20 text-[#2F6F4E] flex items-center justify-center mb-4">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-lg font-bold text-[#1F2937] mb-2">Clear Service Scope</h3>
            <p className="text-sm text-gray-600">Detailed What's Included and Excluded items before you confirm.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#D4A857]/20 text-amber-800 flex items-center justify-center mb-4">
              <CalendarCheck size={24} />
            </div>
            <h3 className="text-lg font-bold text-[#1F2937] mb-2">Convenient Booking</h3>
            <p className="text-sm text-gray-600">Seamless instant appointment scheduling directly in seconds.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
              <Clock size={24} />
            </div>
            <h3 className="text-lg font-bold text-[#1F2937] mb-2">Simple Tracking</h3>
            <p className="text-sm text-gray-600">Live milestone timeline tracking from confirmation to completion.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;