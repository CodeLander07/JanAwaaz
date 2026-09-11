"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * Props for the AnimateOnScroll wrapper component.
 * @property children - The content to animate.
 * @property delay - Animation delay in seconds (default: 0).
 * @property direction - Slide direction: "up" | "left" | "right" (default: "up").
 * @property className - Additional CSS classes.
 */
interface AnimateOnScrollProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right";
  className?: string;
}

const directionOffsets = {
  up: { x: 0, y: 24 },
  left: { x: -24, y: 0 },
  right: { x: 24, y: 0 },
};

/**
 * Generic scroll-triggered animation wrapper.
 * Content fades in and slides from the specified direction.
 * Triggers once when the element enters the viewport.
 */
export function AnimateOnScroll({
  children,
  delay = 0,
  direction = "up",
  className,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-64px" });
  const offset = directionOffsets[direction];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : undefined}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
