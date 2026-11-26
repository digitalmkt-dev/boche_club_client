import React from 'react';

/**
 * Neon SVG Outline Icons, Bar Top & Decorative Helpers
 * Implements the authentic dual-tube neon technique:
 * Base glow stroke: 3.5px #ff1744 with blur filter
 * Core tube stroke: 1px #ffe0e5
 */

/**
 * Neon SVG Outline Icons, Bar Top & Decorative Helpers
 * Implements the authentic dual-tube neon technique:
 * Base glow stroke: 3.5px #ff1744 with blur filter
 * Core tube stroke: 1px #ffe0e5
 */
export const NeonFilters = () => (
  <svg className="absolute w-0 h-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <defs>
      {/* Neon Red/Pink Glow Filter */}
      <filter id="neon-tube-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="2.8" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Gold Accent Glow Filter */}
      <filter id="gold-tube-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Laser Beams Glow Filter */}
      <filter id="laser-glow-filter" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  </svg>
);

/**
 * Neon Beer Mug with foam and effervescent bubbles
 * Dual-stroke: 3.5px #ff1744 (glow) + 1px #ffe0e5 (core)
 */
export const NeonBeerMug = ({ className = '' }) => {
  const mugBody = 'M14 20 H42 V50 C42 54 38 56 34 56 H22 C18 56 14 54 14 50 Z';
  const mugHandle = 'M42 26 H48 C52 26 54 28 54 32 V40 C54 44 52 46 48 46 H42';
  const foamScallops = 'M12 20 C12 16 16 14 20 16 C22 13 28 13 30 16 C34 13 40 14 42 18 C44 19 44 20 42 20';

  return (
    <svg
      className={`overflow-visible pointer-events-none select-none ${className}`}
      viewBox="0 0 64 64"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* --- Pass 1: Neon Red Glow (3.5px) --- */}
      <g stroke="#ff1744" strokeWidth="3.5" filter="url(#neon-tube-glow)">
        <path d={mugBody} />
        <path d={mugHandle} />
        <path d={foamScallops} />
        <circle cx="24" cy="34" r="1.5" fill="#ff1744" stroke="none" />
        <circle cx="32" cy="42" r="1.8" fill="#ff1744" stroke="none" />
        <circle cx="22" cy="46" r="1.2" fill="#ff1744" stroke="none" />
      </g>

      {/* --- Pass 2: Neon White Core Tube (1px) --- */}
      <g stroke="#ffe0e5" strokeWidth="1">
        <path d={mugBody} />
        <path d={mugHandle} />
        <path d={foamScallops} />
        <circle cx="24" cy="34" r="1.2" fill="#ffe0e5" stroke="none" />
        <circle cx="32" cy="42" r="1.5" fill="#ffe0e5" stroke="none" />
        <circle cx="22" cy="46" r="1" fill="#ffe0e5" stroke="none" />
      </g>
    </svg>
  );
};

/**
 * Neon Cocktail Glass with cherry on a pick & gold neon lemon wheel on rim
 * Dual-stroke + subtle neon flicker animation (opacity dips at 20%/22% of 4s cycle)
 */
export const NeonCocktailGlass = ({ className = '' }) => {
  const bowl = 'M12 16 L32 42 L52 16 Z';
  const stemAndBase = 'M32 42 V70 M18 70 H46';
  const pick = 'M22 8 L38 34';

  return (
    <svg
      className={`overflow-visible pointer-events-none select-none animate-neon-flicker ${className}`}
      viewBox="0 0 72 82"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* --- Pass 1: Neon Red Glow (3.5px) --- */}
      <g stroke="#ff1744" strokeWidth="3.5" filter="url(#neon-tube-glow)">
        <path d={bowl} />
        <path d={stemAndBase} />
        <path d={pick} stroke="#ff4d6d" strokeWidth="2.8" />
        <circle cx="30" cy="22" r="3.5" fill="#ff1744" stroke="none" />
      </g>

      {/* --- Pass 2: Neon White Core Tube (1px) --- */}
      <g stroke="#ffe0e5" strokeWidth="1">
        <path d={bowl} />
        <path d={stemAndBase} />
        <path d={pick} stroke="#ffe0e5" strokeWidth="1" />
        <circle cx="30" cy="22" r="2.8" fill="#ffe0e5" stroke="none" />
      </g>

      {/* --- Gold Neon Lemon Wheel on the Rim --- */}
      <g transform="translate(50, 14)">
        {/* Glow pass (2.8px gold) */}
        <g stroke="#f5b82e" strokeWidth="2.8" filter="url(#gold-tube-glow)">
          <circle cx="0" cy="0" r="7.5" fill="#151109" />
          <line x1="0" y1="-7.5" x2="0" y2="7.5" />
          <line x1="-7.5" y1="0" x2="7.5" y2="0" />
        </g>
        {/* Core pass (1px pale yellow core) */}
        <g stroke="#fff3c4" strokeWidth="1">
          <circle cx="0" cy="0" r="7.5" fill="none" />
          <line x1="0" y1="-7.5" x2="0" y2="7.5" />
          <line x1="-7.5" y1="0" x2="7.5" y2="0" />
          <circle cx="0" cy="0" r="1.5" fill="#fff3c4" stroke="none" />
        </g>
      </g>
    </svg>
  );
};

/**
 * Bar Top Strip along the bottom of the section (24px high, #120709)
 * Features dual-stroke neon red top edge & soft red glow upward
 */
export const BarTopStrip = () => {
  return (
    <div
      className="absolute inset-x-0 bottom-0 h-[24px] bg-[#120709] pointer-events-none z-20 overflow-hidden"
      style={{
        boxShadow: '0 -4px 18px rgba(255, 23, 68, 0.4)',
      }}
      aria-hidden="true"
    >
      {/* Neon Red Top Edge (Dual stroke technique) */}
      <svg className="w-full h-[6px] absolute top-0 left-0 overflow-visible" preserveAspectRatio="none">
        {/* Glow stroke (3.5px #ff1744) */}
        <line x1="0" y1="1" x2="100%" y2="1" stroke="#ff1744" strokeWidth="3.5" filter="url(#neon-tube-glow)" />
        {/* Core stroke (1px #ffe0e5) */}
        <line x1="0" y1="1" x2="100%" y2="1" stroke="#ffe0e5" strokeWidth="1" />
      </svg>
    </div>
  );
};
