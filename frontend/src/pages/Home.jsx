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
      {/* 1. HERO SECTION                            */}
      {/* Replace the previous Section 1 block with this section. */}
      {/* ========================================== */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-slate-50 via-white to-slate-50 pt-16 pb-12 sm:pt-20 lg:pt-24 lg:pb-16">
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(#1687B5_1px,transparent_1px),linear-gradient(90deg,#1687B5_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:repeating-linear-gradient(135deg,transparent,transparent_18px,#1687B5_19px,transparent_20px)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#1687B5]/[0.1] via-[#1687B5]/[0.03] to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#1687B5]/30 bg-white/80 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#0F6F98] shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Calgary&apos;s Automotive &amp; Audio Specialists</span>
            </div>

            <h1 className="mt-7 text-4xl font-black leading-[1.05] tracking-tight text-slate-900 sm:text-6xl">
              <span className="text-[#1687B5]">Custom Stereo</span> &amp; Precision Detailing
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Expert detailing, paint protection, tinting, and audio upgrades for drivers who care how every mile feels.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/booking"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1687B5] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#1687B5]/25 transition-all hover:-translate-y-0.5 hover:bg-[#0F6F98] hover:shadow-xl hover:shadow-[#1687B5]/30 active:translate-y-0 sm:w-auto"
              >
                <span>Book Appointment</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="tel:4032938989"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white/70 px-7 py-3.5 text-sm font-bold text-slate-800 transition-colors hover:border-[#1687B5] hover:text-[#0F6F98] sm:w-auto"
              >
                <Phone className="h-4 w-4 text-[#1687B5]" />
                <span>Call (403) 293-8989</span>
              </a>
            </div>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 border-t border-slate-200 text-left sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex gap-3 border-b border-slate-200 py-5 sm:border-r sm:px-5 lg:border-b-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1687B5]/10 text-[#1687B5]"><ShieldCheck className="h-4 w-4" /></div>
              <div><p className="text-xs font-bold text-slate-900">100% Guaranteed Quality</p><p className="mt-1 text-xs leading-relaxed text-slate-500">Premium materials &amp; 3M protection.</p></div>
            </div>
            <div className="flex gap-3 border-b border-slate-200 py-5 sm:px-5 lg:border-b-0 lg:border-r">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1687B5]/10 text-[#1687B5]"><Award className="h-4 w-4" /></div>
              <div><p className="text-xs font-bold text-slate-900">Certified Audio &amp; Detailers</p><p className="mt-1 text-xs leading-relaxed text-slate-500">Expert craftsmanship on every build.</p></div>
            </div>
            <div className="flex gap-3 border-b border-slate-200 py-5 sm:border-r sm:px-5 lg:border-b-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1687B5]/10 text-[#1687B5]"><MapPin className="h-4 w-4" /></div>
              <div><p className="text-xs font-bold text-slate-900">Calgary Workshop</p><p className="mt-1 text-xs leading-relaxed text-slate-500">125- 7 Westwinds Cres NE.</p></div>
            </div>
            <div className="flex gap-3 py-5 sm:px-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1687B5]/10 text-[#1687B5]"><Phone className="h-4 w-4" /></div>
              <div><p className="text-xs font-bold text-slate-900">Direct Phone Support</p><p className="mt-1 text-xs leading-relaxed text-slate-500">(403) 293-8989</p></div>
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
            <h2 className="text-xs font-extrabold text-[#1687B5] uppercase tracking-widest">
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
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1687B5]" />
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
                    className="group bg-white rounded-2xl p-7 border border-slate-200 hover:border-[#1687B5] hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      
                      {/* Top Card Icon Badge */}
                      <div className="flex items-center justify-between">
                        <div className="p-3.5 rounded-xl bg-[#1687B5]/10 text-[#1687B5] group-hover:bg-[#1687B5] group-hover:text-white transition-colors duration-300">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        {service.price && (
                          <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
                            {service.price}
                          </span>
                        )}
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#1687B5] transition-colors">
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
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#1687B5] hover:text-[#0F6F98] transition-colors group/btn"
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
            <h2 className="text-xs font-extrabold text-[#1687B5] uppercase tracking-widest">
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
                className="flex items-start gap-4 p-5 bg-white rounded-xl border border-slate-200 hover:border-[#1687B5] hover:shadow-md transition-all group"
              >
                <div className="p-3 rounded-lg bg-[#1687B5]/10 text-[#1687B5] group-hover:bg-[#1687B5] group-hover:text-white transition-colors shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Support</h4>
                  <p className="text-lg font-bold text-slate-900 group-hover:text-[#1687B5] transition-colors">(403) 293-8989</p>
                  <p className="text-xs text-slate-500">Call or text us for immediate service inquiries.</p>
                </div>
              </a>

              {/* Email Card */}
              <a
                href="mailto:gandkautodetailing1@gmail.com"
                className="flex items-start gap-4 p-5 bg-white rounded-xl border border-slate-200 hover:border-[#1687B5] hover:shadow-md transition-all group"
              >
                <div className="p-3 rounded-lg bg-[#1687B5]/10 text-[#1687B5] group-hover:bg-[#1687B5] group-hover:text-white transition-colors shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Business Email</h4>
                  <p className="text-lg font-bold text-slate-900 group-hover:text-[#1687B5] transition-colors break-all">gandkautodetailing1@gmail.com</p>
                  <p className="text-xs text-slate-500">Send detailed quotes or specific project media.</p>
                </div>
              </a>

              {/* Physical Address Card */}
              <div className="flex items-start gap-4 p-5 bg-white rounded-xl border border-slate-200">
                <div className="p-3 rounded-lg bg-[#1687B5]/10 text-[#1687B5] shrink-0">
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
                <div className="p-3 rounded-lg bg-[#1687B5]/10 text-[#1687B5] shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hours of Operation</h4>
                  <p className="text-sm font-semibold text-slate-800">Contact us for current availability.</p>
                </div>
              </div>

            </div>

            {/* Right Column: Direction & Fast Action Card */}
            <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-8 flex flex-col justify-between shadow-xl border border-slate-800 relative overflow-hidden">
              <div className="space-y-6 z-10">
                <div className="inline-flex items-center gap-2 bg-[#1687B5]/20 text-[#1687B5] px-3 py-1 rounded-full text-xs font-semibold">
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
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#1687B5] hover:bg-[#0F6F98] text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-md"
                  >
                    <span>Get Directions on Google Maps</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <Link
                    to="/booking"
                    className="w-full inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm py-3.5 rounded-xl border border-slate-700 transition-all"
                  >
                    <Calendar className="w-4 h-4 text-[#1687B5]" />
                    <span>Reserve Online Appointment</span>
                  </Link>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>G&amp;K Auto Detailing &amp; Stereo</span>
                <span className="text-[#1687B5] font-semibold">Calgary, AB</span>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}