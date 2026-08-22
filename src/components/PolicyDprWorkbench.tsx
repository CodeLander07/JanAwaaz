import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Sparkles,
  CheckCircle2,
  Download,
  Printer,
  Clock,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Building2,
  Layers,
  MapPin,
  FileText,
  Loader2,
  ChevronRight,
  Award,
  Leaf,
  Globe,
  Share2,
  FolderCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DetailedProjectReport, HotspotCluster, DistrictIndicator } from '../types';

interface PolicyDprWorkbenchProps {
  hotspots: HotspotCluster[];
  districts: DistrictIndicator[];
  activeDpr: DetailedProjectReport | null;
  onSetActiveDpr: (dpr: DetailedProjectReport) => void;
  selectedLanguage: string;
}

export const PolicyDprWorkbench: React.FC<PolicyDprWorkbenchProps> = ({
  hotspots,
  districts,
  activeDpr,
  onSetActiveDpr,
  selectedLanguage,
}) => {
  const [isGeneratingDpr, setIsGeneratingDpr] = useState<boolean>(false);
  const [selectedHotspotId, setSelectedHotspotId] = useState<string>(hotspots[0]?.id || '');
  const [sanctionSuccess, setSanctionSuccess] = useState<boolean>(false);

  // Trigger Gemini DPR Generation
  const handleGenerateDpr = async (hotspotToUse?: HotspotCluster) => {
    const targetHotspot = hotspotToUse || hotspots.find((h) => h.id === selectedHotspotId) || hotspots[0];
    if (!targetHotspot) return;

    setIsGeneratingDpr(true);
    setSanctionSuccess(false);

    try {
      const relatedDistrict = districts.find(
        (d) => d.district.toLowerCase() === targetHotspot.district.toLowerCase()
      );

      const res = await fetch('/api/generate-dpr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotspot: targetHotspot,
          districtProfile: relatedDistrict,
          targetLanguage: selectedLanguage,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        const dpr: DetailedProjectReport = {
          ...data.data,
          status: 'Under NITI Appraisal',
        };
        onSetActiveDpr(dpr);
      }
    } catch (err: any) {
      console.error('Error generating DPR:', err);
      alert('Failed to generate DPR: ' + err.message);
    } finally {
      setIsGeneratingDpr(false);
    }
  };

  // Sanction Project Action
  const handleSanctionProject = () => {
    if (!activeDpr) return;

    // Trigger celebration confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    const updatedDpr: DetailedProjectReport = {
      ...activeDpr,
      status: 'Sanctioned & Fast-Tracked',
      sanctionDate: new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };

    onSetActiveDpr(updatedDpr);
    setSanctionSuccess(true);
  };

  // Print DPR
  const handlePrintDpr = () => {
    window.print();
  };

  return (
    <div id="policy-dpr-workbench" className="space-y-6">
      {/* Top Header & Fast Generator Selector */}
      <div className="bg-white border border-slate-200 rounded-sm p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xs font-bold text-indigo-900 uppercase tracking-widest flex items-center space-x-2">
              <FileSpreadsheet className="w-4 h-4 text-orange-500" />
              <span>National AI Project Appraisal &amp; DPR Generator</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Converts citizen demand hotspots into bankable Government of India Detailed Project Reports (EFC/PIB standard)
            </p>
          </div>

          {/* Quick Hotspot DPR Formulator */}
          <div className="flex items-center space-x-2">
            <select
              value={selectedHotspotId}
              onChange={(e) => setSelectedHotspotId(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-sm px-3 py-2 focus:ring-1 focus:ring-indigo-500 cursor-pointer max-w-xs font-medium"
            >
              {hotspots.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.district} ({h.state}) • {h.title}
                </option>
              ))}
            </select>

            <button
              id="synthesize-dpr-btn"
              disabled={isGeneratingDpr}
              onClick={() => handleGenerateDpr()}
              className="bg-indigo-900 hover:bg-indigo-800 text-white font-bold uppercase tracking-wider px-4 py-2 rounded-sm text-xs shadow-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 transition-colors"
            >
              {isGeneratingDpr ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing DPR...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <span>Synthesize Bankable DPR</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Priority Recommendations List (Left 4 cols) + Full DPR View (Right 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recommended Projects Pipeline (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1 border-b border-slate-200 pb-2">
            <span className="text-xs font-bold text-indigo-900 uppercase tracking-widest">
              High-Priority Project Pipeline
            </span>
            <span className="text-[11px] text-orange-600 font-bold uppercase tracking-wider">{hotspots.length} Recommendations</span>
          </div>

          <div className="space-y-3">
            {hotspots.map((h) => {
              const isSelected = activeDpr?.locationSummary?.includes(h.district) || selectedHotspotId === h.id;
              const isCritical = h.priorityRank.includes('CRITICAL');
              return (
                <div
                  key={h.id}
                  onClick={() => {
                    setSelectedHotspotId(h.id);
                    handleGenerateDpr(h);
                  }}
                  className={`p-4 rounded-sm border transition-all cursor-pointer text-xs space-y-2 ${
                    isSelected
                      ? 'bg-slate-50 border-indigo-500 border-l-4 border-l-orange-500 shadow-xs'
                      : 'bg-white border-slate-200 border-l-4 hover:border-slate-300 ' + (isCritical ? 'border-l-orange-500' : 'border-l-indigo-600')
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider ${
                        isCritical
                          ? 'bg-orange-100 text-orange-900 border border-orange-200'
                          : 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                      }`}
                    >
                      {h.priorityRank}
                    </span>
                    <span className="text-orange-600 font-bold text-[11px] font-mono">
                      {h.disparityGapIndex.toFixed(1)} Gap Index
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 leading-snug">{h.title}</h4>
                  <p className="text-[11px] text-slate-500 flex items-center font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1" />
                    {h.district}, {h.state} • {h.sector}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-500">
                    <span className="font-medium">{h.requestCount} Citizen Claims</span>
                    <span className="text-indigo-900 font-bold uppercase tracking-wider flex items-center">
                      Generate DPR <ChevronRight className="w-3.5 h-3.5 ml-0.5 text-orange-500" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Full Detailed Project Report Viewer (8 cols) */}
        <div className="lg:col-span-8">
          {activeDpr ? (
            <div
              id="detailed-project-report-canvas"
              className="bg-white border border-slate-200 rounded-sm p-6 sm:p-8 shadow-xs space-y-6 relative overflow-hidden"
            >
              {/* Official Government Watermark Badge */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-5">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-sm bg-slate-50 border border-slate-200 p-2 flex items-center justify-center text-indigo-900 shadow-xs">
                    <Building2 className="w-7 h-7 text-indigo-900" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-orange-600 uppercase">
                      Government of India • NITI Aayog Public Investment Board
                    </span>
                    <h3 className="text-base font-bold text-slate-900 leading-tight mt-0.5">
                      {activeDpr.projectTitle}
                    </h3>
                    <span className="text-xs text-slate-500 font-mono">
                      Project Code: <strong className="text-slate-800">{activeDpr.projectCode}</strong> • Sector: <strong className="text-slate-800">{activeDpr.sector}</strong>
                    </span>
                  </div>
                </div>

                {/* Status Badge & Actions */}
                <div className="flex flex-col items-end space-y-2">
                  <span
                    className={`px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 ${
                      activeDpr.status === 'Sanctioned & Fast-Tracked'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-orange-100 text-orange-900 border border-orange-300'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{activeDpr.status}</span>
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handlePrintDpr}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-sm text-xs flex items-center space-x-1 cursor-pointer border border-slate-200"
                      title="Print Official DPR"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Sanction Banner if approved */}
              {sanctionSuccess && (
                <div className="bg-emerald-50 border border-emerald-300 border-l-4 border-l-emerald-600 rounded-sm p-4 text-xs text-emerald-900 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Award className="w-6 h-6 text-emerald-700 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900 block uppercase tracking-wider">
                        Project Formally Sanctioned for Fast-Track Execution!
                      </span>
                      <span className="text-slate-600 font-medium">
                        Budget allocation routed to <strong>{activeDpr.implementingMinistry}</strong> and{' '}
                        <strong>{activeDpr.nodalStateAgency}</strong>. Geotagged milestone tracking enabled.
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-800 font-mono font-bold">
                    {activeDpr.sanctionDate}
                  </span>
                </div>
              )}

              {/* Core Financial & Timeline Summary Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-slate-50 border border-slate-200 rounded-sm p-3">
                  <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">Estimated Capex</span>
                  <span className="text-xl font-black text-orange-600 font-mono">
                    ₹{activeDpr.estimatedCapexCr} Cr
                  </span>
                  <span className="text-[9px] text-slate-400 block font-medium">PIB Approved Ceiling</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-sm p-3">
                  <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">Execution Timeline</span>
                  <span className="text-xl font-black text-slate-900 font-mono">
                    {activeDpr.timelineMonths} Mos
                  </span>
                  <span className="text-[9px] text-slate-400 block font-medium">Fast-Track Mode</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-sm p-3">
                  <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">Implementing Ministry</span>
                  <span className="text-xs font-bold text-indigo-900 block truncate mt-1">
                    {activeDpr.implementingMinistry}
                  </span>
                  <span className="text-[9px] text-slate-400 block font-medium">Union Government</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-sm p-3">
                  <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">Nodal State Agency</span>
                  <span className="text-xs font-bold text-indigo-900 block truncate mt-1">
                    {activeDpr.nodalStateAgency}
                  </span>
                  <span className="text-[9px] text-slate-400 block font-medium">State Division</span>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-widest flex items-center space-x-1.5">
                  <FileText className="w-4 h-4 text-orange-500" />
                  <span>1. Executive Summary &amp; Ground Evidence</span>
                </h4>
                <div className="bg-slate-50 border border-slate-200 rounded-sm p-4 text-xs text-slate-700 space-y-2 leading-relaxed font-medium">
                  <p>{activeDpr.executiveSummary}</p>
                  <div className="border-t border-slate-200 pt-2 text-[11px] text-slate-600">
                    <strong className="text-slate-900">Ground Evidence Synthesis: </strong>
                    {activeDpr.groundEvidence}
                  </div>
                </div>
              </div>

              {/* Technical Specifications & Solution */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-widest flex items-center space-x-1.5">
                  <Layers className="w-4 h-4 text-orange-500" />
                  <span>2. Technical Specification &amp; Engineering Solution</span>
                </h4>
                <div className="bg-slate-50 border border-slate-200 rounded-sm p-4 text-xs text-slate-700 leading-relaxed font-medium">
                  {activeDpr.technicalSolution}
                </div>
              </div>

              {/* Capex Breakdown Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-widest flex items-center space-x-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>3. Financial Modeling &amp; Capex Component Breakdown</span>
                </h4>
                <div className="bg-white border border-slate-200 rounded-sm overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-2.5 px-4">Component</th>
                        <th className="py-2.5 px-4">Description</th>
                        <th className="py-2.5 px-4 text-right">Cost (₹ Crores)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {activeDpr.capexBreakdown.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60">
                          <td className="py-2.5 px-4 font-bold text-slate-900">{item.component}</td>
                          <td className="py-2.5 px-4 text-slate-500 text-[11px] font-medium">
                            {item.description || 'Execution works & commissioning'}
                          </td>
                          <td className="py-2.5 px-4 text-right font-bold text-orange-600 font-mono">
                            ₹{item.costCr.toFixed(2)} Cr
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
                        <td colSpan={2} className="py-3 px-4 uppercase tracking-wider text-[11px]">
                          Total PIB Sanction Ceiling
                        </td>
                        <td className="py-3 px-4 text-right text-emerald-700 font-bold font-mono text-sm">
                          ₹{activeDpr.estimatedCapexCr.toFixed(2)} Cr
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* PM Gati Shakti & Socio-Economic Impact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 border-l-4 border-l-emerald-600 rounded-sm p-4 space-y-2 text-xs">
                  <span className="font-bold text-emerald-900 uppercase tracking-wider flex items-center space-x-1.5 text-xs">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>PM Gati Shakti Master Plan Synergy</span>
                  </span>
                  <p className="text-slate-600 leading-relaxed text-[11px] font-medium">
                    {activeDpr.gatiShaktiSynergy}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 border-l-4 border-l-indigo-600 rounded-sm p-4 space-y-2 text-xs">
                  <span className="font-bold text-indigo-900 uppercase tracking-wider flex items-center space-x-1.5 text-xs">
                    <Leaf className="w-4 h-4 text-indigo-600" />
                    <span>Climate Resilience &amp; ESG Assessment</span>
                  </span>
                  <p className="text-slate-600 leading-relaxed text-[11px] font-medium">
                    {activeDpr.climateResilience}
                  </p>
                </div>
              </div>

              {/* Socio-Economic Impact KPIs */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-widest">
                  4. Projected Socio-Economic Impact Metrics (S-ROI)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {activeDpr.impactMetrics.map((kpi, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-sm p-3 text-xs">
                      <span className="font-bold text-slate-900 block mb-1">{kpi.metric}</span>
                      <div className="flex justify-between text-[11px] text-slate-500 border-t border-slate-200 pt-1 font-medium">
                        <span>Baseline: {kpi.baseline}</span>
                        <span className="font-bold text-emerald-700">Target: {kpi.target}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Localized Bilingual Citizen Brief */}
              <div className="bg-orange-50/50 border border-orange-200 border-l-4 border-l-orange-500 rounded-sm p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-orange-900 uppercase tracking-widest flex items-center space-x-1.5">
                    <Globe className="w-4 h-4 text-orange-600" />
                    <span>5. Multilingual Citizen Summary (Gram Sabha Notice)</span>
                  </h4>
                  <span className="text-[10px] bg-orange-100 text-orange-900 px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider border border-orange-200">
                    Auto-Translated via Bhashini
                  </span>
                </div>

                <div className="bg-white border border-orange-200 rounded-sm p-3 text-xs space-y-2 shadow-xs">
                  <p className="text-slate-900 font-medium text-xs leading-relaxed">
                    {activeDpr.citizenBriefVernacular}
                  </p>
                  <p className="text-slate-500 text-[11px] border-t border-slate-100 pt-1.5 font-medium">
                    <strong className="text-slate-800">English Briefing: </strong>
                    {activeDpr.citizenBriefEnglish}
                  </p>
                </div>
              </div>

              {/* Action Buttons for Policymakers */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
                <div className="text-xs text-slate-500">
                  <span className="font-medium">Recommendation: </span>
                  <strong className="text-slate-800">{activeDpr.recommendedActionForPolicymakers}</strong>
                </div>

                <div className="flex items-center space-x-3">
                  {activeDpr.status !== 'Sanctioned & Fast-Tracked' && (
                    <button
                      id="sanction-fast-track-btn"
                      onClick={handleSanctionProject}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold uppercase tracking-wider py-2.5 px-5 rounded-sm text-xs shadow-xs flex items-center space-x-2 cursor-pointer transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-100" />
                      <span>Sanction Project &amp; Route to Ministry</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-sm p-12 text-center space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-sm bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-indigo-900">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-widest">No Detailed Project Report Loaded</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                Select any priority hotspot from the left or spatial map, and click "Synthesize DPR" to formulate an official appraisal document.
              </p>
              <button
                onClick={() => handleGenerateDpr()}
                className="bg-indigo-900 hover:bg-indigo-800 text-white font-bold uppercase tracking-wider px-5 py-2.5 rounded-sm text-xs shadow-xs cursor-pointer transition-colors"
              >
                Synthesize Top Priority DPR Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
