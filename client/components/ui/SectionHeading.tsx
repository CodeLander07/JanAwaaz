"use client";

import { AnimateOnScroll } from "./AnimateOnScroll";

/**
 * Props for the SectionHeading component.
 * @property eyebrow - Small uppercase label above the title.
 * @property title - Main heading text (rendered as h2).
 * @property subtitle - Optional body text below the heading.
 * @property align - Text alignment: "left" | "center" (default: "center").
 * @property dark - If true, uses white text for dark backgrounds.
 */
interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  dark?: boolean;
}

/**
 * Reusable section heading block with eyebrow, title, and optional subtitle.
 * Includes scroll-triggered fade-in animation.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  dark = false,
}: SectionHeadingProps) {
  const alignment = align === "center" ? "text-center" : "text-left";
  const eyebrowColor = dark ? "text-gray-400" : "text-gray-600";
  const titleColor = dark ? "text-white" : "text-black";
  const subtitleColor = dark ? "text-gray-400" : "text-gray-600";

  return (
    <AnimateOnScroll className={`${alignment} mb-16`}>
      <p
        className={`text-xs font-mono font-medium tracking-[0.2em] uppercase mb-4 ${eyebrowColor}`}
      >
        {eyebrow}
      </p>
      <h2
        className={`text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] ${titleColor}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-base md:text-lg leading-relaxed max-w-2xl ${
            align === "center" ? "mx-auto" : ""
          } ${subtitleColor}`}
        >
          {subtitle}
        </p>
      )}
    </AnimateOnScroll>
  );
}
