import React from 'react';

export const Logo = ({
  className = '',
  size = 'md',
  imgClassName = '',
  showTagline = false,
  href = '#hero',
}) => {
  // Height presets for different placements
  const sizeClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-12 sm:h-14',
    lg: 'h-16 sm:h-20 md:h-24',
    header: 'h-14 sm:h-18 md:h-22',
    xl: 'h-24 sm:h-32',
  };

  const heightClass = imgClassName || sizeClasses[size] || sizeClasses.md;

  return (
    <a
      href={href}
      className={`group inline-flex flex-col items-start no-underline transition-transform duration-300 hover:scale-[1.02] ${className}`}
      aria-label="Boche Shkesbierre and Club - Home"
    >
      <div className="relative flex items-center">
        {/* Subtle dual-color ambient glow behind logo on hover */}
        <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-amber-500/20 via-purple-600/20 to-amber-500/20 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />

        {/* Official Brand Logo */}
        <img
          src="/logo.png"
          alt="Boche Shkesbierre & Club"
          className={`relative ${heightClass} w-auto object-contain transition-all duration-300 drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)]`}
          loading="eager"
        />
      </div>

      {showTagline && (
        <span className="text-[10px] sm:text-xs text-slate-400 tracking-wider font-light mt-1">
          Artisan Brewery • Gastronomy • Club
        </span>
      )}
    </a>
  );
};

export default Logo;
