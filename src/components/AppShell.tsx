import React, { useState } from 'react';
import {
  MapPin,
  Mic,
  BarChart3,
  FileSpreadsheet,
  Globe2,
  Sparkles,
  TrendingUp,
  Droplets,
  Building2,
  ShieldCheck,
  Zap,
  Activity,
  Compass,
  Layers,
  ArrowRight,
  Bell,
  RefreshCw,
  LayoutDashboard,
} from 'lucide-react';
import { Navbar } from './Navbar';
import { LandingOverview } from './LandingOverview';
import { GeoHotspotMap } from './GeoHotspotMap';
import { CitizenIngestionHub } from './CitizenIngestionHub';
import { DisparityMatrix } from './DisparityMatrix';
import { PolicyDprWorkbench } from './PolicyDprWorkbench';
import { PolicyAssistantChat } from './PolicyAssistantChat';
import { DpgOpenDataModal } from './DpgOpenDataModal';
import { AuthProvider } from '../contexts/AuthContext';
import { AuthModal } from './AuthModal';
import { OfficialPortalModal } from './OfficialPortalModal';
import { CitizenPortalModal } from './CitizenPortalModal';

import {
  INITIAL_DISTRICT_INDICATORS,
  INITIAL_CITIZEN_REQUESTS,
  INITIAL_HOTSPOT_CLUSTERS,
  SAMPLE_DPR_MAHOBA,
} from '../data/nationalData';
import {
  CitizenRequest,
  DistrictIndicator,
  HotspotCluster,
  DetailedProjectReport,
} from '../types';

