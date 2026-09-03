'use client';

/**
 * MapTooltip — Hover tooltip for H3 hex cells
 *
 * Renders a floating dark glassmorphism card at the cursor position
 * showing hex metadata, scores, and DPI coverage status.
 */

import type { H3HexData } from '@/types/h3';
import {
  formatScore,
  formatCount,
  getCategoryIcon,
  getCategoryColor,
} from '@/lib/map-utils';

interface MapTooltipProps {
  hex: H3HexData;
  x: number;
  y: number;
}

export default function MapTooltip({ hex, x, y }: MapTooltipProps) {
  return (
    <div
      className="pointer-events-none fixed z-50"
      style={{
        left: x + 12,
        top: y - 12,
      }}
    >
      <div className="rounded-xl border border-white/10 bg-gray-900/90 px-4 py-3 shadow-2xl backdrop-blur-xl min-w-[240px]">
        {/* Header */}
        <div className="mb-2 flex items-center justify-between gap-3">
          <h4 className="text-sm font-semibold text-white truncate">
            {hex.districtName}
          </h4>
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
            style={{
              backgroundColor: `${getCategoryColor(hex.topCategory)}22`,
              color: getCategoryColor(hex.topCategory),
            }}
          >
            {getCategoryIcon(hex.topCategory)} {hex.topCategory}
          </span>
        </div>

        {/* Divider */}
        <div className="mb-2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Scores Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
          <ScoreRow label="Composite" value={hex.compositePriority} highlight />
          <ScoreRow label="Demand" value={hex.demandScore} />
          <ScoreRow label="Vulnerability" value={hex.vulnerabilityScore} />
          <ScoreRow label="Deficit" value={hex.deficitScore} />
        </div>

        {/* Footer */}
        <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2">
          <span className="text-xs text-gray-400">
            📊 {formatCount(hex.complaintCount)} reports
          </span>
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium ${
              hex.isCoveredByDPI ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {hex.isCoveredByDPI ? '✅' : '❌'} DPI
          </span>
        </div>
      </div>
    </div>
  );
}

function ScoreRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  const barWidth = `${(value * 100).toFixed(0)}%`;
  const barColor =
    value > 0.75
      ? 'bg-red-500'
      : value > 0.5
        ? 'bg-orange-400'
        : value > 0.25
          ? 'bg-yellow-400'
          : 'bg-emerald-400';

  return (
    <>
      <span className={`text-gray-400 ${highlight ? 'font-semibold text-white' : ''}`}>
        {label}
      </span>
      <div className="flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full rounded-full ${barColor} transition-all`}
            style={{ width: barWidth }}
          />
        </div>
        <span className={`font-mono text-[10px] ${highlight ? 'text-white' : 'text-gray-300'}`}>
          {formatScore(value)}
        </span>
      </div>
    </>
  );
}
