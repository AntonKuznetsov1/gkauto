import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Sparkles,
  ShieldCheck,
  Music,
  Sun,
  Flame,
  Car,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ArrowRight,
  Clock,
  ExternalLink,
  Award,
  Wrench
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        const response = await axios.get(`${apiBase}/api/services`);
        setServices(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.warn('Could not load services from API:', error);
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Map service titles to matching Lucide icons
  const getServiceIcon = (title) => {
    const lower = title.toLowerCase();
    if (lower.includes('detail') || lower.includes('interior')) return Car;
    if (lower.includes('wax') || lower.includes('polish')) return Sparkles;
    if (lower.includes('tint')) return Sun;
    if (lower.includes('3m') || lower.includes('protect')) return ShieldCheck;
    if (lower.includes('stereo') || lower.includes('audio')) return Music;
    if (lower.includes('remote') || lower.includes('start')) return Flame;
    return Wrench;
  };

  const handleBookService = (serviceTitle) => {
    navigate('/booking', { state: { selectedServiceTitle: serviceTitle } });
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* ========================================== */}
      {/* 1. HERO SECTION (REDESIGNED STUDIO LAYOUT) */}
      {/* ========================================== */}
      <section className="relative overflow-hidden bg-slate-900 text-slate-100 pt-16 pb-20 lg:pt-24 lg:pb-32 border-b border-slate-800">

        {/* Micro-Dot Grid Pattern Background */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#70BAE6 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Ambient Top Lighting Framing Grid */}
        <div className="absolute top-0 right-1/4 w-full max-w-3xl h-96 bg-gradient-to-b from-[#70BAE6]/10 via-transparent to-transparent blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Eyebrow Pill Badge */}
              <div className="inline-flex items-center gap-2 bg-slate-800/80 backdrop-blur-md border border-slate-700/80 px-4 py-2 rounded-full text-[#70BAE6] font-semibold text-xs tracking-wider uppercase shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#70BAE6]" />
                <span>Calgary's Premier Auto Care &amp; Audio Studio</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Precision Detailing &amp; <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#70BAE6] via-[#8ecef5] to-white">
                  Custom Stereo
                </span> Craftsmanship
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                From showroom-grade interior and paint restoration to custom subwoofers, Apple CarPlay, and UV protective tinting—we engineer custom solutions for every vehicle.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/booking"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#70BAE6] hover:bg-[#58A6D3] text-slate-950 font-bold text-base px-8 py-4 rounded-xl shadow-lg shadow-[#70BAE6]/20 hover:shadow-xl hover:shadow-[#70BAE6]/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Book Service Appointment</span>
                  <ArrowRight className="w-5 h-5 text-slate-950" />
                </Link>

                <a
                  href="tel:4032938989"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-slate-800/80 hover:bg-slate-800 text-white font-semibold text-base px-8 py-4 rounded-xl border border-slate-700 hover:border-[#70BAE6]/50 transition-all backdrop-blur-sm"
                >
                  <Phone className="w-4 h-4 text-[#70BAE6]" />
                  <span>Call (403) 293-8989</span>
                </a>
              </div>

              {/* Trust Badges Bar */}
              <div className="pt-8 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800/80 backdrop-blur-sm">
                  <div className="p-2.5 rounded-lg bg-[#70BAE6]/10 text-[#70BAE6] shrink-0 border border-[#70BAE6]/20">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white">100% Satisfaction</p>
                    <p className="text-[11px] text-slate-400">Guaranteed Precision Work</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800/80 backdrop-blur-sm">
                  <div className="p-2.5 rounded-lg bg-[#70BAE6]/10 text-[#70BAE6] shrink-0 border border-[#70BAE6]/20">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white">Certified Technicians</p>
                    <p className="text-[11px] text-slate-400">Master Installers &amp; Detailers</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800/80 backdrop-blur-sm">
                  <div className="p-2.5 rounded-lg bg-[#70BAE6]/10 text-[#70BAE6] shrink-0 border border-[#70BAE6]/20">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white">Premium Materials</p>
                    <p className="text-[11px] text-slate-400">3M Film &amp; Top Audio Brands</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Visual Showcase Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl bg-slate-800/60 p-3 border border-slate-700/80 shadow-2xl backdrop-blur-sm overflow-hidden group">
                
                {/* Main Visual Studio Display */}
                <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-950 border border-slate-800">
                  <img
                    src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80"
                    alt="G&K Auto Care Studio Bay"
                    className="w-full h-full object-cover object-center opacity-85 group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  {/* Status Live Indicator Tag */}
                  <div className="absolute top-4 left-4 inline-flex items-center gap-2 bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-full text-xs font-semibold text-white backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Studio Bay Active</span>
                  </div>
                </div>

                {/* Floating Metrics Overlay Card */}
                <div className="absolute top-8 -right-3 sm:-right-6 bg-slate-900/95 border border-slate-700/80 p-4 rounded-xl shadow-xl backdrop-blur-md max-w-[200px] hidden sm:block transform hover:-translate-y-1 transition-transform">
                  <div className="flex items-center gap-1.5 text-amber-400 text-sm font-bold mb-1">
                    <span>★ 5.0 Rating</span>
                  </div>
                  <p className="text-xs font-bold text-white">Calgary's Top Choice</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">100+ Vehicles Crafted &amp; Detailed Monthly</p>
                </div>

                {/* Quick Mobile Call Card */}
                <div className="mt-3 bg-slate-900/90 border border-slate-700/80 p-4 rounded-xl flex items-center justify-between gap-4 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-[#70BAE6]/10 text-[#70BAE6] shrink-0 border border-[#70BAE6]/20">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Immediate Questions?</p>
                      <p className="text-sm font-bold text-white">Direct Studio Line</p>
                    </div>
                  </div>
                  
                  <a
                    href="tel:4032938989"
                    className="inline-flex items-center gap-2 bg-[#70BAE6] hover:bg-[#58A6D3] text-slate-950 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-colors shrink-0"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>(403) 293-8989</span>
                  </a>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 2. DYNAMIC SERVICES GRID SECTION           */}
      {/* ========================================== */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-extrabold text-[#70BAE6] uppercase tracking-widest">
              Our Expertise
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Comprehensive Automotive &amp; Audio Solutions
            </p>
            <p className="text-base text-slate-600">
              Select from our specialized suite of auto detailing, protective coatings, tinting, custom audio systems, and remote starting services.
            </p>
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#70BAE6]" />
            </div>
          )}

          {/* Services Grid (6 Cards) */}
          {!isLoading && (
            services.length === 0 ? (
              <div className="py-12 text-center border border-slate-200 rounded-2xl">
                <p className="text-sm text-slate-500">Our services are being updated. Please check back soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, index) => {
                const IconComponent = service.icon || getServiceIcon(service.title);

                return (
                  <div
                    key={service.id || index}
                    className="group bg-white rounded-2xl p-7 border border-slate-200 hover:border-[#70BAE6] hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      
                      {/* Top Card Icon Badge */}
                      <div className="flex items-center justify-between">
                        <div className="p-3.5 rounded-xl bg-[#70BAE6]/10 text-[#70BAE6] group-hover:bg-[#70BAE6] group-hover:text-white transition-colors duration-300">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        {service.price && (
                          <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
                            {service.price}
                          </span>
                        )}
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#70BAE6] transition-colors">
                        {service.title}
                      </h3>

                      <p className="text-sm text-slate-600 leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    {/* Book Link Button */}
                    <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => handleBookService(service.title)}
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#70BAE6] hover:text-[#58A6D3] transition-colors group/btn"
                      >
                        <span>Book Service</span>
                        <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                      </button>

                      <span className="text-xs text-slate-400 font-medium">G&amp;K Quality</span>
                    </div>
                  </div>
                );
                })}
              </div>
            )
          )}

        </div>
      </section>

      {/* ========================================== */}
      {/* 3. CONTACT & LOCATION CARD SECTION         */}
      {/* ========================================== */}
      <section id="contact" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-extrabold text-[#70BAE6] uppercase tracking-widest">
              Location &amp; Touchpoints
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Visit Our Calgary Shop or Get In Touch
            </p>
            <p className="text-base text-slate-600">
              Have a custom request or want to schedule an in-person estimate? We are ready to assist you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Column: Direct Interactive Touchpoint Cards */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Phone Card */}
              <a
                href="tel:4032938989"
                className="flex items-start gap-4 p-5 bg-white rounded-xl border border-slate-200 hover:border-[#70BAE6] hover:shadow-md transition-all group"
              >
                <div className="p-3 rounded-lg bg-[#70BAE6]/10 text-[#70BAE6] group-hover:bg-[#70BAE6] group-hover:text-white transition-colors shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Support</h4>
                  <p className="text-lg font-bold text-slate-900 group-hover:text-[#70BAE6] transition-colors">(403) 293-8989</p>
                  <p className="text-xs text-slate-500">Call or text us for immediate service inquiries.</p>
                </div>
              </a>

              {/* Email Card */}
              <a
                href="mailto:gandkautodetailing1@gmail.com"
                className="flex items-start gap-4 p-5 bg-white rounded-xl border border-slate-200 hover:border-[#70BAE6] hover:shadow-md transition-all group"
              >
                <div className="p-3 rounded-lg bg-[#70BAE6]/10 text-[#70BAE6] group-hover:bg-[#70BAE6] group-hover:text-white transition-colors shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Business Email</h4>
                  <p className="text-lg font-bold text-slate-900 group-hover:text-[#70BAE6] transition-colors break-all">gandkautodetailing1@gmail.com</p>
                  <p className="text-xs text-slate-500">Send detailed quotes or specific project media.</p>
                </div>
              </a>

              {/* Physical Address Card */}
              <div className="flex items-start gap-4 p-5 bg-white rounded-xl border border-slate-200">
                <div className="p-3 rounded-lg bg-[#70BAE6]/10 text-[#70BAE6] shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shop Address</h4>
                  <p className="text-base font-bold text-slate-900">125- 7 Westwinds Cres NE, Calgary, AB, Canada, T3J 5H2</p>
                  <p className="text-xs text-slate-500">Located conveniently in Westwinds Calgary.</p>
                </div>
              </div>

              {/* Operating Hours Card */}
              <div className="flex items-start gap-4 p-5 bg-white rounded-xl border border-slate-200">
                <div className="p-3 rounded-lg bg-[#70BAE6]/10 text-[#70BAE6] shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hours of Operation</h4>
                  <p className="text-sm font-semibold text-slate-800">Monday – Saturday: 8:00 AM – 6:00 PM</p>
                  <p className="text-xs text-slate-500">Sunday: Closed</p>
                </div>
              </div>

            </div>

            {/* Right Column: Direction & Fast Action Card */}
            <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-8 flex flex-col justify-between shadow-xl border border-slate-800 relative overflow-hidden">
              <div className="space-y-6 z-10">
                <div className="inline-flex items-center gap-2 bg-[#70BAE6]/20 text-[#70BAE6] px-3 py-1 rounded-full text-xs font-semibold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Calgary Workshop</span>
                </div>

                <h3 className="text-2xl font-bold text-white">
                  Ready to upgrade your vehicle's look and audio?
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed">
                  Book online in less than 2 minutes, or click below to get turn-by-turn driving directions directly to our shop.
                </p>

                <div className="pt-4 space-y-3">
                  <a
                    href="https://maps.google.com/?q=125-+7+Westwinds+Cres+NE,+Calgary,+AB+T3J+5H2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#70BAE6] hover:bg-[#58A6D3] text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-md"
                  >
                    <span>Get Directions on Google Maps</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <Link
                    to="/booking"
                    className="w-full inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm py-3.5 rounded-xl border border-slate-700 transition-all"
                  >
                    <Calendar className="w-4 h-4 text-[#70BAE6]" />
                    <span>Reserve Online Appointment</span>
                  </Link>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>G&amp;K Auto Detailing &amp; Stereo</span>
                <span className="text-[#70BAE6] font-semibold">Calgary, AB</span>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}