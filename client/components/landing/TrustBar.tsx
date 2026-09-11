"use client";

import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

const stats = [
  { value: "20+", label: "Languages Supported" },
  { value: "100K+", label: "Citizen Voices" },
  { value: "50+", label: "Projects Prioritized" },
  { value: "5", label: "BRICS Nations" },
];

/**
 * Horizontal stat bar with 4 key metrics separated by vertical dividers.
 * Displays as 2x2 grid on mobile.
 */
export function TrustBar() {
  return (
    <section className="py-16 md:py-24 border-b border-gray-200">
      <div className="w-full max-w-[1280px] mx-auto px-6">
        <AnimateOnScroll>
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center py-6 lg:py-0 ${
                  i < stats.length - 1
                    ? "lg:border-r lg:border-gray-200"
                    : ""
                } ${i < 2 ? "border-b lg:border-b-0 border-gray-200" : ""} ${
                  i % 2 === 0 ? "border-r lg:border-r-0 border-gray-200" : ""
                } ${
                  i % 2 === 0 && i < stats.length - 1
                    ? "lg:border-r lg:border-gray-200"
                    : ""
                }`}
              >
                <span className="text-4xl md:text-5xl font-bold tracking-tight text-black">
                  {stat.value}
                </span>
                <span className="text-xs font-mono font-medium tracking-[0.15em] uppercase text-gray-400 mt-2">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
