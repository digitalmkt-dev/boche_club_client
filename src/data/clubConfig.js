/**
 * Configurable parameters for the Club Section
 * Tweak any of these to customize the disco ball, lasers, colors, or badge label
 */
export const CLUB_CONFIG = {
  liveBadgeText: 'LIVE DJ',
  ballSpeedDegPerSec: 40,
  ballCenter: { cx: 395, cy: 66, r: 22 },
  beams: [
    // [baseAngle°, sweepAmp°, speed, phase, color]
    { base: 155, amp: 12, speed: 0.7, phase: 0, color: '#ff1744' },
    { base: 135, amp: 14, speed: 1.0, phase: 1, color: '#f5b82e' },
    { base: 120, amp: 12, speed: 0.8, phase: 2, color: '#ff4d6d' },
    { base: 102, amp: 16, speed: 1.2, phase: 3, color: '#ff1744' },
    { base: 69, amp: 14, speed: 0.9, phase: 4, color: '#f5b82e' },
    { base: 44, amp: 12, speed: 1.1, phase: 5, color: '#ff4d6d' },
    { base: 23, amp: 14, speed: 0.75, phase: 6, color: '#ff1744' },
  ],
  equalizerColors: ['#ff1744', '#ff1744', '#f5b82e', '#ff4d6d', '#ff1744', '#ff4d6d', '#f5b82e', '#ff1744'],
  palette: ['#ff1744', '#ffd6dc', '#ff4d6d', '#f5b82e', '#e6eef5'],
};

