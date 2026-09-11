"use client";

import { motion } from "framer-motion";
import Link from "next/link";

/**
 * Props for the Button component.
 * @property variant - Visual variant: "primary" (black) or "secondary" (outlined).
 * @property size - Size: "default" or "lg".
 * @property href - If provided, renders as a Next.js Link.
 * @property children - Button label content.
 * @property className - Additional CSS classes.
 * @property type - HTML button type (default: "button").
 */
interface ButtonProps {
  variant?: "primary" | "secondary";
  size?: "default" | "lg";
  href?: string;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
}

const baseStyles =
  "inline-flex items-center justify-center font-medium rounded-lg transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

const variants = {
  primary: "bg-black text-white border border-black hover:bg-white hover:text-black",
  secondary: "bg-white text-black border border-black hover:bg-black hover:text-white",
};

const sizes = {
  default: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3.5 text-base",
};

/**
 * Monochrome button with hover color-inversion and subtle scale animation.
 * Renders as `<a>` (via Next Link) when `href` is provided, `<button>` otherwise.
 */
export function Button({
  variant = "primary",
  size = "default",
  href,
  children,
  className = "",
  type = "button",
  onClick,
  disabled,
}: ButtonProps) {
  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link href={href} className={classes}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}
