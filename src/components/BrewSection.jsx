import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Beer, ChevronLeft, ChevronRight, X } from 'lucide-react';

const BEERS = [
  {
    id: 'ale-othello',
    name: 'Ale Othello!',
    subtitle: 'India Pale Ale',
    image: '/images/Ale%20Othello!%20Inda%20Pale%20Ale.png',
    description:
      'A hoppy, aromatic India Pale Ale bursting with tropical fruit and bright citrus notes, balanced by toasted caramel malt for a crisp bitter finish.',
  },
  {
    id: 'mango-ale',
    name: 'Mango Ale',
    subtitle: 'Tropical Craft Ale',
    image: '/images/Mango%20Ale.png',
    description:
      'Infused with sun-ripened Alphonso mango over a hazy golden craft ale base—juicy, aromatic, and effortlessly smooth.',
  },
  {
    id: 'romeos-swagger',
    name: "Romeo's Swagger",
    subtitle: 'Belgian Craft Witbier',
    image: '/images/Romeos%20Swaggar.png',
    description:
      'A refreshing, hazy Belgian-style wheat brew with bright lemony zest, subtle spice, and a clean, velvety finish.',
  },
];

const TWO_PI = Math.PI * 2;
const STEP_ANGLE = TWO_PI / BEERS.length;

// Sequential scroll beats: Rise 1 → Rotate 120° → Rise 2 → Rotate 120° → Rise 3 → Continuous Loop
// Extra bottom sticky cushion (0.74..1.00) ensures the sticky stage never unsticks before spin starts
const RISE_WINDOWS = [
  [0.01, 0.16], // Beat 1: Ale Othello! rises into front spotlight
  [0.30, 0.45], // Beat 3: Mango Ale rises into front spotlight
  [0.59, 0.74], // Beat 5: Romeo's Swagger rises into front spotlight
];
const ROTATE_1_WINDOW = [0.16, 0.30]; // Beat 2: Rotate 120° after Glass 1
const ROTATE_2_WINDOW = [0.45, 0.59]; // Beat 4: Rotate 120° after Glass 2
const LOOP_START_P = 0.74;            // Beat 6: Continuous revolution loop begins
const STICKY_GATE_P = 0.84;           // Downward-only gate inside sticky buffer until spin starts

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

// Exact analytical critically-damped spring step (C1 velocity-continuous, zero overshoot)
function stepSpring(current, velocity, target, omega, dt) {
  const diff = current - target;
  const exp = Math.exp(-omega * dt);
  const temp = (velocity + omega * diff) * dt;
  return [
    target + (diff + temp) * exp,
    (velocity - omega * temp) * exp,
  ];
}

