'use client';

/**
 * Dashboard — Spatial Graph Node & Hotspot Map
 *
 * Full-viewport interactive spatial node map displaying graph points,
 * network interconnections, and H3 hexagonal choropleth overlays.
 * Powered by an open-source, non-vulnerable mapping engine.
 */

import { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, Network } from 'lucide-react';
import { MOCK_H3_DATA } from '@/lib/mock-h3-data';
import type { H3HexData } from '@/types/h3';

// Dynamic import — Leaflet requires DOM window access
const CustomNodeMap = dynamic(
  () => import('@/components/map/CustomNodeMap'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen w-screen items-center justify-center bg-[#07090e]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-14 w-14 animate-spin rounded-full border-4 border-sky-500/20 border-t-sky-400" />
            <Network className="absolute inset-0 m-auto h-6 w-6 text-sky-400 animate-pulse" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-white tracking-wide">
              Initializing Spatial Node Graph Engine…
            </p>
            <p className="text-xs text-neutral-400 font-mono mt-1">
              Plotting {MOCK_H3_DATA.length} geospatial graph nodes over open basemap
            </p>
          </div>
        </div>
      </div>
    ),
  }
);

export default function DashboardPage() {
  const [selectedHex, setSelectedHex] = useState<H3HexData | null>(null);

  const handleSelectHex = useCallback((hex: H3HexData) => {
    setSelectedHex(hex);
  }, []);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black">
      {/* Back Navigation */}
      <div className="absolute left-4 top-4 z-50">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl border border-white/15 bg-neutral-950/85 px-4 py-2.5 text-xs sm:text-sm font-mono text-neutral-300 hover:text-white hover:border-neutral-500 backdrop-blur-xl transition-all shadow-xl"
        >
          <ArrowLeft className="h-4 w-4 text-sky-400" />
          <span className="font-semibold tracking-wider">CIVICPULSE</span>
        </Link>
      </div>

      {/* Custom Node Map plotting all graph points */}
      <CustomNodeMap
        data={MOCK_H3_DATA}
        onSelectHex={handleSelectHex}
        selectedHex={selectedHex}
        initialCenter={[28.6139, 77.209]}
        initialZoom={11}
      />
    </main>
  );
}
