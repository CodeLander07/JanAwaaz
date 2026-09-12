import Link from 'next/link';

/**
 * Props for the AuthLayoutShell component.
 * @property children - Page content rendered below the header.
 */
interface AuthLayoutShellProps {
  children: React.ReactNode;
}

/**
 * Minimal header shell for auth pages.
 * Shows only the JanAwaaz wordmark (sound-wave SVG + text) linked to the home page.
 * No nav links, no hamburger — clean and focused.
 */
export function AuthLayoutShell({ children }: AuthLayoutShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Minimal header */}
      <header className="w-full px-6 py-5">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <svg
            width="24"
            height="24"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect
              width="4"
              height="12"
              x="2"
              y="8"
              rx="2"
              fill="currentColor"
            />
            <rect
              width="4"
              height="20"
              x="8"
              y="4"
              rx="2"
              fill="currentColor"
            />
            <rect
              width="4"
              height="28"
              x="14"
              y="0"
              rx="2"
              fill="currentColor"
            />
            <rect
              width="4"
              height="16"
              x="20"
              y="6"
              rx="2"
              fill="currentColor"
            />
          </svg>
          <span className="text-lg font-bold tracking-tight text-black group-hover:opacity-70 transition-opacity">
            JanAwaaz
          </span>
        </Link>
      </header>

      {/* Page content */}
      <main className="flex-1 flex items-center justify-center px-6 py-8">
        {children}
      </main>
    </div>
  );
}
