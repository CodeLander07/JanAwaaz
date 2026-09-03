/**
 * Mock H3 Data Generator
 *
 * Generates ~200 realistic H3 hexagonal cells centered on Delhi NCR
 * for development and demo purposes. Uses h3-js for valid H3 indexes.
 */

import { latLngToCell, gridDisk } from 'h3-js';
import type { H3HexData, ComplaintCategory } from '@/types/h3';

// ─── Seeded PRNG (Mulberry32) for deterministic data ─────────────────────────

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DELHI_CENTER = { lat: 28.6139, lng: 77.209 };
const H3_RESOLUTION = 8;
const GRID_RING_K = 7; // ~150-170 cells in a k=7 disk

const CATEGORIES: ComplaintCategory[] = [
  'Water',
  'Transport',
  'Healthcare',
  'Energy',
  'Sanitation',
];

const DISTRICTS = [
  'Central Delhi',
  'New Delhi',
  'South Delhi',
  'North Delhi',
  'East Delhi',
  'West Delhi',
  'North East Delhi',
  'North West Delhi',
  'South West Delhi',
  'South East Delhi',
  'Shahdara',
];

// ─── Generator ───────────────────────────────────────────────────────────────

/**
 * Generate mock H3HexData[] centered on Delhi.
 * @param seed - Random seed for reproducibility (default: 42)
 */
export function generateMockH3Data(seed = 42): H3HexData[] {
  const rng = mulberry32(seed);

  // Get the center H3 cell and expand outward
  const centerCell = latLngToCell(DELHI_CENTER.lat, DELHI_CENTER.lng, H3_RESOLUTION);
  const hexIndexes = gridDisk(centerCell, GRID_RING_K);

  return hexIndexes.map((h3Index) => {
    // Create spatially correlated scores (cells near center tend to be hotter)
    const baseDemand = rng();
    const baseVulnerability = rng();
    const baseDeficit = rng();

    // Add some spatial bias — not all cells are equal
    const demandScore = clamp(baseDemand * 0.7 + rng() * 0.3);
    const vulnerabilityScore = clamp(baseVulnerability * 0.6 + rng() * 0.4);
    const deficitScore = clamp(baseDeficit * 0.65 + rng() * 0.35);

    // Weighted composite: 40% demand, 30% vulnerability, 30% deficit
    const compositePriority = clamp(
      demandScore * 0.4 + vulnerabilityScore * 0.3 + deficitScore * 0.3
    );

    const complaintCount = Math.floor(rng() * 450 + 10);
    const topCategory = CATEGORIES[Math.floor(rng() * CATEGORIES.length)];
    const isCoveredByDPI = rng() > 0.75; // ~25% have active projects
    const districtName = DISTRICTS[Math.floor(rng() * DISTRICTS.length)];

    return {
      h3Index,
      demandScore: round3(demandScore),
      vulnerabilityScore: round3(vulnerabilityScore),
      deficitScore: round3(deficitScore),
      compositePriority: round3(compositePriority),
      complaintCount,
      topCategory,
      isCoveredByDPI,
      districtName,
    };
  });
}

function clamp(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function round3(v: number): number {
  return Math.round(v * 1000) / 1000;
}

/** Pre-generated default dataset for immediate use */
export const MOCK_H3_DATA: H3HexData[] = generateMockH3Data(42);
