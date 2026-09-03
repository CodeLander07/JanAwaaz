'use client';

/**
 * InteractiveScoring — Live prioritization formula showcase
 *
 * Displays the scoring equation with interactive weight sliders.
 * Adjusting weights causes sample projects to re-rank in real time.
 */

import { useState, useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { SlidersHorizontal, ArrowUp, ArrowDown, Minus } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface WeightConfig {
  key: string;
  label: string;
  symbol: string;
  description: string;
  defaultValue: number;
}

interface SampleProject {
  name: string;
  district: string;
  category: string;
  demand: number;
  vulnerability: number;
  gap: number;
  coverage: number;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const WEIGHTS: WeightConfig[] = [
  { key: 'wd', label: 'Demand', symbol: 'w_d', description: 'Citizen report volume × urgency', defaultValue: 0.35 },
  { key: 'wv', label: 'Vulnerability', symbol: 'w_v', description: 'Socio-economic deficit index', defaultValue: 0.30 },
  { key: 'wg', label: 'Infra Gap', symbol: 'w_g', description: 'OSM infrastructure density inverse', defaultValue: 0.25 },
  { key: 'wc', label: 'DPI Coverage', symbol: 'w_c', description: 'Existing capex overlap penalty', defaultValue: 0.10 },
];

const PROJECTS: SampleProject[] = [
  { name: 'Rohini Water Pipeline Extension', district: 'North West Delhi', category: 'Water', demand: 0.92, vulnerability: 0.71, gap: 0.65, coverage: 0.20 },
  { name: 'Dwarka Metro Phase IV', district: 'South West Delhi', category: 'Transport', demand: 0.68, vulnerability: 0.34, gap: 0.88, coverage: 0.55 },
  { name: 'Shahdara Primary Health Center', district: 'Shahdara', category: 'Healthcare', demand: 0.45, vulnerability: 0.93, gap: 0.82, coverage: 0.10 },
  { name: 'Mehrauli Sanitation Upgrade', district: 'South Delhi', category: 'Sanitation', demand: 0.83, vulnerability: 0.56, gap: 0.41, coverage: 0.70 },
  { name: 'Noida Solar Grid Expansion', district: 'East Delhi', category: 'Energy', demand: 0.61, vulnerability: 0.48, gap: 0.73, coverage: 0.15 },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function InteractiveScoring() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const [weights, setWeights] = useState<Record<string, number>>(() =>
    Object.fromEntries(WEIGHTS.map((w) => [w.key, w.defaultValue]))
  );

  // Compute scores and sort
  const rankedProjects = useMemo(() => {
    const { wd, wv, wg, wc } = weights;
    return PROJECTS.map((p) => ({
      ...p,
      score: wd * p.demand + wv * p.vulnerability + wg * p.gap - wc * p.coverage,
    }))
      .sort((a, b) => b.score - a.score)
      .map((p, i) => ({ ...p, rank: i + 1 }));
  }, [weights]);

  // Get previous rank for delta indicator
  const defaultRanked = useMemo(() => {
    const dw = Object.fromEntries(WEIGHTS.map((w) => [w.key, w.defaultValue]));
    return PROJECTS.map((p) => ({
      name: p.name,
      score: dw.wd * p.demand + dw.wv * p.vulnerability + dw.wg * p.gap - dw.wc * p.coverage,
    }))
      .sort((a, b) => b.score - a.score)
      .map((p, i) => ({ name: p.name, rank: i + 1 }));
  }, []);

  const handleWeightChange = (key: string, value: number) => {
    setWeights((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <section
      id="methodology"
      className="border-t border-neutral-200 dark:border-neutral-800"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        {/* Section Header */}
        <div className="mb-16">
          <span className="font-mono text-xs tracking-[0.2em] text-neutral-400 dark:text-neutral-600">
            METHODOLOGY
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white">
            Multi-criteria scoring
            <br />
            <span className="text-neutral-400 dark:text-neutral-600">with adjustable policy weights.</span>
          </h2>
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Formula Display */}
          <div className="mb-12 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal className="h-4 w-4 text-neutral-400" />
              <span className="font-mono text-xs tracking-wider text-neutral-400 dark:text-neutral-600">
                PRIORITY SCORING EQUATION
              </span>
            </div>
            <div className="font-mono text-sm sm:text-base md:text-lg text-black dark:text-white overflow-x-auto pb-2">
              <span className="font-bold">S</span>
              <span className="text-neutral-400 mx-2">=</span>
              <span className="text-neutral-500">w</span>
              <sub className="text-neutral-500 text-xs">d</sub>
              <span className="text-neutral-400 mx-1">·</span>
              <span>D</span>
              <sub className="text-xs text-neutral-500">norm</sub>
              <span className="text-neutral-400 mx-2">+</span>
              <span className="text-neutral-500">w</span>
              <sub className="text-neutral-500 text-xs">v</sub>
              <span className="text-neutral-400 mx-1">·</span>
              <span>V</span>
              <sub className="text-xs text-neutral-500">norm</sub>
              <span className="text-neutral-400 mx-2">+</span>
              <span className="text-neutral-500">w</span>
              <sub className="text-neutral-500 text-xs">g</sub>
              <span className="text-neutral-400 mx-1">·</span>
              <span>G</span>
              <sub className="text-xs text-neutral-500">norm</sub>
              <span className="text-neutral-400 mx-2">−</span>
              <span className="text-neutral-500">w</span>
              <sub className="text-neutral-500 text-xs">c</sub>
              <span className="text-neutral-400 mx-1">·</span>
              <span>C</span>
              <sub className="text-xs text-neutral-500">norm</sub>
            </div>
          </div>

          {/* Sliders + Table Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Weight Sliders */}
            <div className="lg:col-span-2 space-y-5">
              <h3 className="font-mono text-xs tracking-wider text-neutral-400 dark:text-neutral-600 mb-4">
                ADJUST WEIGHTS
              </h3>
              {WEIGHTS.map((w) => (
                <div key={w.key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <span className="text-sm font-medium text-black dark:text-white">
                        {w.label}
                      </span>
                      <span className="ml-2 font-mono text-[10px] text-neutral-400 dark:text-neutral-600">
                        {w.symbol}
                      </span>
                    </div>
                    <span className="font-mono text-sm font-bold text-black dark:text-white">
                      {weights[w.key].toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={weights[w.key]}
                    onChange={(e) => handleWeightChange(w.key, parseFloat(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-neutral-200 dark:bg-neutral-800 accent-black dark:accent-white [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black dark:[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-neutral-300 dark:[&::-webkit-slider-thumb]:border-neutral-600 [&::-webkit-slider-thumb]:cursor-pointer"
                    aria-label={`Weight for ${w.label}`}
                  />
                  <p className="mt-1 text-[10px] text-neutral-400 dark:text-neutral-600 font-mono">
                    {w.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Ranked Projects Table */}
            <div className="lg:col-span-3">
              <h3 className="font-mono text-xs tracking-wider text-neutral-400 dark:text-neutral-600 mb-4">
                RANKED PROJECT ALLOCATION
              </h3>
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 font-mono text-[10px] tracking-wider text-neutral-500">
                  <div className="col-span-1">#</div>
                  <div className="col-span-5">PROJECT</div>
                  <div className="col-span-3">DISTRICT</div>
                  <div className="col-span-2 text-right">SCORE</div>
                  <div className="col-span-1 text-right">Δ</div>
                </div>

                {/* Table Rows */}
                {rankedProjects.map((project) => {
                  const defaultRank = defaultRanked.find((d) => d.name === project.name)?.rank ?? project.rank;
                  const delta = defaultRank - project.rank;

                  return (
                    <motion.div
                      key={project.name}
                      layout
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                      className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-neutral-100 dark:border-neutral-900 last:border-b-0 hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors"
                    >
                      <div className="col-span-1 font-mono text-sm font-bold text-neutral-300 dark:text-neutral-700">
                        {String(project.rank).padStart(2, '0')}
                      </div>
                      <div className="col-span-5">
                        <div className="text-sm font-medium text-black dark:text-white truncate">
                          {project.name}
                        </div>
                        <div className="font-mono text-[10px] text-neutral-400 dark:text-neutral-600">
                          {project.category}
                        </div>
                      </div>
                      <div className="col-span-3 text-xs text-neutral-500 dark:text-neutral-500 flex items-center">
                        {project.district}
                      </div>
                      <div className="col-span-2 font-mono text-sm font-bold text-black dark:text-white text-right flex items-center justify-end">
                        {project.score.toFixed(3)}
                      </div>
                      <div className="col-span-1 flex items-center justify-end">
                        {delta > 0 ? (
                          <ArrowUp className="h-3 w-3 text-neutral-400" />
                        ) : delta < 0 ? (
                          <ArrowDown className="h-3 w-3 text-neutral-400" />
                        ) : (
                          <Minus className="h-3 w-3 text-neutral-300 dark:text-neutral-700" />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
