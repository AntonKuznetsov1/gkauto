import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

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

  const handleBookService = (serviceTitle) => {
    navigate('/booking', { state: { selectedServiceTitle: serviceTitle } });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      
      {/* ========================================== */}
      {/* 1. HERO SECTION (EDITORIAL & TYPOGRAPHIC)  */}
      {/* ========================================== */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20 border-b border-zinc-800">
        
        {/* Status indicator pill */}
        <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs font-mono text-zinc-400 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Calgary Studio Bay — Active</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          
          {/* Main Headline Block */}
          <div className="lg:col-span-8">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-semibold text-zinc-100 tracking-tight leading-[1.04] mb-8">
              Precision detailing.<br />
              Uncompromised audio.
            </h1>
            
            <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl font-normal leading-relaxed">
              Showroom-grade paint restoration, custom subwoofer fabrication, Apple CarPlay integration, and 3M ceramic tinting—engineered for performance.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="lg:col-span-4 flex flex-col gap-3 font-mono text-sm">
            <Link
              to="/booking"
              className="w-full text-center bg-zinc-100 text-zinc-950 px-6 py-4 font-semibold hover:bg-zinc-300 transition-colors"
            >
              Reserve Appointment
            </Link>
            <a
              href="tel:4032938989"
              className="w-full text-center border border-zinc-800 text-zinc-300 px-6 py-4 hover:bg-zinc-900/80 transition-colors"
            >
              Direct Line — (403) 293-8989
            </a>
          </div>

        </div>

        {/* Spec Bar / Standards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-800 border border-zinc-800 mt-20">
          <div className="bg-zinc-950 p-6 flex flex-col justify-between">
            <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-4">01 // Certification</span>
            <p className="text-sm text-zinc-300 font-medium">Master Certified Technicians &amp; Installers</p>
          </div>
          <div className="bg-zinc-950 p-6 flex flex-col justify-between">
            <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-4">02 // Materials</span>
            <p className="text-sm text-zinc-300 font-medium">Official 3M Protective Film &amp; Audiophile Hardware</p>
          </div>
          <div className="bg-zinc-950 p-6 flex flex-col justify-between">
            <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-4">03 // Guarantee</span>
            <p className="text-sm text-zinc-300 font-medium">100% Precision Craftsmanship Guarantee</p>
          </div>
        </div>

      </section>

      {/* ========================================== */}
      {/* 2. SERVICES GRID (STRICT BORDER GRID)     */}
      {/* ========================================== */}
      <section id="services" className="max-w-7xl mx-auto px-6 py-24">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">Capabilities</span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-zinc-100 tracking-tight mt-2">
              Automotive Services
            </h2>
          </div>
          <p className="text-sm text-zinc-400 max-w-md font-mono">
            // Individual services tailored to specification. Select any discipline to initialize booking.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-20 text-center font-mono text-xs text-zinc-500">
            LOADING_SERVICES_REGISTRY...
          </div>
        )}

        {/* Services Grid */}
        {!isLoading && (
          services.length === 0 ? (
            <div className="p-12 border border-zinc-800 font-mono text-xs text-zinc-500 text-center">
              No service records found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-800 border border-zinc-800">
              {services.map((service, index) => {
                const formattedIndex = String(index + 1).padStart(2, '0');
                
                return (
                  <div
                    key={service.id || index}
                    className="bg-zinc-950 p-8 flex flex-col justify-between min-h-[280px] hover:bg-zinc-900/40 transition-colors group"
                  >
                    <div>
                      {/* Monospaced Top Index & Price */}
                      <div className="flex items-center justify-between font-mono text-xs text-zinc-500 mb-6">
                        <span>{formattedIndex} // SPEC</span>
                        {service.price && <span className="text-zinc-300">{service.price}</span>}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-medium text-zinc-100 tracking-tight mb-3">
                        {service.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-zinc-400 leading-relaxed font-normal">
                        {service.description}
                      </p>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleBookService(service.title)}
                      className="pt-8 mt-6 border-t border-zinc-900 flex items-center justify-between text-xs font-mono text-zinc-400 group-hover:text-zinc-100 transition-colors"
                    >
                      <span>BOOK_DISCIPLINE</span>
                      <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )
        )}

      </section>

      {/* ========================================== */}
      {/* 3. LOCATION & CONTACT (MINIMALIST TABLE)   */}
      {/* ========================================== */}
      <section id="contact" className="border-t border-zinc-800 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 py-24">
          
          <div className="mb-16">
            <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">Touchpoints</span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-zinc-100 tracking-tight mt-2">
              Studio &amp; Location
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Direct Contact Metadata Table */}
            <div className="lg:col-span-7 border-t border-zinc-800">
              
              {/* Phone Row */}
              <div className="py-6 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-mono text-xs text-zinc-500 uppercase">Telephone</span>
                <a href="tel:4032938989" className="text-lg font-medium text-zinc-100 hover:text-zinc-400 transition-colors">
                  (403) 293-8989
                </a>
              </div>

              {/* Email Row */}
              <div className="py-6 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-mono text-xs text-zinc-500 uppercase">Email</span>
                <a href="mailto:gandkautodetailing1@gmail.com" className="text-lg font-medium text-zinc-100 hover:text-zinc-400 transition-colors break-all">
                  gandkautodetailing1@gmail.com
                </a>
              </div>

              {/* Location Row */}
              <div className="py-6 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <span className="font-mono text-xs text-zinc-500 uppercase">Address</span>
                <div className="text-right sm:text-right">
                  <p className="text-base font-medium text-zinc-100">125- 7 Westwinds Cres NE</p>
                  <p className="text-xs text-zinc-500 font-mono mt-0.5">Calgary, AB T3J 5H2</p>
                </div>
              </div>

              {/* Hours Row */}
              <div className="py-6 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-mono text-xs text-zinc-500 uppercase">Hours</span>
                <div className="text-xs font-mono text-zinc-300">
                  <span>MON–SAT: 08:00 – 18:00</span>
                  <span className="text-zinc-500 ml-4">SUN: CLOSED</span>
                </div>
              </div>

            </div>

            {/* Direct Action Panel */}
            <div className="lg:col-span-5 border border-zinc-800 bg-zinc-900/40 p-8 flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">Directions</span>
                <h3 className="text-2xl font-semibold text-zinc-100 tracking-tight mt-2 mb-4">
                  Visit the Calgary Studio
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-normal mb-8">
                  Appointments recommended. Drop-ins available for preliminary evaluations and surface consultations.
                </p>
              </div>

              <div className="space-y-3 font-mono text-sm">
                <a
                  href="https://maps.google.com/?q=125-+7+Westwinds+Cres+NE,+Calgary,+AB+T3J+5H2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center block bg-zinc-100 text-zinc-950 px-6 py-4 font-semibold hover:bg-zinc-300 transition-colors"
                >
                  Open Google Maps →
                </a>
                <Link
                  to="/booking"
                  className="w-full text-center block border border-zinc-800 text-zinc-300 px-6 py-4 hover:bg-zinc-900 transition-colors"
                >
                  Schedule Appointment
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Minimalist Footer */}
      <footer className="border-t border-zinc-800 py-8 px-6 font-mono text-xs text-zinc-500 flex flex-col sm:flex-row justify-between items-center gap-4">
        <span>G&amp;K AUTO DETAILING &amp; STEREO</span>
        <span>CALGARY, AB — ALL RIGHTS RESERVED</span>
      </footer>

    </div>
  );
}