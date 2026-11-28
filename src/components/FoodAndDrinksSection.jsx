import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  UtensilsCrossed,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const FULL_MENU_URL =
  'https://app.muncho.in/home/82e7dbcc-f8c4-46f9-9ae2-b8fd4137bca3/R41/login?required=true&returnTo=Home';
const SWIGGY_URL =
  'https://www.swiggy.com/city/bangalore/boche-club-eva-mall-central-bangalore-rest849321';
const ZOMATO_URL = 'https://zomato.onelink.me/xqzv/zmi1nniy';

// All 15 studio food & drink WebP photos from /public/images/food/ with inline base64 blurred LQIP placeholders
const FLAVOUR_ITEMS = [
  {
    id: 'chilli-mango-prawns',
    name: 'Chilli Mango Habanero Prawns',
    image: '/images/food/Chilli%20mango%20habanero%20prawns.webp',
    blurDataUrl:
      'data:image/webp;base64,UklGRp4AAABXRUJQVlA4IJIAAABwBQCdASoYAB4APt1cqU6opKOiMBgIARAbiWYAvdBpYeo0TWv7jWe86i6NGXh0deyH/+JAAP7u3mZ6IQZ0SYMv7jlMvs+nHoMoFrZEyRmffc5HVm8XFJOLjsghmbUvSokXA59c5JXdWo0FyocS+K3AIFbY2wv9NWPek1JTP8N+BHgfPHDINopOpsGAXI9D4yWAAA==',
  },
  {
    id: 'brass-kindi-cocktail',
    name: 'Brass Kindi Cocktail',
    image: '/images/food/Brass%20Kindi%20Cocktail%20on%20Charcoal.webp',
    blurDataUrl:
      'data:image/webp;base64,UklGRpAAAABXRUJQVlA4IIQAAAAQBQCdASoYAB4APtFaqEyoJaQiMAwBABoJQAApm14sr/yIiXB+9ygA4bbt1C/jq1CAAP7phvEzHXyRtMIUB0YRXlmWrr0iNL32sVjvkpeha5aFk0/lvka4MCjJsB0HGcLmpDpdLxmUMv1xOvzWUyqgKOEEqusPvsJys02Fd79B6fW0UAA=',
  },
  {
    id: 'mutton-seekh',
    name: 'Crisp Mutton Seekh Platter',
    image: '/images/food/Mutton%20seekh%20on%20an%20ivory%20platter.webp',
    blurDataUrl:
      'data:image/webp;base64,UklGRpAAAABXRUJQVlA4IIQAAACQBQCdASoYAB4APt1irE8opaSiKAqpEBuJZgCxCYACVNa8lkVTJ37yeeMmQxqrdSYJHyG6AAD+6/5XwCRB5EpuBuywxhC0HG8KxuinxFVcBqRgxyKrTtbL34XuYAI2wSETNhZG1Z3UpFUP4RLY21GMoHPPTKId8Cru5kUJLppdIE0AAAA=',
  },
  {
    id: 'amber-rosemary-cocktail',
    name: 'Smoked Orange & Rosemary',
    image: '/images/food/Amber%20cocktail%20with%20orange%20and%20rosemary.webp',
    blurDataUrl:
      'data:image/webp;base64,UklGRoQAAABXRUJQVlA4IHgAAABQBQCdASoYAB4APtVWpUyoJKOiN/VYAQAaiWwAwPy/xh+DL8gA8NQv5rVit/+y3x0fuqgA/uScfzvhNr1DZPF2TIwl02x/8Y8g+6t7E39BH9AcGcQYFJLdwPpeiKbS3qiLdiUp8J0lwz06IPKzPBtfqHI76i9QAAA=',
  },
  {
    id: 'handcrafted-veg-pizza',
    name: 'Handcrafted Artisan Pizza',
    image: '/images/food/Handcrafted%20vegetable%20pizza%20on%20a%20black%20tray.webp',
    blurDataUrl:
      'data:image/webp;base64,UklGRp4AAABXRUJQVlA4IJIAAACQBQCdASoYAB4APt1YpU2opKMiMBgMARAbiWgAsQWgAPVRUFJUploKv1IdWOYGvBU6kO4uiAD+vY6xiG0sbkeleIafPkiMe2MlWEHKfnQEp5z0lQcAvBu5EN876G0c322OGlopb0jpN1OU7mv2cy+RT3l+AZUnLg1WODWFHuFcmOS5yPHr7E+YIZ4kkzGEdtAAAA==',
  },
  {
    id: 'turquoise-tiki',
    name: 'Turquoise Citrus Tiki',
    image: '/images/food/Turquoise%20tiki%20drink%20with%20citrus%20and%20mint.webp',
    blurDataUrl:
      'data:image/webp;base64,UklGRogAAABXRUJQVlA4IHwAAADwBACdASoYAB4APt1orVEopaQiqAgBEBuJZADE2FbQd6T6j3AJ4T8IcuwA4OY/E0gA/vV3QTZgL1EcnZqJVoDuTc3hJRNKSypH/Rq+JxZoMOsAhBn7ELrCfrM2/wz8Js/NqN0A4mI3QSeXzc3PNjVfe4/YQnNfS0HwAAAA',
  },
  {
    id: 'korean-seafood-plate',
    name: 'Korean Seafood Plate',
    image: '/images/food/Korean%20seafood%20plate%20with%20sunny-side%20egg.webp',
    blurDataUrl:
      'data:image/webp;base64,UklGRqAAAABXRUJQVlA4IJQAAACwBQCdASoYAB4APt1cpE0opSMiMBgMARAbiWgAvkhX7+PSZUrwYuwZJKyzTpEd/Hz0+KJIYAAA/vDYhMNh8NZ7LRLV8HLOExrvJiD0utJwY7WyT+1bj9ggbRWvWOwEn2IlDv/mjhRM2MCaK/wiVGVwPKBGMDcLf8mNH7SQLxSOeAWe2CIlItyYkOS9qeiw1n2EDwAA',
  },
  {
    id: 'ruby-cocktail',
    name: 'Ruby Velvet Cocktail',
    image: '/images/food/Ruby%20cocktail%20on%20charcoal%20tabletop.webp',
    blurDataUrl:
      'data:image/webp;base64,UklGRnIAAABXRUJQVlA4IGYAAAAQBACdASoYAB4APt1gpkyopaOiMAgBEBuJaAC+wCG5zUifp4idsHECAAD+nsX5jvBqyE3L912mLrNdUQ9MEvQ/WrxDCCnf0MPZAxhEF+gqEPzm0Vmvjl8Y9WaQ05xgUP12Ps6QAAA=',
  },
  {
    id: 'golden-parmesan-pie',
    name: 'Golden Parmesan Potato Pie',
    image: '/images/food/Golden%20Parmesan%20Potato%20Pie.webp',
    blurDataUrl:
      'data:image/webp;base64,UklGRq4AAABXRUJQVlA4IKIAAACwBQCdASoYAB4APt1cpUyopSOiMBgMARAbiWoAsOxU0b+nZxi4TROBhrwed4k4kiw69fjFsIAA/sv+0nedZmlQIU5fU/Y9s6x985kE3P3CT5d+LkTWY5UCzqfsqX71ifKXQB1J4aJ5duuqzmgEhOGLM9yieLPsKSc6FjocKX9PHIDiIWX6OxieUrPV/UF/j+0cTTrxEYa6R15ncOC6lQhzfgA=',
  },
  {
    id: 'pink-paradise-highball',
    name: 'Pink Paradise Highball',
    image: '/images/food/Pink%20Paradise%20Highball%20on%20Charcoal.webp',
    blurDataUrl:
      'data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAADwBACdASoYAB4APt1iqU2opaQiMBgIARAbiWQAv+wyxxq2c4wqL/CBHtZSZ+DpYtAA/rn8Wg8Kt09yfgvXpb9gOWj6KketBlMpzVUe14uWSf+Jw0ZO9Svac/UsXanHmuV1NEMl9K+DLHw4gAA=',
  },
  {
    id: 'california-mango-rolls',
    name: 'California Mango Chicken Rolls',
    image: '/images/food/California%20mango%20chicken%20rolls%20with%20herbed%20toast.webp',
    blurDataUrl:
      'data:image/webp;base64,UklGRpgAAABXRUJQVlA4IIwAAACQBQCdASoYAB4APtVYpEyoJSOiN/VYAQAaiWoArABFX0nNji6Y03+PDuRngahA3GhAva4igAD+6OWjGdbHWUl7d+YabZ54NxXyvv/yTzh74Q0iEOjmEj9Ghii0TvYPV5NTMXVoOKxRyrVpIEZwmviY1D9Cf5nov8XiYq8JoaNUrvhIAIblD8nFCZwAAA==',
  },
  {
    id: 'raw-mango-mojito',
    name: 'Raw Mango Mojito',
    image: '/images/food/Studio-lit%20raw%20mango%20mojito.webp',
    blurDataUrl:
      'data:image/webp;base64,UklGRoIAAABXRUJQVlA4IHYAAABQBQCdASoYAB4APslYoEynpaMiN/qoAPAZCWoAxNgh3/csWYBwp7zcUU1RDH0ATcho7AAA/svEhSIu8Kw2PbK15d64RjOItcXkvblOChdq6/2lFcj5W79nBGH0kjE2TjGYTpHdydW6tg9+DRJB1Rgpr7SXNoAA',
  },
  {
    id: 'mango-avocado-salad',
    name: 'Mango Avocado Millet Salad',
    image: '/images/food/Mango%20avocado%20millet%20salad.webp',
    blurDataUrl:
      'data:image/webp;base64,UklGRqAAAABXRUJQVlA4IJQAAACQBQCdASoYAB4APt1Wp0yopCOiN/VYARAbiWwAtshFX96LHC0LeZFk1GUPdKOyYFJomV7AAAD+y+nTVUJU9L9XKah+PLQPH9P50/s4or8sMuffR+fk/1eXiCnch1UJ8B8MalziDLVGQnZV/+p02WZcR9huB9W9XPNYyS+vZzTl9B+P5TZkZitgh7t0ExZ/Y55NAAAA',
  },
  {
    id: 'golden-maggi-cocktail',
    name: 'Golden Coriander Cocktail',
    image: '/images/food/Golden%20Maggi%20Cocktail%20with%20Coriander.webp',
    blurDataUrl:
      'data:image/webp;base64,UklGRooAAABXRUJQVlA4IH4AAABQBQCdASoYAB4APt1ur1GopqQiqAgBEBuJbACsAFHvEB8JGtxn9M0Mkyx65B4Tq9M0A4AA/ttdfAUHxdjOhvoJXcJHGKoUSBsB5RWjkvPh6V5PwcL7eLzCAq8ns1GdmCBg5QM6RomaqYGDE2myyQmeeTTQ0A3hjNMWWaoKAAA=',
  },
  {
    id: 'mango-lassi-punch',
    name: 'Mango Lassi Punch',
    image: '/images/food/Mango%20Lassi%20Punch%20Studio%20Portrait.webp',
    blurDataUrl:
      'data:image/webp;base64,UklGRoQAAABXRUJQVlA4IHgAAADwBACdASoYAB4APtlgpUyoJiOiMBgMAQAbCWoAxNgQ75e1wKUIyFrjijsZZ9WI/rAA/svEE59RPZR40DOuacTrj0om4hS+ytUFfP5AInOuHi9C+ZYVh2I14ivEccw7cU7EKSZlI4XuR9CFkWcDHNbVmbb+uNgOAAA=',
  },
];

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

