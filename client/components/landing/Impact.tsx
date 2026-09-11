"use client";

import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Button } from "@/components/ui/Button";

/**
 * Full-width dark (black bg) mission statement section.
 * Contains centered quote, supporting text, testimonial placeholder, and CTA.
 */
export function Impact() {
  return (
    <section
      id="impact"
      className="py-24 md:py-32 bg-black text-white"
    >
      <div className="w-full max-w-[1280px] mx-auto px-6 text-center">
        <AnimateOnScroll>
          <p className="text-xs font-mono font-medium tracking-[0.2em] uppercase text-gray-400 mb-6">
            Our Mission
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll delay={0.1}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-6 max-w-4xl mx-auto">
            Every voice deserves to be heard. Every nation deserves to build
            what its people need.
          </h2>
        </AnimateOnScroll>

        <AnimateOnScroll delay={0.2}>
          <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto mb-12">
            JanAwaaz is more than a platform — it&apos;s a movement to ensure
            that development is driven by the people it serves. By bridging the
            gap between citizen voices and government action, we create
            infrastructure that truly matters.
          </p>
        </AnimateOnScroll>

        {/* Testimonial Placeholder */}
        <AnimateOnScroll delay={0.3}>
          <blockquote className="border-l-2 border-gray-600 pl-6 text-left max-w-xl mx-auto mb-12">
            <p className="text-base italic text-gray-400 leading-relaxed mb-3">
              &ldquo;For the first time, we could see what our citizens truly
              needed — not what we assumed they did. JanAwaaz changed how we
              plan infrastructure.&rdquo;
            </p>
            <cite className="text-sm text-gray-600 not-italic font-mono">
              — Government Official, BRICS Nation
            </cite>
          </blockquote>
        </AnimateOnScroll>

        <AnimateOnScroll delay={0.4}>
          <Button variant="secondary" size="lg" href="#auth" className="bg-white text-black border-white hover:bg-transparent hover:text-white">
            Join the Movement
          </Button>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
