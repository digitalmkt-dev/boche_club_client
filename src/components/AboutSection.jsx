import React from 'react';

export const AboutSection = () => {
  return (
    <section
      id="about"
      aria-label="About Boche Club Bangalore - Craft Beer and Nightlife on Brigade Road"
      className="relative overflow-clip w-full bg-[#08090C] text-white py-16 sm:py-20 lg:py-24 scroll-mt-20"
    >
      {/* Full-Bleed Dark Gradient Background (no black edge overlays) */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 75% 60% at 78% 45%, rgba(245, 184, 46, 0.09) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 15% 50%, rgba(127, 29, 45, 0.14) 0%, transparent 68%), linear-gradient(135deg, #121018 0%, #19141E 50%, #0F1118 100%)',
        }}
      />

      {/* Main Content Container */}
      <div className="max-w-[1640px] mx-auto w-full px-5 sm:px-8 lg:px-12 xl:px-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Column: Pill, Heading, Divider, Body Text (spans full 7 cols so no dead gap) */}
          <div className="md:col-span-7 order-1 text-left space-y-5 sm:space-y-6 w-full">
            {/* Top Pill */}
            <div>
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/[0.04] text-[#f5b82e] text-[11px] sm:text-xs font-bold tracking-widest uppercase select-none border border-amber-400/30">
                The Boche Experience
              </div>
            </div>

            {/* Heading */}
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem] font-bold tracking-tight leading-[1.12] text-white text-left">
                <span className="block sm:inline">Boche Club Bangalore: </span>
                <span className="text-[#f5b82e]">Craft Brews </span>
                <span className="text-white">&amp; High-Energy </span>
                <span className="block sm:inline whitespace-nowrap text-[#f5b82e]">
                  Nightlife
                </span>
              </h2>

              {/* Clean Accent Divider */}
              <div className="w-[84px] h-[2px] bg-gradient-to-r from-[#f5b82e] to-amber-500/20 mt-4 mb-6 rounded-full" />
            </div>

            {/* Body text */}
            <div className="space-y-5 text-left w-full text-base sm:text-lg lg:text-xl leading-[1.8] text-slate-300">
              <p>
                Located in the heart of Brigade Road near MG Road, Boche Club is one of Bangalore&apos;s premier nightlife destinations—crafted for those who celebrate life in full color.
              </p>
              <p>
                Whether you are unwinding over fresh craft beers and curated bites or dancing to hypnotic laser spectacles and Bangalore&apos;s top resident DJs, every night is a celebration of flavor, music, and energy.
              </p>
            </div>
          </div>

          {/* Right Column: Full-column Portrait Photo aligned cleanly to right padding edge on desktop */}
          <div className="md:col-span-5 order-2 flex justify-center md:justify-end">
            <div className="relative w-full max-w-[380px] sm:max-w-[460px] md:max-w-full">
              <img
                src="/images/boche-with-beer.png"
                alt="Boche Club Bangalore - Craft Beer and Nightlife on Brigade Road"
                className="w-full h-auto max-h-[76vh] object-contain object-center md:object-right select-none"
                loading="lazy"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
