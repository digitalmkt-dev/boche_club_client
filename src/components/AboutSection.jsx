import React, { useEffect, useRef } from 'react';
import { NeonFilters, NeonBeerMug, NeonCocktailGlass, BarTopStrip } from './ClubDecor';

const BEAM_COLORS = [
  '#ff1744',
  '#ff4d6d',
  '#f5b82e',
  '#ff1744',
  '#ff4d6d',
  '#ff1744',
  '#f5b82e',
];

const BEAM_CFG = [
  [155, 16, 1.8, 0],
  [135, 20, 2.3, 1],
  [120, 18, 1.9, 2],
  [102, 22, 2.7, 3],
  [69, 20, 2.2, 4],
  [44, 18, 2.5, 5],
  [23, 20, 1.85, 6],
];

export const AboutSection = () => {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const textColRef = useRef(null);
  const photoColRef = useRef(null);
  const photoCardRef = useRef(null);
  const svgRef = useRef(null);
  const beamsGroupRef = useRef(null);
  const threadRef = useRef(null);
  const ballGroupRef = useRef(null);
  const tilesGroupRef = useRef(null);
  const glintsGroupRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const svg = svgRef.current;
    if (!section || !svg) return;

    const NS = 'http://www.w3.org/2000/svg';
    const D = Math.PI / 180;
    const beams = [...svg.querySelectorAll('.disco-laser-beam')];
    const glowBeams = [...svg.querySelectorAll('.disco-laser-beam-glow')];
    const tilesG = tilesGroupRef.current;
    const glintsG = glintsGroupRef.current;
    if (!tilesG || !glintsG) return;

    // Mirror tile palette — metallic silver/rose/gold mirrors
    const palette = [
      '#ffe0e8', '#ffd6dc', '#e6eef5', '#fff4f6',
      '#ff4d6d', '#f5b82e', '#ff1744', '#c8c0c4',
    ];

    // ─── Build static DOM pool once in normalized ball coordinates (R = 32, center = 0,0) ───
    // Because the disco ball group is scaled via transform="translate(cx, cy) scale(R / 32)",
    // the tile track always glides by a fixed literal -64px (one full 2*32 period) via pure GPU CSS!
    // Zero requestAnimationFrame = never throttled or paused during trackpad/wheel scrolling.
    const BASE_R = 32;
    const PERIOD_PX = BASE_R * 2; // 64px per repeating period
    const COLS_PER_PERIOD = 8;
    const LAT_ROWS = 7;
    const dLat = 150 / LAT_ROWS;
    const startLat = -75;

    function buildStaticBallDOM() {
      while (tilesG.firstChild) tilesG.removeChild(tilesG.firstChild);
      while (glintsG.firstChild) glintsG.removeChild(glintsG.firstChild);

      const colW = PERIOD_PX / COLS_PER_PERIOD; // 8px wide per tile in normalized space
      const startX = -BASE_R; // -32px

      for (let row = 0; row < LAT_ROWS; row++) {
        const lat1 = (startLat + row * dLat) * D;
        const lat2 = (startLat + (row + 1) * dLat) * D;
        // Spherical vertical compression near top/bottom poles
        const y1 = (-BASE_R * Math.sin(lat1)).toFixed(2);
        const y2 = (-BASE_R * Math.sin(lat2)).toFixed(2);
        const rowShift = (row % 2) * (colW * 0.35);

        // Render 2 full identical periods (+2 buffer columns) so -64px CSS glide loops seamlessly
        for (let col = -1; col < COLS_PER_PERIOD * 2 + 1; col++) {
          const baseCol = ((col % COLS_PER_PERIOD) + COLS_PER_PERIOD) % COLS_PER_PERIOD;
          const x1 = (startX + col * colW + rowShift).toFixed(2);
          const x2 = (startX + (col + 1) * colW + rowShift).toFixed(2);

          const p = document.createElementNS(NS, 'polygon');
          p.setAttribute('points', `${x1},${y1} ${x2},${y1} ${x2},${y2} ${x1},${y2}`);
          p.setAttribute('stroke', '#0c0810');
          p.setAttribute('stroke-width', '0.55');
          const pIdx = (baseCol * 3 + row * 5) % palette.length;
          p.setAttribute('fill', palette[pIdx]);
          const shimmerIdx = (baseCol + row * 2) % 4;
          p.setAttribute('class', `disco-tile-shimmer-${shimmerIdx}`);
          tilesG.appendChild(p);
        }
      }

      // 8 Cross-shaped star sparkle glints (✦) driven by GPU-composited CSS keyframes
      const GLINT_SPECS = [
        { x: -11, y: -9, r: 4.2, color: '#ffffff', cls: 'disco-star-0' },
        { x: 9, y: -12, r: 3.6, color: '#ff4d6d', cls: 'disco-star-1' },
        { x: -4, y: 4, r: 4.6, color: '#f5b82e', cls: 'disco-star-2' },
        { x: 13, y: 3, r: 3.8, color: '#ffffff', cls: 'disco-star-3' },
        { x: -14, y: 7, r: 3.5, color: '#67e8f9', cls: 'disco-star-4' },
        { x: 3, y: 14, r: 4.0, color: '#a78bfa', cls: 'disco-star-5' },
        { x: -2, y: -16, r: 3.6, color: '#ffffff', cls: 'disco-star-6' },
        { x: 7, y: -2, r: 4.4, color: '#ff4d6d', cls: 'disco-star-7' },
      ];

      GLINT_SPECS.forEach(({ x, y, r, color, cls }) => {
        const g = document.createElementNS(NS, 'g');
        g.setAttribute('class', `disco-glint ${cls}`);
        g.style.transformOrigin = `${x}px ${y}px`;

        const glow = document.createElementNS(NS, 'circle');
        glow.setAttribute('cx', x);
        glow.setAttribute('cy', y);
        glow.setAttribute('r', (r * 0.9).toFixed(2));
        glow.setAttribute('fill', color);
        glow.setAttribute('opacity', '0.32');

        const c = document.createElementNS(NS, 'circle');
        c.setAttribute('cx', x);
        c.setAttribute('cy', y);
        c.setAttribute('r', (r * 0.38).toFixed(2));
        c.setAttribute('fill', '#ffffff');

        const hLine = document.createElementNS(NS, 'line');
        hLine.setAttribute('x1', (x - r).toFixed(2));
        hLine.setAttribute('y1', y);
        hLine.setAttribute('x2', (x + r).toFixed(2));
        hLine.setAttribute('y2', y);
        hLine.setAttribute('stroke', color);
        hLine.setAttribute('stroke-width', '0.95');
        hLine.setAttribute('stroke-linecap', 'round');

        const vLine = document.createElementNS(NS, 'line');
        vLine.setAttribute('x1', x);
        vLine.setAttribute('y1', (y - r).toFixed(2));
        vLine.setAttribute('x2', x);
        vLine.setAttribute('y2', (y + r).toFixed(2));
        vLine.setAttribute('stroke', color);
        vLine.setAttribute('stroke-width', '0.95');
        vLine.setAttribute('stroke-linecap', 'round');

        g.appendChild(glow);
        g.appendChild(c);
        g.appendChild(hLine);
        g.appendChild(vLine);
        glintsG.appendChild(g);
      });
    }

    buildStaticBallDOM();

    // Pause GPU animations when section is scrolled completely out of view (saves battery/GPU on low-spec devices)
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          section.classList.remove('about-offscreen-paused');
        } else {
          section.classList.add('about-offscreen-paused');
        }
      },
      { rootMargin: '200px' }
    );
    io.observe(section);

    let w = 800, h = 600, R = 32, cx = 400, cy = 72, L = 1000;
    let isMobile = false;

    // Cached layout metrics for fallback parallax (avoids getBoundingClientRect during scroll)
    let cachedSectionTop = 0;
    let cachedSectionHeight = 600;
    let cachedVh = window.innerHeight;

    // ─── Static geometry: thread, ball transform, beams — recomputed on resize
    function updateGeometry() {
      if (!section || !svg) return;
      const secRect = section.getBoundingClientRect();
      w = secRect.width; h = secRect.height;
      if (w <= 0 || h <= 0) return;

      cachedSectionTop = secRect.top + window.scrollY;
      cachedSectionHeight = h;
      cachedVh = window.innerHeight;

      svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      R = Math.max(26, Math.min(w * 0.024, 48));

      const isStacked =
        window.innerWidth < 768 ||
        (photoCardRef.current && textColRef.current &&
          photoCardRef.current.getBoundingClientRect().top >
          textColRef.current.getBoundingClientRect().bottom - 80);

      if (!isStacked && textColRef.current && photoCardRef.current) {
        const textRect = textColRef.current.getBoundingClientRect();
        const cardRect = photoCardRef.current.getBoundingClientRect();
        const textRight = textRect.right - secRect.left;
        const cardLeft = cardRect.left - secRect.left;
        const gap = cardLeft - textRight;
        cx = gap > 60 ? textRight + gap * 0.72 : cardLeft - R * 1.2;
        isMobile = false;
      } else if (!isStacked) {
        cx = w * 0.62; isMobile = false;
      } else {
        cx = w * 0.82; isMobile = true;
      }

      cy = R * 2.4;
      L = Math.hypot(w, h);

      if (threadRef.current) {
        threadRef.current.setAttribute('x1', cx.toFixed(1));
        threadRef.current.setAttribute('y1', '0');
        threadRef.current.setAttribute('x2', cx.toFixed(1));
        threadRef.current.setAttribute('y2', (cy - R).toFixed(1));
      }
      if (ballGroupRef.current) {
        const scale = (R / BASE_R).toFixed(4);
        ballGroupRef.current.setAttribute(
          'transform',
          `translate(${cx.toFixed(1)}, ${cy.toFixed(1)}) scale(${scale})`
        );
      }
      if (beamsGroupRef.current) {
        beamsGroupRef.current.setAttribute('opacity', isMobile ? '0.45' : '0.65');
      }
      beams.forEach((b, i) => {
        const [a0] = BEAM_CFG[i];
        const rad = a0 * D;
        const bx1 = cx.toFixed(1), by1 = cy.toFixed(1);
        const bx2 = (cx + L * Math.cos(rad)).toFixed(1);
        const by2 = (cy + L * Math.sin(rad)).toFixed(1);
        b.setAttribute('x1', bx1); b.setAttribute('y1', by1);
        b.setAttribute('x2', bx2); b.setAttribute('y2', by2);
        if (glowBeams[i]) {
          glowBeams[i].setAttribute('x1', bx1); glowBeams[i].setAttribute('y1', by1);
          glowBeams[i].setAttribute('x2', bx2); glowBeams[i].setAttribute('y2', by2);
        }
        const grp = b.parentElement;
        if (grp) grp.style.transformOrigin = `${cx}px ${cy}px`;
      });
    }

    updateGeometry();

    const resizeObserver = new ResizeObserver(() => updateGeometry());
    resizeObserver.observe(section);
    const onWindowResize = () => updateGeometry();
    window.addEventListener('resize', onWindowResize, { passive: true });

    // Check if the browser natively supports GPU compositor-driven CSS view-timeline
    const supportsCssViewTimeline =
      typeof CSS !== 'undefined' &&
      typeof CSS.supports === 'function' &&
      CSS.supports('animation-timeline', 'view()');

    let cleanupScroll = null;
    const bgEl = bgRef.current;
    // Only attach a JS scroll listener if CSS view-timeline is NOT supported
    if (!supportsCssViewTimeline && bgEl && section) {
      let ticking = false;
      const updateParallaxFallback = () => {
        if (!bgEl) return;
        const scrollY = window.scrollY;
        const rectTop = cachedSectionTop - scrollY;
        const rectBottom = rectTop + cachedSectionHeight;
        if (rectBottom > -200 && rectTop < cachedVh + 200) {
          const totalDist = cachedVh + cachedSectionHeight;
          const progress = (cachedVh - rectTop) / totalDist;
          const shiftY = (progress - 0.5) * 360;
          bgEl.style.transform = `translate3d(0, ${shiftY.toFixed(2)}px, 0)`;
        }
      };

      const onScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            updateParallaxFallback();
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      updateParallaxFallback();
      cleanupScroll = () => {
        window.removeEventListener('scroll', onScroll);
      };
    }

    return () => {
      io.disconnect();
      window.removeEventListener('resize', onWindowResize);
      if (cleanupScroll) cleanupScroll();
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="About Boche Club Bangalore - Craft Beer and Nightlife on Brigade Road"
      className="about-section-timeline relative overflow-clip w-full bg-[#08090C] text-white pt-20 sm:pt-24 pb-20 sm:pb-28 scroll-mt-20 [isolation:isolate]"
    >
      {/* 
        1. Dimmed Responsive Background Image with Parallax Bleed
        - Uses overflow-clip instead of overflow-hidden so CSS view-timeline binds to root viewport
        - Driven 100% on the GPU compositor thread via CSS animation-timeline: --about-view
      */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-clip select-none" aria-hidden="true">
        {/* Parallax wrapper with 208px vertical bleed to ensure smooth, seamless motion without edge clipping */}
        <div
          ref={bgRef}
          className="about-parallax-bg absolute -top-52 -bottom-52 inset-x-0 w-full h-[calc(100%+416px)] pointer-events-none select-none"
          style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
        >
          <picture className="w-full h-full block">
            {/* Portrait version for mobiles (< 768px): 1080 x 2268 tall aspect ratio */}
            <source
              media="(max-width: 767px)"
              srcSet="/images/about%20background%20potrait.webp"
              type="image/webp"
            />
            {/* Wide version for desktop / tablet (>= 768px): 1920 x 1293 tall aspect ratio */}
            <source
              media="(min-width: 768px)"
              srcSet="/images/about%20background%20wide.webp"
              type="image/webp"
            />
            {/* Base / Fallback Image: decoded eagerly into GPU texture to prevent mid-scroll decode jitter */}
            <img
              src="/images/about%20background%20wide.webp"
              alt=""
              className="w-full h-full object-cover object-center opacity-85 brightness-[0.72] contrast-[1.15]"
              decoding="async"
              fetchPriority="high"
              draggable={false}
              style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
            />
          </picture>
        </div>

        {/* 
          Synchronized Hardware-Accelerated Club Lighting Wash
          Cross-fades between warm ruby/gold and electric purple/magenta with zero CPU repainting
        */}
        <div
          className="absolute -inset-10 animate-club-light-wash-1 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 25% 30%, rgba(255, 23, 68, 0.36) 0%, transparent 60%), radial-gradient(circle at 75% 70%, rgba(245, 184, 46, 0.26) 0%, transparent 65%)',
            willChange: 'opacity',
          }}
        />

        <div
          className="absolute -inset-10 animate-club-light-wash-2 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 70% 25%, rgba(168, 85, 247, 0.34) 0%, transparent 60%), radial-gradient(circle at 30% 75%, rgba(255, 77, 109, 0.30) 0%, transparent 65%)',
            willChange: 'opacity',
          }}
        />

        {/* Ambient Dark Dim Overlay & Seamless Top/Bottom Vignettes */}
        <div className="absolute inset-0 bg-[#08090C]/25 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#08090C] via-transparent to-[#08090C]/90 pointer-events-none" />
      </div>

      {/* 
        2. Absolutely Positioned SVG Overlay for Lasers & Disco Ball
        z-index: 1 sits on top of the dimmed background image, but underneath 
        all content (z-index: 2).
      */}
      <svg
        ref={svgRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'none',
          overflow: 'hidden',
          contain: 'strict',
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}
        aria-hidden="true"
      >
        {/* SVG defs: normalized (0,0,r=32) clip path & spherical 3D limb-darkening gradient */}
        <defs>
          <clipPath id="disco-ball-clip">
            <circle cx="0" cy="0" r="32" />
          </clipPath>
          <radialGradient id="disco-sphere-shade" cx="38%" cy="34%" r="64%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.06" />
            <stop offset="48%" stopColor="#2a1020" stopOpacity="0.18" />
            <stop offset="78%" stopColor="#140610" stopOpacity="0.62" />
            <stop offset="100%" stopColor="#05020a" stopOpacity="0.90" />
          </radialGradient>
        </defs>
        {/* 7 Laser Beams: 100% GPU Compositor-Accelerated CSS Animations */}
        <g ref={beamsGroupRef} opacity="0.65">
          {BEAM_COLORS.map((color, i) => (
            <g
              key={`beam-group-${i}`}
              className={`disco-laser-sweep-${i}`}
            >
              {/* Soft ambient glow line */}
              <line
                className="disco-laser-beam-glow"
                stroke={color}
                strokeWidth="5.5"
                strokeLinecap="round"
                opacity="0.32"
              />
              {/* Intense focused core line */}
              <line
                className="disco-laser-beam"
                stroke={color}
                strokeWidth="1.8"
                strokeLinecap="round"
                opacity="0.95"
              />
            </g>
          ))}
        </g>

        {/* Thin metallic thread hanging the ball from the ceiling edge */}
        <line
          ref={threadRef}
          stroke="#6b5a60"
          strokeWidth="1"
        />

        {/* Normalized Disco Ball Group (center = 0,0, radius = 32, scaled & positioned via transform) */}
        <g ref={ballGroupRef} transform="translate(400, 72) scale(1)">
          {/* Base dark core of the ball */}
          <circle
            cx="0"
            cy="0"
            r="32"
            fill="#1a1018"
            stroke="#6a5860"
            strokeWidth="1"
          />

          {/* 100% GPU Compositor-Accelerated Vertical-Axis Tile Glide (never pauses during scroll) */}
          <g clipPath="url(#disco-ball-clip)">
            <g
              ref={tilesGroupRef}
              id="disco-tiles"
              className="disco-tiles-glide"
            />
          </g>

          {/* Spherical shading overlay — adds 3D depth and limb-darkening */}
          <circle
            cx="0"
            cy="0"
            r="32"
            fill="url(#disco-sphere-shade)"
            style={{ pointerEvents: 'none' }}
          />

          {/* Specular highlight ellipse — bright glint at top-left of the sphere */}
          <ellipse
            cx="-9"
            cy="-10.2"
            rx="10.2"
            ry="6.4"
            transform="rotate(-35, -9, -10.2)"
            fill="#ffffff"
            opacity="0.22"
            style={{ pointerEvents: 'none' }}
          />

          {/* 8 Cross-shaped star glints (✦) — 100% GPU CSS animated */}
          <g ref={glintsGroupRef} id="disco-glints" />
        </g>
      </svg>

      {/* CSS Keyframes for Neon Flicker, Lasers & Disco Ball */}
      <style>{`
        /* 100% GPU Compositor-Synchronized Scroll Parallax (Zero Jitter on Fast Scroll) */
        @keyframes about-parallax-shift {
          from {
            transform: translate3d(0, -180px, 0);
          }
          to {
            transform: translate3d(0, 180px, 0);
          }
        }
        @supports (animation-timeline: view()) {
          .about-parallax-bg {
            animation: about-parallax-shift linear both;
            animation-timeline: view();
            animation-range: entry 0% exit 100%;
          }
        }

        @keyframes neon-flicker {
          0%, 19%, 21%, 23%, 100% { opacity: 1; }
          20%, 22% { opacity: 0.42; }
        }
        .animate-neon-flicker {
          animation: neon-flicker 4s infinite ease-in-out;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(0.85); }
        }
        .animate-pulse-dot {
          animation: pulse-dot 1.2s infinite ease-in-out;
        }
        @keyframes club-light-wash-1 {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.85; }
        }
        .animate-club-light-wash-1 {
          animation: club-light-wash-1 7s infinite ease-in-out;
        }
        @keyframes club-light-wash-2 {
          0%, 100% { opacity: 0.75; }
          50% { opacity: 0.3; }
        }
        .animate-club-light-wash-2 {
          animation: club-light-wash-2 9s infinite ease-in-out;
        }

        /* 100% GPU Compositor-Accelerated Laser Sweeps (never throttled during trackpad scroll) */
        @keyframes laser-sweep-0 {
          0% { transform: rotate(-16deg); }
          100% { transform: rotate(16deg); }
        }
        .disco-laser-sweep-0 {
          animation: laser-sweep-0 3.1s ease-in-out infinite alternate;
        }

        @keyframes laser-sweep-1 {
          0% { transform: rotate(18deg); }
          100% { transform: rotate(-18deg); }
        }
        .disco-laser-sweep-1 {
          animation: laser-sweep-1 2.5s ease-in-out infinite alternate;
        }

        @keyframes laser-sweep-2 {
          0% { transform: rotate(-15deg); }
          100% { transform: rotate(17deg); }
        }
        .disco-laser-sweep-2 {
          animation: laser-sweep-2 3.3s ease-in-out infinite alternate;
        }

        @keyframes laser-sweep-3 {
          0% { transform: rotate(20deg); }
          100% { transform: rotate(-16deg); }
        }
        .disco-laser-sweep-3 {
          animation: laser-sweep-3 2.7s ease-in-out infinite alternate;
        }

        @keyframes laser-sweep-4 {
          0% { transform: rotate(-17deg); }
          100% { transform: rotate(19deg); }
        }
        .disco-laser-sweep-4 {
          animation: laser-sweep-4 3.2s ease-in-out infinite alternate;
        }

        @keyframes laser-sweep-5 {
          0% { transform: rotate(16deg); }
          100% { transform: rotate(-18deg); }
        }
        .disco-laser-sweep-5 {
          animation: laser-sweep-5 2.6s ease-in-out infinite alternate;
        }

        @keyframes laser-sweep-6 {
          0% { transform: rotate(-19deg); }
          100% { transform: rotate(17deg); }
        }
        .disco-laser-sweep-6 {
          animation: laser-sweep-6 3.4s ease-in-out infinite alternate;
        }

        @media (max-width: 767px) {
          .disco-laser-sweep-4,
          .disco-laser-sweep-5,
          .disco-laser-sweep-6 {
            display: none !important;
          }
        }

        /* 100% GPU Compositor-Accelerated Disco Ball Vertical-Axis Spin (Literal -64px period) */
        @keyframes disco-vertical-spin {
          0% {
            transform: translate3d(0px, 0px, 0px);
          }
          100% {
            transform: translate3d(-64px, 0px, 0px);
          }
        }
        .disco-tiles-glide {
          animation: disco-vertical-spin 3.8s linear infinite;
          will-change: transform;
        }

        /* 4-phase GPU tile shimmer so facets catch the light as they glide across the sphere */
        @keyframes disco-shimmer-a {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes disco-shimmer-b {
          0%, 100% { opacity: 0.95; }
          50% { opacity: 0.45; }
        }
        .disco-tile-shimmer-0 { animation: disco-shimmer-a 1.8s ease-in-out infinite; }
        .disco-tile-shimmer-1 { animation: disco-shimmer-b 2.3s ease-in-out infinite; }
        .disco-tile-shimmer-2 { animation: disco-shimmer-a 1.5s ease-in-out -0.7s infinite; }
        .disco-tile-shimmer-3 { animation: disco-shimmer-b 2.0s ease-in-out -1.1s infinite; }

        /* 8 Cross-shaped star glints (✦) — GPU-composited flash & scale */
        @keyframes disco-star-flash {
          0%, 100% { opacity: 0; transform: scale(0.25) rotate(0deg); }
          32% { opacity: 0; transform: scale(0.35) rotate(10deg); }
          50% { opacity: 1; transform: scale(1.15) rotate(45deg); }
          68% { opacity: 0; transform: scale(0.35) rotate(80deg); }
        }
        .disco-glint {
          will-change: transform, opacity;
        }
        .disco-star-0 { animation: disco-star-flash 1.7s ease-in-out 0.0s infinite; }
        .disco-star-1 { animation: disco-star-flash 2.1s ease-in-out -0.6s infinite; }
        .disco-star-2 { animation: disco-star-flash 1.5s ease-in-out -1.1s infinite; }
        .disco-star-3 { animation: disco-star-flash 2.3s ease-in-out -0.3s infinite; }
        .disco-star-4 { animation: disco-star-flash 1.9s ease-in-out -1.4s infinite; }
        .disco-star-5 { animation: disco-star-flash 1.6s ease-in-out -0.8s infinite; }
        .disco-star-6 { animation: disco-star-flash 2.4s ease-in-out -1.7s infinite; }
        .disco-star-7 { animation: disco-star-flash 1.4s ease-in-out -0.4s infinite; }

        /* Pause all child keyframe animations when #about is scrolled offscreen (0% idle GPU usage) */
        .about-offscreen-paused *,
        .about-offscreen-paused *::before,
        .about-offscreen-paused *::after {
          animation-play-state: paused !important;
        }
      `}</style>

      {/* Shared Neon SVG Filters for Icons and Frame */}
      <NeonFilters />

      {/* Main Content Container constrained to max-w-7xl, sitting above lasers (z-index: 2) */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-[2]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-center relative z-[2]">
          {/* Left Column: Pill, Heading, Neon Divider, Body Text - Centered block on mobile, left on desktop */}
          <div
            ref={textColRef}
            className="md:col-span-7 lg:col-span-6 order-1 text-left space-y-4 sm:space-y-5 relative z-[2] w-full max-w-[500px] sm:max-w-[540px] md:max-w-none mx-auto md:mx-0"
          >
            {/* Top Pill: Left-aligned within the centered block */}
            <div>
              <div
                className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#08090C]/90 text-[#f5b82e] text-[11px] font-bold tracking-widest uppercase select-none border-[1.2px] border-[#ff1744]"
                style={{
                  boxShadow: '0 0 10px rgba(255, 23, 68, 0.45), inset 0 0 6px rgba(255, 23, 68, 0.2)',
                }}
              >
                The Boche Experience
              </div>
            </div>

            {/* Heading: Left-aligned within the centered block */}
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-snug text-white text-left">
                <span className="block sm:inline">Boche Club Bangalore: </span>
                <span style={{ color: '#f5b82e' }}>Craft Brews </span>
                <span className="text-white">&amp; High-Energy </span>
                <span
                  className="block sm:inline whitespace-nowrap"
                  style={{
                    color: '#ffe0e5',
                    textShadow:
                      '0 0 4px #ffe0e5, 0 0 12px #ff1744, 0 0 28px #ff1744, 0 0 48px rgba(255, 23, 68, 0.6)',
                  }}
                >
                  Nightlife
                </span>
              </h2>

              {/* Divider under heading: Left-aligned within the centered block */}
              <div
                className="w-[74px] h-[2px] bg-[#ffe0e5] mt-3.5 mb-5 rounded-full"
                style={{
                  boxShadow: '0 0 6px #ff1744, 0 0 14px #ff1744',
                }}
              />
            </div>

            {/* Body text: Left-aligned with natural spacing within the centered block */}
            <div
              className="space-y-4 text-left max-w-[52ch]"
              style={{
                color: '#e0d4d6',
                fontSize: '1.025rem',
                lineHeight: 1.75,
              }}
            >
              <p>
                Located in the heart of Brigade Road near MG Road, Boche Club is one of Bangalore&apos;s premier nightlife destinations—crafted for those who celebrate life in full color.
              </p>
              <p>
                Whether you are unwinding over fresh craft beers and curated bites or dancing to hypnotic laser spectacles and Bangalore&apos;s top resident DJs, every night is a celebration of flavor, music, and energy.
              </p>
            </div>
          </div>

          {/* Right Column: Neon Photo Frame with soft red glow circles & neon icons */}
          <div ref={photoColRef} className="md:col-span-5 lg:col-span-6 order-2 flex justify-center md:justify-end md:pr-8 lg:pr-12 xl:pr-14 relative pt-10 sm:pt-4 md:pt-0 z-[2]">
            {/* Soft Red Glow Circles behind the photo (rgba(255,23,68,.03-.05), radii ~120/165/210px) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10" aria-hidden="true">
              {/* Radius ~210px (420px wide) */}
              <div className="absolute w-[360px] sm:w-[420px] h-[360px] sm:h-[420px] rounded-full bg-[rgba(255,23,68,0.03)] blur-[70px]" />
              {/* Radius ~165px (330px wide) */}
              <div className="absolute w-[280px] sm:w-[330px] h-[280px] sm:h-[330px] rounded-full bg-[rgba(255,23,68,0.04)] blur-[50px]" />
              {/* Radius ~120px (240px wide) */}
              <div className="absolute w-[200px] sm:w-[240px] h-[200px] sm:h-[240px] rounded-full bg-[rgba(255,23,68,0.05)] blur-[30px]" />
            </div>

            {/* Photo Frame Container with Faint Echo Outline */}
            <div ref={photoCardRef} className="relative w-full max-w-[285px] sm:max-w-[340px] md:max-w-[390px] mb-6 sm:mb-4 mx-auto md:mx-0">
              {/* Faint echo outline: 1.5px rgba(255,23,68,.35) offset by 8px right and down */}
              <div
                className="absolute inset-0 translate-x-2 translate-y-2 rounded-[18px] border-[1.5px] border-[rgba(255,23,68,0.35)] -z-10 pointer-events-none"
                aria-hidden="true"
              />

              {/* Main Neon Tube Frame: rounded-[18px], 2px #ffe0e5 border with multi-layer glow */}
              <div
                className="relative aspect-[4/5] rounded-[18px] border-2 border-[#ffe0e5] bg-[#0c0a0e]/95 overflow-hidden flex items-center justify-center group"
                style={{
                  boxShadow:
                    '0 0 8px #ff1744, 0 0 22px #ff1744, inset 0 0 14px rgba(255, 23, 68, 0.45)',
                }}
              >
                {/* Photo inside frame - Bright, crisp and vivid */}
                <img
                  src="/images/boche-with-beer.png"
                  alt="Boche Club Bangalore - Craft Beer and Nightlife on Brigade Road"
                  className="w-full h-full object-contain p-3 drop-shadow-[0_15px_25px_rgba(0,0,0,0.85)] transition-transform duration-500 group-hover:scale-[1.02] filter brightness-[1.02] contrast-[1.04]"
                  loading="lazy"
                />

                {/* Light luminous rose & gold atmospheric glow */}
                <div
                  className="absolute inset-0 pointer-events-none mix-blend-screen opacity-22"
                  style={{
                    background:
                      'radial-gradient(circle at 80% 20%, rgba(255, 23, 68, 0.55) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(245, 184, 46, 0.45) 0%, transparent 60%)',
                  }}
                />

                {/* Delicate warm tint for color harmony without darkening */}
                <div
                  className="absolute inset-0 pointer-events-none mix-blend-color opacity-15"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(255, 77, 109, 0.4) 0%, rgba(245, 184, 46, 0.3) 100%)',
                  }}
                />

                {/* Subtle soft bottom shadow for natural grounding */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              </div>

              {/* Neon Beer Mug standing near bottom-left of photo frame (enlarged) */}
              <div className="absolute -bottom-7 sm:-bottom-8 -left-6 sm:-left-10 lg:-left-12 z-20 pointer-events-none">
                <NeonBeerMug className="w-20 sm:w-24 lg:w-28 h-20 sm:h-24 lg:h-28" />
              </div>

              {/* Neon Cocktail Glass standing near bottom-right of photo frame (enlarged & uncropped) */}
              <div className="absolute -bottom-9 sm:-bottom-11 -right-4 sm:-right-6 lg:-right-8 z-20 pointer-events-none">
                <NeonCocktailGlass className="w-20 sm:w-24 lg:w-28 h-24 sm:h-30 lg:h-34" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bar Top Strip along the bottom of the section (24px high, #120709) */}
      <BarTopStrip />
    </section>
  );
};

export default AboutSection;
