"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

/**
 * Call-to-action section replacing the old inline auth forms.
 * Directs users to the dedicated sign-in and sign-up pages.
 */
export function AuthSection() {
  return (
    <section id="auth" className="py-24 md:py-32 border-t border-gray-200">
      <div className="w-full max-w-[1280px] mx-auto px-6">
        <AnimateOnScroll>
          <div className="text-center max-w-2xl mx-auto">
            {/* Eyebrow */}
            <p className="text-xs font-mono font-medium tracking-[0.2em] uppercase text-gray-400 mb-4">
              Get Started
            </p>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-4">
              Ready to make your{" "}
              <em className="font-serif not-italic font-bold italic">
                voice heard?
              </em>
            </h2>

            {/* Subtitle */}
            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-10">
              Join thousands of citizens shaping infrastructure priorities.
              Sign up in seconds — it&apos;s free, open source, and built for
              the people.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href="/auth/signup" size="lg">
                Create Account
              </Button>
              <Button href="/auth/signin" variant="secondary" size="lg">
                Sign In
              </Button>
            </div>

            {/* Trust note */}
            <p className="mt-6 text-xs text-gray-400 font-mono">
              No credit card required · Free forever · Open source
            </p>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
