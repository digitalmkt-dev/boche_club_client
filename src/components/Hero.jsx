import React, { useEffect, useRef, useCallback, useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { CraftPourIcon, DJLineupsIcon, VIPBoothsIcon, FoodPairingIcon } from './HighlightIcons';

/**
 * HLS source sets — portrait for mobile (<768px), wide for tablet/desktop.
 * Each master playlist contains two renditions (480p and 720p).
 * hls.js picks the best rendition automatically based on measured bandwidth.
 * Safari uses native HLS via <video src> fallback.
 */
const HLS_WIDE_MASTER    = '/videos/hero/hls-wide/master.m3u8';
const HLS_PORTRAIT_MASTER = '/videos/hero/hls-portrait/master.m3u8';

/** Checks if the current viewport is portrait/mobile (< 768px wide). */
const isPortraitViewport = () =>
  typeof window !== 'undefined' && window.innerWidth < 768;

export const Hero = () => {
  const videoRef   = useRef(null);
  const hlsRef     = useRef(null);    // holds the Hls instance
  const srcLoadedRef = useRef('');    // tracks which src is currently loaded
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [loaderMounted, setLoaderMounted] = useState(true);

  const markVideoReady = useCallback(() => {
    setIsVideoReady(true);
  }, []);

  // Unmount loader overlay cleanly after fade-out transition completes
  useEffect(() => {
    if (!isVideoReady) return undefined;
    const timer = setTimeout(() => setLoaderMounted(false), 750);
    return () => clearTimeout(timer);
  }, [isVideoReady]);

  // Safety fallback: never block the page indefinitely if network/autoplay fails
  useEffect(() => {
    const fallbackTimer = setTimeout(() => setIsVideoReady(true), 5000);
    return () => clearTimeout(fallbackTimer);
  }, []);

  /**
   * Loads (or switches) the correct HLS master playlist into the <video> element.
   * - On browsers with native HLS (Safari): sets src directly — the browser
   *   handles adaptive rendition selection itself.
   * - On all other browsers: uses hls.js for ABR (adaptive bitrate) streaming.
   */
  const loadHls = useCallback(async (portrait) => {
    const video = videoRef.current;
    if (!video) return;

    const src = portrait ? HLS_PORTRAIT_MASTER : HLS_WIDE_MASTER;
    if (srcLoadedRef.current === src) return; // already loaded
    srcLoadedRef.current = src;

    // Destroy previous hls.js instance if any
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Dynamically import hls.js (tree-shaken, only loads once)
    const { default: Hls } = await import('hls.js');

    if (Hls.isSupported()) {
      // ── hls.js path: ABR handled automatically ──────────────────────────
      const hls = new Hls({
        // Start from the lowest quality, ramp up quickly based on bandwidth
        startLevel: -1,            // -1 = auto (let ABR engine decide first segment)
        abrEwmaDefaultEstimate: 500_000, // initial BW estimate: 500 kbps (conservative)
        maxMaxBufferLength: 30,    // cap buffer at 30 s to save memory
        enableWorker: true,
      });
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {
          markVideoReady();
        });
      });
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data?.fatal) {
          markVideoReady();
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // ── Native HLS path (Safari / iOS) ──────────────────────────────────
      video.src = src;
      video.load();
      video.play().catch(() => {
        markVideoReady();
      });
    } else {
      markVideoReady();
    }
  }, [markVideoReady]);

  useEffect(() => {
    // Initial load based on current viewport
    loadHls(isPortraitViewport());

    // Switch source when viewport crosses the 768px breakpoint (e.g. device rotation)
    let lastPortrait = isPortraitViewport();
    const onResize = () => {
      const p = isPortraitViewport();
      if (p !== lastPortrait) {
        lastPortrait = p;
        srcLoadedRef.current = ''; // force reload
        loadHls(p);
      }
    };
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      window.removeEventListener('resize', onResize);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [loadHls]);

  return (
    <section
      id="hero"
      aria-label="Welcome to Boche Club Bangalore"
      className="relative h-[100dvh] sm:h-screen max-h-screen min-h-[600px] sm:min-h-[620px] flex flex-col justify-between overflow-hidden bg-[#07080B] pt-20 sm:pt-24 pb-2 sm:pb-3"
    >
      {/* ── Branded Video Preloader Overlay (fades out once hero video is ready) ── */}
      {loaderMounted && (
        <div
          role="status"
          aria-live="polite"
          aria-label="Loading Boche Club experience"
          className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#07080B] transition-opacity duration-700 ease-out ${
            isVideoReady ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Ambient crimson & gold loader glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[440px] h-[320px] sm:h-[440px] rounded-full blur-[120px]"
              style={{
                background:
                  'radial-gradient(circle, rgba(255, 23, 68, 0.22) 0%, rgba(245, 184, 46, 0.14) 50%, transparent 75%)',
              }}
            />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-6 px-6">
            <img
              src="/club%20log.png"
              alt="Boche Club"
              width={860}
              height={290}
              loading="eager"
              fetchPriority="high"
              draggable={false}
              className="h-20 sm:h-28 w-auto max-w-[75vw] object-contain animate-pulse drop-shadow-[0_4px_24px_rgba(255,23,68,0.35)]"
            />

            {/* Sleek neon progress bar */}
            <div className="w-44 sm:w-52 h-[2px] rounded-full bg-white/10 overflow-hidden">
              <div className="hero-loader-bar h-full w-1/2 rounded-full bg-gradient-to-r from-[#ff1744] via-[#f5b82e] to-[#ff1744]" />
            </div>

            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
              Loading Experience
            </span>
          </div>

          <style>{`
            @keyframes hero-loader-slide {
              0% { transform: translateX(-120%); }
              100% { transform: translateX(260%); }
            }
            .hero-loader-bar {
              animation: hero-loader-slide 1.25s ease-in-out infinite;
              will-change: transform;
            }
          `}</style>
        </div>
      )}

      {/* ── Background Video ───────────────────────────────────────────────── */}
      {/* overflow-hidden clips the video when it exceeds the section bounds */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        {/*
          Full-bleed responsive video:
          - Fills the entire hero edge-to-edge (including behind the transparent gradient navbar)
            so mobile 9:19.5 screens never show a solid black letterbox bar at the top/bottom.
        */}
        <video
          ref={videoRef}
          onLoadedData={markVideoReady}
          onCanPlay={markVideoReady}
          onPlaying={markVideoReady}
          onError={markVideoReady}
          className={`w-full h-full object-cover object-center transition-opacity duration-700 ${
            isVideoReady ? 'opacity-100' : 'opacity-0'
          }`}
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          preload="auto"
          aria-hidden="true"
        />

        {/* Primary dark overlay */}
        <div className="absolute inset-0 bg-black/25" />

        {/* Cinematic bottom-to-top gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080B] via-[#07080B]/15 to-transparent" />

        {/* Smooth top gradient under navbar — blends seamlessly into the full-bleed hero video */}
        <div className="absolute inset-x-0 top-0 h-36 sm:h-32 bg-gradient-to-b from-[#07080B]/65 via-[#07080B]/20 to-transparent" />

        {/* Warm amber atmosphere glow — left */}
        <div
          className="absolute top-1/3 -left-24 w-[480px] h-[480px] rounded-full blur-[130px] pointer-events-none"
          style={{ background: 'rgba(245, 184, 46, 0.12)' }}
        />

        {/* Club neon red atmosphere glow — right */}
        <div
          className="absolute top-1/3 -right-24 w-[480px] h-[480px] rounded-full blur-[130px] pointer-events-none"
          style={{ background: 'rgba(255, 23, 68, 0.14)' }}
        />
      </div>

      {/* ── Main Content ───────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-auto w-full text-center">

        {/* Venue Identity Pill */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full bg-black/60 border border-white/15 backdrop-blur-md shadow-xl shadow-black/50 mb-3 sm:mb-4">
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-slate-200">
            Craft Brewery &amp; Club
          </span>
          <span className="text-white/30">•</span>
          <span className="text-[10px] sm:text-xs font-medium text-amber-300 tracking-wider">
            Brigade Road, Bengaluru
          </span>
        </div>

        {/* Brand Headline */}
        <div className="space-y-1 sm:space-y-2 mb-5 sm:mb-7">
          <div className="flex items-center justify-center gap-3 text-[10px] sm:text-xs tracking-[0.3em] font-semibold text-amber-400 drop-shadow-sm">
            <span className="h-[1px] w-8 bg-gradient-to-l from-amber-400/60 to-transparent" />
            <span>WELCOME TO</span>
            <span className="h-[1px] w-8 bg-gradient-to-r from-amber-400/60 to-transparent" />
          </div>

          <h1 className="flex justify-center py-1">
            <span className="sr-only">
              Boche Club Bangalore – Craft Beer &amp; Premier Nightclub on Brigade Road, Bengaluru
            </span>
            <img
              src="/club%20log.png"
              alt="Boche Club Bangalore Logo"
              width={860}
              height={290}
              loading="eager"
              fetchPriority="high"
              draggable={false}
              className="h-24 sm:h-32 md:h-36 lg:h-40 xl:h-44 w-auto max-w-[88vw] object-contain select-none drop-shadow-[0_6px_24px_rgba(0,0,0,0.75)]"
            />
          </h1>

          {/* Tagline */}
          <p className="font-sans text-sm sm:text-base lg:text-lg font-light text-slate-100 tracking-wide max-w-2xl mx-auto pt-1 drop-shadow-md">
            Where{' '}
            <span className="font-semibold text-amber-300">Artisan Craft</span> Meets{' '}
            <span className="font-semibold text-red-400">High-Energy Club Beats</span>
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex items-center justify-center">
          <a
            href="#reservations"
            className="group inline-flex items-center gap-2 px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs sm:text-sm uppercase tracking-widest shadow-lg shadow-amber-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-amber-400/50"
          >
            Book a Table
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>

      {/* ── Bottom Strip ───────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-2 sm:pt-3">
        {/* Highlights Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl bg-[#0E1015]/80 backdrop-blur-md border border-white/10 text-slate-300 shadow-xl">
          <div className="flex items-center gap-2.5 justify-center py-0.5">
            <CraftPourIcon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
            <span className="font-medium text-[11px] sm:text-xs md:text-sm">Signature Craft Pours</span>
          </div>
          <div className="flex items-center gap-2.5 justify-center py-0.5">
            <DJLineupsIcon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
            <span className="font-medium text-[11px] sm:text-xs md:text-sm">Top DJ Lineups</span>
          </div>
          <div className="flex items-center gap-2.5 justify-center py-0.5">
            <VIPBoothsIcon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
            <span className="font-medium text-[11px] sm:text-xs md:text-sm">VIP Tables &amp; Booths</span>
          </div>
          <div className="flex items-center gap-2.5 justify-center py-0.5">
            <FoodPairingIcon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
            <span className="font-medium text-[11px] sm:text-xs md:text-sm">Curated Food Pairing</span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center pt-2.5">
          <a
            href="#about"
            className="group flex flex-col items-center gap-0.5 text-[10px] sm:text-[11px] uppercase tracking-widest text-slate-400 hover:text-amber-300 transition-colors"
            aria-label="Scroll down to explore venue story"
          >
            <span>Scroll to explore</span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce text-amber-400/80 group-hover:text-amber-300" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
