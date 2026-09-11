"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, ExternalLink, GitFork, Mail } from "lucide-react";

const productLinks = [
  { label: "Features", href: "#features" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "API", href: "#" },
  { label: "Roadmap", href: "#" },
];

const resourceLinks = [
  { label: "Documentation", href: "#" },
  { label: "GitHub", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
];

const socialLinks = [
  { label: "Twitter", href: "#", icon: MessageCircle },
  { label: "LinkedIn", href: "#", icon: ExternalLink },
  { label: "GitHub", href: "#", icon: GitFork },
  { label: "Email", href: "mailto:hello@janawaaz.org", icon: Mail },
];

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "pt", label: "Português" },
  { code: "zh", label: "中文" },
  { code: "ru", label: "Русский" },
];

/**
 * Multi-column footer with product, resource, social links,
 * language selector (UI only), and copyright bar.
 */
export function Footer() {
  const [language, setLanguage] = useState("en");

  return (
    <footer className="border-t border-gray-200">
      {/* Footer Columns */}
      <div className="w-full max-w-[1280px] mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1: Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="#" className="flex items-center gap-2 mb-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect width="4" height="12" x="2" y="8" rx="2" fill="currentColor" />
                <rect width="4" height="20" x="8" y="4" rx="2" fill="currentColor" />
                <rect width="4" height="28" x="14" y="0" rx="2" fill="currentColor" />
                <rect width="4" height="16" x="20" y="6" rx="2" fill="currentColor" />
              </svg>
              <span className="text-lg font-bold tracking-tight">JanAwaaz</span>
            </Link>
            <p className="text-sm font-mono text-gray-400 mb-3">
              Voice of the People
            </p>
            <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
              Amplifying citizen voices for infrastructure development across
              BRICS nations. A multilingual AI platform and Digital Public Good.
            </p>
          </div>

          {/* Column 2: Product */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Connect
            </h3>
            <ul className="space-y-3">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    <link.icon size={16} strokeWidth={1.5} aria-hidden="true" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="w-full max-w-[1280px] mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 font-mono">
            © 2026 JanAwaaz. A Digital Public Good.
          </p>
          <div className="flex items-center gap-2">
            <label htmlFor="footer-language" className="sr-only">
              Language
            </label>
            <select
              id="footer-language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-xs text-gray-600 border border-gray-200 rounded-md px-3 py-1.5 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 appearance-none"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
}
