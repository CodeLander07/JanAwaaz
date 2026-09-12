'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

/** Visual variant of the toast. */
type ToastVariant = 'success' | 'error' | 'info';

/** Internal toast object. */
interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

/** Methods exposed by the useToast() hook. */
interface ToastActions {
  /** Show a success toast. */
  success: (message: string) => void;
  /** Show an error toast. */
  error: (message: string) => void;
  /** Show an info toast. */
  info: (message: string) => void;
}

const ToastContext = createContext<ToastActions | null>(null);

/** Auto-dismiss duration in milliseconds. */
const DISMISS_MS = 4000;

/**
 * Individual toast notification with enter/exit transitions.
 */
function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const enterTimer = requestAnimationFrame(() => setVisible(true));

    // Auto-dismiss
    const dismissTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(toast.id), 200);
    }, DISMISS_MS);

    return () => {
      cancelAnimationFrame(enterTimer);
      clearTimeout(dismissTimer);
    };
  }, [toast.id, onDismiss]);

  const variantStyles: Record<ToastVariant, string> = {
    success: 'border-gray-700 bg-black text-white',
    error: 'border-red-500 bg-white text-red-600',
    info: 'border-gray-400 bg-white text-gray-700',
  };

  const iconMap: Record<ToastVariant, string> = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg text-sm font-medium transition-all duration-200 ${
        variantStyles[toast.variant]
      } ${visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
      style={{ minWidth: '280px', maxWidth: '420px' }}
    >
      <span className="text-base leading-none" aria-hidden="true">
        {iconMap[toast.variant]}
      </span>
      <span className="flex-1">{toast.message}</span>
      <button
        type="button"
        onClick={() => {
          setVisible(false);
          setTimeout(() => onDismiss(toast.id), 200);
        }}
        className="ml-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  );
}

/**
 * Props for the ToastProvider component.
 * @property children - Child components that can access toast methods via useToast().
 */
interface ToastProviderProps {
  children: ReactNode;
}

/**
 * Provides a toast notification system to the component tree.
 * Renders a fixed container at bottom-right for toast messages.
 */
export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, variant: ToastVariant) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setToasts((prev) => [...prev, { id, message, variant }]);
  }, []);

  const actions = useMemo<ToastActions>(
    () => ({
      success: (message: string) => addToast(message, 'success'),
      error: (message: string) => addToast(message, 'error'),
      info: (message: string) => addToast(message, 'info'),
    }),
    [addToast],
  );

  return (
    <ToastContext.Provider value={actions}>
      {children}
      {/* Toast container — fixed bottom-right */}
      <div
        className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-auto"
        aria-label="Notifications"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/**
 * Hook to access toast notification actions.
 * Must be used within a `<ToastProvider>`.
 *
 * @throws {Error} If used outside of a ToastProvider.
 *
 * @example
 * ```tsx
 * const toast = useToast();
 * toast.success('Logged in successfully');
 * toast.error('Invalid credentials');
 * toast.info('Check your email');
 * ```
 */
export function useToast(): ToastActions {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return context;
}
