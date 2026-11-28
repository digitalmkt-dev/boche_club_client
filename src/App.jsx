import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { BrewSection } from './components/BrewSection';
import { FoodAndDrinksSection } from './components/FoodAndDrinksSection';
import { FineDiningSection } from './components/FineDiningSection';
import { ClubFloorSection } from './components/ClubFloorSection';
import { GroupBookingSection } from './components/GroupBookingSection';
import { Logo } from './components/Logo';
import { InstagramFeed } from './components/InstagramFeed';
import { SmoothScrollGravity } from './components/SmoothScrollGravity';
import { siteConfig } from './data/siteConfig';
import { Calendar } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

const SectionDivider = () => (
  <div className="relative z-20 w-full h-px bg-white/10" aria-hidden="true">
    <div
      className="mx-auto h-px w-full"
      style={{
        background:
          'linear-gradient(90deg, transparent 0%, rgba(245, 184, 46, 0.5) 35%, rgba(255, 255, 255, 0.55) 50%, rgba(255, 23, 68, 0.45) 65%, transparent 100%)',
      }}
    />
  </div>
);

export const App = () => {
  return (
    <div className="min-h-screen bg-[#08090C] text-[#F8FAFC] selection:bg-amber-500 selection:text-black">
      {/* 1. Sticky Navigation */}
      <Navbar />

      {/* 2. Hero Section */}
      <main>
        <Hero />

        <SectionDivider />

        {/* 3. First Section: Boche Club About Section */}
        <AboutSection />

        <SectionDivider />

        {/* 4. Experiences: Brew Section → Club Ambiance → Fine Dining */}
        <div id="experiences">
          <BrewSection />

          <SectionDivider />

          <ClubFloorSection />

          <SectionDivider />

          <FineDiningSection />
        </div>

        <SectionDivider />

        {/* 5. Flavours: Food & Drinks Horizontal Scroll Showcase */}
        <FoodAndDrinksSection />

        <SectionDivider />

        {/* Events Placeholder Anchor */}
        <section
          id="events"
          className="relative overflow-clip w-full py-20 scroll-mt-20"
        >
          {/* Full-Bleed Midnight-Slate Gradient Background */}
          <div
            className="absolute inset-0 pointer-events-none select-none"
            aria-hidden="true"
            style={{
              background:
                'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(56, 189, 248, 0.09) 0%, transparent 70%), linear-gradient(135deg, #0E131E 0%, #131A29 50%, #0C1019 100%)',
            }}
          />
          <div className="relative z-10 max-w-[1640px] mx-auto w-full px-5 sm:px-8 lg:px-12 xl:px-16">
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
          </div>
        </section>

        <SectionDivider />

        {/* Group Booking & Corporate Events Section */}
        <GroupBookingSection />

        <SectionDivider />

        {/* Visual Gallery / Official Instagram Feed */}
        <InstagramFeed />
      </main>

      <SectionDivider />

      {/* Footer */}
      <footer
        className="relative py-12 px-5 sm:px-8 lg:px-12 xl:px-16 flex flex-col items-center justify-center text-center text-xs text-slate-500"
        style={{
          background: 'linear-gradient(180deg, #111018 0%, #090A0E 100%)',
        }}
      >
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

      {/* Weighted Smooth-Scroll Gravity Controller */}
      <SmoothScrollGravity />
    </div>
  );
};

export default App;
