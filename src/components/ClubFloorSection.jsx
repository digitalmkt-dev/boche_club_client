import React, { useEffect, useRef, useState } from 'react';
import { Music } from 'lucide-react';

const TOTAL_FRAMES = 283;
const LANDSCAPE_FRAME_BASE = '/images/club_vibe-ezgif-split/ezgif-frame-';
const PORTRAIT_FRAME_BASE = '/images/club_vibe_portrait-ezgif-split/ezgif-frame-';
const FRAME_EXT = 'webp';

function isPortraitViewport() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || window.innerHeight > window.innerWidth;
}

function getFrameUrl(frameNumber, portrait = false, ext = FRAME_EXT) {
  const base = portrait ? PORTRAIT_FRAME_BASE : LANDSCAPE_FRAME_BASE;
  return `${base}${String(frameNumber).padStart(3, '0')}.${ext}`;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

/**
 * 5 choreographed text beats synced to the exact club dance-floor video milestones:
 * - Start (Frame 1)
 * - Frame 70  (Blazing red LED ceiling canopy reveal)
 * - Frame 128 (Neon magenta/cyan fog & atmosphere)
 * - Frame 179 (Glowing 3D infinity-mirror LED dance floor)
 * - Frame 230 (Pioneer DJ booth overlooking the dance floor)
 */
const TEXT_CUES = [
  {
    id: 'start',
    eyebrow: 'The Club • Boche Bangalore',
    title: 'Step Into',
    highlight: 'The Night',
    subtitle: 'When the lights drop low on Brigade Road, the dance floor awakens.',
    inStart: 1,
    inEnd: 1,
    outStart: 54,
    outEnd: 67,
    positionClass: 'items-center justify-center text-center',
    blockClass: 'items-center max-w-3xl',
    accent: '#ff1744',
  },
  {
    id: 'frame-70',
    eyebrow: 'Kinetic Light Canopy',
    title: 'Electric',
    highlight: 'Atmosphere',
    subtitle: 'Custom crimson ceiling rigs and sweeping lasers pulsing in lockstep with every beat.',
    inStart: 70,
    inEnd: 82,
    outStart: 113,
    outEnd: 125,
    positionClass: 'items-end justify-start text-left pb-16 sm:pb-20 lg:pb-24',
    blockClass: 'items-start max-w-xl',
    accent: '#ff1744',
  },
  {
    id: 'frame-128',
    eyebrow: 'Midnight Sensory Haze',
    title: 'Lost In',
    highlight: 'Neon Energy',
    subtitle: 'Waves of atmospheric haze, vivid colour washes, and pure late-night club momentum.',
    inStart: 128,
    inEnd: 140,
    outStart: 165,
    outEnd: 176,
    positionClass: 'items-end justify-end text-left sm:text-right pb-16 sm:pb-20 lg:pb-24',
    blockClass: 'items-start sm:items-end max-w-xl',
    accent: '#f472b6',
  },
  {
    id: 'frame-179',
    eyebrow: 'The Dance Floor',
    title: 'Infinity',
    highlight: 'LED Floor',
    subtitle: 'A luminous mirror-depth dance floor engineered to keep the crowd moving till closing.',
    inStart: 179,
    inEnd: 191,
    outStart: 215,
    outEnd: 227,
    positionClass: 'items-start justify-start text-left pt-24 sm:pt-28 lg:pt-32',
    blockClass: 'items-start max-w-xl',
    accent: '#ff1744',
  },
  {
    id: 'frame-230',
    eyebrow: 'Headline Sound Booth',
    title: 'Resident &',
    highlight: 'Guest DJs',
    subtitle: 'Concert-grade acoustics and relentless sets spinning live from the heart of the booth.',
    inStart: 230,
    inEnd: 244,
    outStart: 295, // Stays crisply on screen through the final frame (283)
    outEnd: 300,
    positionClass: 'items-start justify-center text-center pt-24 sm:pt-28 lg:pt-32',
    blockClass: 'items-center max-w-2xl',
    accent: '#f5b82e',
  },
];

const CHAPTER_MARKERS = [1, 70, 128, 179, 230];

export const ClubFloorSection = () => {
  const runwayRef = useRef(null);
  const canvasRef = useRef(null);
  const cueRefs = useRef([]);
  const progressBarRef = useRef(null);
  const markerRefs = useRef([]);
  const [isPortrait, setIsPortrait] = useState(isPortraitViewport);

  // Switch between portrait (mobile/vertical) and landscape (desktop) frame sets on resize/orientation change
  useEffect(() => {
    const onResize = () => {
      setIsPortrait(isPortraitViewport());
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const runway = runwayRef.current;
    const canvas = canvasRef.current;
    if (!runway || !canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let rafId = null;
    let lastTs = null;
    let disposed = false;

    const frames = new Array(TOTAL_FRAMES); // 0-indexed decoded HTMLImageElements
    const requested = new Uint8Array(TOTAL_FRAMES); // 1 once fetch kicked off

    const state = {
      currentFrame: 1,
      lastDrawnIdx: -1,
      canvasW: 0,
      canvasH: 0,
      maxScroll: 1,
      inView: true,
    };

    const drawCover = (img) => {
      const cw = state.canvasW || canvas.width;
      const ch = state.canvasH || canvas.height;
      if (!cw || !ch || !img || !img.naturalWidth || !img.naturalHeight) return false;

      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = cw / ch;
      let drawW = cw;
      let drawH = ch;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasRatio > imgRatio) {
        drawW = cw;
        drawH = cw / imgRatio;
        offsetY = (ch - drawH) * 0.5;
      } else {
        drawH = ch;
        drawW = ch * imgRatio;
        offsetX = (cw - drawW) * 0.5;
      }

      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
      return true;
    };

    const findNearestLoaded = (targetIdx) => {
      if (frames[targetIdx]) return targetIdx;
      for (let delta = 1; delta < TOTAL_FRAMES; delta++) {
        const prev = targetIdx - delta;
        if (prev >= 0 && frames[prev]) return prev;
        const next = targetIdx + delta;
        if (next < TOTAL_FRAMES && frames[next]) return next;
      }
      return -1;
    };

    // Load and fully decode a single frame before making it available to canvas
    const loadSingleFrame = (idx, onDone) => {
      if (disposed || idx < 0 || idx >= TOTAL_FRAMES) {
        if (onDone) onDone();
        return;
      }
      if (frames[idx] || requested[idx]) {
        if (onDone) onDone();
        return;
      }
      requested[idx] = 1;

      const img = new Image();
      const finish = () => {
        if (disposed) return;
        if (img.naturalWidth > 0) {
          frames[idx] = img;
          const desiredIdx = clamp(Math.round(state.currentFrame) - 1, 0, TOTAL_FRAMES - 1);
          if (idx === desiredIdx || state.lastDrawnIdx === -1) {
            if (drawCover(img)) {
              state.lastDrawnIdx = idx;
            }
          }
        }
        if (onDone) onDone();
      };

      img.onload = () => {
        if (typeof img.decode === 'function') {
          img.decode().then(finish).catch(finish);
        } else {
          finish();
        }
      };
      img.onerror = () => {
        if (onDone) onDone();
      };
      img.src = getFrameUrl(idx + 1, isPortrait, FRAME_EXT);
    };

    const measure = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = canvas.clientWidth || window.innerWidth;
      const cssH = canvas.clientHeight || window.innerHeight;
      const targetW = Math.round(cssW * dpr);
      const targetH = Math.round(cssH * dpr);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
        state.lastDrawnIdx = -1;
      }
      state.canvasW = canvas.width;
      state.canvasH = canvas.height;
      state.maxScroll = Math.max(1, runway.offsetHeight - window.innerHeight);

      const nearest = findNearestLoaded(
        clamp(Math.round(state.currentFrame) - 1, 0, TOTAL_FRAMES - 1)
      );
      if (nearest >= 0 && drawCover(frames[nearest])) {
        state.lastDrawnIdx = nearest;
      }
    };

    // Build prioritized preload queue: milestones + 6-frame skeleton + all remaining frames
    const loadQueue = [];
    const queued = new Uint8Array(TOTAL_FRAMES);
    const enqueue = (frameNum) => {
      const idx = frameNum - 1;
      if (idx < 0 || idx >= TOTAL_FRAMES || queued[idx]) return;
      queued[idx] = 1;
      loadQueue.push(idx);
    };

    [10, 1, 70, 128, 179, 230, TOTAL_FRAMES].forEach(enqueue);
    for (let f = 1; f <= TOTAL_FRAMES; f += 6) enqueue(f);
    for (let f = 1; f <= TOTAL_FRAMES; f++) enqueue(f);

    let queueCursor = 0;
    const pump = () => {
      if (disposed) return;
      while (queueCursor < loadQueue.length) {
        const idx = loadQueue[queueCursor++];
        if (!requested[idx]) {
          loadSingleFrame(idx, pump);
          return;
        }
      }
    };

    const updateTextCues = (frame) => {
      for (let i = 0; i < TEXT_CUES.length; i++) {
        const el = cueRefs.current[i];
        if (!el) continue;

        const cue = TEXT_CUES[i];
        let opacity = 0;
        let translateY = 32;
        let scale = 0.96;

        if (frame >= cue.inStart && frame <= cue.outEnd) {
          const inT =
            cue.inEnd <= cue.inStart
              ? 1
              : smoothstep(clamp((frame - cue.inStart) / (cue.inEnd - cue.inStart), 0, 1));
          const outT =
            frame <= cue.outStart
              ? 0
              : smoothstep(clamp((frame - cue.outStart) / (cue.outEnd - cue.outStart), 0, 1));
          const holdSpan = Math.max(1, cue.outStart - cue.inEnd);
          const holdT = clamp((frame - cue.inEnd) / holdSpan, 0, 1);

          opacity = inT * (1 - outT);
          translateY = (1 - inT) * 32 - holdT * 8 - outT * 26;
          scale = 0.96 + inT * 0.04 - outT * 0.02;
        }

        el.style.opacity = opacity.toFixed(3);
        el.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
        el.style.visibility = opacity > 0.005 ? 'visible' : 'hidden';
      }

      for (let i = 0; i < CHAPTER_MARKERS.length; i++) {
        const dot = markerRefs.current[i];
        if (!dot) continue;
        const active = frame >= CHAPTER_MARKERS[i];
        dot.style.opacity = active ? '1' : '0.3';
        dot.style.transform = active ? 'scale(1.25)' : 'scale(1)';
      }
    };

    const renderFrame = (ts) => {
      if (lastTs === null) lastTs = ts;
      const dt = clamp((ts - lastTs) / 1000, 0, 0.05);
      lastTs = ts;

      const rect = runway.getBoundingClientRect();
      const rawProgress = clamp(-rect.top / state.maxScroll, 0, 1);
      const targetFrame = 1 + rawProgress * (TOTAL_FRAMES - 1);

      // Frame-rate-independent damping for silky 60/120fps scrubbing
      const alpha = 1 - Math.exp(-dt * 9.5);
      state.currentFrame += (targetFrame - state.currentFrame) * alpha;
      if (Math.abs(targetFrame - state.currentFrame) < 0.04) {
        state.currentFrame = targetFrame;
      }

      const desiredIdx = clamp(Math.round(state.currentFrame) - 1, 0, TOTAL_FRAMES - 1);
      // Prioritize loading the exact frame under the user's scroll immediately if not yet loaded
      if (!frames[desiredIdx] && !requested[desiredIdx]) {
        loadSingleFrame(desiredIdx);
      }

      const drawIdx = findNearestLoaded(desiredIdx);
      if (drawIdx >= 0 && drawIdx !== state.lastDrawnIdx) {
        if (drawCover(frames[drawIdx])) {
          state.lastDrawnIdx = drawIdx;
        }
      }

      updateTextCues(state.currentFrame);

      if (progressBarRef.current) {
        const p = clamp((state.currentFrame - 1) / (TOTAL_FRAMES - 1), 0, 1);
        progressBarRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
      }

      if (state.inView) {
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

    // Sync initial frame with current scroll position immediately on mount
    measure();
    const initRect = runway.getBoundingClientRect();
    const initP = clamp(-initRect.top / state.maxScroll, 0, 1);
    state.currentFrame = 1 + initP * (TOTAL_FRAMES - 1);
    updateTextCues(state.currentFrame);

    // Kick off prioritized WebP frame streaming immediately on mount (8 parallel workers)
    for (let w = 0; w < 8; w++) {
      pump();
    }

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    if (ro) {
      ro.observe(runway);
      ro.observe(canvas);
    }
    window.addEventListener('resize', measure, { passive: true });

    // Passive scroll wake-up guarantees rendering never stalls even on sudden anchor jumps
    const onScroll = () => {
      const rect = runway.getBoundingClientRect();
      const nearView = rect.bottom > -300 && rect.top < window.innerHeight + 300;
      if (nearView) {
        state.inView = true;
        startLoop();
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const viewIo = new IntersectionObserver(
      (entries) => {
        const latest = entries[entries.length - 1];
        state.inView = latest.isIntersecting;
        if (latest.isIntersecting) {
          measure();
          startLoop();
        } else {
          stopLoop();
        }
      },
      { rootMargin: '300px 0px' }
    );
    viewIo.observe(runway);

    startLoop();

    return () => {
      disposed = true;
      stopLoop();
      viewIo.disconnect();
      if (ro) ro.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', onScroll);
    };
  }, [isPortrait]);

  return (
    <section
      ref={runwayRef}
      id="club"
      data-scroll-gravity="heavy"
      aria-label="The Club Dance Floor Experience at Boche Club Bangalore"
      className="relative w-full h-[560vh] sm:h-[640vh] bg-[#08090C] text-white scroll-mt-0"
    >
      {/* Full-Width Full-Viewport Sticky Canvas Stage */}
      <div className="sticky top-0 h-[100dvh] sm:h-screen w-full overflow-hidden bg-black select-none">
        {/* Static WebP Poster Fallback beneath Canvas so Stage Is Never Blank */}
        <img
          src={getFrameUrl(10, isPortrait)}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
          draggable={false}
        />

        {/* Scroll-Driven HD Video Frame Canvas */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full block"
        />

        {/* Subtle Cinematic Edge Vignette for Crisp Typography Contrast Over Bright Haze Frames */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse 85% 75% at 50% 50%, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.52) 100%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/75 via-black/30 to-transparent"
          aria-hidden="true"
        />

        {/* 5 Milestone Animated Text Overlays (Start, Frame 70, 128, 179, 230) */}
        <div className="pointer-events-none absolute inset-0 z-10 max-w-[1640px] mx-auto w-full px-5 sm:px-8 lg:px-12 xl:px-16">
          {TEXT_CUES.map((cue, idx) => (
            <div
              key={cue.id}
              className={`absolute inset-0 px-5 sm:px-8 lg:px-12 xl:px-16 flex ${cue.positionClass}`}
            >
              <div
                ref={(el) => {
                  cueRefs.current[idx] = el;
                }}
                className={`flex flex-col ${cue.blockClass} will-change-transform`}
                style={{
                  opacity: idx === 0 ? 1 : 0,
                  visibility: idx === 0 ? 'visible' : 'hidden',
                  transform: 'translate3d(0, 0px, 0) scale(1)',
                }}
              >
                <div
                  className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/55 backdrop-blur-md text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase border mb-3 sm:mb-4"
                  style={{
                    color: cue.accent === '#f5b82e' ? '#fcd34d' : '#fda4af',
                    borderColor: `${cue.accent}66`,
                  }}
                >
                  <Music className="w-3.5 h-3.5" style={{ color: cue.accent }} />
                  <span>{cue.eyebrow}</span>
                </div>

                <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.06] text-white drop-shadow-[0_6px_28px_rgba(0,0,0,0.85)]">
                  {cue.title}{' '}
                  <span style={{ color: cue.accent }}>{cue.highlight}</span>
                </h2>

                <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed max-w-lg drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)]">
                  {cue.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Minimal Bottom Scroll Timeline & 5 Chapter Markers */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-5 sm:bottom-7 z-20 max-w-[1640px] mx-auto w-full px-5 sm:px-8 lg:px-12 xl:px-16"
          aria-hidden="true"
        >
          <div className="relative h-[2px] w-full bg-white/15 rounded-full overflow-visible">
            <div
              ref={progressBarRef}
              className="h-full w-full origin-left rounded-full bg-gradient-to-r from-[#ff1744] via-[#f5b82e] to-[#ff1744]"
              style={{ transform: 'scaleX(0)' }}
            />
            {CHAPTER_MARKERS.map((frameNum, idx) => {
              const pct = ((frameNum - 1) / (TOTAL_FRAMES - 1)) * 100;
              return (
                <span
                  key={`marker-${frameNum}`}
                  ref={(el) => {
                    markerRefs.current[idx] = el;
                  }}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.85)] transition-all duration-300"
                  style={{
                    left: `${pct.toFixed(2)}%`,
                    opacity: idx === 0 ? 1 : 0.3,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClubFloorSection;
