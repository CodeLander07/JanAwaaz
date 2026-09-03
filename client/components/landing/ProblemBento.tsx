'use client';

/**
 * ProblemBento — Asymmetric bento grid showing the core problems
 *
 * Three cards demonstrating:
 * 1. Fragmented Channels (voice, SMS, local grievances in silos)
 * 2. Affluence Bias (wealthy regions skewing complaint volumes)
 * 3. Unmonitored DPI (zero ground-level impact telemetry)
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Radio, Scale, Eye } from 'lucide-react';

// ─── Problem Data ────────────────────────────────────────────────────────────

interface ProblemCard {
  id: string;
  icon: React.ReactNode;
  tag: string;
  title: string;
  description: string;
  stats: { label: string; value: string }[];
}

const PROBLEMS: ProblemCard[] = [
  {
    id: 'fragmented',
    icon: <Radio className="h-5 w-5" />,
    tag: '01 — FRAGMENTED CHANNELS',
    title: 'Voice notes, SMS, and local grievances remain trapped in bureaucratic silos.',
    description:
      'Citizen complaints arrive through WhatsApp, Telegram, call centers, and paper forms — each siloed in separate departments with no cross-channel deduplication or spatial correlation.',
    stats: [
      { label: 'Channels', value: '12+' },
      { label: 'Dedup Rate', value: '<5%' },
      { label: 'Avg Response', value: '47 days' },
    ],
  },
  {
    id: 'affluence',
    icon: <Scale className="h-5 w-5" />,
    tag: '02 — AFFLUENCE BIAS',
    title: 'Wealthier regions skew raw complaint volumes over vulnerable zones.',
    description:
      'Digital-literate, affluent populations generate 3-5× more reports per capita — drowning out underserved communities that lack smartphone access or digital fluency.',
    stats: [
      { label: 'Volume Skew', value: '3-5×' },
      { label: 'Coverage Gap', value: '68%' },
      { label: 'Equity Index', value: '0.23' },
    ],
  },
  {
    id: 'dpi',
    icon: <Eye className="h-5 w-5" />,
    tag: '03 — UNMONITORED DPI',
    title: 'Public capital expenditures deployed with zero ground-level impact telemetry.',
    description:
      'Government infrastructure projects worth billions are approved without spatial correlation to citizen need — and lack any ground-truth feedback loop measuring actual impact post-deployment.',
    stats: [
      { label: 'Capex Tracked', value: '<12%' },
      { label: 'Feedback Loop', value: 'None' },
      { label: 'Overlap Rate', value: '34%' },
    ],
  },
];

// ─── Animation Variants ──────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function ProblemBento() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="problem"
      className="border-t border-neutral-200 dark:border-neutral-800"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        {/* Section Header */}
        <div className="mb-16">
          <span className="font-mono text-xs tracking-[0.2em] text-neutral-400 dark:text-neutral-600">
            THE DISCONNECT
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white">
            Why citizen voice fails
            <br />
            <span className="text-neutral-400 dark:text-neutral-600">to reach infrastructure budgets.</span>
          </h2>
        </div>

        {/* Bento Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {/* Card 1 — Spans 2 columns */}
          <motion.div
            variants={itemVariants}
            className="group md:col-span-2 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 p-8 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
          >
            <BentoCardContent card={PROBLEMS[0]} />
          </motion.div>

          {/* Card 2 — 1 column */}
          <motion.div
            variants={itemVariants}
            className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 p-8 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
          >
            <BentoCardContent card={PROBLEMS[1]} />
          </motion.div>

          {/* Card 3 — Full width */}
          <motion.div
            variants={itemVariants}
            className="group md:col-span-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 p-8 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
          >
            <div className="md:flex md:items-start md:justify-between md:gap-12">
              <div className="md:max-w-xl">
                <BentoCardContent card={PROBLEMS[2]} />
              </div>
              {/* Stats for full-width card laid out horizontally */}
              <div className="mt-6 md:mt-0 flex gap-6 md:gap-10">
                {PROBLEMS[2].stats.map((stat) => (
                  <div key={stat.label} className="text-center md:text-right">
                    <div className="font-mono text-2xl font-bold text-black dark:text-white">
                      {stat.value}
                    </div>
                    <div className="mt-1 font-mono text-[10px] tracking-wider text-neutral-400 dark:text-neutral-600">
                      {stat.label.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Card Content Sub-Component ──────────────────────────────────────────────

function BentoCardContent({ card }: { card: ProblemCard }) {
  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <div className="text-neutral-400 dark:text-neutral-600 group-hover:text-black dark:group-hover:text-white transition-colors">
          {card.icon}
        </div>
        <span className="font-mono text-[10px] tracking-[0.15em] text-neutral-400 dark:text-neutral-600">
          {card.tag}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-black dark:text-white leading-snug mb-3">
        {card.title}
      </h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-500 leading-relaxed mb-6">
        {card.description}
      </p>
      {/* Inline stats (hidden on the full-width card 3 since it renders its own) */}
      {card.id !== 'dpi' && (
        <div className="flex gap-6 border-t border-neutral-200 dark:border-neutral-800 pt-4">
          {card.stats.map((stat) => (
            <div key={stat.label}>
              <div className="font-mono text-lg font-bold text-black dark:text-white">
                {stat.value}
              </div>
              <div className="font-mono text-[10px] tracking-wider text-neutral-400 dark:text-neutral-600">
                {stat.label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
