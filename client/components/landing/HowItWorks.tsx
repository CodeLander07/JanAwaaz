"use client";

import { Mic, Headphones, Hammer } from "lucide-react";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  {
    number: "01",
    hindi: "बोलें",
    english: "Speak",
    description:
      "Citizens submit their infrastructure needs through voice messages, text inputs, or popular messaging apps — in any of 20+ supported languages.",
    icon: Mic,
  },
  {
    number: "02",
    hindi: "सुनें",
    english: "Listen",
    description:
      "AI translates, classifies, and geolocates every request. Sentiment analysis and topic modelling turn unstructured voices into structured insights.",
    icon: Headphones,
  },
  {
    number: "03",
    hindi: "बनाएँ",
    english: "Build",
    description:
      "Governments receive actionable, ranked development priorities — evidence-based recommendations mapped to real geographic demand.",
    icon: Hammer,
  },
];

/**
 * Three-step horizontal process flow: Speak → Listen → Build.
 * Each step shows a large serif number, Hindi + English title, icon, and description.
 * Steps are connected by dotted lines on desktop, stacked on mobile.
 */
export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 md:py-32 border-t border-gray-200"
    >
      <div className="w-full max-w-[1280px] mx-auto px-6">
        <SectionHeading
          eyebrow="The Journey"
          title="From a single voice to national impact."
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
          {/* Dotted connector line (desktop only) */}
          <div
            className="hidden lg:block absolute top-[60px] left-[20%] right-[20%] border-t-2 border-dashed border-gray-200"
            aria-hidden="true"
          />

          {steps.map((step, i) => (
            <AnimateOnScroll key={step.number} delay={i * 0.15}>
              <div className="relative text-center lg:text-center">
                {/* Step Number */}
                <span className="inline-block text-5xl md:text-6xl font-serif font-bold text-gray-200 mb-4">
                  {step.number}
                </span>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center bg-white relative z-10">
                    <step.icon
                      size={20}
                      strokeWidth={1.5}
                      className="text-black"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* Title: Hindi + English */}
                <h3 className="text-xl font-bold tracking-tight mb-1">
                  {step.hindi}
                </h3>
                <p className="text-sm font-mono font-medium tracking-[0.1em] uppercase text-gray-400 mb-4">
                  {step.english}
                </p>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
