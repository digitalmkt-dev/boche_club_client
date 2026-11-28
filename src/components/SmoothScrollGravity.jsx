import { useEffect } from 'react';

const GRAVITY_PROFILES = {
  // Lightly smoothed, near-native pace for normal content sections
  normal: { multiplier: 0.94, maxStep: 180, maxLead: 520, damping: 9.5 },
  // Subtle controlled glide for the horizontal Flavours card gallery
  medium: { multiplier: 0.82, maxStep: 135, maxLead: 380, damping: 8.5 },
  // Gentle gravity for frame-scrubbed & 3D sticky animation showcases
  heavy: { multiplier: 0.75, maxStep: 115, maxLead: 320, damping: 8.0 },
};

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function normalizeWheelDeltaY(e) {
  let dy = e.deltaY;
  if (e.deltaMode === 1) dy *= 32; // DOM_DELTA_LINE
  else if (e.deltaMode === 2) dy *= window.innerHeight; // DOM_DELTA_PAGE
  return dy;
}

function hasScrollableAncestor(target, deltaY) {
  let node = target;
  while (node && node !== document.body && node !== document.documentElement) {
    if (node instanceof HTMLElement) {
      const overflowY = window.getComputedStyle(node).overflowY;
      if (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') {
        const canScrollDown = deltaY > 0 && node.scrollTop + node.clientHeight < node.scrollHeight - 1;
        const canScrollUp = deltaY < 0 && node.scrollTop > 1;
        if (canScrollDown || canScrollUp) return true;
      }
    }
    node = node.parentElement;
  }
  return false;
}

function getActiveGravityProfile() {
  const vh = window.innerHeight;
  const zones = document.querySelectorAll('[data-scroll-gravity]');
  let best = 'normal';

  for (let i = 0; i < zones.length; i++) {
    const el = zones[i];
    const rect = el.getBoundingClientRect();
    // Engage gentle gravity once inside the pinned sticky animation zone
    const inZone = rect.top <= 40 && rect.bottom >= vh - 40;

    if (inZone) {
      const level = el.getAttribute('data-scroll-gravity');
      if (level === 'heavy') return GRAVITY_PROFILES.heavy;
      if (level === 'medium') best = 'medium';
    }
  }

  return GRAVITY_PROFILES[best] || GRAVITY_PROFILES.normal;
}

/**
 * Site-wide weighted smooth-scroll gravity controller for mouse wheel & trackpad.
 * - Softly compresses aggressive wheel flicks via tanh impulse damping + lead cap so users
 *   naturally explore scroll-driven animations without skipping past milestones.
 * - Leaves mobile touch, scrollbar dragging, keyboard navigation, modals, and anchor jumps
 *   100% native and immediately yields whenever external code updates window.scrollY.
 */
