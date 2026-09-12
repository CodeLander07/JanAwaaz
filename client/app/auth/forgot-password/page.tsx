'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthInput } from '@/components/auth/AuthInput';
import { Button } from '@/components/ui/Button';
import { forgotPassword } from '@/lib/auth';

/**
 * Forgot-password page — always shows a success message on submit,
 * never revealing whether the email exists in the system.
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      await forgotPassword({ email: email.trim() });
    } catch {
      // Silently ignore errors — always show success for security
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <AuthCard>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-black font-serif">
          Forgot password?
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter your email and we&apos;ll send a reset link
        </p>
      </div>

      {submitted ? (
        /* Success state — always shown regardless of whether email exists */
        <div>
          <div
            className="px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-sm text-gray-700"
            role="status"
          >
            If an account exists for that email, we&apos;ve sent a reset link.
            Please check your inbox.
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/auth/signin"
              className="text-sm text-black font-medium hover:underline"
            >
              ← Back to sign in
            </Link>
          </div>
        </div>
      ) : (
        /* Form state */
        <div>
          {error && (
            <div
              className="mb-4 px-4 py-3 rounded-lg border border-red-400 bg-red-400/5 text-sm text-red-600"
              role="alert"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <AuthInput
              label="Email"
              id="forgot-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            <Button type="submit" className="w-full" loading={loading}>
              Send Reset Link
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/auth/signin"
              className="text-sm text-gray-600 hover:text-black transition-colors"
            >
              ← Back to sign in
            </Link>
          </div>
        </div>
      )}
    </AuthCard>
  );
}
