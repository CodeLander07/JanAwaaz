'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthInput } from '@/components/auth/AuthInput';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { SocialButtons } from '@/components/auth/SocialButtons';
import { Button } from '@/components/ui/Button';

/**
 * Maps HTTP status codes to user-friendly error messages.
 */
function getSignInError(status: number): string {
  switch (status) {
    case 401:
      return 'Invalid email or password';
    case 429:
      return 'Too many attempts. Please try again later.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

/**
 * Sign-in page — email/password login with error mapping,
 * social buttons, forgot-password link, and password-reset success banner.
 */
export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user, loading: authLoading } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const showResetBanner = searchParams.get('reset') === '1';

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      await login({ email, password });
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(getSignInError(err.response.status));
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
      {/* Password reset success banner */}
      {showResetBanner && (
        <div
          className="mb-6 px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-sm text-gray-700"
          role="status"
        >
          Password reset successful. Sign in with your new password.
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-black font-serif">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Sign in to continue to JanAwaaz
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

      {/* Sign-in form */}
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <AuthInput
          label="Email"
          id="signin-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <PasswordInput
          label="Password"
          id="signin-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <div className="flex justify-end">
          <Link
            href="/auth/forgot-password"
            className="text-xs text-gray-600 hover:text-black transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" loading={loading}>
          Sign In
        </Button>
      </form>

      {/* Social login */}
      <SocialButtons />

      {/* Footer */}
      <p className="text-sm text-gray-600 text-center mt-6">
        Don&apos;t have an account?{' '}
        <Link
          href="/auth/signup"
          className="text-black font-medium hover:underline"
        >
          Sign up
        </Link>
      </p>
    </AuthCard>
  );
}
