import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Column 1: Brand & Overview (4 Cols) */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-20 flex items-center justify-center bg-white rounded-md p-1">
                <img
                  src="/logo.png"
                  alt="G&K Logo"
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = '<span class="font-bold text-xs text-slate-900">G&K Logo</span>';
                  }}
                />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                <span className="text-[#70BAE6]">G&K</span> Auto Detailing
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              Calgary’s trusted destination for high-end interior &amp; exterior auto detailing, ceramic coatings, window tinting, professional stereo systems, and remote starter installations. Quality care for every vehicle.
            </p>

            <div className="pt-2">
              <div className="flex items-start gap-2.5 text-xs text-slate-400 bg-slate-800/60 p-3 rounded-lg border border-slate-800">
                <Clock className="w-4 h-4 text-[#70BAE6] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-200">Operating Hours:</p>
                  <p>Monday – Saturday: 8:00 AM – 6:00 PM</p>
                  <p className="text-slate-500">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Direct Contact & Quick Links (4 Cols) */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 inline-block">
              Get In Touch
            </h3>

            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="tel:4032938989"
                  className="flex items-center gap-3 text-slate-300 hover:text-[#70BAE6] transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-slate-800 text-[#70BAE6] group-hover:bg-[#70BAE6] group-hover:text-white transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span>(403) 293-8989</span>
                </a>
              </li>

              <li>
                <a
                  href="mailto:gandkautodetailing1@gmail.com"
                  className="flex items-center gap-3 text-slate-300 hover:text-[#70BAE6] transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-slate-800 text-[#70BAE6] group-hover:bg-[#70BAE6] group-hover:text-white transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="break-all">gandkautodetailing1@gmail.com</span>
                </a>
              </li>

              <li className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-800 text-[#70BAE6] shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-slate-300 leading-snug">
                  125- 7 Westwinds Cres NE,<br />Calgary, AB, Canada, T3J 5H2
                </span>
              </li>
            </ul>

            <div className="pt-2">
              <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">
                Quick Shortcuts
              </h4>
              <div className="flex flex-wrap gap-4 text-xs font-medium">
                <Link to="/" className="hover:text-[#70BAE6] transition-colors">Home</Link>
                <Link to="/booking" className="hover:text-[#70BAE6] transition-colors">Book Online</Link>
                <Link to="/blog" className="hover:text-[#70BAE6] transition-colors">Latest News &amp; Blog</Link>
              </div>
            </div>
          </div>

          {/* Column 3: Embedded Google Map Location (4 Cols) */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                Visit Our Shop
              </h3>
              <a
                href="https://maps.google.com/?q=125-+7+Westwinds+Cres+NE,+Calgary,+AB+T3J+5H2"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#70BAE6] hover:underline flex items-center gap-1"
              >
                <span>Open Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-800 shadow-lg">
              <iframe
                title="G&K Auto Detailing Physical Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2505.289389278912!2d-113.97233822329382!3d51.1031301401348!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x537164ff2f95fb61%3A0x6b87d27e7d6b384d!2s7%20Westwinds%20Cres%20NE%20%23125%2C%20Calgary%2C%20AB%20T3J%205H2!5e0!3m2!1sen!2sca!4v1710000000000!5m2!1sen!2sca"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="filter contrast-[0.95] brightness-[0.9]"
              ></iframe>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            &copy; {currentYear} G&amp;K Auto Detailing &amp; Stereo Services. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            <span>Designed for premium auto care in Calgary, AB</span>
          </p>
        </div>

      </div>
    </footer>
  );
}