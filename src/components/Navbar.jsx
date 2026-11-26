import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, Calendar, Phone, Beer, Music } from 'lucide-react';
import { Logo } from './Logo';
import { navLinks } from '../data/navigation';
import { siteConfig } from '../data/siteConfig';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Track scroll position for backdrop blur and dynamic styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Check which section is in view
      const sections = [
        'hero',
        'about',
        'experiences',
        'club',
        'flavours',
        'food-and-drinks',
        'shkesbierre',
        'brewery',
        'group-booking',
        'group-bookings',
        'reservations',
        'ambiance',
        'gallery',
        'contact',
      ];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B0C10]/95 backdrop-blur-xl shadow-2xl shadow-black/80 py-2 sm:py-2.5'
          : 'bg-gradient-to-b from-[#07080B]/75 via-[#07080B]/30 to-transparent py-2.5 sm:py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo - Prominent Header Sizing */}
          <Logo
            className="transition-all duration-300"
            imgClassName={
              isScrolled
                ? 'h-12 sm:h-14 md:h-16'
                : 'h-16 sm:h-20 md:h-24'
            }
          />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const target = link.href.replace('#', '');
              const isActive =
                activeSection === target ||
                (target === 'about' && activeSection === 'about') ||
                (target === 'experiences' && (activeSection === 'experiences' || activeSection === 'club')) ||
                ((target === 'flavours' || target === 'food-and-drinks') &&
                  (activeSection === 'flavours' || activeSection === 'food-and-drinks' || activeSection === 'shkesbierre' || activeSection === 'brewery')) ||
                ((target === 'group-booking' || target === 'group-bookings') &&
                  (activeSection === 'group-booking' || activeSection === 'group-bookings' || activeSection === 'reservations')) ||
                (target === 'ambiance' && (activeSection === 'ambiance' || activeSection === 'gallery')) ||
                (target === 'contact' && activeSection === 'contact');
              const isClubLink = link.href === '#club' || link.href === '#experiences';

              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative px-2.5 xl:px-3.5 py-1.5 xl:py-2 text-xs xl:text-sm font-medium tracking-wide transition-all duration-200 rounded-lg group whitespace-nowrap ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    {link.label}
                    {link.badge && (
                      <span className="inline-flex items-center text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {link.badge}
                      </span>
                    )}
                  </span>

                  {/* Active/Hover Indicator */}
                  {isActive ? (
                    <span className="absolute inset-0 bg-white/5 rounded-lg border border-white/10 shadow-sm" />
                  ) : (
                    <span className="absolute inset-0 bg-white/0 rounded-lg group-hover:bg-white/5 transition-colors duration-200" />
                  )}

                  {/* Subtle dual-accent bottom bar on hover */}
                  <span
                    className={`absolute bottom-0 left-2.5 right-2.5 h-[2px] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${
                      isClubLink
                        ? 'bg-gradient-to-r from-red-500 to-rose-600'
                        : 'bg-gradient-to-r from-amber-400 to-amber-600'
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* Desktop Actions - Reserve Table CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="#reservations"
              className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold tracking-wider uppercase text-slate-950 rounded-lg overflow-hidden group shadow-lg shadow-amber-500/20 transition-all duration-300 hover:shadow-amber-500/40 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-amber-400/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#F59E0B] via-[#E5B869] to-[#D97706] transition-all duration-300 group-hover:opacity-95" />
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Reserve Table
              </span>
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href="#reservations"
              className="inline-flex items-center justify-center p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold"
              aria-label="Reserve Table"
            >
              <Calendar className="w-4 h-4" />
            </a>

            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2.5 rounded-lg text-slate-200 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-amber-400" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Side Drawer Overlay mounted directly on document.body via Portal */}
      {mobileMenuOpen && typeof document !== 'undefined' && createPortal(
        <div className="lg:hidden fixed inset-0 z-[100] flex justify-end">
          {/* Dark Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          {/* Side Drawer Panel */}
          <div
            id="mobile-menu"
            className="relative w-full max-w-xs sm:max-w-sm h-full bg-[#0A0B0F] border-l border-white/10 shadow-2xl flex flex-col justify-between p-5 overflow-y-auto z-10"
          >
            {/* Drawer Top Header: Logo + Close Button */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
              <Logo
                onClick={closeMobileMenu}
                imgClassName="h-12"
              />
              <button
                type="button"
                onClick={closeMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-lg text-slate-200 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-amber-400" />
              </button>
            </div>

            {/* Quick Venue Switcher & Nav Links */}
            <div className="space-y-4 py-4 flex-1">
              {/* Quick Brand Switcher in Mobile */}
              <div className="grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-white/5 border border-white/10">
                <a
                  href="#flavours"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold hover:bg-amber-500/20 transition-colors"
                >
                  <Beer className="w-4 h-4" />
                  Brewery & Dining
                </a>
                <a
                  href="#experiences"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-semibold hover:bg-red-500/20 transition-colors"
                >
                  <Music className="w-4 h-4" />
                  Club Experience
                </a>
              </div>

              {/* Mobile Nav Links: About, Experiences, Food and Drinks, Corporate Booking, Ambiance, Contact */}
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-slate-200 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/5"
                  >
                    <span className="flex items-center gap-3">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400/80" />
                      {link.label}
                    </span>
                    {link.badge && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {link.badge}
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>

            {/* Mobile Bottom CTAs & Contact Info */}
            <div className="pt-4 border-t border-white/10 space-y-3 shrink-0">
              <a
                href="#reservations"
                onClick={closeMobileMenu}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold uppercase tracking-wider shadow-lg shadow-amber-500/25 active:scale-95 transition-transform text-sm"
              >
                <Calendar className="w-4 h-4" />
                Book Table / VIP Lounge
              </a>

              <div className="flex items-center justify-between text-xs text-slate-400 px-1 pt-1">
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>{siteConfig.contact.phone}</span>
                </a>
                <span className="text-slate-500">{siteConfig.hours.brewery.split(':')[0]} Open</span>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};
