'use client';

import { useState, useEffect, useMemo, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthInput } from '@/components/auth/AuthInput';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { Button } from '@/components/ui/Button';

/** BRICS+ country options for the dropdown. */
const COUNTRIES = [
  { value: '', label: 'Select a country' },
  { value: 'IN', label: 'India' },
  { value: 'BR', label: 'Brazil' },
  { value: 'CN', label: 'China' },
  { value: 'RU', label: 'Russia' },
  { value: 'ZA', label: 'South Africa' },
] as const;

/**
 * Calculates a simple password strength score (0–4).
 * Based on length and character variety.
 */
function getPasswordStrength(password: string): number {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password) && /[^a-zA-Z0-9]/.test(password)) score += 1;
  return score;
}

/**
 * Human-readable label and color class for each strength level.
 */
function getStrengthMeta(score: number): { label: string; colorClass: string; widthPercent: number } {
  switch (score) {
    case 0:
      return { label: 'Too short', colorClass: 'bg-gray-200', widthPercent: 5 };
    case 1:
      return { label: 'Weak', colorClass: 'bg-gray-400', widthPercent: 25 };
    case 2:
      return { label: 'Fair', colorClass: 'bg-gray-600', widthPercent: 50 };
    case 3:
      return { label: 'Good', colorClass: 'bg-gray-700', widthPercent: 75 };
    case 4:
      return { label: 'Strong', colorClass: 'bg-black', widthPercent: 100 };
    default:
      return { label: '', colorClass: 'bg-gray-200', widthPercent: 0 };
  }
}

/**
 * Visual-only password strength indicator bar.
 */
function PasswordStrengthBar({ password }: { password: string }) {
  const score = getPasswordStrength(password);
  const { label, colorClass, widthPercent } = getStrengthMeta(score);

  if (!password) return null;

  return (
    <div className="space-y-1.5">
      <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${colorClass}`}
          style={{ width: `${widthPercent}%` }}
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={4}
          aria-label={`Password strength: ${label}`}
        />
      </div>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}

/**
 * Maps HTTP status codes to user-friendly error messages.
 */
function getSignUpError(status: number): string {
  switch (status) {
    case 409:
      return 'Email already registered. Try signing in instead.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

/**
 * Sign-up page — registration form with name, email, country,
 * password + confirmation, strength bar, and terms checkbox.
 */
export default function SignUpPage() {
  const router = useRouter();
  const { register, user, loading: authLoading } = useAuth();
  const toast = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  /** Client-side validation. Returns true if valid. */
  const validate = useMemo(() => {
    return (): boolean => {
      const errors: Record<string, string> = {};

      if (!fullName.trim()) errors.fullName = 'Full name is required';
      if (!email.trim()) errors.email = 'Email is required';
      if (!country) errors.country = 'Please select a country';
      if (password.length < 8) errors.password = 'Password must be at least 8 characters';
      if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
      if (!termsAccepted) errors.terms = 'You must accept the terms to continue';

      setFieldErrors(errors);
      return Object.keys(errors).length === 0;
    };
  }, [fullName, email, country, password, confirmPassword, termsAccepted]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    setLoading(true);

    try {
      await register({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
        country,
      });
      toast.success('Account created! Welcome to JanAwaaz.');
      router.push('/dashboard');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(getSignUpError(err.response.status));
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Don't render form if already authenticated
  if (!authLoading && user) {
    return null;
  }

  return (
    <AuthCard>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-black font-serif">
          Join JanAwaaz
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Your voice shapes the nation
        </p>
      </div>

      {/* Form-level error */}
      {error && (
        <div
          className="mb-4 px-4 py-3 rounded-lg border border-red-400 bg-red-400/5 text-sm text-red-600"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Sign-up form */}
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <AuthInput
          label="Full Name"
          id="signup-name"
          type="text"
          placeholder="Your full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          autoComplete="name"
          error={fieldErrors.fullName}
          required
        />

        <AuthInput
          label="Email"
          id="signup-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          error={fieldErrors.email}
          required
        />

        {/* Country dropdown */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="signup-country"
            className="text-sm font-medium text-gray-700"
          >
            Country
          </label>
          <select
            id="signup-country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            aria-invalid={fieldErrors.country ? true : undefined}
            aria-describedby={fieldErrors.country ? 'signup-country-error' : undefined}
            className={`w-full px-4 py-2.5 text-sm border rounded-lg bg-white text-black transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 cursor-pointer appearance-none ${
              fieldErrors.country ? 'border-red-400' : 'border-gray-200'
            }`}
          >
            {COUNTRIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          {fieldErrors.country && (
            <p id="signup-country-error" className="text-xs text-red-600" role="alert">
              {fieldErrors.country}
            </p>
          )}
        </div>

        <div>
          <PasswordInput
            label="Password"
            id="signup-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            error={fieldErrors.password}
            required
          />
          <div className="mt-2">
            <PasswordStrengthBar password={password} />
          </div>
        </div>

        <PasswordInput
          label="Confirm Password"
          id="signup-confirm"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          error={fieldErrors.confirmPassword}
          required
        />

        {/* Terms checkbox */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="signup-terms"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            aria-invalid={fieldErrors.terms ? true : undefined}
            aria-describedby={fieldErrors.terms ? 'signup-terms-error' : undefined}
            className="mt-1 w-4 h-4 border border-gray-200 rounded cursor-pointer accent-black"
          />
          <div>
            <label
              htmlFor="signup-terms"
              className="text-sm text-gray-600 leading-relaxed cursor-pointer"
            >
              I agree to the{' '}
              <span className="text-black font-medium underline">
                Terms of Service
              </span>{' '}
              and{' '}
              <span className="text-black font-medium underline">
                Privacy Policy
              </span>
            </label>
            {fieldErrors.terms && (
              <p id="signup-terms-error" className="text-xs text-red-600 mt-1" role="alert">
                {fieldErrors.terms}
              </p>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full" loading={loading}>
          Create Account
        </Button>
      </form>

      {/* Footer */}
      <p className="text-sm text-gray-600 text-center mt-6">
        Already have an account?{' '}
        <Link
          href="/auth/signin"
          className="text-black font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
