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

  // Fallback services array used if backend is loading or unavailable
  const fallbackServices = [
    {
      id: 'fallback-1',
      title: 'Complete Interior & Exterior Detailing',
      description: 'Full deep steam cleaning, leather conditioning, paint decontamination, multi-stage hand wash, and tire dressing for complete renewal.',
      price: 'Starting at $199',
      icon: Car
    },
    {
      id: 'fallback-2',
      title: 'Wax & Polish',
      description: 'High-gloss paint restoration, minor swirl removal, and long-lasting synthetic wax sealant protection.',
      price: 'Starting at $149',
      icon: Sparkles
    },
    {
      id: 'fallback-3',
      title: 'Tint Windows',
      description: 'Premium UV-blocking ceramic automotive window tinting for maximum heat reduction, privacy, and glare control.',
      price: 'Starting at $179',
      icon: Sun
    },
    {
      id: 'fallback-4',
      title: '3M Protection',
      description: 'Durable clear bra / paint protection film (PPF) shielding your vehicle front against rock chips, scratches, and road debris.',
      price: 'Starting at $299',
      icon: ShieldCheck
    },
    {
      id: 'fallback-5',
      title: 'Stereo Installation & Services',
      description: 'Custom sound system integration, touchscreen head unit upgrades, premium speakers, subwoofers, and amplifier tuning.',
      price: 'Custom Quote',
      icon: Music
    },
    {
      id: 'fallback-6',
      title: 'Remote Start',
      description: 'Professional installation of long-range, cold-weather reliable remote vehicle starters with smartphone app options.',
      price: 'Starting at $249',
      icon: Flame
    }
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        const response = await axios.get(`${apiBase}/api/services`);
        if (response.data && response.data.length > 0) {
          setServices(response.data);
        } else {
          setServices(fallbackServices);
        }
      } catch (error) {
        console.warn('Backend API unreachable, utilizing fallback services payload:', error);
        setServices(fallbackServices);
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
      {/* ========================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-100">
        
        {/* Subtle background glow graphics */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#70BAE6]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-24 w-80 h-80 bg-[#70BAE6]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Eyebrow Pill Badge */}
              <div className="inline-flex items-center gap-2 bg-[#70BAE6]/10 border border-[#70BAE6]/20 px-4 py-2 rounded-full text-[#70BAE6] font-semibold text-xs sm:text-sm tracking-wide">
                <Sparkles className="w-4 h-4 text-[#70BAE6]" />
                <span>Calgary's Premier Auto Care &amp; Audio Specialists</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                Precision Detailing &amp; <br className="hidden sm:inline" />
                <span className="text-[#70BAE6]">Custom Stereo</span> Installation
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Elevate your driving experience. From showroom-quality interior and exterior detailing to 3M paint protection, window tinting, and high-performance audio systems—we bring expert craftsmanship to every vehicle.
              </p>

              {/* Call to Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/booking"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#70BAE6] hover:bg-[#58A6D3] text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg shadow-[#70BAE6]/25 hover:shadow-xl hover:shadow-[#70BAE6]/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Book Your Service Now</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <a
                  href="#services"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base px-8 py-4 rounded-xl border border-slate-200 hover:border-[#70BAE6] transition-all shadow-sm"
                >
                  <span>Explore Services</span>
                </a>
              </div>

              {/* Trust Badges Bar */}
              <div className="pt-8 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-[#70BAE6]/10 text-[#70BAE6] shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">100% Satisfaction</p>
                    <p className="text-xs text-slate-500">Guaranteed Quality Care</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-[#70BAE6]/10 text-[#70BAE6] shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Certified Technicians</p>
                    <p className="text-xs text-slate-500">Years of Expert Service</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-[#70BAE6]/10 text-[#70BAE6] shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Premium Materials</p>
                    <p className="text-xs text-slate-500">3M Film &amp; Top Audio Brands</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 p-8 text-white shadow-2xl overflow-hidden border border-slate-700">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#70BAE6]/20 rounded-full blur-2xl pointer-events-none" />
                
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                    <div>
                      <span className="text-xs font-bold tracking-widest text-[#70BAE6] uppercase">G&amp;K Auto Care</span>
                      <h3 className="text-xl font-bold text-white">Featured Services Suite</h3>
                    </div>
                    <div className="p-2 bg-[#70BAE6]/20 rounded-xl">
                      <Car className="w-6 h-6 text-[#70BAE6]" />
                    </div>
                  </div>

                  <ul className="space-y-3 text-sm text-slate-300">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#70BAE6] shrink-0" />
                      <span>Deep Steam Cleaning &amp; Leather Treatment</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#70BAE6] shrink-0" />
                      <span>3M Clear Bra Paint Protection &amp; Swirl Polish</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#70BAE6] shrink-0" />
                      <span>UV Ceramic Window Tinting (All Windows)</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#70BAE6] shrink-0" />
                      <span>Subwoofer, Amp &amp; Apple CarPlay Installs</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#70BAE6] shrink-0" />
                      <span>Cold-Weather 2-Way Remote Starters</span>
                    </li>
                  </ul>

                  <div className="pt-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">Ready to transform your ride?</p>
                      <p className="text-sm font-bold text-white">Call (403) 293-8989</p>
                    </div>
                    <a
                      href="tel:4032938989"
                      className="bg-[#70BAE6] hover:bg-[#58A6D3] text-white p-2.5 rounded-lg transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
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