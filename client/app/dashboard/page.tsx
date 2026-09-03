'use client';

/**
 * Dashboard — H3 Hexagonal Hotspot Map
 *
 * Full-viewport interactive 3D hexagonal choropleth map
 * with mock data centered on Delhi NCR.
 */

import { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MOCK_H3_DATA } from '@/lib/mock-h3-data';
import type { H3HexData } from '@/types/h3';

// Dynamic import — Deck.gl uses WebGL and must not SSR
const H3HotspotMap = dynamic(
  () => import('@/components/map/H3HotspotMap'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-500 border-t-transparent" />
          <p className="text-sm text-neutral-400 animate-pulse font-mono">
            Initializing geospatial engine…
          </p>
        </div>
      </div>
    ),
  }
);

export default function DashboardPage() {
  const [selectedHex, setSelectedHex] = useState<H3HexData | null>(null);

  const handleSelectHex = useCallback((hex: H3HexData) => {
    setSelectedHex(hex);
    console.log('[CivicPulse] Selected hex:', hex.h3Index, hex.districtName);
  }, []);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black">
      {/* Back Navigation */}
      <div className="absolute left-4 top-4 z-50">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-black/80 px-4 py-2.5 text-sm font-mono text-neutral-400 hover:text-white hover:border-neutral-600 backdrop-blur-xl transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">CIVICPULSE</span>
        </Link>
      </div>

      {/* Map */}
      <H3HotspotMap
        data={MOCK_H3_DATA}
        onSelectHex={handleSelectHex}
        initialViewState={{
          longitude: 77.209,
          latitude: 28.6139,
          zoom: 11,
          pitch: 45,
          bearing: -15,
        }}
      />
    </main>
  );
}
