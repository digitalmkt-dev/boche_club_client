import React, { useEffect, useRef } from 'react';
import { Utensils, Calendar, ArrowRight } from 'lucide-react';

const TOTAL_FRAMES = 53;
const FRAME_BASE_PATH = '/images/food-ezgif-split/ezgif-frame-';
const FRAME_EXT = 'webp';

function getFrameUrl(frameNumber) {
  return `${FRAME_BASE_PATH}${String(frameNumber).padStart(3, '0')}.${FRAME_EXT}`;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

export const FineDiningSection = () => {
  const runwayRef = useRef(null);
  const canvasRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    const runway = runwayRef.current;
    const canvas = canvasRef.current;
    if (!runway || !canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let rafId = null;
    let lastTs = null;
    let disposed = false;

    const frames = new Array(TOTAL_FRAMES);
    const requested = new Uint8Array(TOTAL_FRAMES);

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
      img.src = getFrameUrl(idx + 1);
    };

    const measure = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = canvas.clientWidth || 360;
      const cssH = canvas.clientHeight || 640;
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

    // Prioritize key frames first, then fill all 53 WebP frames quickly (~3.2 MB total)
    const loadQueue = [];
    const queued = new Uint8Array(TOTAL_FRAMES);
    const enqueue = (frameNum) => {
      const idx = frameNum - 1;
      if (idx < 0 || idx >= TOTAL_FRAMES || queued[idx]) return;
      queued[idx] = 1;
      loadQueue.push(idx);
    };

    [1, 18, 36, TOTAL_FRAMES].forEach(enqueue);
    for (let f = 1; f <= TOTAL_FRAMES; f += 4) enqueue(f);
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

    const renderFrame = (ts) => {
      if (lastTs === null) lastTs = ts;
      const dt = clamp((ts - lastTs) / 1000, 0, 0.05);
      lastTs = ts;

      const rect = runway.getBoundingClientRect();
      const rawProgress = clamp(-rect.top / state.maxScroll, 0, 1);
      const targetFrame = 1 + rawProgress * (TOTAL_FRAMES - 1);

      const alpha = 1 - Math.exp(-dt * 9.5);
      state.currentFrame += (targetFrame - state.currentFrame) * alpha;
      if (Math.abs(targetFrame - state.currentFrame) < 0.03) {
        state.currentFrame = targetFrame;
      }

      const desiredIdx = clamp(Math.round(state.currentFrame) - 1, 0, TOTAL_FRAMES - 1);
      if (!frames[desiredIdx] && !requested[desiredIdx]) {
        loadSingleFrame(desiredIdx);
      }

      const drawIdx = findNearestLoaded(desiredIdx);
      if (drawIdx >= 0 && drawIdx !== state.lastDrawnIdx) {
        if (drawCover(frames[drawIdx])) {
          state.lastDrawnIdx = drawIdx;
        }
      }

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

    measure();
    const initRect = runway.getBoundingClientRect();
    const initP = clamp(-initRect.top / state.maxScroll, 0, 1);
    state.currentFrame = 1 + initP * (TOTAL_FRAMES - 1);

    for (let w = 0; w < 6; w++) {
      pump();
    }

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    if (ro) {
      ro.observe(runway);
      ro.observe(canvas);
    }
    window.addEventListener('resize', measure, { passive: true });

    const onScroll = () => {
      const rect = runway.getBoundingClientRect();
      if (rect.bottom > -300 && rect.top < window.innerHeight + 300) {
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
  }, []);

  return (
    <section
      ref={runwayRef}
      id="fine-dining"
      data-scroll-gravity="heavy"
      aria-label="Fine Dining Table Experience at Boche Club Bangalore"
      className="relative w-full h-[280vh] sm:h-[320vh] bg-[#08090C] text-white scroll-mt-0"
    >
      {/* Native GPU-composited Sticky Stage */}
      <div className="sticky top-0 h-[100dvh] sm:h-screen w-full overflow-hidden flex flex-col justify-center pt-20 sm:pt-24 pb-5 sm:pb-8 select-none">
        {/* Full-Bleed Warm Culinary Dark Gradient Background */}
        <div
          className="absolute inset-0 pointer-events-none select-none"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse 68% 58% at 72% 50%, rgba(245, 184, 46, 0.10) 0%, transparent 65%), radial-gradient(ellipse 60% 55% at 22% 40%, rgba(160, 44, 58, 0.11) 0%, transparent 68%), linear-gradient(135deg, #121014 0%, #191412 50%, #0E0D11 100%)',
          }}
        />

        {/* Tightly Paired Editorial Composition: Text Left + Portrait Reel Right (Stacked on Mobile) */}
        <div className="relative z-10 max-w-6xl mx-auto w-full px-5 sm:px-8 lg:px-12 h-full flex flex-col md:flex-row items-center justify-center gap-5 md:gap-12 lg:gap-16 xl:gap-20">
          {/* ── LEFT: Fine Dining Story & Reserve CTA ── */}
          <div className="w-full md:flex-1 max-w-xl flex flex-col items-center md:items-start text-center md:text-left justify-center shrink-0">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] text-[#f5b82e] text-[10px] sm:text-xs font-bold tracking-widest uppercase border border-amber-400/30 mb-3 sm:mb-4">
              <Utensils className="w-3.5 h-3.5 text-amber-400" />
              <span>Fine Dining • Boche Kitchen</span>
            </div>

            <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl xl:text-[3.4rem] font-bold tracking-tight leading-[1.1] text-white">
              A Feast Unfolds{' '}
              <span className="text-[#f5b82e] sm:block">At Your Table</span>
            </h2>

            <div className="w-[80px] h-[2px] bg-gradient-to-r from-[#f5b82e] to-amber-500/20 mt-3.5 mb-3.5 sm:mt-5 sm:mb-6 rounded-full" />

            <p className="text-xs sm:text-base lg:text-lg text-slate-300 leading-relaxed">
              Indulge in a chef-curated dining experience where vibrant flavours, thoughtfully plated dishes, and handcrafted drinks come together for an unforgettable evening.
            </p>

            <p className="hidden md:block text-sm lg:text-base text-slate-400 leading-relaxed mt-4">
              From inviting starters to abundant sharing spreads, every dish is prepared fresh to order—crafted for unhurried dinners, celebrations, and great company.
            </p>

            <div className="hidden sm:flex items-center mt-6 lg:mt-8">
              <a
                href="#reservations"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25 transition-all duration-200 hover:-translate-y-0.5"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve Your Table</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* ── RIGHT: Portrait 9:16 Scroll-Driven Reel Card ── */}
          <div className="flex-1 md:flex-none min-h-0 flex items-center justify-center shrink-0">
            <div className="relative h-full max-h-[52vh] sm:max-h-[60vh] md:h-[74vh] lg:h-[78vh] md:max-h-[760px] aspect-[9/16] rounded-3xl overflow-hidden bg-[#0E0D11] border border-amber-400/25 shadow-[0_24px_70px_rgba(0,0,0,0.85)]">
              {/* Static Poster Fallback beneath Canvas */}
              <img
                src={getFrameUrl(1)}
                alt="Fine dining spread unfolding at Boche Club Bangalore"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                draggable={false}
              />

              {/* Scroll-Scrubbed 9:16 Portrait Canvas */}
              <canvas
                ref={canvasRef}
                aria-hidden="true"
                className="absolute inset-0 w-full h-full block"
              />

              {/* Subtle Bottom Scrim + Progress Line inside Portrait Frame */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute inset-x-4 bottom-4 h-[2px] rounded-full bg-white/20 overflow-hidden"
                aria-hidden="true"
              >
                <div
                  ref={progressBarRef}
                  className="h-full w-full origin-left bg-gradient-to-r from-[#f5b82e] via-amber-300 to-[#ff1744]"
                  style={{ transform: 'scaleX(0)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FineDiningSection;
