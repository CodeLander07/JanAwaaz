"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

/**
 * UI-only authentication section with Sign In and Sign Up cards.
 * Forms use local state but perform no API calls — onSubmit only prevents default.
 * All inputs have proper labels, IDs, and aria attributes.
 */
export function AuthSection() {
  // Sign In state
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Sign Up state
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirm, setSignUpConfirm] = useState("");
  const [signUpCountry, setSignUpCountry] = useState("");
  const [signUpTerms, setSignUpTerms] = useState(false);

  const handleSignIn = (e: FormEvent) => {
    e.preventDefault();
  };

  const handleSignUp = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <section id="auth" className="py-24 md:py-32 border-t border-gray-200">
      <div className="w-full max-w-[1280px] mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Sign In Card */}
          <AnimateOnScroll direction="left">
            <div className="border border-gray-200 rounded-lg p-8 md:p-10 h-full">
              <h2 className="text-2xl font-bold tracking-tight mb-6">
                Welcome Back
              </h2>

              <form onSubmit={handleSignIn} className="space-y-5">
                <Input
                  label="Email"
                  id="signin-email"
                  type="email"
                  placeholder="you@example.com"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  autoComplete="email"
                />
                <Input
                  label="Password"
                  id="signin-password"
                  type="password"
                  placeholder="••••••••"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  autoComplete="current-password"
                />

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-xs text-gray-600 hover:text-black transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">
                  or continue with
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Social Buttons (UI only) */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2.5 text-sm font-medium hover:border-black transition-colors cursor-pointer"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#999"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#999"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#999"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#999"
                    />
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2.5 text-sm font-medium hover:border-black transition-colors cursor-pointer"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#999" aria-hidden="true">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </button>
              </div>

              <p className="text-sm text-gray-600 text-center mt-6">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="text-black font-medium hover:underline cursor-pointer"
                >
                  Sign up
                </button>
              </p>
            </div>
          </AnimateOnScroll>

          {/* Sign Up Card */}
          <AnimateOnScroll direction="right" delay={0.1}>
            <div className="border border-gray-200 rounded-lg p-8 md:p-10 h-full">
              <h2 className="text-2xl font-bold tracking-tight mb-6">
                Create Account
              </h2>

              <form onSubmit={handleSignUp} className="space-y-5">
                <Input
                  label="Full Name"
                  id="signup-name"
                  type="text"
                  placeholder="Your full name"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  autoComplete="name"
                />
                <Input
                  label="Email"
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  autoComplete="email"
                />
                <Input
                  label="Password"
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <Input
                  label="Confirm Password"
                  id="signup-confirm"
                  type="password"
                  placeholder="••••••••"
                  value={signUpConfirm}
                  onChange={(e) => setSignUpConfirm(e.target.value)}
                  autoComplete="new-password"
                />

                {/* Country Dropdown (UI only) */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="signup-country"
                    className="text-sm font-medium text-gray-700"
                  >
                    Country
                  </label>
                  <select
                    id="signup-country"
                    value={signUpCountry}
                    onChange={(e) => setSignUpCountry(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-black transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 cursor-pointer appearance-none"
                  >
                    <option value="">Select a country</option>
                    <option value="IN">India</option>
                    <option value="BR">Brazil</option>
                    <option value="CN">China</option>
                    <option value="RU">Russia</option>
                    <option value="ZA">South Africa</option>
                  </select>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="signup-terms"
                    checked={signUpTerms}
                    onChange={(e) => setSignUpTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 border border-gray-200 rounded cursor-pointer accent-black"
                  />
                  <label
                    htmlFor="signup-terms"
                    className="text-sm text-gray-600 leading-relaxed cursor-pointer"
                  >
                    I agree to the{" "}
                    <span className="text-black font-medium underline">
                      Terms of Service
                    </span>{" "}
                    and{" "}
                    <span className="text-black font-medium underline">
                      Privacy Policy
                    </span>
                  </label>
                </div>

                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </form>

              <p className="text-sm text-gray-600 text-center mt-6">
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-black font-medium hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
