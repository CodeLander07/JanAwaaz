import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'CivicPulse AI — Citizen Feedback & DPI Prioritization Engine',
  description:
    'A Digital Public Good platform bridging citizen voice with national infrastructure priorities across BRICS nations. Multimodal, multilingual complaint aggregation into H3 spatial clusters for equitable public spending.',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full bg-white dark:bg-black text-black dark:text-white">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
