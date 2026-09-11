"use client";

import {
  Globe,
  Brain,
  MapPin,
  BarChart3,
  Code2,
  ShieldCheck,
} from "lucide-react";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { SectionHeading } from "@/components/ui/SectionHeading";

const features = [
  {
    icon: Globe,
    title: "Multilingual Input",
    description:
      "Voice, text, and messaging in 20+ languages — from Hindi to Mandarin, Portuguese to Russian.",
  },
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description:
      "Natural language processing, sentiment analysis, and automatic topic classification at scale.",
  },
  {
    icon: MapPin,
    title: "Geospatial Hotspots",
    description:
      "Real-time demand mapping with H3 hexagonal indexing to pinpoint infrastructure needs.",
  },
  {
    icon: BarChart3,
    title: "Evidence-Based Recommendations",
    description:
      "Data-driven project prioritization that helps governments allocate budgets effectively.",
  },
  {
    icon: Code2,
    title: "Open Source",
    description:
      "Apache 2.0 licensed Digital Public Good — transparent, auditable, and community-driven.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy First",
    description:
      "All citizen data is anonymized, encrypted at rest and in transit. No personal data stored.",
  },
];

/**
 * Features section with a 3-column card grid.
 * Each card has a Lucide icon, title, and description.
 * Cards use border-only styling with hover darkening.
 * Staggered fade-in animation (0.1s delay per card).
 */
export function Features() {
  return (
    <section id="features" className="py-24 md:py-32 border-t border-gray-200">
      <div className="w-full max-w-[1280px] mx-auto px-6">
        <SectionHeading
          eyebrow="Capabilities"
          title="Built for scale. Designed for trust."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <AnimateOnScroll key={feature.title} delay={i * 0.1}>
              <div className="group border border-gray-200 rounded-lg p-8 transition-colors hover:border-black h-full">
                <feature.icon
                  size={24}
                  strokeWidth={1.5}
                  className="text-black mb-5"
                  aria-hidden="true"
                />
                <h3 className="text-lg font-semibold tracking-tight mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
