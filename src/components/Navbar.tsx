import React from 'react';
import {
  Globe,
  MapPin,
  Mic,
  BarChart3,
  FileSpreadsheet,
  Layers,
  Sparkles,
  ShieldCheck,
  Building2,
  TrendingUp,
  Activity,
  Compass,
  LayoutDashboard,
  Users,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../data/indianLanguages';
import { UserNavProfile } from './UserNavProfile';

interface NavbarProps {
  activeTab: 'overview' | 'map' | 'ingest' | 'matrix' | 'dpr';
  setActiveTab: (tab: 'overview' | 'map' | 'ingest' | 'matrix' | 'dpr') => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  totalRequests: number;
  criticalHotspotsCount: number;
  onOpenAiAssistant: () => void;
  onOpenDpgModal: () => void;
  onOpenAuthModal: (role?: 'official' | 'citizen') => void;
  onOpenOfficialPortal: () => void;
  onOpenCitizenPortal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedLanguage,
  setSelectedLanguage,
  totalRequests,
  criticalHotspotsCount,
  onOpenAiAssistant,
  onOpenDpgModal,
  onOpenAuthModal,
  onOpenOfficialPortal,
  onOpenCitizenPortal,
}) => {
  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <header id="civicpulse-header" className="bg-indigo-950 text-white border-b border-indigo-800 shadow-md">
      {/* 1. Universal Sovereign Top Bar (Global DPG Certification & Telemetry) */}
      <div className="h-1 bg-gradient-to-r from-orange-500 via-indigo-400 to-emerald-500 w-full" />
      <div className="bg-indigo-950/95 border-b border-indigo-900/80 px-4 sm:px-8 py-2 text-xs text-indigo-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
          {/* Sovereign & DPG Certification */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="px-2.5 py-0.5 bg-orange-600 text-white rounded-sm text-[10px] font-bold uppercase tracking-widest shadow-xs">
              DIGITAL PUBLIC GOOD (DPG) • OPEN GOVERNANCE
            </span>
            <span className="text-indigo-300 text-[11px] font-medium tracking-normal">
              Universal Citizen Infrastructure &amp; Spatial Equity Intelligence
            </span>
          </div>

          {/* Real-time Status & Standards Badge & User Profile */}
          <div className="flex items-center space-x-3 text-[11px]">
            <div className="hidden sm:flex items-center space-x-1.5 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest">Firebase Live</span>
            </div>
            <div className="hidden sm:block h-3 w-px bg-indigo-800" />
            <button
              id="dpg-standards-badge-btn"
              onClick={onOpenDpgModal}
              className="hover:text-white flex items-center text-orange-300 font-bold cursor-pointer transition-colors text-[10px] uppercase tracking-wider bg-indigo-900/80 px-2.5 py-1 rounded-sm border border-indigo-700/60"
            >
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              DPGA Certified Standard
            </button>
            <div className="h-3 w-px bg-indigo-800" />
            {/* User Navigation Profile */}
            <UserNavProfile
              onOpenAuthModal={onOpenAuthModal}
              onOpenOfficialPortal={onOpenOfficialPortal}
              onOpenCitizenPortal={onOpenCitizenPortal}
            />
          </div>
        </div>
      </div>

      {/* 2. Main Grand Banner (Universal Title & Action Command Center) */}
      <div className="bg-indigo-900 border-b border-indigo-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            {/* Left: Grand Title Block & Geometric Diamond Emblem */}
            <div className="flex items-start sm:items-center space-x-4">
              {/* Sovereign Diamond Emblem */}
              <div className="w-11 h-11 sm:w-13 sm:h-13 bg-orange-500 rounded-sm rotate-45 flex items-center justify-center shadow-lg flex-shrink-0 mt-1 sm:mt-0 border border-orange-400/40">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full -rotate-45 flex items-center justify-center shadow-xs">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-indigo-900 rounded-full" />
                </div>
              </div>

              {/* Title & Hierarchy */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight uppercase text-white leading-tight">
                    CIVIC PULSE AI <span className="text-orange-400 font-light">•</span> Platform
                  </h1>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-sm bg-indigo-800/90 text-orange-300 border border-indigo-700 tracking-widest uppercase">
                    DPG-OPEN-2026
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 tracking-wider uppercase hidden sm:inline">
                    Multi-Lingual NLP
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-indigo-200 font-medium leading-relaxed max-w-2xl">
                  Universal Citizen Demand Intelligence &amp; Spatial Public Infrastructure Allocation Engine
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px] text-indigo-300">
                  <span className="text-orange-300 font-semibold">Core Framework:</span>
                  <span>Grassroots Citizen Voice (IVR/SMS/Web)</span>
                  <span className="text-indigo-400">•</span>
                  <span>Spatial Deficit Clustering</span>
                  <span className="text-indigo-400">•</span>
                  <span>Autonomous Bankable Project DPRs</span>
                </div>
              </div>
            </div>

            {/* Right: Exactly ONE Unified Language Switcher & AI Copilot Button */}
            <div className="flex flex-wrap items-center gap-3 self-start lg:self-center">
              {/* Single Unified Language Selector */}
              <div className="relative flex items-center">
                <Globe className="w-4 h-4 text-orange-400 absolute left-3 pointer-events-none" />
                <select
                  id="language-selector-dropdown"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  aria-label="Select Interface Language"
                  className="bg-indigo-950 text-indigo-100 text-xs font-bold rounded-sm pl-9 pr-8 py-2.5 border border-indigo-700 hover:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer shadow-xs"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-indigo-950 text-white">
                      {lang.flag ? `${lang.flag} ` : ''}{lang.name} — {lang.nativeName}
                    </option>
                  ))}
                </select>
              </div>

              {/* AI Strategic Policy Copilot Button */}
              <button
                id="open-policy-copilot-btn"
                onClick={onOpenAiAssistant}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-sm text-xs font-bold uppercase tracking-widest shadow-md flex items-center space-x-2 transition-all transform active:scale-95 cursor-pointer border border-orange-400/40"
              >
                <Sparkles className="w-4 h-4 text-orange-100" />
                <span>AI Policy Copilot</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Navigation Bar (Clear, Prominent, Instantaneous Navigation) */}
      <div className="bg-indigo-950 border-b border-indigo-800/80 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Main Navigation Tabs */}
          <nav className="flex flex-wrap items-center gap-2">
            <button
              id="nav-tab-overview"
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer shadow-xs ${
                activeTab === 'overview'
                  ? 'bg-orange-500 text-white ring-1 ring-orange-400 font-extrabold'
                  : 'bg-indigo-900/70 text-indigo-200 hover:text-white hover:bg-indigo-800 border border-indigo-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Project Overview</span>
            </button>

            <button
              id="nav-tab-map"
              onClick={() => setActiveTab('map')}
              className={`px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer shadow-xs ${
                activeTab === 'map'
                  ? 'bg-orange-500 text-white ring-1 ring-orange-400 font-extrabold'
                  : 'bg-indigo-900/70 text-indigo-200 hover:text-white hover:bg-indigo-800 border border-indigo-800'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Spatial Demand Map</span>
            </button>

            <button
              id="nav-tab-ingest"
              onClick={() => setActiveTab('ingest')}
              className={`px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer shadow-xs ${
                activeTab === 'ingest'
                  ? 'bg-orange-500 text-white ring-1 ring-orange-400 font-extrabold'
                  : 'bg-indigo-900/70 text-indigo-200 hover:text-white hover:bg-indigo-800 border border-indigo-800'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>Citizen Intake Hub</span>
            </button>

            <button
              id="nav-tab-matrix"
              onClick={() => setActiveTab('matrix')}
              className={`px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer shadow-xs ${
                activeTab === 'matrix'
                  ? 'bg-orange-500 text-white ring-1 ring-orange-400 font-extrabold'
                  : 'bg-indigo-900/70 text-indigo-200 hover:text-white hover:bg-indigo-800 border border-indigo-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Disparity Gap Matrix</span>
            </button>

            <button
              id="nav-tab-dpr"
              onClick={() => setActiveTab('dpr')}
              className={`px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer shadow-xs ${
                activeTab === 'dpr'
                  ? 'bg-orange-500 text-white ring-1 ring-orange-400 font-extrabold'
                  : 'bg-indigo-900/70 text-indigo-200 hover:text-white hover:bg-indigo-800 border border-indigo-800'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Policy DPR Workbench</span>
            </button>
          </nav>

          {/* Right: Live Telemetry Status Strip */}
          <div className="flex items-center space-x-3 text-xs bg-indigo-900/60 px-3.5 py-1.5 rounded-sm border border-indigo-800 self-start lg:self-auto">
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] text-indigo-400 uppercase font-bold">Claims:</span>
              <span className="font-mono font-bold text-white text-xs">
                {totalRequests.toLocaleString()}
              </span>
            </div>
            <span className="text-indigo-700">•</span>
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] text-indigo-400 uppercase font-bold">Hotspots:</span>
              <span className="font-mono font-bold text-orange-400 text-xs">
                {criticalHotspotsCount} Nodes
              </span>
            </div>
            <span className="text-indigo-700 hidden sm:inline">•</span>
            <div className="hidden sm:flex items-center space-x-1.5">
              <span className="text-[10px] text-indigo-400 uppercase font-bold">Dialect:</span>
              <span className="font-mono font-bold text-emerald-400 text-xs">
                {currentLangObj.nativeName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
