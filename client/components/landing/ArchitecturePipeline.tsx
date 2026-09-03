'use client';

/**
 * ArchitecturePipeline — 4-step visual pipeline
 *
 * Illustrates the vertical slice from citizen voice to policy allocation:
 * 01 Ingestion → 02 Geo-Binning → 03 Data Fusion → 04 Policy Allocation
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mic, Hexagon, Layers, FileOutput } from 'lucide-react';

// ─── Pipeline Step Data ──────────────────────────────────────────────────────

interface PipelineStep {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  metadata: { label: string; value: string }[];
  tags: string[];
}

const STEPS: PipelineStep[] = [
  {
    number: '01',
    title: 'Ingestion',
    description:
      'Audio normalization and speech-to-text via Whisper large-v3 and SeamlessM4T for multilingual coverage across all BRICS languages.',
    icon: <Mic className="h-5 w-5" />,
    metadata: [
      { label: 'Latency', value: '<450ms' },
      { label: 'Languages', value: '24+' },
    ],
    tags: ['Whisper large-v3', 'SeamlessM4T', 'ffmpeg'],
  },
  {
    number: '02',
    title: 'Geo-Binning',
    description:
      'Uber H3 spatial indexing at resolution 8 with pgvector-powered semantic deduplication to collapse redundant complaints into unique spatial signals.',
    icon: <Hexagon className="h-5 w-5" />,
    metadata: [
      { label: 'Resolution', value: '~0.74km²' },
      { label: 'Dedup', value: '94.2%' },
    ],
    tags: ['H3 res-8', 'pgvector', 'PostGIS'],
  },
  {
    number: '03',
    title: 'Data Fusion',
    description:
      'WorldPop vulnerability indices and OpenStreetMap infrastructure density fused with citizen demand signals to compute equity-adjusted priority scores.',
    icon: <Layers className="h-5 w-5" />,
    metadata: [
      { label: 'Sources', value: '4 layers' },
      { label: 'Refresh', value: '6h cycle' },
    ],
    tags: ['WorldPop', 'OSM Overpass', 'GeoJSON'],
  },
  {
    number: '04',
    title: 'Policy Allocation',
    description:
      'Automated project brief generation matching H3 hotspot clusters to budget ministry formats — with DPI overlap detection to prevent redundant expenditure.',
    icon: <FileOutput className="h-5 w-5" />,
    metadata: [
      { label: 'Format', value: 'YAML/PDF' },
      { label: 'DPI Match', value: '76.8%' },
    ],
    tags: ['LLM Synthesis', 'Budget Mapper', 'DPI Registry'],
  },
];

// ─── Animation Variants ──────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function ArchitecturePipeline() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="architecture"
      className="border-t border-neutral-200 dark:border-neutral-800"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        {/* Section Header */}
        <div className="mb-16 md:flex md:items-end md:justify-between">
          <div>
            <span className="font-mono text-xs tracking-[0.2em] text-neutral-400 dark:text-neutral-600">
              SYSTEM ARCHITECTURE
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white">
              From raw voice to
              <br />
              <span className="text-neutral-400 dark:text-neutral-600">policy-ready intelligence.</span>
            </h2>
          </div>
          <p className="mt-4 md:mt-0 max-w-sm text-sm text-neutral-500 dark:text-neutral-500 leading-relaxed">
            A four-stage pipeline that transforms unstructured citizen feedback into
            spatially-indexed, equity-weighted infrastructure priority maps.
          </p>
        </div>

        {/* Pipeline Steps */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
        >
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              variants={stepVariants}
              className="group relative rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 p-6 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
            >
              {/* Connector Arrow (hidden on first and mobile) */}
              {i > 0 && (
                <div className="hidden xl:block absolute -left-4 top-1/2 -translate-y-1/2">
                  <div className="flex items-center text-neutral-300 dark:text-neutral-700">
                    <div className="w-4 h-px bg-neutral-300 dark:bg-neutral-700" />
                  </div>
                </div>
              )}

              {/* Step Number */}
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-3xl font-bold text-neutral-200 dark:text-neutral-800 group-hover:text-neutral-300 dark:group-hover:text-neutral-700 transition-colors">
                  {step.number}
                </span>
                <div className="text-neutral-400 dark:text-neutral-600 group-hover:text-black dark:group-hover:text-white transition-colors">
                  {step.icon}
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-500 leading-relaxed mb-6">
                {step.description}
              </p>

              {/* Technical Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {step.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] tracking-wider px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Metadata */}
              <div className="flex gap-4 border-t border-neutral-200 dark:border-neutral-800 pt-4">
                {step.metadata.map((meta) => (
                  <div key={meta.label}>
                    <div className="font-mono text-sm font-bold text-black dark:text-white">
                      {meta.value}
                    </div>
                    <div className="font-mono text-[10px] tracking-wider text-neutral-400 dark:text-neutral-600">
                      {meta.label.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
