import React from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { siteConfig } from '../data/siteConfig';

// Official Instagram SVG Icon
const InstagramIcon = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

// Exact media extracted directly from the user's 9 Instagram links
const sharedPosts = [
  {
    id: 'post-1',
    type: 'reel',
    url: 'https://www.instagram.com/reel/DdTm527hX04/',
    image: '/images/instagram/post-1.jpg',
  },
  {
    id: 'post-2',
    type: 'reel',
    url: 'https://www.instagram.com/reel/Dc52vp7AQqp/',
    image: '/images/instagram/post-2.jpg',
  },
  {
    id: 'post-3',
    type: 'post',
    url: 'https://www.instagram.com/p/DciwQk9gsFt/',
    image: '/images/instagram/post-3.jpg',
  },
  {
    id: 'post-4',
    type: 'post',
    url: 'https://www.instagram.com/p/DcbCUidgys-/',
    image: '/images/instagram/post-4.jpg',
  },
  {
    id: 'post-5',
    type: 'post',
    url: 'https://www.instagram.com/p/DcOKorzgy3I/',
    image: '/images/instagram/post-5.jpg',
  },
  {
    id: 'post-6',
    type: 'post',
    url: 'https://www.instagram.com/p/DcLlzakAnfC/',
    image: '/images/instagram/post-6.jpg',
  },
  {
    id: 'post-7',
    type: 'post',
    url: 'https://www.instagram.com/p/DZzRVAWgthJ/',
    image: '/images/instagram/post-7.jpg',
  },
  {
    id: 'post-8',
    type: 'reel',
    url: 'https://www.instagram.com/reel/DZhpTihzHEz/',
    image: '/images/instagram/post-8.jpg',
  },
  {
    id: 'post-9',
    type: 'reel',
    url: 'https://www.instagram.com/reel/DZH5aKHhATx/',
    image: '/images/instagram/post-9.jpg',
  },
];

export const InstagramFeed = () => {
  const profileUrl = siteConfig.socials.instagram;
  const handle = siteConfig.socials.instagramHandle || '@boche.shakesbierre';

  return (
    <section
      id="ambiance"
      className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-white/5 scroll-mt-20 relative"
      aria-label="Instagram Feed Grid and Ambiance"
    >
      <span id="gallery" className="absolute -top-20" aria-hidden="true" />
      {/* Header Profile Bar */}
      <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
        {/* Instagram Brand Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-amber-500/10 border border-pink-500/30 text-pink-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-lg shadow-pink-500/5">
          <InstagramIcon className="w-4 h-4 text-pink-400" />
          <span>Instagram Feed</span>
        </div>

        {/* Minimal Profile Bar */}
        <div className="flex items-center justify-between gap-4 p-3 sm:p-3.5 rounded-2xl bg-[#0D0F14]/90 border border-white/10 backdrop-blur-md max-w-sm w-full shadow-xl">
          <div className="flex items-center gap-3 text-left">
            {/* Story Gradient Ring */}
            <div className="relative p-[2px] rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] shadow-md shadow-pink-500/20">
              <div className="h-10 w-10 rounded-full overflow-hidden bg-black p-1 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Boche Shakesbierre Profile"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-white text-sm tracking-wide">
                  boche.shakesbierre
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-pink-400" />
              </div>
              <p className="text-[11px] text-slate-400">
                Brewery • Dining • Club
              </p>
            </div>
          </div>

          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 transition-transform hover:scale-105 active:scale-95 shadow-md shadow-pink-600/25"
            aria-label={`Follow ${handle} on Instagram`}
          >
            <span>Follow</span>
          </a>
        </div>
      </div>

      {/* Pure Media 3x3 Grid - 3:4 Aspect Ratio Format */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 rounded-2xl overflow-hidden p-2 sm:p-3 bg-[#090B0E] border border-white/10 shadow-2xl shadow-black/80">
        {sharedPosts.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-[3/4] w-full overflow-hidden bg-[#12141A] cursor-pointer block rounded-lg sm:rounded-xl"
            aria-label="Open post on Instagram"
          >
            {/* Actual media from the shared link - strictly centered */}
            <img
              src={item.image}
              alt="Boche Shakesbierre Instagram media"
              className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-108"
              loading="lazy"
            />

            {/* Reel Icon on video posts (just like Instagram's native feed) */}
            {item.type === 'reel' && (
              <div className="absolute top-2 right-2 z-10 p-1 sm:p-1.5 rounded-md bg-black/50 backdrop-blur-sm text-white/95 group-hover:opacity-0 transition-opacity duration-200">
                <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white text-white" />
              </div>
            )}

            {/* Clean Native Hover Overlay */}
            <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 text-white">
              <div className="p-2.5 rounded-full bg-white/15 backdrop-blur-md">
                <InstagramIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-pink-300">
                View On Instagram ↗
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* Button Redirecting to the Instagram Profile */}
      <div className="mt-8 sm:mt-10 flex flex-col items-center justify-center text-center">
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base font-bold uppercase tracking-wider text-white overflow-hidden shadow-2xl shadow-pink-600/30 transition-all duration-300 hover:scale-[1.03] hover:shadow-pink-600/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          {/* Official Instagram Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] transition-all duration-300 group-hover:brightness-110" />
          <div className="absolute inset-0 bg-white/15 opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Label */}
          <InstagramIcon className="relative z-10 w-5 h-5 text-white" />
          <span className="relative z-10">
            View More on Instagram {handle}
          </span>
          <ExternalLink className="relative z-10 w-4 h-4 text-white/90 transition-transform group-hover:translate-x-1" />
        </a>

        <p className="mt-2.5 text-xs text-slate-400">
          Click any post to view it directly on Instagram
        </p>
      </div>
    </section>
  );
};

export default InstagramFeed;