export const SmoothScrollGravity = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    let rafId = null;
    let lastTs = null;
    let currentY = window.scrollY;
    let targetY = window.scrollY;
    let lastAppliedY = window.scrollY;
    let activeDamping = GRAVITY_PROFILES.normal.damping;

    const restoreScrollBehavior = () => {
      if (document.documentElement.style.scrollBehavior === 'auto') {
        document.documentElement.style.scrollBehavior = '';
      }
    };

    const stopLoop = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      lastTs = null;
      restoreScrollBehavior();
    };

    const syncToNative = () => {
      stopLoop();
      const y = window.scrollY;
      currentY = y;
      targetY = y;
      lastAppliedY = y;
    };

    const applyScroll = (y) => {
      if (document.documentElement.style.scrollBehavior !== 'auto') {
        document.documentElement.style.scrollBehavior = 'auto';
      }
      window.scrollTo({ top: y, behavior: 'instant' });
      lastAppliedY = window.scrollY;
    };

    const tick = (ts) => {
      if (lastTs === null) lastTs = ts;
      const dt = clamp((ts - lastTs) / 1000, 0, 0.05);
      lastTs = ts;

      // Immediately yield if scrollbar drag, anchor link, keyboard, or section collapse moved scrollY
      if (Math.abs(window.scrollY - lastAppliedY) > 2) {
        syncToNative();
        return;
      }

      const maxScrollY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      targetY = clamp(targetY, 0, maxScrollY);

      const alpha = 1 - Math.exp(-dt * activeDamping);
      currentY += (targetY - currentY) * alpha;

      if (Math.abs(targetY - currentY) < 0.35) {
        currentY = targetY;
        applyScroll(currentY);
        stopLoop();
        return;
      }

      applyScroll(currentY);
      rafId = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (!rafId) {
        lastTs = null;
        rafId = requestAnimationFrame(tick);
      }
    };

    const onWheel = (e) => {
      // Respect browser pinch-zoom, already-gated events (e.g. BrewSection spin gate), and modal locks
      if (e.ctrlKey || e.metaKey) return;
      if (e.defaultPrevented) {
        // Prevent leftover forward momentum from pushing past an active downward gate
        if (e.deltaY > 0 && targetY > currentY) {
          targetY = currentY;
        }
        return;
      }
      if (document.body.style.overflow === 'hidden' || e.target?.closest?.('[role="dialog"]')) {
        return;
      }

      // Leave predominantly horizontal trackpad gestures untouched
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaY) < 4) return;

      const rawDeltaY = normalizeWheelDeltaY(e);
      if (Math.abs(rawDeltaY) < 0.1) return;
      if (hasScrollableAncestor(e.target, rawDeltaY)) return;

      const maxScrollY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

      // Keep current position synced if idle or if external scrolling occurred before this wheel tick
      if (!rafId || Math.abs(window.scrollY - lastAppliedY) > 2) {
        currentY = window.scrollY;
        targetY = window.scrollY;
        lastAppliedY = window.scrollY;
      }

      // Let native edge behavior stay intact when already parked at page top/bottom
      if (!rafId && ((currentY <= 0 && rawDeltaY < 0) || (currentY >= maxScrollY && rawDeltaY > 0))) {
        return;
      }

      e.preventDefault();

      const profile = getActiveGravityProfile();
      activeDamping = profile.damping;

      // Soft-knee tanh compression: gentle scrolls stay 1:1 smooth while rapid flicks feel weighted
      const scaled = rawDeltaY * profile.multiplier;
      const weightedDelta = profile.maxStep * Math.tanh(scaled / profile.maxStep);

      const nextTarget = targetY + weightedDelta;
      // Cap how far ahead targetY can run from currentY so rapid flicks never queue huge leaps
      targetY = clamp(
        nextTarget,
        Math.max(0, currentY - profile.maxLead),
        Math.min(maxScrollY, currentY + profile.maxLead)
      );

      startLoop();
    };

    // Yield immediately on native user controls (scrollbar drag, keyboard, touch, anchor clicks)
    const onNativeControl = () => {
      if (rafId) syncToNative();
    };

    const onKeyDown = (e) => {
      if (
        ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key) &&
        rafId
      ) {
        syncToNative();
      }
    };

    const onAnchorClick = (e) => {
      if (e.target?.closest?.('a[href^="#"]')) {
        syncToNative();
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onNativeControl, { passive: true });
    window.addEventListener('pointerdown', onNativeControl, { passive: true });
    window.addEventListener('keydown', onKeyDown, { passive: true });
    window.addEventListener('hashchange', syncToNative, { passive: true });
    window.addEventListener('smoothscroll:sync', syncToNative);
    document.addEventListener('click', onAnchorClick, true);

    return () => {
      stopLoop();
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onNativeControl);
      window.removeEventListener('pointerdown', onNativeControl);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('hashchange', syncToNative);
      window.removeEventListener('smoothscroll:sync', syncToNative);
      document.removeEventListener('click', onAnchorClick, true);
    };
  }, []);

  return null;
};

export default SmoothScrollGravity;

