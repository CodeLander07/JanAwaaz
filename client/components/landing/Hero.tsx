"use client";

import { Button } from "@/components/ui/Button";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

const marqueeItems = [
  "20+ LANGUAGES",
  "5 NATIONS",
  "1 MISSION",
  "100K+ VOICES",
  "OPEN SOURCE",
  "DIGITAL PUBLIC GOOD",
];

/**
 * Full-viewport hero section with Hindi tagline, subtitle,
 * CTA buttons, grid-pattern background, and scrolling stat marquee.
 */
export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center bg-grid-pattern pt-[72px]"
    >
      {/* Content */}
      <div className="flex-1 flex items-center">
        <div className="w-full max-w-[1280px] mx-auto px-6 py-16 md:py-24 text-center">
          {/* Eyebrow */}
          <AnimateOnScroll>
            <p className="text-xs font-mono font-medium tracking-[0.2em] uppercase text-gray-600 mb-6">
              Digital Public Good · Open Source
            </p>
          </AnimateOnScroll>

          {/* Headline */}
          <AnimateOnScroll delay={0.1}>
            <h1 className="text-[2.5rem] sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              Har Awaaz Mein Hai{" "}
              <em className="font-serif not-italic font-bold italic">
                Vikas ki Shakti
              </em>
            </h1>
          </AnimateOnScroll>

          {/* Subtitle */}
          <AnimateOnScroll delay={0.2}>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-10">
              A multilingual AI platform that aggregates citizen development
              requests and helps governments build what matters most.
            </p>
          </AnimateOnScroll>

          {/* CTAs */}
          <AnimateOnScroll delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href="/submit" size="lg">
                Submit Your Voice
              </Button>
              <Button href="/dashboard" variant="secondary" size="lg">
                Explore Dashboard
              </Button>
            </div>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Marquee Strip */}
      <div className="border-t border-b border-gray-200 overflow-hidden py-4 bg-white">
        <div className="animate-marquee marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-4 px-6 text-xs font-mono font-medium tracking-[0.15em] text-gray-400 uppercase whitespace-nowrap"
            >
              {item}
              <span className="w-1 h-1 rounded-full bg-gray-400" aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
