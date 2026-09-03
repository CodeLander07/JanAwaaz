/**
 * Map Visualization Utilities
 * 
 * Color scales, formatting helpers, and category mappings
 * for the H3HotspotMap component.
 */

import type { ComplaintCategory, ColorMetricKey } from '@/types/h3';

// ─── Color Scale (5-stop gradient: green → yellow → orange → red) ────────────

type RGBA = [number, number, number, number];

const COLOR_STOPS: { t: number; color: RGBA }[] = [
  { t: 0.0, color: [16, 185, 129, 180] },   // Emerald green
  { t: 0.25, color: [132, 204, 22, 200] },   // Lime
  { t: 0.5, color: [250, 204, 21, 220] },    // Amber
  { t: 0.75, color: [249, 115, 22, 235] },   // Orange
  { t: 1.0, color: [239, 68, 68, 255] },     // Red
];

/** DPI-covered hex overlay tint (blue shift) */
const DPI_TINT: RGBA = [56, 189, 248, 200]; // Sky-400

/**
 * Interpolate a color from the priority gradient for a value in [0, 1].
 */
export function getColorForValue(value: number, isDPI = false): RGBA {
  const v = Math.max(0, Math.min(1, value));

  if (isDPI) {
    // Blend the base color with a blue tint for DPI-covered cells
    const base = interpolateColor(v);
    return [
      Math.round(base[0] * 0.5 + DPI_TINT[0] * 0.5),
      Math.round(base[1] * 0.5 + DPI_TINT[1] * 0.5),
      Math.round(base[2] * 0.5 + DPI_TINT[2] * 0.5),
      Math.round(base[3] * 0.7 + DPI_TINT[3] * 0.3),
    ];
  }

  return interpolateColor(v);
}

function interpolateColor(t: number): RGBA {
  // Find the two stops to interpolate between
  for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
    const s0 = COLOR_STOPS[i];
    const s1 = COLOR_STOPS[i + 1];
    if (t >= s0.t && t <= s1.t) {
      const localT = (t - s0.t) / (s1.t - s0.t);
      return [
        Math.round(s0.color[0] + (s1.color[0] - s0.color[0]) * localT),
        Math.round(s0.color[1] + (s1.color[1] - s0.color[1]) * localT),
        Math.round(s0.color[2] + (s1.color[2] - s0.color[2]) * localT),
        Math.round(s0.color[3] + (s1.color[3] - s0.color[3]) * localT),
      ];
    }
  }
  return COLOR_STOPS[COLOR_STOPS.length - 1].color;
}

/**
 * Generate a CSS linear-gradient string for the legend bar.
 */
export function getLegendGradientCSS(): string {
  const colors = COLOR_STOPS.map(
    (s) => `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, ${s.color[3] / 255})`
  );
  return `linear-gradient(to right, ${colors.join(', ')})`;
}

// ─── Category Helpers ────────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<ComplaintCategory, string> = {
  Water: '💧',
  Transport: '🚌',
  Healthcare: '🏥',
  Energy: '⚡',
  Sanitation: '🚽',
};

const CATEGORY_COLORS: Record<ComplaintCategory, string> = {
  Water: '#38bdf8',
  Transport: '#a78bfa',
  Healthcare: '#f472b6',
  Energy: '#fbbf24',
  Sanitation: '#34d399',
};

export function getCategoryIcon(category: ComplaintCategory): string {
  return CATEGORY_ICONS[category] ?? '📋';
}

export function getCategoryColor(category: ComplaintCategory): string {
  return CATEGORY_COLORS[category] ?? '#94a3b8';
}

// ─── Formatting ──────────────────────────────────────────────────────────────

/** Format a 0-1 score as a percentage string */
export function formatScore(score: number): string {
  return `${(score * 100).toFixed(1)}%`;
}

/** Format a large number with commas */
export function formatCount(count: number): string {
  return count.toLocaleString('en-IN');
}

/** Human-readable label for each metric key */
export const METRIC_LABELS: Record<ColorMetricKey, string> = {
  compositePriority: 'Composite Priority',
  demandScore: 'Demand Score',
  deficitScore: 'Deficit Score',
};
