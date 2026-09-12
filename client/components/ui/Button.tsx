"use client";

import { motion } from "framer-motion";
import Link from "next/link";

/**
 * Props for the Button component.
 * @property variant - Visual variant: "primary" (black), "secondary" (outlined), or "ghost" (transparent).
 * @property size - Size: "default" or "lg".
 * @property href - If provided, renders as a Next.js Link.
 * @property children - Button label content.
 * @property className - Additional CSS classes.
 * @property type - HTML button type (default: "button").
 * @property loading - When true, shows a spinner and disables the button.
 * @property disabled - Whether the button is disabled.
 * @property onClick - Click handler.
 */
interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "lg";
  href?: string;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  loading?: boolean;
}

const baseStyles =
  "inline-flex items-center justify-center font-medium rounded-lg transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-50 disabled:cursor-not-allowed";

const variants = {
  primary: "bg-black text-white border border-black hover:bg-white hover:text-black",
  secondary: "bg-white text-black border border-black hover:bg-black hover:text-white",
  ghost: "bg-transparent text-gray-700 border border-transparent hover:bg-gray-100 hover:text-black",
};

const sizes = {
  default: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3.5 text-base",
};

/**
 * Spinning loader displayed inside the button when `loading` is true.
 */
function Spinner() {
  return (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

/**
 * Monochrome button with hover color-inversion and subtle scale animation.
 * Renders as `<a>` (via Next Link) when `href` is provided, `<button>` otherwise.
 * Supports a `loading` state that disables the button and shows a spinner.
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
  loading = false,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href && !isDisabled) {
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
      whileHover={isDisabled ? undefined : { scale: 1.02 }}
      whileTap={isDisabled ? undefined : { scale: 0.98 }}
      type={type}
      className={classes}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading || undefined}
    >
      {loading && <Spinner />}
      {children}
    </motion.button>
  );
}
