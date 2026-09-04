'use client';

/**
 * MapControls — HUD Control Panel for the Custom Node Map
 *
 * Provides view mode toggling (Node Graph vs Hexagons vs Hybrid),
 * metric selection, network edge visibility, category filtering,
 * and graph telemetry counters.
 */

import { useState } from 'react';
import {
  Layers,
  Palette,
  Network,
  Radio,
  Hexagon,
  ChevronDown,
  ChevronUp,
  Filter,
} from 'lucide-react';
import type { ColorMetricKey, ComplaintCategory } from '@/types/h3';
import {
  METRIC_LABELS,
  getLegendGradientCSS,
  getCategoryIcon,
  getCategoryColor,
} from '@/lib/map-utils';

export type ViewMode = 'graph' | 'hybrid' | 'hexagons';

interface MapControlsProps {
  activeMetric: ColorMetricKey;
  onMetricChange: (metric: ColorMetricKey) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showEdges: boolean;
  onToggleEdges: () => void;
  showPulseHalos: boolean;
  onTogglePulseHalos: () => void;
  activeCategory: ComplaintCategory | 'All';
  onCategoryChange: (cat: ComplaintCategory | 'All') => void;
  nodeCount: number;
  edgeCount: number;
  criticalCount: number;
}

const METRICS: ColorMetricKey[] = ['compositePriority', 'demandScore', 'deficitScore'];
const CATEGORIES: (ComplaintCategory | 'All')[] = [
  'All',
  'Water',
  'Transport',
  'Healthcare',
  'Energy',
  'Sanitation',
];