export const BrewSection = () => {
  const runwayRef = useRef(null);
  const stickyStageRef = useRef(null);
  const stageRef = useRef(null);
  const glassRefs = useRef([]);
  const shadowRefs = useRef([]);
  const progressBarRef = useRef(null);

  // Mutable 60/120fps animation state (avoids React re-renders during scroll/orbit)
  const animRef = useRef({
    scrollProgress: 0,
    maxProgress: 0,         // live scroll target while not collapsed; locks to 1 once arranged & spinning
    forcedReveal: false,    // true if user manually triggers rotation controls early
    collapsed: false,       // true ONLY once all 3 glasses are arranged & continuously spinning
    glassT: [0, 0, 0],      // critically-damped rise progress per glass (0..1)
    glassV: [0, 0, 0],      // critically-damped rise velocity per glass
    scrollOrbit: 0,
    scrollOrbitV: 0,
    loopAngle: 0,
    userAngle: 0,
    targetDelta: 0,
    velocity: 0,
    isDragging: false,
    isHovering: false,
    dragLastX: 0,
    dragMoved: 0,
    lastPointerTs: 0,
    inView: false,
    modalOpen: false,
    // Cached layout & style metrics (avoid per-frame forced layout queries / redundant DOM writes)
    viewportW: 1280,
    stageW: 520,
    stageH: 480,
    isCompact: false,
    shadowOffsetY: 118,
    maxScroll: 1,
    lastZ: [-1, -1, -1],
    lastPtr: ['', '', ''],
  });

  const [scrollUnlocked, setScrollUnlocked] = useState(false);
  const [selectedBeer, setSelectedBeer] = useState(null);

  // Clear inline collapse overrides once React commits normal-flow classes
  useLayoutEffect(() => {
    if (!scrollUnlocked) return;
    if (runwayRef.current) runwayRef.current.style.height = '';
    if (stickyStageRef.current) stickyStageRef.current.style.position = '';
  }, [scrollUnlocked]);

  useEffect(() => {
    animRef.current.modalOpen = Boolean(selectedBeer);
  }, [selectedBeer]);

  // Keyboard navigation inside the beer popup modal
  useEffect(() => {
    if (!selectedBeer) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedBeer(null);
      if (e.key === 'ArrowRight') {
        const idx = BEERS.findIndex((b) => b.id === selectedBeer.id);
        setSelectedBeer(BEERS[(idx + 1) % BEERS.length]);
      }
      if (e.key === 'ArrowLeft') {
        const idx = BEERS.findIndex((b) => b.id === selectedBeer.id);
        setSelectedBeer(BEERS[(idx - 1 + BEERS.length) % BEERS.length]);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedBeer]);

  // Trigger smooth full reveal if the user clicks rotation controls early
  const ensureRevealed = useCallback(() => {
    animRef.current.forcedReveal = true;
    animRef.current.maxProgress = 1;
  }, []);

  const rotateByStep = useCallback(
    (dir) => {
      ensureRevealed();
      animRef.current.velocity = 0;
      animRef.current.targetDelta += dir * STEP_ANGLE;
    },
    [ensureRevealed]
  );

  // Pointer drag / touch swipe handlers for free user rotation
  const handlePointerDown = useCallback((e) => {
    if (e.button !== undefined && e.button !== 0) return;
    const s = animRef.current;
    s.isDragging = true;
    s.dragLastX = e.clientX;
    s.dragMoved = 0;
    s.velocity = 0;
    s.targetDelta = 0;
    s.lastPointerTs = performance.now();
  }, []);

  const handlePointerMove = useCallback((e) => {
    const s = animRef.current;
    if (!s.isDragging) return;
    const now = performance.now();
    const dx = e.clientX - s.dragLastX;
    const dt = Math.max(8, now - s.lastPointerTs);
    s.dragMoved += Math.abs(dx);
    s.dragLastX = e.clientX;
    s.lastPointerTs = now;

    const sensitivity = window.innerWidth < 640 ? 0.012 : 0.0075;
    const dAngle = dx * sensitivity;
    s.userAngle += dAngle;
    s.velocity = (dAngle / dt) * 1000;
  }, []);

  const handlePointerUp = useCallback(() => {
    animRef.current.isDragging = false;
  }, []);

  // Native GPU position:sticky scroll stop (zero elastic jitter) + end-of-runway spin gate
  useEffect(() => {
    const runway = runwayRef.current;
    if (!runway) return undefined;

    let rafId = null;
    let lastTs = null;
    let touchLastY = 0;
    let touchLastX = 0;

    const BREW_ANCHORS = new Set(['experiences', 'shkesbierre', 'brewery']);

    const measureLayout = () => {
      const s = animRef.current;
      const stageEl = stageRef.current;
      const vw = window.innerWidth;
      s.viewportW = vw;
      s.isCompact = vw < 768;
      s.shadowOffsetY = vw < 768 ? 76 : vw >= 1536 ? 156 : vw >= 1280 ? 128 : 112;
      s.stageW = stageEl ? stageEl.clientWidth : vw;
      s.stageH = stageEl ? stageEl.clientHeight : 340;
      if (!s.collapsed) {
        s.maxScroll = Math.max(1, runway.offsetHeight - window.innerHeight);
      }
    };

    const getRawProgress = () => {
      const rect = runway.getBoundingClientRect();
      return clamp(-rect.top / animRef.current.maxScroll, 0, 1);
    };

    // Collapse sticky runway back into a normal 100vh section with zero visual jump once arranged & spinning
    const collapseRunway = (instantReveal = false) => {
      const s = animRef.current;
      const stageBox = stickyStageRef.current;
      if (s.collapsed || !stageBox) return;

      const beforeHeight = runway.offsetHeight;
      const targetHeight = stageBox.offsetHeight;
      const deltaHeight = Math.max(0, beforeHeight - targetHeight);
      const rect = runway.getBoundingClientRect();
      const scrollAdjustment = clamp(-rect.top, 0, deltaHeight);

      s.collapsed = true;
      s.maxProgress = 1;
      s.scrollProgress = 1;
      if (instantReveal) {
        s.glassT = [1, 1, 1];
        s.glassV = [0, 0, 0];
        s.scrollOrbit = -2 * STEP_ANGLE;
        s.scrollOrbitV = 0;
      }

      const html = document.documentElement;
      const prevBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';
      runway.style.height = `${targetHeight}px`;
      stageBox.style.position = 'relative';
      if (scrollAdjustment > 0) {
        window.scrollTo(0, Math.max(0, window.scrollY - scrollAdjustment));
      }
      html.style.scrollBehavior = prevBehavior;
      window.dispatchEvent(new Event('smoothscroll:sync'));

      setScrollUnlocked(true);
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

    function renderFrame(ts) {
      const s = animRef.current;
      if (lastTs === null) lastTs = ts;
      const dt = clamp((ts - lastTs) / 1000, 0, 0.05);
      lastTs = ts;

      // 1. Track sticky scroll progress bi-directionally until arranged & spinning:
      //    If not yet fully arranged, scrolling back up smoothly returns glasses down;
      //    once collapsed (all 3 arranged & spinning), glasses stay permanently up.
      if (!s.collapsed) {
        const rawProgress = getRawProgress();
        const targetP = s.forcedReveal ? 1 : rawProgress;
        s.maxProgress = targetP;
        const diff = targetP - s.scrollProgress;
        const desiredStep = diff * (1 - Math.exp(-dt * 8.5));
        // Cap forward slew so fast flicks still reveal all 3 glasses sequentially; reverse follows smoothly
        s.scrollProgress += clamp(desiredStep, -dt * 1.1, dt * 0.58);
      }
      const p = s.scrollProgress;

      if (progressBarRef.current) {
        const arrangeShare = clamp(p / LOOP_START_P, 0, 1) * 0.88;
        const spinShare = clamp(Math.abs(s.loopAngle) / 0.22, 0, 1) * 0.12;
        progressBarRef.current.style.transform = `scaleX(${clamp(arrangeShare + spinShare, 0, 1).toFixed(4)})`;
      }

      // 2. Smoothly step deterministic sequential scroll rotation via critically-damped spring:
      //    Rise 1 → Rotate -120° → Rise 2 → Rotate -120° → Rise 3 → Continuous Loop
      const rot1 = smoothstep(
        clamp((p - ROTATE_1_WINDOW[0]) / (ROTATE_1_WINDOW[1] - ROTATE_1_WINDOW[0]), 0, 1)
      );
      const rot2 = smoothstep(
        clamp((p - ROTATE_2_WINDOW[0]) / (ROTATE_2_WINDOW[1] - ROTATE_2_WINDOW[0]), 0, 1)
      );
      const targetScrollOrbit = -(rot1 + rot2) * STEP_ANGLE;
      [s.scrollOrbit, s.scrollOrbitV] = stepSpring(
        s.scrollOrbit,
        s.scrollOrbitV,
        targetScrollOrbit,
        6.2,
        dt
      );

      // Step each glass's vertical entrance through its own critically-damped spring
      for (let i = 0; i < BEERS.length; i++) {
        const [start, end] = RISE_WINDOWS[i];
        const rawT = clamp((p - start) / (end - start), 0, 1);
        const targetRise = smoothstep(rawT);
        [s.glassT[i], s.glassV[i]] = stepSpring(
          s.glassT[i],
          s.glassV[i],
          targetRise,
          5.8,
          dt
        );
      }

      // 3. Smoothly apply queued arrow rotation (frame-rate independent)
      if (Math.abs(s.targetDelta) > 0.0005) {
        const step = s.targetDelta * (1 - Math.exp(-dt * 8.0));
        s.userAngle += step;
        s.targetDelta -= step;
      } else {
        s.targetDelta = 0;
      }

      // Apply drag momentum/inertia
      if (!s.isDragging && Math.abs(s.velocity) > 0.005) {
        s.userAngle += s.velocity * dt;
        s.velocity *= Math.pow(0.06, dt);
      } else if (!s.isDragging) {
        s.velocity = 0;
      }

      // Auto-revolve seamlessly in a loop as the final glass settles into place.
      // Before unlocking (!s.collapsed), ignore stray hover so initial spin always kicks off.
      const loopRamp = smoothstep(clamp((s.glassT[2] - 0.82) / 0.18, 0, 1));
      const canAutoSpin =
        loopRamp > 0 &&
        !s.isDragging &&
        !s.modalOpen &&
        Math.abs(s.velocity) < 0.04 &&
        (!s.collapsed || !s.isHovering);
      if (canAutoSpin) {
        s.loopAngle -= 0.36 * loopRamp * dt;
      } else if (!s.collapsed && loopRamp === 0 && Math.abs(s.loopAngle) > 0.0005) {
        // If user reversed upward before arrangement completed, smoothly reset any partial loop angle
        s.loopAngle *= Math.exp(-dt * 6);
      }

      // ONLY release sticky runway once all 3 glasses are arranged AND visibly spinning
      if (
        !s.collapsed &&
        s.maxProgress >= LOOP_START_P + 0.02 &&
        s.glassT[0] >= 0.99 &&
        s.glassT[1] >= 0.99 &&
        s.glassT[2] >= 0.99 &&
        Math.abs(s.scrollOrbit - -2 * STEP_ANGLE) < 0.02 &&
        Math.abs(s.loopAngle) >= 0.22
      ) {
        collapseRunway(false);
      }

      const totalOrbit = s.scrollOrbit + s.loopAngle + s.userAngle;

      // 4. Use cached stage dimensions (zero layout thrashing inside rAF)
      const { viewportW, stageW, stageH, isCompact, shadowOffsetY } = s;

      // Clamp orbit radius strictly inside stageW so glasses never overflow into the right/left page padding
      const glassHalf =
        viewportW < 640 ? 72 : viewportW < 1024 ? 95 : viewportW < 1280 ? 108 : viewportW < 1536 ? 116 : 136;
      const arrowClearance = viewportW < 640 ? 30 : 48;
      const maxSafeRx = Math.max(80, stageW * 0.5 - glassHalf - arrowClearance);
      const rx = clamp(stageW * 0.30, 80, Math.min(300, maxSafeRx));
      const ry = isCompact ? clamp(stageH * 0.08, 20, 32) : clamp(stageH * 0.095, 34, 54);
      const riseDistance = Math.min(stageH * 0.85, 420);

      for (let i = 0; i < BEERS.length; i++) {
        const el = glassRefs.current[i];
        const shadowEl = shadowRefs.current[i];
        if (!el) continue;

        const easedT = clamp(s.glassT[i], 0, 1);

        const theta = totalOrbit + i * STEP_ANGLE;
        const sinT = Math.sin(theta);
        const cosT = Math.cos(theta); // +1 = dead front-center, -1 = far back

        const depthNorm = (cosT + 1) * 0.5;
        const x = sinT * rx;
        const yOrbit = cosT * ry;
        const yRise = (1 - easedT) * riseDistance;

        // Smoothly ramp idle float bob in as the glass lands (no abrupt snap)
        const bobRamp = smoothstep(clamp((easedT - 0.72) / 0.28, 0, 1));
        const floatBob = Math.sin(ts * 0.002 + i * 2.1) * 3.5 * bobRamp;

        const depthScale = 0.64 + depthNorm * 0.40;
        const finalScale = depthScale * (0.82 + 0.18 * easedT);
        const tiltDeg = -sinT * 3.5 * easedT;

        // Keep glasses crisp and solid over the backdrop (subtle 10% back-depth cue)
        const depthOpacity = 0.90 + depthNorm * 0.10;
        const appearOpacity = smoothstep(clamp(easedT * 2.2, 0, 1));
        const finalOpacity = depthOpacity * appearOpacity;

        const zIndex = Math.round(10 + depthNorm * 40);
        const ptr = easedT > 0.25 ? 'auto' : 'none';

        el.style.transform = `translate3d(${x.toFixed(2)}px, ${(yOrbit + yRise + floatBob).toFixed(2)}px, 0) scale(${finalScale.toFixed(4)}) rotate(${tiltDeg.toFixed(2)}deg)`;
        el.style.opacity = finalOpacity.toFixed(3);
        if (s.lastZ[i] !== zIndex) {
          s.lastZ[i] = zIndex;
          el.style.zIndex = String(zIndex);
        }
        if (s.lastPtr[i] !== ptr) {
          s.lastPtr[i] = ptr;
          el.style.pointerEvents = ptr;
        }

        if (shadowEl) {
          const shadowAppear = smoothstep(clamp((easedT - 0.12) / 0.88, 0, 1));
          const shadowScale = (0.52 + depthNorm * 0.54) * (0.55 + 0.45 * easedT);
          const shadowOpacity = shadowAppear * (0.25 + depthNorm * 0.48);
          shadowEl.style.transform = `translate3d(${x.toFixed(2)}px, ${(yOrbit * 0.85 + shadowOffsetY).toFixed(2)}px, 0) scale(${shadowScale.toFixed(3)})`;
          shadowEl.style.opacity = shadowOpacity.toFixed(3);
        }
      }

      if (s.inView) {
        rafId = requestAnimationFrame(renderFrame);
      } else {
        rafId = null;
      }
    }

    // End-of-runway downward gate ONLY: never touches scroll on entry or scroll-up (0px jitter!)
    // While inside the bottom sticky cushion (rawProgress >= STICKY_GATE_P), the stage is already
    // GPU-pinned at top:0 by position:sticky, so blocking further downward scroll until spin starts
    // keeps the visible section 100% motionless with zero elastic bounce.
    const onWheel = (e) => {
      const s = animRef.current;
      if (s.collapsed || e.deltaY <= 0) return;
      const rawP = getRawProgress();
      if (rawP >= STICKY_GATE_P) {
        s.maxProgress = Math.max(s.maxProgress, rawP);
        e.preventDefault();
      }
    };

    const onTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      touchLastY = e.touches[0].clientY;
      touchLastX = e.touches[0].clientX;
    };

    const onTouchMove = (e) => {
      const s = animRef.current;
      if (s.collapsed || e.touches.length !== 1) return;
      const curY = e.touches[0].clientY;
      const curX = e.touches[0].clientX;
      const dy = touchLastY - curY; // positive when scrolling down
      const dx = curX - touchLastX;
      touchLastY = curY;
      touchLastX = curX;

      if (dy <= 0 || Math.abs(dy) < Math.abs(dx)) return;
      const rawP = getRawProgress();
      if (rawP >= STICKY_GATE_P) {
        s.maxProgress = Math.max(s.maxProgress, rawP);
        e.preventDefault();
      }
    };

    const onKeyDown = (e) => {
      const s = animRef.current;
      if (s.collapsed || s.modalOpen) return;
      if (['ArrowDown', 'PageDown', ' ', 'End'].includes(e.key) && getRawProgress() >= STICKY_GATE_P) {
        s.maxProgress = Math.max(s.maxProgress, STICKY_GATE_P);
        e.preventDefault();
      }
    };

    // Safety clamp if scrollbar is dragged all the way to the bottom before spin finishes.
    // Because the clamp sits 24px ABOVE the end of the sticky zone, stickyStage stays pinned at top:0
    // with literally 0px of visual movement on screen.
    const onScroll = () => {
      const s = animRef.current;
      if (s.collapsed) return;
      const rect = runway.getBoundingClientRect();
      const maxAllowedTop = -(s.maxScroll - 24);
      if (rect.top < maxAllowedTop) {
        s.maxProgress = 1;
        const clampedY = Math.max(0, Math.round(window.scrollY + (rect.top - maxAllowedTop)));
        const html = document.documentElement;
        const prevBehavior = html.style.scrollBehavior;
        html.style.scrollBehavior = 'auto';
        window.scrollTo(0, clampedY);
        html.style.scrollBehavior = prevBehavior;
      }
    };

    // Capture-phase anchor click handler: collapse runway cleanly BEFORE browser jumps to sections below
    const onDocumentClick = (e) => {
      const s = animRef.current;
      if (s.collapsed) return;
      const link = e.target?.closest?.('a[href^="#"]');
      if (!link) return;
      const targetId = link.getAttribute('href').slice(1);
      if (!targetId || BREW_ANCHORS.has(targetId)) return;
      const targetEl = document.getElementById(targetId);
      if (targetEl && targetEl.getBoundingClientRect().top > runway.getBoundingClientRect().bottom - 20) {
        collapseRunway(true);
      }
    };

    measureLayout();

    // If user reloads directly below BrewSection, unlock & display glasses already arranged and spinning
    if (runway.getBoundingClientRect().bottom < window.innerHeight * 0.5) {
      collapseRunway(true);
    }

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measureLayout) : null;
    if (ro) {
      ro.observe(runway);
      if (stageRef.current) ro.observe(stageRef.current);
    }

    window.addEventListener('resize', measureLayout, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: false, capture: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('click', onDocumentClick, true);

    const io = new IntersectionObserver(
      (entries) => {
        animRef.current.inView = entries[0].isIntersecting;
        if (entries[0].isIntersecting) {
          measureLayout();
          startLoop();
        } else {
          stopLoop();
        }
      },
      { rootMargin: '250px' }
    );
    io.observe(runway);

    animRef.current.inView = true;
    startLoop();

    return () => {
      stopLoop();
      io.disconnect();
      if (ro) ro.disconnect();
      window.removeEventListener('resize', measureLayout);
      window.removeEventListener('wheel', onWheel, true);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('click', onDocumentClick, true);
    };
  }, []);

  return (
    <section
      ref={runwayRef}
      id="shkesbierre"
      data-scroll-gravity={scrollUnlocked ? undefined : 'heavy'}
      aria-label="Signature Craft Brews at Boche Club Bangalore"
      className={`relative w-full bg-[#08090C] text-white ${
        scrollUnlocked ? 'h-[100dvh] sm:h-screen min-h-[600px]' : 'h-[380vh] sm:h-[400vh]'
      }`}
    >
      {/* Anchor alias for brewery navigation */}
      <span id="brewery" className="absolute top-0" aria-hidden="true" />

      {/* Native GPU-Composited Sticky Stage (0px scroll stop jitter; unlocks to normal flow once spinning) */}
      <div
        ref={stickyStageRef}
        className={`${
          scrollUnlocked ? 'relative' : 'sticky top-0'
        } h-[100dvh] sm:h-screen min-h-[600px] w-full overflow-hidden flex flex-col justify-center pt-20 sm:pt-24 pb-4 sm:pb-8 select-none`}
      >
        {/* Clean Full-Bleed Warm Brewery Dark Gradient Background */}
        <div
          className="absolute inset-0 pointer-events-none select-none"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse 68% 58% at 72% 52%, rgba(245, 184, 46, 0.10) 0%, transparent 65%), radial-gradient(ellipse 60% 55% at 18% 42%, rgba(185, 28, 56, 0.10) 0%, transparent 68%), linear-gradient(135deg, #130F12 0%, #191311 50%, #0E0C10 100%)',
          }}
        />

        {/* Thin Scroll-Sequence Progress Bar at Top of Stage (disappears once arranged & spinning) */}
        {!scrollUnlocked && (
          <div className="absolute top-0 inset-x-0 h-[2px] bg-transparent z-20" aria-hidden="true">
            <div
              ref={progressBarRef}
              className="h-full w-full origin-left bg-gradient-to-r from-[#ff1744] via-[#f5b82e] to-amber-300"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>
        )}

        {/* ── Responsive Split Container: Top/Bottom on Mobile, Left/Right on Desktop ── */}
        <div className="relative z-10 max-w-[1640px] mx-auto w-full px-5 sm:px-8 lg:px-12 xl:px-16 h-full flex flex-col md:grid md:grid-cols-12 md:items-center gap-4 md:gap-8 lg:gap-12">
          {/* ── LEFT COLUMN (TOP ON MOBILE): Brew Story, Heading, Description & Controls ── */}
          <div className="md:col-span-5 lg:col-span-5 text-center md:text-left flex flex-col items-center md:items-start justify-center shrink-0 pt-1 md:pt-0">
            {/* Top Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#08090C]/90 text-[#f5b82e] text-[10px] sm:text-xs font-bold tracking-widest uppercase border-[1.2px] border-amber-500/50 mb-3 sm:mb-5"
              style={{
                boxShadow: '0 0 12px rgba(245, 184, 46, 0.25), inset 0 0 6px rgba(245, 184, 46, 0.15)',
              }}
            >
              <Beer className="w-3.5 h-3.5 text-amber-400" />
              <span>Fresh On Tap • Craft Brews</span>
            </div>

            {/* Section Heading */}
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem] font-bold tracking-tight leading-[1.1] text-white">
              Small-Batch{' '}
              <span style={{ color: '#f5b82e' }}>Craft Brews</span>{' '}
              <span
                className="inline sm:block"
                style={{
                  color: '#ffe0e5',
                  textShadow:
                    '0 0 4px #ffe0e5, 0 0 12px #ff1744, 0 0 24px rgba(255, 23, 68, 0.55)',
                }}
              >
                Poured Fresh
              </span>
            </h2>

            {/* Accent Divider */}
            <div
              className="w-[80px] h-[2px] bg-[#ffe0e5] mt-3.5 mb-3.5 sm:mt-5 sm:mb-6 rounded-full"
              style={{ boxShadow: '0 0 6px #ff1744, 0 0 14px #ff1744' }}
            />

            {/* Brew Description */}
            <p className="text-sm sm:text-base lg:text-lg xl:text-[1.15rem] text-slate-300 leading-relaxed max-w-xl">
              Brewed fresh in small batches for Bangalore&apos;s craft beer lovers—from bold, hop-forward IPAs to juicy Alphonso mango ales and crisp Belgian wheat pours.
            </p>
            <p className="hidden md:block text-sm lg:text-base xl:text-lg text-slate-400 leading-relaxed max-w-xl mt-4">
              Every pint is served frosty straight from the tap with vibrant aromatics and balanced character. Rotate the lineup to explore each brew, or click any glass for full tasting notes.
            </p>
          </div>

          {/* ── RIGHT COLUMN (BOTTOM ON MOBILE): Interactive 3D Circular Beer Carousel ── */}
          <div
            ref={stageRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="md:col-span-7 lg:col-span-7 relative flex-1 w-full min-h-[290px] md:min-h-[500px] lg:min-h-[580px] xl:min-h-[640px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y"
          >
            {/* 3D Perspective Orbit Ring */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[58px] md:translate-y-[96px] xl:translate-y-[112px] 2xl:translate-y-[136px] w-[72%] max-w-[680px] h-[64px] sm:h-[84px] lg:h-[104px] 2xl:h-[128px] rounded-[50%] border border-white/15"
              aria-hidden="true"
            />

            {/* Inner Dashed Orbit Ring */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[66px] md:translate-y-[106px] xl:translate-y-[122px] 2xl:translate-y-[148px] w-[50%] max-w-[480px] h-[42px] sm:h-[56px] lg:h-[70px] 2xl:h-[84px] rounded-[50%] border border-white/10 border-dashed"
              aria-hidden="true"
            />

            {/* Floor Contact Shadows (synced to each glass) */}
            {BEERS.map((beer, idx) => (
              <div
                key={`shadow-${beer.id}`}
                ref={(el) => {
                  shadowRefs.current[idx] = el;
                }}
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 -ml-12 sm:-ml-16 w-24 sm:w-32 h-6 sm:h-8 rounded-full blur-md"
                style={{
                  background:
                    'radial-gradient(ellipse at center, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.55) 55%, transparent 75%)',
                  opacity: 0,
                  willChange: 'transform, opacity',
                }}
              />
            ))}

            {/* The 3 Beer Glasses in 3D Circular Depth Orbit */}
            {BEERS.map((beer, idx) => (
              <button
                key={beer.id}
                ref={(el) => {
                  glassRefs.current[idx] = el;
                }}
                type="button"
                onMouseEnter={() => {
                  animRef.current.isHovering = true;
                }}
                onMouseLeave={() => {
                  animRef.current.isHovering = false;
                }}
                onClick={() => {
                  if (animRef.current.dragMoved < 10) {
                    setSelectedBeer(beer);
                  }
                }}
                aria-label={`View details for ${beer.name} ${beer.subtitle}`}
                className="group absolute left-1/2 top-1/2 -ml-[72px] sm:-ml-[95px] lg:-ml-[108px] xl:-ml-[116px] 2xl:-ml-[136px] -mt-[114px] sm:-mt-[154px] lg:-mt-[174px] xl:-mt-[190px] 2xl:-mt-[222px] w-[144px] sm:w-[190px] lg:w-[216px] xl:w-[232px] 2xl:w-[272px] flex flex-col items-center focus:outline-none cursor-pointer"
                style={{
                  opacity: 0,
                  willChange: 'transform, opacity',
                  backfaceVisibility: 'hidden',
                }}
              >
                <img
                  src={beer.image}
                  alt={`${beer.name} ${beer.subtitle}`}
                  draggable={false}
                  loading="eager"
                  decoding="async"
                  className="relative z-10 h-[168px] sm:h-[235px] lg:h-[265px] xl:h-[295px] 2xl:h-[355px] w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_18px_28px_rgba(0,0,0,0.85)]"
                />

                {/* Floating Name Plate (opaque dark glass avoids per-frame backdrop-blur re-sampling) */}
                <div className="relative z-10 mt-1.5 sm:mt-2.5 px-3 sm:px-3.5 py-1 rounded-full bg-[#0B0D13]/92 border border-white/15 group-hover:border-amber-400/60 transition-colors shadow-lg">
                  <span className="block font-heading text-[11px] sm:text-xs lg:text-sm font-bold text-white whitespace-nowrap tracking-wide">
                    {beer.name}
                  </span>
                  <span className="block text-[8px] sm:text-[9px] font-semibold uppercase tracking-widest text-amber-300/90 whitespace-nowrap">
                    Tap for Info
                  </span>
                </div>
              </button>
            ))}

            {/* Left / Right Manual Rotation Buttons (aligned flush to stage edges so outer left/right padding matches) */}
            <button
              type="button"
              onClick={() => rotateByStep(1)}
              aria-label="Rotate beers left"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#0E1016]/85 border border-white/15 hover:border-amber-400/60 hover:bg-amber-500/15 text-slate-200 hover:text-amber-300 backdrop-blur-md flex items-center justify-center shadow-xl transition-all duration-200 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              type="button"
              onClick={() => rotateByStep(-1)}
              aria-label="Rotate beers right"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#0E1016]/85 border border-white/15 hover:border-amber-400/60 hover:bg-amber-500/15 text-slate-200 hover:text-amber-300 backdrop-blur-md flex items-center justify-center shadow-xl transition-all duration-200 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Beer Info Popup Modal (Portal above fixed Navbar) ── */}
      {selectedBeer &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="beer-modal-title"
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setSelectedBeer(null)}
              aria-hidden="true"
            />

            {/* Minimal Modal Card: Image, Name & Short Description */}
            <div className="relative z-10 w-full max-w-lg sm:max-w-xl rounded-3xl bg-[#0D0F16] border border-white/15 shadow-2xl shadow-black/90 overflow-hidden">
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedBeer(null)}
                aria-label="Close beer details"
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-12 items-center">
                {/* Beer Image */}
                <div className="sm:col-span-5 flex items-center justify-center p-6 sm:p-7 bg-gradient-to-b from-[#151218] to-[#0B0C12] border-b sm:border-b-0 sm:border-r border-white/10">
                  <img
                    src={selectedBeer.image}
                    alt={`${selectedBeer.name} ${selectedBeer.subtitle}`}
                    className="h-48 sm:h-56 w-auto object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.85)]"
                  />
                </div>

                {/* Beer Name & Small Description */}
                <div className="sm:col-span-7 p-6 sm:p-7 text-center sm:text-left">
                  <h3
                    id="beer-modal-title"
                    className="font-heading text-2xl sm:text-3xl font-bold text-white leading-tight"
                  >
                    {selectedBeer.name}
                  </h3>
                  <div className="w-12 h-[2px] bg-gradient-to-r from-[#f5b82e] to-amber-500/20 mt-3 mb-4 mx-auto sm:mx-0 rounded-full" />
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {selectedBeer.description}
                  </p>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
};

export default BrewSection;
