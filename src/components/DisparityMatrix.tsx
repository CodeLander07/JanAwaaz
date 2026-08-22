import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Layers,
  ArrowUpDown,
  Filter,
  Droplets,
  Compass,
  Activity,
  Zap,
  Building,
  CheckCircle2,
  ChevronRight,
  Info,
  DollarSign,
  Users,
} from 'lucide-react';
import { DistrictIndicator, HotspotCluster } from '../types';

interface DisparityMatrixProps {
  districts: DistrictIndicator[];
  hotspots: HotspotCluster[];
  onSelectHotspot: (hotspot: HotspotCluster) => void;
  onOpenDprForDistrict: (district: DistrictIndicator) => void;
}

export const DisparityMatrix: React.FC<DisparityMatrixProps> = ({
  districts,
  hotspots,
  onSelectHotspot,
  onOpenDprForDistrict,
}) => {
  const [sortField, setSortField] = useState<
    'disparityScore' | 'povertyIndex' | 'jalJeevanCoveragePercent' | 'pmgsyRoadConnectivityPercent' | 'approvedCapexCr'
  >('disparityScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterAspirational, setFilterAspirational] = useState<boolean>(false);
  const [selectedQuadrant, setSelectedQuadrant] = useState<string>('all');

  // Compute Disparity Score for each district:
  // Disparity Score = (100 - JJM%)*0.3 + (100 - PMGSY%)*0.3 + (PovertyIndex)*0.25 + (PHC Deficit * 10)*0.15
  const scoredDistricts = useMemo(() => {
    return districts.map((d) => {
      const relatedHotspot = hotspots.find(
        (h) => h.district.toLowerCase() === d.district.toLowerCase()
      );

      const infraDeficit =
        (100 - d.jalJeevanCoveragePercent) * 0.35 +
        (100 - d.pmgsyRoadConnectivityPercent) * 0.35 +
        d.phcDeficitPer10k * 10 * 0.3;

      const citizenDemandUrgency = relatedHotspot ? relatedHotspot.aggregateUrgency : 50;

      const disparityScore =
        infraDeficit * 0.45 +
        citizenDemandUrgency * 0.35 +
        d.povertyIndex * 0.2;

      const unmetCapexGapCr = d.approvedCapexCr * (1 - d.utilizedCapexPercent / 100);

      // Determine Quadrant
      let quadrant = 'baseline';
      if (infraDeficit >= 45 && citizenDemandUrgency >= 75) {
        quadrant = 'critical_action'; // High Deficit + High Citizen Voice
      } else if (infraDeficit < 45 && citizenDemandUrgency >= 75) {
        quadrant = 'service_failure'; // Moderate Deficit + High Voice (Maintenance/operational failure)
      } else if (infraDeficit >= 45 && citizenDemandUrgency < 75) {
        quadrant = 'dark_spot'; // High Deficit + Low Voice (Under-reported outreach need)
      }

      return {
        ...d,
        infraDeficit,
        citizenDemandUrgency,
        disparityScore,
        unmetCapexGapCr,
        quadrant,
        relatedHotspot,
      };
    });
  }, [districts, hotspots]);

  // Filtered & Sorted list
  const filteredAndSortedDistricts = useMemo(() => {
    let result = scoredDistricts;

    if (filterAspirational) {
      result = result.filter((d) => d.isAspirational);
    }

    if (selectedQuadrant !== 'all') {
      result = result.filter((d) => d.quadrant === selectedQuadrant);
    }

    result.sort((a, b) => {
      const aVal = (a as any)[sortField];
      const bVal = (b as any)[sortField];
      if (sortDirection === 'asc') return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

    return result;
  }, [scoredDistricts, filterAspirational, selectedQuadrant, sortField, sortDirection]);

  const handleSort = (field: any) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div id="disparity-matrix-view" className="space-y-6">
      {/* Top Header Card - Geometric Balance */}
      <div className="bg-white border border-slate-200 rounded-sm p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xs font-bold text-indigo-900 uppercase tracking-widest flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-orange-500" />
              <span>Multi-Source Disparity Gap Matrix</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Cross-referencing Citizen Demand (Voice/Text) × NITI Aayog Infrastructure Indices × Public Capex Utilization
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={() => setFilterAspirational(!filterAspirational)}
              className={`px-3 py-1.5 rounded-sm font-bold uppercase tracking-wider text-xs transition-all cursor-pointer ${
                filterAspirational
                  ? 'bg-indigo-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              NITI Aspirational Only ({districts.filter((d) => d.isAspirational).length})
            </button>
          </div>
        </div>
      </div>

      {/* 2D Interactive Quadrant Analysis Matrix */}
      <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-widest flex items-center space-x-2">
              <Layers className="w-4 h-4 text-orange-500" />
              <span>2D Policy Decision Quadrant (Demand Urgency vs. Infrastructure Deficit)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Surfaces high-priority intervention corridors where acute citizen distress coincides with deep structural deficits.
            </p>
          </div>

          <div className="flex items-center space-x-1.5 text-xs">
            <button
              onClick={() => setSelectedQuadrant('all')}
              className={`px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider cursor-pointer ${
                selectedQuadrant === 'all' ? 'bg-indigo-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedQuadrant('critical_action')}
              className={`px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider cursor-pointer ${
                selectedQuadrant === 'critical_action' ? 'bg-orange-600 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Critical Hotspots
            </button>
            <button
              onClick={() => setSelectedQuadrant('dark_spot')}
              className={`px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider cursor-pointer ${
                selectedQuadrant === 'dark_spot' ? 'bg-amber-600 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Under-reported Zones
            </button>
          </div>
        </div>

        {/* 2x2 Grid Visualization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Quadrant 1: Critical Action Hotspots (Top-Right) */}
          <div
            onClick={() => setSelectedQuadrant('critical_action')}
            className={`border rounded-sm p-4 transition-all cursor-pointer ${
              selectedQuadrant === 'critical_action'
                ? 'bg-orange-50/50 border-orange-500 border-l-4 border-l-orange-600 shadow-xs'
                : 'bg-slate-50 border-slate-200 border-l-4 border-l-orange-500 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-orange-700 uppercase tracking-widest flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
                <span>QUADRANT I: CRITICAL ACTION HOTSPOTS</span>
              </span>
              <span className="text-[10px] bg-orange-100 text-orange-900 px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider border border-orange-200">
                High Demand • High Deficit
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed font-medium">
              Regions facing acute citizen distress and deep infrastructure deprivation. Recommended for immediate fast-tracked DPR funding.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {scoredDistricts
                .filter((d) => d.quadrant === 'critical_action')
                .map((d) => (
                  <span
                    key={d.district}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (d.relatedHotspot) onSelectHotspot(d.relatedHotspot);
                    }}
                    className="bg-white text-orange-900 border border-orange-200 px-2.5 py-1 rounded-sm text-xs font-bold hover:bg-orange-100 cursor-pointer shadow-xs"
                  >
                    {d.district} ({d.disparityScore.toFixed(0)})
                  </span>
                ))}
            </div>
          </div>

          {/* Quadrant 2: Service Delivery Failures (Top-Left) */}
          <div
            onClick={() => setSelectedQuadrant('service_failure')}
            className={`border rounded-sm p-4 transition-all cursor-pointer ${
              selectedQuadrant === 'service_failure'
                ? 'bg-indigo-50/50 border-indigo-500 border-l-4 border-l-indigo-600 shadow-xs'
                : 'bg-slate-50 border-slate-200 border-l-4 border-l-indigo-600 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-widest flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
                <span>QUADRANT II: OPERATIONAL &amp; O&amp;M FAILURES</span>
              </span>
              <span className="text-[10px] bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider border border-indigo-200">
                High Demand • Moderate Deficit
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed font-medium">
              Assets physically exist on paper but operational outages, doctor absenteeism, or pump breakdowns trigger high citizen distress.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {scoredDistricts
                .filter((d) => d.quadrant === 'service_failure')
                .map((d) => (
                  <span
                    key={d.district}
                    className="bg-white text-indigo-900 border border-indigo-200 px-2.5 py-1 rounded-sm text-xs font-bold shadow-xs"
                  >
                    {d.district} ({d.disparityScore.toFixed(0)})
                  </span>
                ))}
            </div>
          </div>

          {/* Quadrant 3: Under-Reported Dark Spots (Bottom-Right) */}
          <div
            onClick={() => setSelectedQuadrant('dark_spot')}
            className={`border rounded-sm p-4 transition-all cursor-pointer ${
              selectedQuadrant === 'dark_spot'
                ? 'bg-amber-50/50 border-amber-500 border-l-4 border-l-amber-600 shadow-xs'
                : 'bg-slate-50 border-slate-200 border-l-4 border-l-amber-500 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-widest flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>QUADRANT III: UNDER-REPORTED VULNERABLE ZONES</span>
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider border border-amber-200">
                Low Voice • High Deficit
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed font-medium">
              Severe infrastructure deprivation but low voice volume due to digital divide or remote forest terrain. Requires targeted outreach.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {scoredDistricts
                .filter((d) => d.quadrant === 'dark_spot')
                .map((d) => (
                  <span
                    key={d.district}
                    className="bg-white text-amber-900 border border-amber-200 px-2.5 py-1 rounded-sm text-xs font-bold shadow-xs"
                  >
                    {d.district} ({d.disparityScore.toFixed(0)})
                  </span>
                ))}
            </div>
          </div>

          {/* Quadrant 4: Baseline Saturated (Bottom-Left) */}
          <div
            onClick={() => setSelectedQuadrant('baseline')}
            className={`border rounded-sm p-4 transition-all cursor-pointer ${
              selectedQuadrant === 'baseline'
                ? 'bg-emerald-50/50 border-emerald-500 border-l-4 border-l-emerald-600 shadow-xs'
                : 'bg-slate-50 border-slate-200 border-l-4 border-l-emerald-600 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-widest flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>QUADRANT IV: CORE BASELINE COVERAGE</span>
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider border border-emerald-200">
                Low Demand • Low Deficit
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed font-medium">
              Districts with robust tap water coverage, all-weather road saturation, and adequate healthcare infrastructure.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {scoredDistricts
                .filter((d) => d.quadrant === 'baseline')
                .map((d) => (
                  <span
                    key={d.district}
                    className="bg-white text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded-sm text-xs font-bold shadow-xs"
                  >
                    {d.district} ({d.disparityScore.toFixed(0)})
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive District Multi-Index Leaderboard */}
      <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-widest flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>National Infrastructure Disparity Leaderboard ({filteredAndSortedDistricts.length} Districts)</span>
          </h3>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Click column headers to sort</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">District &amp; State</th>
                <th
                  onClick={() => handleSort('disparityScore')}
                  className="py-3 px-3 cursor-pointer hover:text-indigo-900"
                >
                  <div className="flex items-center space-x-1">
                    <span>Disparity Index</span>
                    <ArrowUpDown className="w-3 h-3 text-orange-500" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('jalJeevanCoveragePercent')}
                  className="py-3 px-3 cursor-pointer hover:text-indigo-900"
                >
                  <div className="flex items-center space-x-1">
                    <span>JJM Water %</span>
                    <ArrowUpDown className="w-3 h-3 text-indigo-600" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('pmgsyRoadConnectivityPercent')}
                  className="py-3 px-3 cursor-pointer hover:text-indigo-900"
                >
                  <div className="flex items-center space-x-1">
                    <span>PMGSY Road %</span>
                    <ArrowUpDown className="w-3 h-3 text-indigo-600" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('povertyIndex')}
                  className="py-3 px-3 cursor-pointer hover:text-indigo-900"
                >
                  <div className="flex items-center space-x-1">
                    <span>Poverty %</span>
                    <ArrowUpDown className="w-3 h-3 text-indigo-600" />
                  </div>
                </th>
                <th className="py-3 px-3">PHC Deficit / 10k</th>
                <th
                  onClick={() => handleSort('approvedCapexCr')}
                  className="py-3 px-3 cursor-pointer hover:text-indigo-900"
                >
                  <div className="flex items-center space-x-1">
                    <span>Capex &amp; Unmet Gap</span>
                    <ArrowUpDown className="w-3 h-3 text-indigo-600" />
                  </div>
                </th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredAndSortedDistricts.map((d) => (
                <tr key={d.district} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                      <span>{d.district}</span>
                      {d.isAspirational && (
                        <span className="bg-orange-100 text-orange-900 text-[9px] px-1.5 py-0.2 rounded-sm font-bold border border-orange-200 uppercase tracking-wider">
                          ASP #{d.nitiDeltaRank}
                        </span>
                      )}
                      {d.isTribalDominant && (
                        <span className="bg-purple-100 text-purple-900 text-[9px] px-1.5 py-0.2 rounded-sm font-bold uppercase tracking-wider">
                          Tribal
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500">{d.state}</span>
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`font-mono font-bold text-xs ${
                          d.disparityScore >= 80
                            ? 'text-orange-600'
                            : d.disparityScore >= 65
                            ? 'text-amber-600'
                            : 'text-emerald-700'
                        }`}
                      >
                        {d.disparityScore.toFixed(1)}
                      </span>
                      <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            d.disparityScore >= 80
                              ? 'bg-orange-600'
                              : d.disparityScore >= 65
                              ? 'bg-amber-500'
                              : 'bg-emerald-600'
                          }`}
                          style={{ width: `${d.disparityScore}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`font-bold ${
                        d.jalJeevanCoveragePercent < 45 ? 'text-orange-600' : 'text-slate-900'
                      }`}
                    >
                      {d.jalJeevanCoveragePercent}%
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`font-bold ${
                        d.pmgsyRoadConnectivityPercent < 60 ? 'text-orange-600' : 'text-slate-900'
                      }`}
                    >
                      {d.pmgsyRoadConnectivityPercent}%
                    </span>
                  </td>

                  <td className="py-3 px-3 font-semibold text-slate-700">{d.povertyIndex}%</td>

                  <td className="py-3 px-3 font-semibold text-slate-700">{d.phcDeficitPer10k}</td>

                  <td className="py-3 px-3">
                    <div className="text-slate-900 font-bold">₹{d.approvedCapexCr} Cr</div>
                    <span className="text-[10px] text-orange-600 font-semibold block">
                      Unspent: ₹{d.unmetCapexGapCr.toFixed(1)} Cr ({100 - d.utilizedCapexPercent}%)
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onOpenDprForDistrict(d)}
                      className="bg-indigo-900 hover:bg-indigo-800 text-white font-bold uppercase tracking-wider px-3 py-1.5 rounded-sm text-xs shadow-xs transition-all cursor-pointer"
                    >
                      Draft DPR
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
