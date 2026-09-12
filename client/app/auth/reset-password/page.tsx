'use client';

import { useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { AuthCard } from '@/components/auth/AuthCard';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { resetPassword } from '@/lib/auth';

/**
 * Calculates a simple password strength score (0–4).
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
 * Visual-only password strength indicator bar.
 */
function PasswordStrengthBar({ password }: { password: string }) {
  const score = getPasswordStrength(password);
  const meta: Record<number, { label: string; colorClass: string; width: number }> = {
    0: { label: 'Too short', colorClass: 'bg-gray-200', width: 5 },
    1: { label: 'Weak', colorClass: 'bg-gray-400', width: 25 },
    2: { label: 'Fair', colorClass: 'bg-gray-600', width: 50 },
    3: { label: 'Good', colorClass: 'bg-gray-700', width: 75 },
    4: { label: 'Strong', colorClass: 'bg-black', width: 100 },
  };
  const { label, colorClass, width } = meta[score] ?? meta[0];

  if (!password) return null;

  return (
    <div className="space-y-1.5">
      <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${colorClass}`}
          style={{ width: `${width}%` }}
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
 * Reset-password page — reads the token from search params,
 * shows an error card if missing, otherwise shows the reset form.
 */
export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // No token — show error card
  if (!token) {
    return (
      <AuthCard>
        <div className="text-center">
          <div className="mb-4">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-600 text-xl">
              ✕
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-black mb-2">
            Invalid reset link
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            This reset link is missing or invalid. Please request a new one.
          </p>
          <Link
            href="/auth/forgot-password"
            className="text-sm text-black font-medium hover:underline"
          >
            Request a new reset link
          </Link>
        </div>
      </AuthCard>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (password.length < 8) errors.password = 'Password must be at least 8 characters';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      await resetPassword({ token, new_password: password });
      toast.success('Password reset successful!');
      router.push('/auth/signin?reset=1');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 400) {
        setError('Reset link is invalid or has expired. Please request a new one.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-black font-serif">
          Reset password
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter your new password below
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

      {/* Reset form */}
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <PasswordInput
            label="New Password"
            id="reset-password"
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
          id="reset-confirm"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          error={fieldErrors.confirmPassword}
          required
        />

        <Button type="submit" className="w-full" loading={loading}>
          Reset Password
        </Button>
      </form>

      {/* Back link */}
      <div className="mt-6 text-center">
        <Link
          href="/auth/signin"
          className="text-sm text-gray-600 hover:text-black transition-colors"
        >
          ← Back to sign in
        </Link>
      </div>
    </AuthCard>
  );
}
