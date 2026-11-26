import React from 'react';

/**
 * Custom generated vector icons specifically tailored for Boche Shkesbierre & Club highlights.
 */

// 1. Signature Craft Pours: Craft beer tulip/pint with foam head, bubbles, and tap pour
export const CraftPourIcon = ({ className = "w-5 h-5 sm:w-6 sm:h-6" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="craftPourGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    {/* Glass Body with amber ale fill */}
    <path
      d="M7 8.5C7 8.5 7 16.8 8.5 18.8C9.4 20 10.8 20.3 12 20.3C13.2 20.3 14.6 20 15.5 18.8C17 16.8 17 8.5 17 8.5H7Z"
      fill="url(#craftPourGrad)"
      fillOpacity="0.3"
      stroke="url(#craftPourGrad)"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    {/* Glass Stem & Sturdy Base */}
    <path d="M12 20.3V22.2M9.5 22.2H14.5" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" />
    {/* Frothy Foam Top */}
    <path
      d="M6.5 8.5C6.5 7.4 7.4 6.5 8.5 6.5C8.8 6.5 9.1 6.6 9.4 6.7C9.9 5.7 10.9 5 12 5C13.1 5 14.1 5.7 14.6 6.8C14.9 6.6 15.3 6.5 15.7 6.5C16.7 6.5 17.5 7.3 17.5 8.3C17.5 8.4 17.5 8.4 17.5 8.5H6.5Z"
      fill="#FEF3C7"
      fillOpacity="0.95"
    />
    {/* Rising Brew Effervescence */}
    <circle cx="10" cy="12.5" r="0.75" fill="#FDE68A" />
    <circle cx="13.5" cy="14" r="0.85" fill="#FDE68A" />
    <circle cx="11.5" cy="16.5" r="0.65" fill="#FDE68A" />
    {/* Tap Pour Stream */}
    <path d="M12 1.5V4.5" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1 1.5" />
    <path d="M10.5 1.5H13.5" stroke="#FBBF24" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

// 2. Top DJ Lineups: DJ vinyl deck turntable with tonearm needle & neon sound equalizer waves
export const DJLineupsIcon = ({ className = "w-5 h-5 sm:w-6 sm:h-6" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="djRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F87171" />
        <stop offset="100%" stopColor="#DC2626" />
      </linearGradient>
    </defs>
    {/* Vinyl Record */}
    <circle cx="10.5" cy="12" r="8" stroke="url(#djRedGrad)" strokeWidth="1.6" />
    <circle cx="10.5" cy="12" r="5" stroke="url(#djRedGrad)" strokeWidth="1.1" strokeOpacity="0.5" />
    <circle cx="10.5" cy="12" r="2" fill="url(#djRedGrad)" />
    <circle cx="10.5" cy="12" r="0.6" fill="#08090C" />
    {/* Tonearm & Needle Head */}
    <path d="M18 5V9.5L14 12" stroke="#FCA5A5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="18" cy="5" r="1.3" fill="#EF4444" />
    {/* Beat & Equalizer Waves */}
    <path d="M20 12V14" stroke="#EF4444" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M21.8 10.5V15.5" stroke="#F87171" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

// 3. VIP Tables & Booths: Royal VIP crown atop an illuminated table with lounge booth banquette
export const VIPBoothsIcon = ({ className = "w-5 h-5 sm:w-6 sm:h-6" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="vipCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22D3EE" />
        <stop offset="100%" stopColor="#0891B2" />
      </linearGradient>
    </defs>
    {/* VIP Crown */}
    <path
      d="M7 6.5L9 9.5L12 5.5L15 9.5L17 6.5L16.2 11.8H7.8L7 6.5Z"
      fill="url(#vipCyanGrad)"
      fillOpacity="0.3"
      stroke="url(#vipCyanGrad)"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <circle cx="7" cy="6" r="0.75" fill="#67E8F9" />
    <circle cx="12" cy="5" r="0.85" fill="#67E8F9" />
    <circle cx="17" cy="6" r="0.75" fill="#67E8F9" />
    {/* Lounge Table */}
    <ellipse cx="12" cy="14" rx="4.5" ry="1.5" stroke="#22D3EE" strokeWidth="1.4" />
    <path d="M12 15.5V19.5M9.5 19.5H14.5" stroke="#22D3EE" strokeWidth="1.4" strokeLinecap="round" />
    {/* Curved Lounge Booth Wings */}
    <path
      d="M3 17C3 13.5 4.5 10.5 7 9M21 17C21 13.5 19.5 10.5 17 9"
      stroke="#67E8F9"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeOpacity="0.8"
    />
    <path d="M2.5 17H5M19 17H21.5" stroke="#67E8F9" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 4. Curated Food Pairing: Fine dining gourmet cloche dome with aroma steam & platter
export const FoodPairingIcon = ({ className = "w-5 h-5 sm:w-6 sm:h-6" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="foodGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    {/* Cloche Dome */}
    <path
      d="M4.5 15.5C4.5 10.5 7.8 7.5 12 7.5C16.2 7.5 19.5 10.5 19.5 15.5H4.5Z"
      fill="url(#foodGoldGrad)"
      fillOpacity="0.28"
      stroke="url(#foodGoldGrad)"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Cloche Finial Handle */}
    <circle cx="12" cy="6" r="1.3" stroke="#FDE047" strokeWidth="1.4" />
    {/* Serving Platter / Rim */}
    <path d="M3 16.5H21" stroke="#FDE047" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M6 18.5H18" stroke="#D97706" strokeWidth="1.3" strokeLinecap="round" />
    {/* Steam / Aroma Ribbon Wisps */}
    <path d="M9.5 4C9 3 9.5 2 9 1" stroke="#FEF08A" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M14.5 4C14 3 14.5 2 14 1" stroke="#FEF08A" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

