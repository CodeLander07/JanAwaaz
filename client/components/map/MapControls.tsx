'use client';

/**
 * MapControls — Overlay control panel for the H3HotspotMap
 *
 * Provides metric selector, elevation toggle, and color legend.
 * Uses glassmorphism styling with lucide-react icons.
 */

import { useState } from 'react';
import { Layers, BarChart3, Eye, EyeOff, Palette, ChevronDown, ChevronUp } from 'lucide-react';
import type { ColorMetricKey } from '@/types/h3';
import { METRIC_LABELS, getLegendGradientCSS } from '@/lib/map-utils';

interface MapControlsProps {
  activeMetric: ColorMetricKey;
  onMetricChange: (metric: ColorMetricKey) => void;
  elevationEnabled: boolean;
  onElevationToggle: () => void;
  hexCount: number;
}

const METRICS: ColorMetricKey[] = ['compositePriority', 'demandScore', 'deficitScore'];

export default function MapControls({
  activeMetric,
  onMetricChange,
  elevationEnabled,
  onElevationToggle,
  hexCount,
}: MapControlsProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="absolute right-4 top-4 z-40 flex flex-col gap-3">
      {/* Main Control Panel */}
      <div className="rounded-2xl border border-white/15 bg-gray-900/80 shadow-2xl backdrop-blur-xl overflow-hidden transition-all duration-300">
        {/* Panel Header */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-sky-400" />
            <span className="text-sm font-semibold text-white">Map Controls</span>
          </div>
          {collapsed ? (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          )}
        </button>

        {!collapsed && (
          <div className="px-4 pb-4 space-y-4">
            {/* Metric Selector */}
            <div>
              <div className="mb-2 flex items-center gap-1.5">
                <Palette className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-xs font-medium text-gray-300">Color Metric</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {METRICS.map((metric) => (
                  <button
                    key={metric}
                    onClick={() => onMetricChange(metric)}
                    className={`rounded-lg px-3 py-1.5 text-left text-xs font-medium transition-all duration-200 ${
                      activeMetric === metric
                        ? 'bg-sky-500/20 text-sky-300 ring-1 ring-sky-500/40'
                        : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                    }`}
                  >
                    {METRIC_LABELS[metric]}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            {/* Elevation Toggle */}
            <div>
              <div className="mb-2 flex items-center gap-1.5">
                <BarChart3 className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-xs font-medium text-gray-300">3D Elevation</span>
              </div>
              <button
                onClick={onElevationToggle}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 ${
                  elevationEnabled
                    ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40'
                    : 'bg-white/5 text-gray-400'
                }`}
              >
                <span>{elevationEnabled ? 'Enabled' : 'Disabled'}</span>
                {elevationEnabled ? (
                  <Eye className="h-3.5 w-3.5" />
                ) : (
                  <EyeOff className="h-3.5 w-3.5" />
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            {/* Color Legend */}
            <div>
              <span className="mb-2 block text-xs font-medium text-gray-300">
                Priority Scale
              </span>
              <div
                className="h-3 w-full rounded-full"
                style={{ background: getLegendGradientCSS() }}
              />
              <div className="mt-1 flex justify-between text-[10px] text-gray-500">
                <span>Low (0%)</span>
                <span>High (100%)</span>
              </div>
            </div>

            {/* Hex Count Badge */}
            <div className="flex items-center justify-center gap-1.5 rounded-lg bg-white/5 py-1.5 text-[10px] text-gray-500">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
              {hexCount} hexagons loaded
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
