'use client';

/**
 * DemoTeaser — Live Hotspot Map Preview
 *
 * Abstract CSS hex grid teaser with mock layer toggles.
 * CTA banner directing to the live dashboard at /dashboard.
 */

import { useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Map, Box, Layers } from 'lucide-react';

// ─── Hex Grid Data ───────────────────────────────────────────────────────────

// Seeded RNG for deterministic hex intensities
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface HexCell {
  id: number;
  row: number;
  col: number;
  demand: number;
  vulnerability: number;
}

function generateHexGrid(): HexCell[] {
  const rng = mulberry32(88);
  const cells: HexCell[] = [];
  const ROWS = 8;
  const COLS = 12;

  for (let row = 0; row < ROWS; row++) {
    const colsInRow = row % 2 === 0 ? COLS : COLS - 1;
    for (let col = 0; col < colsInRow; col++) {
      cells.push({
        id: row * COLS + col,
        row,
        col,
        demand: rng(),
        vulnerability: rng(),
      });
    }
  }
  return cells;
}

// ─── Component ───────────────────────────────────────────────────────────────

type LayerMode = 'demand' | 'vulnerability';
type ViewMode = '2D' | '3D';

export default function DemoTeaser() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const [layerMode, setLayerMode] = useState<LayerMode>('demand');
  const [viewMode, setViewMode] = useState<ViewMode>('3D');

  const hexCells = useMemo(() => generateHexGrid(), []);

  return (
    <section
      id="demo"
      className="border-t border-neutral-200 dark:border-neutral-800"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <span className="font-mono text-xs tracking-[0.2em] text-neutral-400 dark:text-neutral-600">
            LIVE PREVIEW
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white">
            Explore the spatial
            <br />
            <span className="text-neutral-400 dark:text-neutral-600">decision engine.</span>
          </h2>
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Map Preview Container */}
          <div className="relative rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 overflow-hidden">
            {/* Controls Bar */}
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-4 py-3">
              <div className="flex items-center gap-2">
                <Map className="h-4 w-4 text-neutral-400" />
                <span className="font-mono text-[10px] tracking-wider text-neutral-400 dark:text-neutral-600">
                  H3 HEXAGON LAYER — DELHI NCR
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* View Toggle */}
                <div className="flex rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                  {(['2D', '3D'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono transition-colors ${
                        viewMode === mode
                          ? 'bg-black dark:bg-white text-white dark:text-black'
                          : 'text-neutral-500 hover:text-black dark:hover:text-white'
                      }`}
                    >
                      {mode === '3D' ? <Box className="h-3 w-3" /> : <Map className="h-3 w-3" />}
                      {mode}
                    </button>
                  ))}
                </div>

                {/* Layer Toggle */}
                <div className="flex rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                  {([
                    { key: 'demand' as const, label: 'Demand' },
                    { key: 'vulnerability' as const, label: 'Vulnerability' },
                  ]).map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setLayerMode(key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono transition-colors ${
                        layerMode === key
                          ? 'bg-black dark:bg-white text-white dark:text-black'
                          : 'text-neutral-500 hover:text-black dark:hover:text-white'
                      }`}
                    >
                      <Layers className="h-3 w-3" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Hex Grid Visualization */}
            <div className="relative p-8 min-h-[320px] sm:min-h-[400px] flex items-center justify-center overflow-hidden">
              {/* Subtle grid background */}
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />

              <div
                className="relative"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(12, 1fr)',
                  gap: '3px',
                  maxWidth: '600px',
                  width: '100%',
                  transform: viewMode === '3D' ? 'perspective(800px) rotateX(35deg) rotateZ(-5deg) scale(0.9)' : 'none',
                  transition: 'transform 0.6s ease',
                }}
              >
                {hexCells.map((cell) => {
                  const intensity = layerMode === 'demand' ? cell.demand : cell.vulnerability;
                  const opacity = 0.1 + intensity * 0.85;

                  return (
                    <motion.div
                      key={cell.id}
                      animate={{ opacity }}
                      transition={{ duration: 0.5 }}
                      className="aspect-square rounded-sm bg-black dark:bg-white"
                      style={{
                        gridColumn: cell.row % 2 !== 0 ? `${cell.col + 1} / span 1` : undefined,
                        marginLeft: cell.row % 2 !== 0 ? '50%' : '0',
                        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                        boxShadow: viewMode === '3D' ? `0 ${Math.round(intensity * 20)}px ${Math.round(intensity * 8)}px rgba(0,0,0,0.2)` : 'none',
                      }}
                      title={`${layerMode}: ${(intensity * 100).toFixed(0)}%`}
                    />
                  );
                })}
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 flex items-center gap-3">
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-neutral-400 dark:text-neutral-600">
                  <div className="w-3 h-3 rounded-sm bg-black dark:bg-white opacity-10" />
                  Low
                </div>
                <div className="w-16 h-1.5 rounded-full bg-gradient-to-r from-neutral-200 dark:from-neutral-800 to-black dark:to-white" />
                <div className="font-mono text-[10px] text-neutral-400 dark:text-neutral-600">
                  High
                </div>
              </div>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="mt-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-black dark:text-white">
                Ready to explore the full interactive map?
              </h3>
              <p className="mt-1 text-sm text-neutral-500">
                Navigate the live Deck.gl 3D hexagonal visualization with real-time data layers.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="group flex items-center gap-2 rounded-full bg-black dark:bg-white text-white dark:text-black px-8 py-3.5 text-sm font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors whitespace-nowrap"
            >
              Launch Dashboard
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