function CivicPulseMain() {
  // Global State: default to overview to provide clear explanation and navigation
  const [activeTab, setActiveTab] = useState<'overview' | 'map' | 'ingest' | 'matrix' | 'dpr'>('overview');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [requests, setRequests] = useState<CitizenRequest[]>(INITIAL_CITIZEN_REQUESTS);
  const [districts, setDistricts] = useState<DistrictIndicator[]>(INITIAL_DISTRICT_INDICATORS);
  const [hotspots, setHotspots] = useState<HotspotCluster[]>(INITIAL_HOTSPOT_CLUSTERS);
  const [activeDpr, setActiveDpr] = useState<DetailedProjectReport | null>(SAMPLE_DPR_MAHOBA);

  // Modals & Drawers
  const [isDpgModalOpen, setIsDpgModalOpen] = useState<boolean>(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalRole, setAuthModalRole] = useState<'official' | 'citizen'>('official');
  const [isOfficialPortalOpen, setIsOfficialPortalOpen] = useState<boolean>(false);
  const [isCitizenPortalOpen, setIsCitizenPortalOpen] = useState<boolean>(false);
  const [latestToast, setLatestToast] = useState<{ title: string; desc: string } | null>(null);

  // Handle new incoming citizen request
  const handleNewRequestIngested = (newReq: CitizenRequest) => {
    setRequests((prev) => [newReq, ...prev]);

    // Show celebratory toast notification
    setLatestToast({
      title: `Citizen Request Ingested (${newReq.sourceLanguageName})`,
      desc: `${newReq.location.district}, ${newReq.location.state} • ${newReq.sector}`,
    });
    setTimeout(() => setLatestToast(null), 5000);

    // Update or amplify corresponding hotspot cluster
    setHotspots((prev) => {
      const matchIndex = prev.findIndex(
        (h) => h.district.toLowerCase() === newReq.location.district.toLowerCase()
      );

      if (matchIndex >= 0) {
        const updated = [...prev];
        const target = updated[matchIndex];
        updated[matchIndex] = {
          ...target,
          requestCount: target.requestCount + 1,
          disparityGapIndex: Math.min(100, target.disparityGapIndex + 0.4),
          aggregateUrgency: Math.min(100, target.aggregateUrgency + 0.3),
        };
        return updated;
      } else {
        // Create new dynamic cluster
        const newHotspot: HotspotCluster = {
          id: `HOTSPOT-DYNAMIC-${Date.now()}`,
          title: `Acute ${newReq.sector} Demand`,
          sector: newReq.sector,
          district: newReq.location.district,
          state: newReq.location.state,
          blockTehsil: newReq.location.blockTehsil || 'Central Block',
          lat: newReq.location.lat,
          lng: newReq.location.lng,
          priorityRank: 'HIGH PRIORITY',
          disparityGapIndex: newReq.urgencyScore,
          requestCount: 1,
          affectedPopulation: newReq.estimatedBeneficiaries,
          aggregateUrgency: newReq.urgencyScore,
          infrastructureDeficitScore: newReq.urgencyScore,
          primaryDeficit: newReq.rawVernacularText.slice(0, 80) + '...',
          recommendedMission: newReq.recommendedMission,
          topCitizenQuotes: [
            {
              vernacular: newReq.rawVernacularText,
              english: newReq.translatedEnglish,
              lang: newReq.sourceLanguageName,
            },
          ],
        };
        return [newHotspot, ...prev];
      }
    });
  };

  // Quick navigation helpers
  const handleSynthesizeDprFromMap = (hotspot: HotspotCluster) => {
    setActiveTab('dpr');
  };

  const handleOpenDprForDistrict = (district: DistrictIndicator) => {
    const matchedHotspot = hotspots.find(
      (h) => h.district.toLowerCase() === district.district.toLowerCase()
    );
    setActiveTab('dpr');
  };

  const handleSelectHotspotFromMatrix = (hotspot: HotspotCluster) => {
    setActiveTab('map');
  };

  // Total beneficiary count
  const totalBeneficiaries = hotspots.reduce((acc, h) => acc + h.affectedPopulation, 0);
  const totalUnspentCapex = districts.reduce(
    (acc, d) => acc + d.approvedCapexCr * (1 - d.utilizedCapexPercent / 100),
    0
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-orange-500 selection:text-white flex flex-col">
      {/* Top Main Navigation Header (Spacious Sovereign Banner with exactly ONE Language Switcher) */}
      <Navbar
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDpgModal={() => setIsDpgModalOpen(true)}
        onOpenAiAssistant={() => setIsAssistantOpen(true)}
        onOpenAuthModal={(role) => {
          setAuthModalRole(role || 'official');
          setIsAuthModalOpen(true);
        }}
        onOpenOfficialPortal={() => setIsOfficialPortalOpen(true)}
        onOpenCitizenPortal={() => setIsCitizenPortalOpen(true)}
        totalRequests={requests.length}
        criticalHotspotsCount={hotspots.length}
      />

      {/* Real-time Ingestion Toast Notification */}
      {latestToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-950 text-white border-l-4 border-orange-500 border border-indigo-800 rounded-sm p-4 shadow-2xl flex items-center space-x-3 text-xs animate-bounce max-w-sm">
          <div className="w-8 h-8 rounded bg-orange-500/20 text-orange-400 flex items-center justify-center flex-shrink-0">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white block uppercase tracking-wider text-[11px]">{latestToast.title}</span>
            <span className="text-indigo-200 text-[11px]">{latestToast.desc}</span>
          </div>
        </div>
      )}

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Universal DPG Stats Quick Strip - 4-Card System */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 border-l-4 border-l-indigo-600 p-4 shadow-xs rounded-sm transition-all hover:shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-widest">Aggregated Demands</span>
              <Mic className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-mono font-bold text-slate-900">{requests.length.toLocaleString()}</div>
            <div className="text-[10px] font-semibold text-indigo-600 mt-1 uppercase tracking-wider">Multi-Lingual Ingest</div>
          </div>

          <div className="bg-white border border-slate-200 border-l-4 border-l-orange-500 p-4 shadow-xs rounded-sm transition-all hover:shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-widest">Demand Hotspots</span>
              <Activity className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-2xl font-mono font-bold text-orange-600">{hotspots.length} Nodes</div>
            <div className="text-[10px] font-semibold text-slate-500 mt-1 uppercase tracking-wider">Priority Deprivation Clusters</div>
          </div>

          <div className="bg-white border border-slate-200 border-l-4 border-l-emerald-500 p-4 shadow-xs rounded-sm transition-all hover:shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-widest">Beneficiary Impact</span>
              <Layers className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-mono font-bold text-slate-900">
              {(totalBeneficiaries / 1000).toFixed(0)}k+ <span className="text-base font-normal text-slate-600">Citizens</span>
            </div>
            <div className="text-[10px] font-semibold text-emerald-600 mt-1 uppercase tracking-wider">Vulnerable Population Covered</div>
          </div>

          <div className="bg-white border border-slate-200 border-l-4 border-l-indigo-900 p-4 shadow-xs rounded-sm transition-all hover:shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-widest">Unallocated Capex</span>
              <Building2 className="w-4 h-4 text-indigo-900" />
            </div>
            <div className="text-2xl font-mono font-bold text-indigo-900">${totalUnspentCapex.toFixed(0)}M <span className="text-base font-normal text-slate-600">Capex</span></div>
            <div className="text-[10px] font-semibold text-emerald-600 mt-1 uppercase tracking-wider">Available for Reallocation</div>
          </div>
        </div>

        {/* Tab 0: Project Landing & Architecture Overview */}
        {activeTab === 'overview' && (
          <LandingOverview
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenDpgModal={() => setIsDpgModalOpen(true)}
            onOpenAiAssistant={() => setIsAssistantOpen(true)}
            totalRequests={requests.length}
            criticalHotspotsCount={hotspots.length}
            totalBeneficiaries={totalBeneficiaries}
          />
        )}

        {/* Tab 1: Geo Hotspot Map */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            <GeoHotspotMap
              hotspots={hotspots}
              districts={districts}
              selectedHotspot={null}
              onSelectHotspot={handleSynthesizeDprFromMap}
              onGenerateDprForHotspot={handleSynthesizeDprFromMap}
              selectedLanguage={selectedLanguage}
            />
          </div>
        )}

        {/* Tab 2: Multilingual Citizen Ingestion Hub */}
        {activeTab === 'ingest' && (
          <div className="space-y-6">
            <CitizenIngestionHub
              onNewRequestIngested={handleNewRequestIngested}
              selectedLanguage={selectedLanguage}
            />
          </div>
        )}

        {/* Tab 3: Multi-Source Disparity Matrix */}
        {activeTab === 'matrix' && (
          <div className="space-y-6">
            <DisparityMatrix
              districts={districts}
              hotspots={hotspots}
              onSelectHotspot={handleSelectHotspotFromMatrix}
              onOpenDprForDistrict={handleOpenDprForDistrict}
            />
          </div>
        )}

        {/* Tab 4: Policy & Project DPR Workbench */}
        {activeTab === 'dpr' && (
          <div className="space-y-6">
            <PolicyDprWorkbench
              hotspots={hotspots}
              districts={districts}
              activeDpr={activeDpr}
              onSetActiveDpr={setActiveDpr}
              selectedLanguage={selectedLanguage}
            />
          </div>
        )}
      </main>

      {/* Footer Strip - Universal DPG */}
      <footer className="border-t border-slate-200 bg-white py-3.5 px-4 sm:px-8 text-xs text-slate-500 font-medium mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-[11px] text-slate-700">
              <strong className="text-indigo-900">CivicPulse AI Platform</strong> • Digital Public Good (DPG-OPEN-2026-UNIV)
            </span>
          </div>
          <div className="flex items-center space-x-6 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
            <span>Beckn Open Protocol</span>
            <span>Multilingual Voice &amp; NLP</span>
            <span>Universal Spatial Allocation Framework</span>
          </div>
        </div>
      </footer>

      {/* Strategic Policy Assistant Copilot Drawer */}
      <PolicyAssistantChat
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        hotspots={hotspots}
        districts={districts}
      />

      {/* DPG Open Data & Beckn Schema Modal */}
      <DpgOpenDataModal
        isOpen={isDpgModalOpen}
        onClose={() => setIsDpgModalOpen(false)}
        hotspots={hotspots}
        districts={districts}
        requests={requests}
      />

      {/* Unified Authentication & Role Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialRole={authModalRole}
      />

      {/* Official Command & Sanction Workbench Modal */}
      <OfficialPortalModal
        isOpen={isOfficialPortalOpen}
        onClose={() => setIsOfficialPortalOpen(false)}
        dprs={activeDpr ? [activeDpr] : []}
        hotspots={hotspots}
        onSelectDpr={(dpr) => {
          setActiveDpr(dpr);
          setActiveTab('dpr');
          setIsOfficialPortalOpen(false);
        }}
      />

      {/* Citizen Action & Claims Lifecycle Modal */}
      <CitizenPortalModal
        isOpen={isCitizenPortalOpen}
        onClose={() => setIsCitizenPortalOpen(false)}
        hotspots={hotspots}
        onSelectHotspot={(h) => {
          setActiveTab('map');
          setIsCitizenPortalOpen(false);
        }}
      />
    </div>
  );
}

export default function AppShell() {
  return (
    <AuthProvider>
      <CivicPulseMain />
    </AuthProvider>
  );
}
