import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Calendar, Phone } from 'lucide-react';

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Handles smooth scrolling to anchor sections (#services, #contact) across route changes
  const handleAnchorClick = (e, targetId) => {
    e.preventDefault();
    setIsOpen(false);

    if (location.pathname !== '/') {
      navigate('/', { replace: false });
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navLinks = [
    { label: 'Home', path: '/', isAnchor: false },
    { label: 'Services', path: 'services', isAnchor: true },
    { label: 'Contact', path: 'contact', isAnchor: true },
    { label: 'Blog', path: '/blog', isAnchor: false },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo + Business Title (Left) */}
          <Link to="/" className="flex items-center gap-3 group" onClick={() => setIsOpen(false)}>
            <div className="relative h-12 w-24 flex items-center justify-center overflow-hidden">
              <img
                src="/logo.png"
                alt="G&K Auto Detailing & Stereo Services Logo"
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  // Fallback visual badge if image file is not yet placed in /public
                  e.target.style.display = 'none';
                  e.target.parentNode.classList.add('bg-slate-100', 'rounded-md', 'border', 'border-slate-200');
                  e.target.parentNode.innerHTML = '<span class="font-bold text-xs text-slate-700">G&K 2:1</span>';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-[#70BAE6] transition-colors leading-tight">
                <span className="text-[#70BAE6]">G&K</span> Auto Detailing
              </span>
              <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                &amp; Stereo Services
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Center) */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = !link.isAnchor && location.pathname === link.path;
              
              if (link.isAnchor) {
                return (
                  <a
                    key={link.label}
                    href={`#${link.path}`}
                    onClick={(e) => handleAnchorClick(e, link.path)}
                    className="text-sm font-medium text-slate-600 hover:text-[#70BAE6] transition-colors relative py-1"
                  >
                    {link.label}
                  </a>
                );
              }

              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`text-sm font-medium transition-colors relative py-1 ${
                    isActive
                      ? 'text-[#70BAE6] font-semibold'
                      : 'text-slate-600 hover:text-[#70BAE6]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#70BAE6] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Call to Action & Direct Contact (Right) */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:4032938989"
              className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#70BAE6] transition-colors bg-slate-50 px-3 py-2 rounded-lg border border-slate-200"
            >
              <Phone className="w-3.5 h-3.5 text-[#70BAE6]" />
              <span>(403) 293-8989</span>
            </a>

            <Link
              to="/booking"
              className="inline-flex items-center justify-center gap-2 bg-[#70BAE6] hover:bg-[#58A6D3] text-white font-semibold text-sm px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all transform active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/booking"
              className="inline-flex items-center justify-center bg-[#70BAE6] text-white p-2 rounded-lg shadow-sm text-xs font-semibold"
            >
              <Calendar className="w-4 h-4" />
            </Link>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="p-2 rounded-lg text-slate-700 hover:text-[#70BAE6] hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              if (link.isAnchor) {
                return (
                  <a
                    key={link.label}
                    href={`#${link.path}`}
                    onClick={(e) => handleAnchorClick(e, link.path)}
                    className="px-3 py-2.5 rounded-md text-base font-medium text-slate-700 hover:text-[#70BAE6] hover:bg-slate-50 transition-colors"
                  >
                    {link.label}
                  </a>
                );
              }

              return (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-[#70BAE6] bg-slate-50 font-semibold'
                      : 'text-slate-700 hover:text-[#70BAE6] hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-3">
            <a
              href="tel:4032938989"
              className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-700 bg-slate-100 py-2.5 rounded-lg border border-slate-200"
            >
              <Phone className="w-4 h-4 text-[#70BAE6]" />
              <span>Call Us: (403) 293-8989</span>
            </a>

            <Link
              to="/booking"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 bg-[#70BAE6] text-white font-semibold text-base py-3 rounded-lg shadow-sm"
            >
              <Calendar className="w-5 h-5" />
              <span>Book Appointment Now</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}