// Displays an instant inline base64 blurred WebP placeholder first, then lazily loads
// and cross-fades to the crisp WebP image once the card approaches the viewport.
const ProgressiveFlavourImage = ({ src, blurDataUrl, alt, viewportRef, sectionNearView }) => {
  const containerRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(
    () => typeof IntersectionObserver === 'undefined'
  );
  const [isLoaded, setIsLoaded] = useState(false);

  // Lazy-trigger the full WebP only once the section is near the viewport AND the card approaches horizontally
  useEffect(() => {
    if (!sectionNearView || shouldLoad) return undefined;
    const node = containerRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        root: viewportRef.current || null,
        rootMargin: '0px 450px 0px 250px',
        threshold: 0,
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [sectionNearView, shouldLoad, viewportRef]);

  // Immediately reveal if the crisp WebP is already cached in memory upon mounting
  const handleImgRef = useCallback((img) => {
    if (img && img.complete && img.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"
    >
      {/* Base64-encoded blurred WebP LQIP rendered immediately with 0 network latency */}
      <img
        src={blurDataUrl}
        alt=""
        aria-hidden="true"
        draggable={false}
        className={`absolute inset-0 w-full h-full object-cover object-center scale-110 blur-xl select-none transition-opacity duration-300 delay-500 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Full-resolution WebP lazily fetched and cross-faded cleanly over the blur placeholder */}
      {shouldLoad && (
        <img
          ref={handleImgRef}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          draggable={false}
          onLoad={() => setIsLoaded(true)}
          className={`relative w-full h-full object-cover object-center select-none transition-opacity duration-500 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};

export const FoodAndDrinksSection = () => {
  const runwayRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const progressBarRef = useRef(null);
  const [sectionNearView, setSectionNearView] = useState(false);
  const metricsRef = useRef({
    maxTranslateX: 0,
    scrollSpan: 1,
    currentX: 0,
    inView: false,
  });

  // Scroll-driven GPU horizontal gallery using native position:sticky (0px jitter)
  useEffect(() => {
    const runway = runwayRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!runway || !viewport || !track) return undefined;

    let rafId = null;
    let lastTs = null;

    const measure = () => {
      const m = metricsRef.current;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Align first & last card pixel-for-pixel with our shared max-w-[1640px] page gutter
      const basePad = vw >= 1280 ? 64 : vw >= 1024 ? 48 : vw >= 640 ? 32 : 20;
      const containerLeft = Math.max(0, (viewport.clientWidth - 1640) * 0.5) + basePad;
      track.style.paddingLeft = `${containerLeft}px`;
      track.style.paddingRight = `${containerLeft}px`;

      const maxTranslateX = Math.max(0, track.scrollWidth - viewport.clientWidth);
      // Scale vertical scroll runway (~0.86x horizontal travel) for balanced, effortless horizontal browsing
      const scrollSpan = Math.max(1, Math.round(maxTranslateX * 0.86));
      runway.style.height = `${vh + scrollSpan}px`;

      m.maxTranslateX = maxTranslateX;
      m.scrollSpan = scrollSpan;
    };

    const renderFrame = (ts) => {
      const m = metricsRef.current;
      if (lastTs === null) lastTs = ts;
      const dt = clamp((ts - lastTs) / 1000, 0, 0.05);
      lastTs = ts;

      const rect = runway.getBoundingClientRect();
      const progress = clamp(-rect.top / m.scrollSpan, 0, 1);
      const targetX = progress * m.maxTranslateX;

      // Frame-rate-independent smoothing melts scroll input into silky horizontal glide
      const alpha = 1 - Math.exp(-dt * 9.5);
      m.currentX += (targetX - m.currentX) * alpha;
      if (Math.abs(targetX - m.currentX) < 0.2) {
        m.currentX = targetX;
      }

      track.style.transform = `translate3d(${(-m.currentX).toFixed(2)}px, 0, 0)`;

      if (progressBarRef.current) {
        const barScale = m.maxTranslateX > 0 ? clamp(m.currentX / m.maxTranslateX, 0, 1) : 1;
        progressBarRef.current.style.transform = `scaleX(${barScale.toFixed(4)})`;
      }

      if (m.inView) {
        rafId = requestAnimationFrame(renderFrame);
      } else {
        rafId = null;
      }
    };

    const startLoop = () => {
      if (!rafId) {
        lastTs = null;
        rafId = requestAnimationFrame(renderFrame);
      }
    };

    const stopLoop = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    measure();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    if (ro) {
      ro.observe(viewport);
      ro.observe(track);
    }
    window.addEventListener('resize', measure, { passive: true });

    const io = new IntersectionObserver(
      (entries) => {
        const isIntersecting = entries[entries.length - 1].isIntersecting;
        metricsRef.current.inView = isIntersecting;
        if (isIntersecting) {
          setSectionNearView(true);
          measure();
          startLoop();
        } else {
          stopLoop();
        }
      },
      { rootMargin: '300px' }
    );
    io.observe(runway);

    metricsRef.current.inView = true;
    startLoop();

    return () => {
      stopLoop();
      io.disconnect();
      if (ro) ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  // Optional arrow buttons nudge vertical scroll smoothly along the horizontal runway
  const nudgeTrack = (dir) => {
    const runway = runwayRef.current;
    if (!runway) return;
    const m = metricsRef.current;
    const stepY = Math.max(260, Math.min(460, m.scrollSpan * 0.14));
    const sectionTop = window.scrollY + runway.getBoundingClientRect().top;
    const minY = sectionTop;
    const maxY = sectionTop + m.scrollSpan;
    const targetY = clamp(window.scrollY + dir * stepY, minY, maxY);
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  return (
    <section
      ref={runwayRef}
      id="flavours"
      data-scroll-gravity="medium"
      aria-label="Food and Drinks - Signature Flavours at Boche Club Bangalore"
      className="relative w-full bg-[#08090C] text-white scroll-mt-0"
      style={{ height: '450vh' }}
    >
      {/* Secondary anchor alias for Food and Drinks links */}
      <span id="food-and-drinks" className="absolute top-0" aria-hidden="true" />

      {/* Native GPU-composited Sticky Viewport Stage (airy 3-tier layout with zero crowding) */}
      <div className="sticky top-0 h-[100dvh] sm:h-screen w-full overflow-hidden flex flex-col justify-between pt-24 sm:pt-28 pb-5 sm:pb-8">
        {/* Clean Full-Bleed Warm Dark Gradient Background */}
        <div
          className="absolute inset-0 pointer-events-none select-none"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse 68% 55% at 18% 24%, rgba(245, 184, 46, 0.09) 0%, transparent 66%), radial-gradient(ellipse 64% 55% at 84% 76%, rgba(255, 23, 68, 0.09) 0%, transparent 66%), linear-gradient(135deg, #130F15 0%, #191216 50%, #100D12 100%)',
          }}
        />

        {/* ── Top Header Row: Clean Minimal Title + Quiet Progress/Arrows on Desktop ── */}
        <div className="relative z-10 max-w-[1640px] mx-auto w-full px-5 sm:px-8 lg:px-12 xl:px-16 shrink-0">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] text-[#f5b82e] text-[10px] sm:text-xs font-bold tracking-widest uppercase border border-amber-400/30 mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Flavours • Food &amp; Drinks</span>
              </div>

              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl xl:text-[2.75rem] font-bold tracking-tight leading-tight text-white">
                Curated Bites &amp;{' '}
                <span className="text-[#f5b82e]">Signature Cocktails</span>
              </h2>
            </div>

            {/* Quiet Desktop Progress & Nudge Controls */}
            <div className="hidden md:flex items-center gap-4 shrink-0 pb-1">
              <div className="w-36 lg:w-48 h-[2px] rounded-full bg-white/10 overflow-hidden">
                <div
                  ref={progressBarRef}
                  className="h-full w-full origin-left bg-gradient-to-r from-[#f5b82e] via-amber-400 to-[#ff1744]"
                  style={{ transform: 'scaleX(0)' }}
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => nudgeTrack(-1)}
                  aria-label="Scroll flavours left"
                  className="w-9 h-9 rounded-full bg-white/[0.05] hover:bg-amber-500/20 border border-white/15 hover:border-amber-400/60 text-slate-200 hover:text-amber-300 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => nudgeTrack(1)}
                  aria-label="Scroll flavours right"
                  className="w-9 h-9 rounded-full bg-white/[0.05] hover:bg-amber-500/20 border border-white/15 hover:border-amber-400/60 text-slate-200 hover:text-amber-300 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Center Horizontal Scroll-Driven Photo Strip (generous spacing & auto-fit height) ── */}
        <div
          ref={viewportRef}
          className="relative z-10 w-full flex-1 min-h-0 flex items-center overflow-hidden py-5 sm:py-7 lg:py-9"
        >
          <div
            ref={trackRef}
            className="flex items-center h-full gap-5 sm:gap-6 lg:gap-8 will-change-transform"
            style={{ transform: 'translate3d(0px, 0, 0)' }}
          >
            {FLAVOUR_ITEMS.map((item) => (
              <article
                key={item.id}
                className="group relative shrink-0 h-full max-h-[440px] aspect-[4/5] rounded-2xl overflow-hidden bg-[#141419] border border-white/10 hover:border-amber-400/50 shadow-2xl shadow-black/70 transition-colors duration-300"
              >
                <ProgressiveFlavourImage
                  src={item.image}
                  blurDataUrl={item.blurDataUrl}
                  alt={item.name}
                  viewportRef={viewportRef}
                  sectionNearView={sectionNearView}
                />

                {/* Subtle bottom gradient for readable dish/drink title */}
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/90 via-black/45 to-transparent"
                  aria-hidden="true"
                />

                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <h3 className="font-heading text-sm sm:text-base lg:text-lg font-bold text-white leading-snug">
                    {item.name}
                  </h3>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* ── Bottom Action Dock: Centered Menu, Swiggy & Zomato CTAs ── */}
        <div className="relative z-10 max-w-[1640px] mx-auto w-full px-5 sm:px-8 lg:px-12 xl:px-16 shrink-0">
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-center gap-2.5 sm:gap-3.5">
            <a
              href={FULL_MENU_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all duration-200 hover:-translate-y-0.5"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Explore Full Menu</span>
              <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            {/* Side-by-side Swiggy & Zomato on mobile; centered inline row on desktop */}
            <div className="grid grid-cols-2 sm:flex items-center gap-2.5 sm:gap-3.5">
              <a
                href={SWIGGY_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Order on Swiggy"
                className="group inline-flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-[#FE5005]/55 hover:border-[#FE5005] text-white font-semibold text-[11px] sm:text-sm uppercase tracking-wider shadow-lg shadow-[#FE5005]/10 hover:shadow-[#FE5005]/25 transition-all duration-200 hover:-translate-y-0.5"
              >
                <span className="hidden sm:inline">Order on</span>
                <img
                  src="/swiggy%20logo.svg"
                  alt="Swiggy"
                  draggable={false}
                  className="h-5 sm:h-[22px] w-auto object-contain select-none"
                />
                <ExternalLink className="w-3.5 h-3.5 text-[#FE5005] shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <a
                href={ZOMATO_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Order on Zomato"
                className="group inline-flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-full bg-[#E23744]/20 hover:bg-[#E23744]/35 border border-[#E23744]/65 hover:border-[#E23744] text-white font-semibold text-[11px] sm:text-sm uppercase tracking-wider shadow-lg shadow-[#E23744]/10 hover:shadow-[#E23744]/25 transition-all duration-200 hover:-translate-y-0.5"
              >
                <span className="hidden sm:inline">Order on</span>
                <img
                  src="/zomato%20logo.png"
                  alt="Zomato"
                  draggable={false}
                  className="h-3.5 sm:h-4 w-auto object-contain select-none"
                />
                <ExternalLink className="w-3.5 h-3.5 text-[#ff6b76] shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoodAndDrinksSection;
