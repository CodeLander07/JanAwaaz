'use client';

/**
 * Footer — Minimalist 4-column footer
 *
 * Open-source link, DPG compliance badge, architecture spec,
 * and copyright notice.
 */

import { Code2, FileText, Shield, ExternalLink } from 'lucide-react';

interface FooterLink {
  label: string;
  href: string;
  icon: React.ReactNode;
  description: string;
}

const FOOTER_ITEMS: FooterLink[] = [
  {
    label: 'Source Code',
    href: 'https://github.com/civicpulse-brics',
    icon: <Code2 className="h-5 w-5" />,
    description: 'MIT licensed open-source repository',
  },
  {
    label: 'DPG Standard',
    href: '#',
    icon: <Shield className="h-5 w-5" />,
    description: 'Digital Public Good compliant',
  },
  {
    label: 'Architecture Spec',
    href: '/docs/ARCHITECTURE.md',
    icon: <FileText className="h-5 w-5" />,
    description: 'Full system topology & data flow',
  },
  {
    label: 'API Documentation',
    href: '/docs/BACKEND_SPEC.md',
    icon: <ExternalLink className="h-5 w-5" />,
    description: 'Backend routes & data contracts',
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {FOOTER_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group flex flex-col gap-3 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
            >
              <div className="text-neutral-400 dark:text-neutral-600 group-hover:text-black dark:group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-black dark:text-white flex items-center gap-1.5">
                  {item.label}
                  {item.href.startsWith('http') && (
                    <ExternalLink className="h-3 w-3 opacity-40" />
                  )}
                </h4>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-500">
                  {item.description}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-200 dark:border-neutral-800 pt-8">
          <div className="font-mono text-xs tracking-[0.15em] text-neutral-400 dark:text-neutral-600">
            CIVICPULSE // BRICS-DPI
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-neutral-400 dark:text-neutral-600">
              BUILD FOR COMMUNITIES © {new Date().getFullYear()}
            </span>
            <span className="hidden sm:inline-block h-3 w-px bg-neutral-300 dark:bg-neutral-700" />
            <span className="hidden sm:inline font-mono text-[10px] text-neutral-400 dark:text-neutral-600">
              DIGITAL PUBLIC GOOD
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
