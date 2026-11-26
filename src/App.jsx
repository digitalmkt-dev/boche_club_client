import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { GroupBookingSection } from './components/GroupBookingSection';
import { Logo } from './components/Logo';
import { InstagramFeed } from './components/InstagramFeed';
import { siteConfig } from './data/siteConfig';
import { Beer, Music, Calendar } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

export const App = () => {
  return (
    <div className="min-h-screen bg-[#08090C] text-[#F8FAFC] selection:bg-amber-500 selection:text-black">
      {/* 1. Sticky Navigation */}
      <Navbar />

      {/* 2. Hero Section */}
      <main>
        <Hero />

        {/* 3. First Section: Shakespearean Heritage, Gastronomy, Drinks, Spaces & Club */}
        <AboutSection />

        {/* Shkesbierre (Brewery & Dining) Section */}
        <section
          id="shkesbierre"
          className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-amber-500/20 scroll-mt-20 relative"
        >
          <span id="flavours" className="absolute -top-20" aria-hidden="true" />
          <span id="food-and-drinks" className="absolute -top-20" aria-hidden="true" />
          <span id="brewery" className="absolute -top-20" aria-hidden="true" />
          <div className="rounded-2xl p-8 sm:p-12 bg-gradient-to-b from-amber-950/20 to-transparent border border-amber-500/30 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <Beer className="w-4 h-4 text-amber-400" />
              Section 4 • Brewery & Dining
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-3">
              Artisan Brews & Gastronomy
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
              Copper tanks, house-made small-batch ales, stouts, and wood-fired pairing menus.
            </p>
            <div className="mt-6 text-xs text-amber-400/60 font-mono">
              [Upcoming Section: Signature Brews, Tasting Flights, Food Highlights, Ambience Grid]
            </div>
          </div>
        </section>

        {/* Club Section (Official Red Neon Theme) */}
        <section
          id="club"
          className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-red-500/20 scroll-mt-20 relative"
        >
          <span id="experiences" className="absolute -top-20" aria-hidden="true" />
          <div className="rounded-2xl p-8 sm:p-12 bg-gradient-to-b from-red-950/25 to-transparent border border-red-500/30 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <Music className="w-4 h-4 text-red-400" />
              Section 5 • The Club
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-3">
              High-Energy Sound Sanctuary
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
              Concert-grade acoustics, kinetic laser lighting, resident & headline DJs, and elevated VIP bottle service.
            </p>
            <div className="mt-6 text-xs text-red-400/60 font-mono">
              [Upcoming Section: DJ Lineups, Sound System Details, VIP Table Booking, Club Vibe]
            </div>
          </div>
        </section>

        {/* Events Placeholder Anchor */}
        <section
          id="events"
          className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5 scroll-mt-20"
        >
          <div className="rounded-2xl p-8 sm:p-12 bg-white/[0.02] border border-white/10 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <Calendar className="w-4 h-4 text-cyan-400" />
              Section 6 • Events / What's On
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-3">
              Upcoming Events & Lineups
            </h2>
            <div className="mt-4 text-xs text-slate-500 font-mono">
              [Upcoming Section: Weekly Schedule, Guest DJs, Live Acoustics, Weekend Parties]
            </div>
          </div>
        </section>

        {/* Group Booking & Corporate Events Section */}
        <GroupBookingSection />

        {/* Visual Gallery / Official Instagram Feed */}
        <InstagramFeed />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4 flex flex-col items-center justify-center text-center text-xs text-slate-500">
        <Logo size="lg" className="mb-5 items-center" />
        <a
          href={siteConfig.socials.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-xs font-semibold text-pink-400 hover:text-pink-300 hover:bg-pink-500/20 transition-all mb-4"
        >
          <span>Follow {siteConfig.socials.instagramHandle} on Instagram</span>
          <span className="text-xs">↗</span>
        </a>
        <p>© {CURRENT_YEAR} Boche Shkesbierre & Club. All rights reserved.</p>
        <p className="mt-1.5 text-xs text-slate-400">
          Craft Brewery • Dining Sanctuary • Premier Club
        </p>
      </footer>
    </div>
  );
};

export default App;
