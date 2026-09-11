"use client";

import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

/**
 * Scattered dots SVG — represents fragmented citizen voices.
 */
function ScatteredDots() {
  return (
    <svg
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto max-w-md"
      aria-hidden="true"
    >
      {/* Scattered dots */}
      {[
        [45, 60], [120, 30], [200, 80], [280, 45], [350, 70],
        [80, 130], [160, 110], [250, 140], [320, 120], [60, 200],
        [140, 180], [220, 210], [300, 190], [370, 220], [100, 260],
        [180, 240], [260, 270], [340, 250],
      ].map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={4}
          fill="#999"
          opacity={0.3 + (i % 3) * 0.2}
        />
      ))}
      {/* Faint connecting lines between some dots */}
      <line x1="45" y1="60" x2="120" y2="30" stroke="#E5E5E5" strokeWidth="1" />
      <line x1="200" y1="80" x2="280" y2="45" stroke="#E5E5E5" strokeWidth="1" />
      <line x1="80" y1="130" x2="160" y2="110" stroke="#E5E5E5" strokeWidth="1" />
      <line x1="140" y1="180" x2="220" y2="210" stroke="#E5E5E5" strokeWidth="1" />
      <line x1="300" y1="190" x2="370" y2="220" stroke="#E5E5E5" strokeWidth="1" />
    </svg>
  );
}

/**
 * Converging lines SVG — represents unified priority from many voices.
 */
function ConvergingLines() {
  return (
    <svg
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto max-w-md"
      aria-hidden="true"
    >
      {/* Converging lines from edges to center-right */}
      {[
        [20, 30], [20, 80], [20, 130], [20, 180], [20, 230], [20, 270],
      ].map(([x, y], i) => (
        <line
          key={i}
          x1={x}
          y1={y}
          x2={380}
          y2={150}
          stroke="#0A0A0A"
          strokeWidth="1"
          opacity={0.15 + i * 0.1}
        />
      ))}
      {/* Source dots */}
      {[30, 80, 130, 180, 230, 270].map((y, i) => (
        <circle key={`src-${i}`} cx={20} cy={y} r={5} fill="#999" />
      ))}
      {/* Target dot */}
      <circle cx={380} cy={150} r={10} fill="#0A0A0A" />
      {/* Arrow hint */}
      <line x1="350" y1="150" x2="370" y2="150" stroke="#0A0A0A" strokeWidth="2" />
      <polygon points="375,150 365,144 365,156" fill="#0A0A0A" />
    </svg>
  );
}

/**
 * About section with two alternating rows: "The Problem" and "Our Solution".
 * Each row pairs text content with an abstract monochrome SVG illustration.
 */
export function About() {
  return (
    <section id="about" className="py-24 md:py-32">
      <div className="w-full max-w-[1280px] mx-auto px-6 space-y-24 md:space-y-32">
        {/* Row 1: The Problem — text left, visual right */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <AnimateOnScroll direction="left">
            <div>
              <p className="text-xs font-mono font-medium tracking-[0.2em] uppercase text-gray-600 mb-4">
                The Problem
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-6">
                Citizen voices are scattered. Development priorities are
                misaligned.
              </h2>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                Across BRICS nations, millions of citizens voice their
                infrastructure needs daily — through calls, social media,
                petitions, and local meetings. Yet these voices remain
                fragmented, unstructured, and invisible to the policymakers who
                allocate development budgets. The result: roads built where none
                are needed, hospitals planned without demand data, and
                communities left waiting for decades.
              </p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll direction="right" delay={0.15}>
            <div className="flex justify-center">
              <ScatteredDots />
            </div>
          </AnimateOnScroll>
        </div>

        {/* Row 2: Our Solution — visual left, text right */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <AnimateOnScroll direction="left" className="order-2 md:order-1">
            <div className="flex justify-center">
              <ConvergingLines />
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll
            direction="right"
            delay={0.15}
            className="order-1 md:order-2"
          >
            <div>
              <p className="text-xs font-mono font-medium tracking-[0.2em] uppercase text-gray-600 mb-4">
                Our Solution
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-6">
                One platform. Every voice. Data-driven decisions.
              </h2>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                JanAwaaz uses multilingual AI to collect, translate, classify,
                and geolocate citizen infrastructure requests at scale. It
                transforms scattered voices into a unified, evidence-based
                priority map — giving governments the clarity to build what
                their people actually need, where they need it most.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
