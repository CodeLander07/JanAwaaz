'use client';

/**
 * HeroSection — High-impact landing hero
 *
 * Features a pulsing DPG badge, large headline, explainer subtitle,
 * dual CTAs, and an animated terminal showing live voice note
 * processing from multilingual citizen inputs.
 */

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Terminal } from 'lucide-react';

// ─── Terminal Animation Data ─────────────────────────────────────────────────

interface TerminalLine {
  text: string;
  style: 'command' | 'output' | 'success' | 'muted';
}

const TERMINAL_SESSIONS: TerminalLine[][] = [
  [
    { text: '> Incoming voice note (Hindi) — +91-XXXX-7834', style: 'command' },
    { text: '  Transcribing via Whisper large-v3...', style: 'muted' },
    { text: '  "हमारे क्षेत्र में पानी की गंभीर समस्या है"', style: 'output' },
    { text: '  EN: "There is a severe water problem in our area"', style: 'output' },
    { text: '  Geocoding → H3: 882830828dfffff (res-8, ~0.74km²)', style: 'muted' },
    { text: '  Category: Water | Urgency: CRITICAL | South Delhi', style: 'output' },
    { text: '  ✓ Indexed — 47 correlated reports in cluster', style: 'success' },
  ],
  [
    { text: '> Incoming voice note (Portuguese) — +55-XXXX-2291', style: 'command' },
    { text: '  Transcribing via SeamlessM4T...', style: 'muted' },
    { text: '  "O esgoto está transbordando na rua principal"', style: 'output' },
    { text: '  EN: "Sewage is overflowing on the main road"', style: 'output' },
    { text: '  Geocoding → H3: 88a8100d65fffff (res-8, ~0.74km²)', style: 'muted' },
    { text: '  Category: Sanitation | Urgency: HIGH | São Paulo', style: 'output' },
    { text: '  ✓ Indexed — 12 correlated reports in cluster', style: 'success' },
  ],
  [
    { text: '> Incoming text report (Arabic) — WhatsApp Gateway', style: 'command' },
    { text: '  Processing via SeamlessM4T...', style: 'muted' },
    { text: '  "انقطاع الكهرباء منذ ثلاثة أيام في حينا"', style: 'output' },
    { text: '  EN: "Power outage for three days in our neighborhood"', style: 'output' },
    { text: '  Geocoding → H3: 88195a361bfffff (res-8, ~0.74km²)', style: 'muted' },
    { text: '  Category: Energy | Urgency: CRITICAL | Cairo', style: 'output' },
    { text: '  ✓ Indexed — 89 correlated reports in cluster', style: 'success' },
  ],
];

// ─── Animated Terminal Component ─────────────────────────────────────────────

function AnimatedTerminal() {
  const [sessionIdx, setSessionIdx] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);

  const session = TERMINAL_SESSIONS[sessionIdx];

  useEffect(() => {
    if (visibleCount < session.length) {
      const delay = visibleCount === 0 ? 400 : 700;
      const timer = setTimeout(() => setVisibleCount((c) => c + 1), delay);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setVisibleCount(0);
        setSessionIdx((s) => (s + 1) % TERMINAL_SESSIONS.length);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visibleCount, session.length, sessionIdx]);

  const getLineClass = (style: TerminalLine['style']): string => {
    switch (style) {
      case 'command':
        return 'text-white dark:text-white text-black';
      case 'output':
        return 'text-neutral-300 dark:text-neutral-300 text-neutral-700';
      case 'success':
        return 'text-neutral-100 dark:text-neutral-100 text-neutral-900 font-semibold';
      case 'muted':
        return 'text-neutral-500 dark:text-neutral-500';
      default:
        return 'text-neutral-400';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
      {/* Terminal Title Bar */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 px-4 py-2.5">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
          <div className="h-2.5 w-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
          <div className="h-2.5 w-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
        </div>
        <span className="ml-2 font-mono text-[10px] text-neutral-400 dark:text-neutral-600 tracking-wider">
          CIVICPULSE — INGESTION STREAM
        </span>
      </div>

      {/* Terminal Content */}
      <div className="p-4 font-mono text-xs leading-relaxed min-h-[220px]">
        {session.slice(0, visibleCount).map((line, i) => (
          <motion.div
            key={`${sessionIdx}-${i}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`${getLineClass(line.style)} py-0.5`}
          >
            {line.text}
          </motion.div>
        ))}
        {/* Blinking Cursor */}
        {visibleCount < session.length && (
          <span className="inline-block w-2 h-4 bg-neutral-400 dark:bg-neutral-500 animate-pulse ml-0.5" />
        )}
      </div>
    </div>
  );
}

// ─── Hero Section ────────────────────────────────────────────────────────────

export default function HeroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-24 pb-16"
    >
      {/* Dot Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        {/* DPG Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 inline-flex items-center gap-2"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neutral-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-neutral-500" />
          </span>
          <span className="font-mono text-xs tracking-[0.15em] text-neutral-500 dark:text-neutral-500 border border-neutral-300 dark:border-neutral-700 rounded-full px-3 py-1">
            DIGITAL PUBLIC GOOD v1.0
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-black dark:text-white leading-[0.95]"
        >
          Bridging Citizen Voice
          <br />
          <span className="text-neutral-400 dark:text-neutral-500">
            with National Infrastructure
          </span>
          <br />
          Priorities.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mx-auto mt-8 max-w-2xl text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed"
        >
          Multimodal, multilingual citizen voice notes from WhatsApp and Telegram—aggregated
          into spatial H3 hexagon clusters—to eliminate misaligned public spending across
          BRICS nations.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/dashboard"
            className="group flex items-center gap-2 rounded-full bg-black dark:bg-white text-white dark:text-black px-8 py-3.5 text-sm font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
          >
            Explore Live Map
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#architecture"
            className="group flex items-center gap-2 rounded-full border border-neutral-300 dark:border-neutral-700 px-8 py-3.5 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:border-neutral-500 dark:hover:border-neutral-500 hover:text-black dark:hover:text-white transition-colors"
          >
            Read Specification
            <span className="font-mono text-xs transition-transform group-hover:translate-x-1 inline-block">
              →
            </span>
          </a>
        </motion.div>
      </div>

      {/* Terminal Preview */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.7 }}
        className="relative z-10 mx-auto mt-16 w-full max-w-2xl"
      >
        <div className="absolute -inset-px rounded-xl bg-gradient-to-b from-neutral-300 dark:from-neutral-700 to-transparent opacity-50 blur-sm" />
        <div className="relative">
          <AnimatedTerminal />
        </div>
        <div className="mt-3 flex items-center justify-center gap-2">
          <Terminal className="h-3 w-3 text-neutral-400" />
          <span className="font-mono text-[10px] text-neutral-400 tracking-wider">
            LIVE INGESTION PREVIEW — 3 LANGUAGE STREAMS
          </span>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[10px] text-neutral-500 tracking-wider">SCROLL</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-6 w-px bg-neutral-400"
          />
        </div>
      </motion.div>
    </section>
  );
}