export default function MapControls({
  activeMetric,
  onMetricChange,
  viewMode,
  onViewModeChange,
  showEdges,
  onToggleEdges,
  showPulseHalos,
  onTogglePulseHalos,
  activeCategory,
  onCategoryChange,
  nodeCount,
  edgeCount,
  criticalCount,
}: MapControlsProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      id="map-controls-panel"
      aria-label="Map Visualization Controls"
      className="absolute right-4 top-4 z-40 w-72 sm:w-80 flex flex-col gap-2.5 pointer-events-auto select-none"
    >
      <div className="rounded-2xl border border-white/15 bg-neutral-950/85 backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-300">
        {/* Header */}
        <button
          id="map-controls-toggle-btn"
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Network className="h-4 w-4 text-sky-400" />
            <span className="text-xs sm:text-sm font-semibold text-white tracking-wide">
              Spatial Node Graph
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-sky-500/10 px-2 py-0.5 font-mono text-[10px] text-sky-400 border border-sky-500/20">
              {nodeCount} Nodes
            </span>
            {collapsed ? (
              <ChevronDown className="h-4 w-4 text-neutral-400" />
            ) : (
              <ChevronUp className="h-4 w-4 text-neutral-400" />
            )}
          </div>
        </button>

        {!collapsed && (
          <div className="px-4 pb-4 space-y-4 text-neutral-300">
            {/* View Mode Switcher */}
            <div>
              <div className="mb-2 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-sky-400" />
                <span className="text-xs font-medium text-neutral-300">Visualization Layer</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-neutral-900 border border-neutral-800">
                <button
                  type="button"
                  id="view-mode-graph-btn"
                  onClick={() => onViewModeChange('graph')}
                  className={`flex flex-col items-center justify-center gap-1 rounded-lg py-2 text-[11px] font-medium transition-all ${
                    viewMode === 'graph'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                  }`}
                >
                  <Network className="h-3.5 w-3.5" />
                  <span>Nodes</span>
                </button>
                <button
                  type="button"
                  id="view-mode-hybrid-btn"
                  onClick={() => onViewModeChange('hybrid')}
                  className={`flex flex-col items-center justify-center gap-1 rounded-lg py-2 text-[11px] font-medium transition-all ${
                    viewMode === 'hybrid'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                  }`}
                >
                  <Radio className="h-3.5 w-3.5" />
                  <span>Hybrid</span>
                </button>
                <button
                  type="button"
                  id="view-mode-hex-btn"
                  onClick={() => onViewModeChange('hexagons')}
                  className={`flex flex-col items-center justify-center gap-1 rounded-lg py-2 text-[11px] font-medium transition-all ${
                    viewMode === 'hexagons'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                  }`}
                >
                  <Hexagon className="h-3.5 w-3.5" />
                  <span>Hex Mesh</span>
                </button>
              </div>
            </div>

            {/* Metric Selector */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Palette className="h-3.5 w-3.5 text-purple-400" />
                  <span className="text-xs font-medium text-neutral-300">Priority Metric</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                {METRICS.map((metric) => (
                  <button
                    key={metric}
                    id={`metric-btn-${metric}`}
                    type="button"
                    onClick={() => onMetricChange(metric)}
                    className={`rounded-lg px-3 py-1.5 text-left text-xs font-medium transition-all duration-200 ${
                      activeMetric === metric
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold'
                        : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200 border border-transparent'
                    }`}
                  >
                    {METRIC_LABELS[metric]}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div>
              <div className="mb-2 flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-xs font-medium text-neutral-300">Sector Filter</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => onCategoryChange(cat)}
                      className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium transition-all ${
                        isActive
                          ? 'bg-white text-black font-semibold shadow-md'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                      }`}
                    >
                      {cat !== 'All' && <span>{getCategoryIcon(cat)}</span>}
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Graph Network Toggles */}
            <div className="space-y-2 pt-1 border-t border-neutral-800">
              <label className="flex items-center justify-between cursor-pointer py-1">
                <span className="text-xs text-neutral-300 flex items-center gap-1.5">
                  <Network className="h-3.5 w-3.5 text-neutral-400" />
                  <span>Network Interconnections</span>
                </span>
                <input
                  type="checkbox"
                  checked={showEdges}
                  onChange={onToggleEdges}
                  className="h-4 w-4 rounded accent-sky-500 cursor-pointer"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer py-1">
                <span className="text-xs text-neutral-300 flex items-center gap-1.5">
                  <Radio className="h-3.5 w-3.5 text-rose-400" />
                  <span>Hotspot Radar Halos</span>
                </span>
                <input
                  type="checkbox"
                  checked={showPulseHalos}
                  onChange={onTogglePulseHalos}
                  className="h-4 w-4 rounded accent-rose-500 cursor-pointer"
                />
              </label>
            </div>

            {/* Priority Scale Gradient Bar */}
            <div className="pt-2 border-t border-neutral-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-medium text-neutral-400">Score Gradient</span>
                <span className="text-[10px] text-neutral-500 font-mono">0.0 → 1.0</span>
              </div>
              <div
                className="h-2.5 w-full rounded-full border border-neutral-800 shadow-inner"
                style={{ background: getLegendGradientCSS() }}
              />
              <div className="mt-1 flex justify-between text-[10px] text-neutral-500 font-mono">
                <span>Low Distress</span>
                <span>Severe Hotspot</span>
              </div>
            </div>

            {/* Sector Color Legend */}
            <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-neutral-800 text-[10px] text-neutral-400">
              {(['Water', 'Transport', 'Healthcare', 'Energy', 'Sanitation'] as ComplaintCategory[]).map(
                (c) => (
                  <div key={c} className="flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full inline-block"
                      style={{ backgroundColor: getCategoryColor(c) }}
                    />
                    <span>
                      {getCategoryIcon(c)} {c}
                    </span>
                  </div>
                )
              )}
            </div>

            {/* Real-time Telemetry Stats */}
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-neutral-900/90 border border-neutral-800 p-2 text-center text-[10px]">
              <div>
                <span className="block font-mono text-xs font-bold text-sky-400">{nodeCount}</span>
                <span className="text-neutral-500">Points</span>
              </div>
              <div>
                <span className="block font-mono text-xs font-bold text-amber-400">{edgeCount}</span>
                <span className="text-neutral-500">Edges</span>
              </div>
              <div>
                <span className="block font-mono text-xs font-bold text-rose-400">{criticalCount}</span>
                <span className="text-neutral-500">Critical</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
