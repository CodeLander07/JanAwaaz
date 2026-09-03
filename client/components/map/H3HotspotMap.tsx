'use client';

/**
 * H3HotspotMap — Interactive 3D Hexagonal Choropleth Map
 *
 * Production-ready component that renders an interactive 3D hexagonal
 * choropleth/hotspot map using Deck.gl's H3HexagonLayer over a Mapbox
 * basemap. Visualizes aggregated citizen infrastructure complaints and
 * multi-criteria priority scores across urban/rural zones.
 *
 * @example
 * ```tsx
 * <H3HotspotMap
 *   data={hexData}
 *   colorMetric="compositePriority"
 *   elevationScale={50}
 *   onSelectHex={(hex) => console.log(hex)}
 * />
 * ```
 */

import { useState, useCallback, useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import { H3HexagonLayer } from '@deck.gl/geo-layers';
import { Map } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

import type { H3HexData, H3HotspotMapProps, ColorMetricKey } from '@/types/h3';
import { getColorForValue } from '@/lib/map-utils';
import MapControls from './MapControls';
import MapTooltip from './MapTooltip';

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_VIEW_STATE = {
  longitude: 77.209,
  latitude: 28.6139,
  zoom: 11,
  pitch: 45,
  bearing: -15,
};

const MAP_STYLE = 'mapbox://styles/mapbox/dark-v11';

// ─── Component ───────────────────────────────────────────────────────────────

export default function H3HotspotMap({
  data,
  initialViewState,
  onSelectHex,
  colorMetric: controlledMetric,
  elevationScale = 50,
  mapboxToken,
}: H3HotspotMapProps) {
  // State
  const [viewState, setViewState] = useState({
    ...DEFAULT_VIEW_STATE,
    ...initialViewState,
  });
  const [activeMetric, setActiveMetric] = useState<ColorMetricKey>(
    controlledMetric ?? 'compositePriority'
  );
  const [elevationEnabled, setElevationEnabled] = useState(true);
  const [selectedHex, setSelectedHex] = useState<H3HexData | null>(null);
  const [hoverInfo, setHoverInfo] = useState<{
    hex: H3HexData;
    x: number;
    y: number;
  } | null>(null);

  // Sync controlled metric prop
  const currentMetric = controlledMetric ?? activeMetric;

  // Token resolution
  const token = mapboxToken ?? process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';

  // ─── Handlers ────────────────────────────────────────────────────────

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleViewStateChange = useCallback((params: any) => {
    setViewState(params.viewState);
  }, []);

  const handleHover = useCallback(
    (info: { object?: H3HexData; x?: number; y?: number }) => {
      if (info.object && info.x !== undefined && info.y !== undefined) {
        setHoverInfo({ hex: info.object, x: info.x, y: info.y });
      } else {
        setHoverInfo(null);
      }
    },
    []
  );

  const handleClick = useCallback(
    (info: { object?: H3HexData }) => {
      if (info.object) {
        setSelectedHex(info.object);
        onSelectHex?.(info.object);
      }
    },
    [onSelectHex]
  );

  // ─── Layers ──────────────────────────────────────────────────────────

  const layers = useMemo(() => {
    const hexLayer = new H3HexagonLayer<H3HexData>({
      id: 'h3-hotspot-layer',
      data,
      pickable: true,
      filled: true,
      extruded: elevationEnabled,
      wireframe: false,
      elevationScale: elevationEnabled ? elevationScale : 0,

      // H3 index accessor
      getHexagon: (d: H3HexData) => d.h3Index,

      // Color encoding based on active metric
      getFillColor: (d: H3HexData) => {
        const value = d[currentMetric];
        return getColorForValue(value, d.isCoveredByDPI);
      },

      // Elevation driven by complaint count (normalized to 0-1 range, then scaled)
      getElevation: (d: H3HexData) => d.complaintCount,

      // Interaction
      onHover: handleHover,
      onClick: handleClick,

      // Visual polish
      opacity: 0.85,
      coverage: 0.92,

      // Smooth transitions
      transitions: {
        getFillColor: { duration: 500, type: 'interpolation' },
        getElevation: { duration: 800, type: 'spring', stiffness: 0.3, damping: 0.6 },
        elevationScale: { duration: 600, type: 'interpolation' },
      },

      // Update triggers — tell Deck.gl to re-evaluate accessors when these change
      updateTriggers: {
        getFillColor: [currentMetric],
        getElevation: [elevationEnabled],
        elevationScale: [elevationEnabled, elevationScale],
      },
    });

    // Highlight ring for selected hex
    const selectionLayer = selectedHex
      ? new H3HexagonLayer<H3HexData>({
          id: 'h3-selection-ring',
          data: [selectedHex],
          pickable: false,
          filled: false,
          extruded: false,
          wireframe: true,
          getHexagon: (d: H3HexData) => d.h3Index,
          getLineColor: [255, 255, 255, 220],
          lineWidthMinPixels: 3,
        })
      : null;

    return selectionLayer ? [hexLayer, selectionLayer] : [hexLayer];
  }, [
    data,
    currentMetric,
    elevationEnabled,
    elevationScale,
    selectedHex,
    handleHover,
    handleClick,
  ]);

  // ─── Render ──────────────────────────────────────────────────────────

  return (
    <div className="relative h-full w-full overflow-hidden">
      <DeckGL
        viewState={viewState}
        onViewStateChange={handleViewStateChange}
        controller={{
          dragPan: true,
          dragRotate: true,
          scrollZoom: true,
          touchZoom: true,
          touchRotate: true,
          doubleClickZoom: true,
          keyboard: true,
        }}
        layers={layers}
        getCursor={({ isHovering }: { isHovering: boolean }) =>
          isHovering ? 'pointer' : 'grab'
        }
      >
        <Map
          mapboxAccessToken={token}
          mapStyle={MAP_STYLE}
          projection={{ name: 'mercator' }}
          reuseMaps
        />
      </DeckGL>

      {/* Overlay Controls */}
      <MapControls
        activeMetric={currentMetric}
        onMetricChange={setActiveMetric}
        elevationEnabled={elevationEnabled}
        onElevationToggle={() => setElevationEnabled((v) => !v)}
        hexCount={data.length}
      />

      {/* Hover Tooltip */}
      {hoverInfo && (
        <MapTooltip hex={hoverInfo.hex} x={hoverInfo.x} y={hoverInfo.y} />
      )}

      {/* Selected Hex Info Bar */}
      {selectedHex && (
        <SelectedHexBar hex={selectedHex} onClose={() => setSelectedHex(null)} />
      )}
    </div>
  );
}

// ─── Selected Hex Info Bar ─────────────────────────────────────────────────────

import { X, MapPin, AlertTriangle, Shield } from 'lucide-react';
import {
  formatScore,
  formatCount,
  getCategoryIcon,
  getCategoryColor,
} from '@/lib/map-utils';

function SelectedHexBar({
  hex,
  onClose,
}: {
  hex: H3HexData;
  onClose: () => void;
}) {
  return (
    <div className="absolute bottom-4 left-1/2 z-40 -translate-x-1/2">
      <div className="flex items-center gap-5 rounded-2xl border border-white/15 bg-gray-900/90 px-6 py-4 shadow-2xl backdrop-blur-xl">
        {/* District & Category */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
            style={{ backgroundColor: `${getCategoryColor(hex.topCategory)}22` }}
          >
            {getCategoryIcon(hex.topCategory)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3 text-sky-400" />
              <span className="text-sm font-semibold text-white">{hex.districtName}</span>
            </div>
            <span className="text-xs text-gray-400">{hex.topCategory} • {formatCount(hex.complaintCount)} reports</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-10 w-px bg-white/15" />

        {/* Scores */}
        <div className="flex gap-4">
          <ScorePill label="Priority" value={hex.compositePriority} icon={<AlertTriangle className="h-3 w-3" />} />
          <ScorePill label="Demand" value={hex.demandScore} icon={<AlertTriangle className="h-3 w-3" />} />
          <ScorePill label="Deficit" value={hex.deficitScore} icon={<AlertTriangle className="h-3 w-3" />} />
        </div>

        {/* DPI Badge */}
        <div className="flex items-center gap-1.5">
          <Shield className={`h-4 w-4 ${hex.isCoveredByDPI ? 'text-emerald-400' : 'text-red-400'}`} />
          <span className={`text-xs font-medium ${hex.isCoveredByDPI ? 'text-emerald-400' : 'text-red-400'}`}>
            {hex.isCoveredByDPI ? 'DPI Active' : 'No DPI'}
          </span>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="ml-2 rounded-lg p-1.5 text-gray-500 hover:bg-white/10 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function ScorePill({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  const color =
    value > 0.75
      ? 'text-red-400'
      : value > 0.5
        ? 'text-orange-400'
        : value > 0.25
          ? 'text-yellow-400'
          : 'text-emerald-400';

  return (
    <div className="text-center">
      <div className={`flex items-center justify-center gap-1 text-sm font-bold ${color}`}>
        {icon}
        {formatScore(value)}
      </div>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  );
}
