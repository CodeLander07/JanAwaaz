'use client';

/**
 * CivicPulse AI — Dashboard Home Page
 *
 * Full-viewport H3 hexagonal hotspot map with mock data
 * centered on Delhi NCR.
 */

import { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
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
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
          <p className="text-sm text-gray-400 animate-pulse">
            Loading geospatial engine…
          </p>
        </div>
      </div>
    ),
  }
);

export default function Home() {
  const [selectedHex, setSelectedHex] = useState<H3HexData | null>(null);

  const handleSelectHex = useCallback((hex: H3HexData) => {
    setSelectedHex(hex);
    console.log('[CivicPulse] Selected hex:', hex.h3Index, hex.districtName);
  }, []);

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      {/* Branding */}
      <div className="absolute left-4 top-4 z-50">
        <div className="rounded-xl border border-white/10 bg-gray-900/80 px-4 py-2.5 shadow-2xl backdrop-blur-xl">
          <h1 className="text-lg font-bold tracking-tight text-white">
            <span className="text-sky-400">Civic</span>Pulse
            <span className="ml-1.5 text-[10px] font-medium text-purple-400 align-super">
              AI
            </span>
          </h1>
          <p className="text-[10px] text-gray-500">
            Infrastructure Hotspot Dashboard
          </p>
        </div>
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
