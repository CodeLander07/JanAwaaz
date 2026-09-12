'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import type { User, LoginPayload, RegisterPayload } from '@/types/auth';
import * as authApi from '@/lib/auth';
import { setAuthFailureHandler } from '@/lib/api';

/**
 * Shape of the auth context value.
 */
interface AuthContextValue {
  /** The currently authenticated user, or null if not logged in. */
  user: User | null;
  /** True while the initial session check is in progress. */
  loading: boolean;
  /** Log in with email/password. Returns the user on success. */
  login: (payload: LoginPayload) => Promise<User>;
  /** Register a new account. Returns the user on success. */
  register: (payload: RegisterPayload) => Promise<User>;
  /** Log out and clear session. */
  logout: () => Promise<void>;
  /** Re-fetch the current user from the server. */
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Props for the AuthProvider component.
 * @property children - Child components that can access auth state via useAuth().
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provides auth state (user, loading) and actions (login, register, logout, refreshUser)
 * to the component tree. On mount, attempts to fetch the current session.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /** Register the auth failure handler so the 401 interceptor can redirect via Next.js router. */
  useEffect(() => {
    setAuthFailureHandler(() => {
      setUser(null);
      router.push('/auth/signin');
    });
  }, [router]);

  /** Fetch current user from session cookie. */
  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    }
  }, []);

  /** On mount: check if the user has an active session. */
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const currentUser = await authApi.getCurrentUser();
        if (!cancelled) setUser(currentUser);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (payload: LoginPayload): Promise<User> => {
    const loggedInUser = await authApi.login(payload);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const register = useCallback(
    async (payload: RegisterPayload): Promise<User> => {
      const newUser = await authApi.register(payload);
      setUser(newUser);
      return newUser;
    },
    [],
  );

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, login, register, logout, refreshUser }),
    [user, loading, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth state and actions.
 * Must be used within an `<AuthProvider>`.
 *
 * @throws {Error} If used outside of an AuthProvider.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return context;
}
