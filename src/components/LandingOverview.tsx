import React from 'react';
import {
  Sparkles,
  MapPin,
  Mic,
  BarChart3,
  FileSpreadsheet,
  Globe2,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  Layers,
  Database,
  Users,
  Compass,
  Cpu,
  Workflow,
  Radio,
  FileCode2,
  Share2,
  Building,
  Check,
  TrendingUp,
  Activity,
  Award,
} from 'lucide-react';
import { GLOBAL_COUNTRY_PROFILES } from '../data/indianLanguages';

interface LandingOverviewProps {
  onNavigateTab: (tab: 'overview' | 'map' | 'ingest' | 'matrix' | 'dpr') => void;
  onOpenDpgModal: () => void;
  onOpenAiAssistant: () => void;
  totalRequests: number;
  criticalHotspotsCount: number;
  totalBeneficiaries: number;
}

export const LandingOverview: React.FC<LandingOverviewProps> = ({
  onNavigateTab,
  onOpenDpgModal,
  onOpenAiAssistant,
  totalRequests,
  criticalHotspotsCount,
  totalBeneficiaries,
}) => {
  const pipelineSteps = [
    {
      step: '01',
      title: 'Omnichannel Citizen Intake',
      icon: Mic,
      badge: 'Multilingual Ingest',
      color: 'border-l-orange-500 text-orange-600',
      bgGlow: 'bg-orange-50',
      description:
        'Captures grassroots citizen infrastructure requests via toll-free voice IVR, WhatsApp chatbots, SMS shortcodes, and civic kiosks in any native language or spoken dialect.',
      subpoints: [
        'Real-time Speech-to-Text & Dialect Normalization',
        'Automatic Sector & Sentiment Classification',
        'Privacy-preserving demographic and spatial geocoding',
      ],
      actionTab: 'ingest' as const,
      cta: 'Explore Intake Channels',
    },
    {
      step: '02',
      title: 'Spatial Geocoding & Hotspot Clustering',
      icon: MapPin,
      badge: 'GIS Clustering',
      color: 'border-l-indigo-600 text-indigo-600',
      bgGlow: 'bg-indigo-50',
      description:
        'Transforms unstructured citizen claims into high-density geospatial clusters and priority demand nodes across administrative boundaries and remote regions.',
      subpoints: [
        'Density-based spatial cluster aggregation',
        'Radius impact modeling for affected populations',
        'Direct overlay with regional infrastructure maps',
      ],
      actionTab: 'map' as const,
      cta: 'View Spatial Heatmap',
    },
    {
      step: '03',
      title: 'AI Disparity & Fiscal Gap Matrix',
      icon: BarChart3,
      badge: 'Decision Matrix',
      color: 'border-l-purple-600 text-purple-600',
      bgGlow: 'bg-purple-50',
      description:
        'Cross-references live citizen complaints with official census indicators and unspent public capex budgets to reveal hidden deprivation and unallocated funds.',
      subpoints: [
        '4-Quadrant Policy Priority Index calculation',
        'Capital expenditure absorption & idle budget audit',
        'Ranking of high-demand, low-funding blindspots',
      ],
      actionTab: 'matrix' as const,
      cta: 'Inspect Disparity Matrix',
    },
    {
      step: '04',
      title: 'Autonomous Bankable DPR Generator',
      icon: FileSpreadsheet,
      badge: 'Policy Workbench',
      color: 'border-l-emerald-600 text-emerald-600',
      bgGlow: 'bg-emerald-50',
      description:
        'Synthesizes end-to-end Detailed Project Reports (DPR) with engineering capex breakdowns, phased timelines, climate resilience scores, and inter-agency sanctioning.',
      subpoints: [
        'Standardized public procurement bills of quantities',
        'Social Return on Investment (S-ROI) forecasting',
        'One-click sanctioning and exportable dossier briefs',
      ],
      actionTab: 'dpr' as const,
      cta: 'Open DPR Workbench',
    },
  ];

  const globalPillars = [
    {
      title: 'Universal Country Adaptability',
      icon: Globe2,
      desc: 'Plug-and-play architecture supporting any nation, province, state, or municipality worldwide. Configure custom administrative tiers, local languages, and currency standards.',
    },
    {
      title: 'Digital Public Good (DPG) Certified',
      icon: ShieldCheck,
      desc: 'Adheres to global open-source DPG standards, Beckn open discovery protocols, and machine-readable REST API endpoints for seamless inter-agency integration.',
    },
    {
      title: 'Autonomous AI Policy Copilot',
      icon: Sparkles,
      desc: 'Ground-truth generative intelligence providing instant strategic budget reallocation advisory, infrastructure impact simulation, and ministerial briefings.',
    },
    {
      title: 'Grassroots-to-Cabinet Governance',
      icon: Users,
      desc: 'Direct bridge connecting isolated citizens with central planning commissions, ensuring tax dollars are channeled to the most acute deprivation zones first.',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Global Sovereign Hero Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 text-white rounded-sm p-6 sm:p-10 border border-indigo-800 shadow-xl relative overflow-hidden">
        {/* Subtle decorative grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#4338ca_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-5">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="bg-orange-500 text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-sm shadow-xs">
              Universal Digital Public Good (DPG)
            </span>
            <span className="bg-indigo-800/90 text-indigo-200 text-[10px] sm:text-xs font-medium uppercase tracking-wider px-3 py-1 rounded-sm border border-indigo-700/80">
              Open Governance &amp; Spatial Equity
            </span>
            <span className="bg-emerald-900/80 text-emerald-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-sm border border-emerald-700/60">
              Multi-Jurisdiction Ready
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase leading-tight text-white">
            Transforming Citizen Voice into <span className="text-orange-400">Bankable Public Infrastructure</span>
          </h1>

          <p className="text-sm sm:text-base text-indigo-100 font-normal leading-relaxed max-w-3xl">
            CivicPulse AI is an open, globally adaptable Digital Public Good platform that aggregates multilingual citizen demand via voice, messaging, and kiosks, identifies severe spatial infrastructure deficits, and autonomously synthesizes bankable project engineering dossiers for policymakers and planning agencies.
          </p>

          {/* Key CTA Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={() => onNavigateTab('map')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-wider text-xs px-5 py-3 rounded-sm shadow-md flex items-center space-x-2 transition-all cursor-pointer border border-orange-400"
            >
              <MapPin className="w-4 h-4" />
              <span>Launch Spatial Heatmap</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => onNavigateTab('ingest')}
              className="bg-indigo-800 hover:bg-indigo-700 text-white font-bold uppercase tracking-wider text-xs px-5 py-3 rounded-sm shadow-sm flex items-center space-x-2 transition-all cursor-pointer border border-indigo-600"
            >
              <Mic className="w-4 h-4 text-orange-400" />
              <span>Test Multilingual Ingest</span>
            </button>

            <button
              onClick={onOpenDpgModal}
              className="bg-white/10 hover:bg-white/20 text-indigo-100 hover:text-white font-bold uppercase tracking-wider text-xs px-4 py-3 rounded-sm border border-white/20 flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <FileCode2 className="w-4 h-4 text-emerald-400" />
              <span>Open DPG APIs</span>
            </button>
          </div>
        </div>

        {/* Live System Counter Strip */}
        <div className="relative z-10 mt-8 pt-6 border-t border-indigo-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider">Citizen Demands</div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-white mt-0.5">
              {totalRequests.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-400 font-medium">Live Voice &amp; Text Ingest</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider">Spatial Clusters</div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-orange-400 mt-0.5">
              {criticalHotspotsCount} Priority Nodes
            </div>
            <div className="text-[10px] text-indigo-300 font-medium">Multi-Regional Coverage</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider">Beneficiaries Impacted</div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-400 mt-0.5">
              {(totalBeneficiaries / 1000).toFixed(0)}k+ Residents
            </div>
            <div className="text-[10px] text-emerald-300 font-medium">Vulnerable Communities</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider">Project Formulation</div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-white mt-0.5">Instant AI DPR</div>
            <div className="text-[10px] text-orange-300 font-medium">Fast-Track Public Capex</div>
          </div>
        </div>
      </div>

      {/* 2. The Core Problem Statement & Solution Framework */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* The Problem */}
        <div className="bg-white border border-slate-200 border-l-4 border-l-rose-500 p-6 rounded-sm shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-rose-600">
            <Radio className="w-5 h-5" />
            <h3 className="font-bold text-sm uppercase tracking-wider">The Problem: Disconnected Top-Down Planning</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            In many developing and emerging jurisdictions, public infrastructure investment relies on static 5-year census figures and centralized political lobbying. 
            Over <strong>80% of citizen grievances</strong> voiced in rural dialects never reach ministry planning boards, while billions in approved regional capital expenditure (Capex) remain trapped or unspent due to a lack of actionable engineering project reports.
          </p>
          <ul className="space-y-1.5 text-xs text-slate-700 font-medium pt-1">
            <li className="flex items-start space-x-2">
              <span className="text-rose-500 font-bold">•</span>
              <span>Grassroots communities excluded due to language &amp; digital literacy barriers.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-rose-500 font-bold">•</span>
              <span>Months of administrative delays in commissioning field feasibility studies.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-rose-500 font-bold">•</span>
              <span>Persistent disparity gaps in clean water, bridges, rural power, and healthcare.</span>
            </li>
          </ul>
        </div>

        {/* The Solution */}
        <div className="bg-white border border-slate-200 border-l-4 border-l-emerald-600 p-6 rounded-sm shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-emerald-700">
            <Zap className="w-5 h-5" />
            <h3 className="font-bold text-sm uppercase tracking-wider">The Solution: Autonomous Ground-Truth Intelligence</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            CivicPulse AI acts as a <strong>decentralized digital nervous system</strong>. By capturing citizen demands across any vernacular dialect or channel, our spatial clustering engine cross-references real-time complaints with infrastructure deficits to autonomously draft sanction-ready Detailed Project Reports (DPRs).
          </p>
          <ul className="space-y-1.5 text-xs text-slate-700 font-medium pt-1">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Voice-first vernacular intake accessible to any citizen without smartphone apps.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Real-time Disparity Matrix correlating citizen distress with unallocated budgets.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Instant formulation of bankable project dossiers with Bills of Quantities.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. The 4-Stage Autonomous Intelligence Pipeline */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-lg font-bold text-indigo-950 uppercase tracking-wide">
              The 4-Stage Autonomous Pipeline
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              From raw vernacular citizen voice to sanction-ready infrastructure investments
            </p>
          </div>
          <span className="text-xs bg-indigo-50 text-indigo-900 border border-indigo-200 px-3 py-1 rounded-sm font-bold uppercase tracking-wider self-start sm:self-auto">
            End-to-End Automation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pipelineSteps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`bg-white border border-slate-200 border-l-4 ${item.color} p-5 rounded-sm shadow-xs flex flex-col justify-between hover:shadow-md transition-all`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-400">{item.step}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-sm">
                      {item.badge}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2.5">
                    <div className={`p-2 rounded-sm ${item.bgGlow} ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 leading-tight">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    {item.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    {item.subpoints.map((sub, sIdx) => (
                      <div key={sIdx} className="flex items-start space-x-1.5 text-[10px] text-slate-500">
                        <Check className="w-3 h-3 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{sub}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100">
                  <button
                    onClick={() => onNavigateTab(item.actionTab)}
                    className="w-full bg-slate-50 hover:bg-indigo-900 hover:text-white text-indigo-900 border border-slate-200 text-xs font-bold uppercase tracking-wider py-2 px-3 rounded-sm flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <span>{item.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Global Adaptability & Architectural Blueprint */}
      <div className="bg-white border border-slate-200 rounded-sm p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Globe2 className="w-5 h-5 text-indigo-900" />
              <h2 className="text-base font-bold text-indigo-950 uppercase tracking-wide">
                Universal Global Adaptability Blueprint
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Deployable across any sovereign government, provincial jurisdiction, or multilateral development mission
            </p>
          </div>
          <button
            onClick={onOpenAiAssistant}
            className="bg-indigo-900 hover:bg-indigo-800 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-sm flex items-center space-x-1.5 cursor-pointer shadow-xs transition-colors self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Consult AI Policy Copilot</span>
          </button>
        </div>

        {/* 4 Global Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {globalPillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-sm space-y-2">
                <div className="w-8 h-8 rounded-sm bg-indigo-900 text-white flex items-center justify-center shadow-xs">
                  <Icon className="w-4 h-4 text-orange-400" />
                </div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">{p.title}</h3>
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">{p.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Global Jurisdiction Profiles Showcase */}
        <div className="bg-indigo-950 text-white p-5 rounded-sm border border-indigo-900 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
              Ready-to-Deploy Regional Presets
            </span>
            <span className="text-[11px] text-indigo-300 font-medium">
              Zero code reconfiguration needed for local administrative boundaries
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {GLOBAL_COUNTRY_PROFILES.map((prof) => (
              <div key={prof.id} className="bg-indigo-900/80 border border-indigo-800 p-3 rounded-sm space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{prof.flag}</span>
                  <span className="font-bold text-white text-xs">{prof.name}</span>
                </div>
                <div className="text-[10px] text-indigo-200 space-y-0.5">
                  <div><strong>Tiers:</strong> {prof.adminTier1} → {prof.adminTier2}</div>
                  <div><strong>Board:</strong> {prof.planningAgency}</div>
                  <div><strong>Currencies:</strong> {prof.currencyName} ({prof.currencySymbol})</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Direct Module Launchers & Quick Start Navigation */}
      <div className="bg-slate-100 border border-slate-300/80 rounded-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-widest text-slate-800">
            Quick Navigation Hub
          </h3>
          <span className="text-[11px] text-slate-600 font-medium">
            Jump directly into any operational module
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigateTab('map')}
            className="bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 p-4 rounded-sm text-left transition-all shadow-xs group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <MapPin className="w-5 h-5 text-orange-600" />
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 transition-colors" />
            </div>
            <div className="font-bold text-xs uppercase tracking-wider text-slate-900">Spatial Demand Map</div>
            <p className="text-[10px] text-slate-500 mt-1 font-medium">
              Interactive GIS clustering, urgency heatmaps, and deprivation corridor overlays.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab('ingest')}
            className="bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 p-4 rounded-sm text-left transition-all shadow-xs group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <Mic className="w-5 h-5 text-indigo-600" />
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </div>
            <div className="font-bold text-xs uppercase tracking-wider text-slate-900">Citizen Ingestion Hub</div>
            <p className="text-[10px] text-slate-500 mt-1 font-medium">
              Simulate voice IVR audio recordings, SMS claims, and native dialect extraction.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab('matrix')}
            className="bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 p-4 rounded-sm text-left transition-all shadow-xs group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
            </div>
            <div className="font-bold text-xs uppercase tracking-wider text-slate-900">Disparity Gap Matrix</div>
            <p className="text-[10px] text-slate-500 mt-1 font-medium">
              2D decision matrix cross-referencing citizen demand with unspent public capex.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab('dpr')}
            className="bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 p-4 rounded-sm text-left transition-all shadow-xs group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </div>
            <div className="font-bold text-xs uppercase tracking-wider text-slate-900">Policy DPR Workbench</div>
            <p className="text-[10px] text-slate-500 mt-1 font-medium">
              Formulate bankable engineering dossiers, BoQ costs, and one-click sanctioning.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
