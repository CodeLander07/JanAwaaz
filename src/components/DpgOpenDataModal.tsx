import React, { useState } from 'react';
import {
  X,
  Download,
  Code2,
  Copy,
  Check,
  Globe2,
  ShieldCheck,
  Share2,
  Database,
  ExternalLink,
} from 'lucide-react';
import { HotspotCluster, DistrictIndicator, CitizenRequest } from '../types';

interface DpgOpenDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotspots: HotspotCluster[];
  districts: DistrictIndicator[];
  requests: CitizenRequest[];
}

export const DpgOpenDataModal: React.FC<DpgOpenDataModalProps> = ({
  isOpen,
  onClose,
  hotspots,
  districts,
  requests,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'beckn' | 'geojson' | 'api'>('beckn');

  if (!isOpen) return null;

  const becknDiscoveryPayload = {
    context: {
      domain: 'global:dpg:citizen-infrastructure:v1',
      country: 'GLOBAL-UNIV',
      city: 'std:all',
      action: 'search',
      core_version: '1.1.0',
      bap_id: 'civicpulse.dpg.global',
      timestamp: new Date().toISOString(),
    },
    message: {
      intent: {
        category: {
          id: 'PUBLIC_INFRASTRUCTURE_DEMAND_HOTSPOTS',
        },
        provider: {
          id: 'CIVICPULSE_OPEN_GOVERNANCE_REGISTRY',
          descriptor: {
            name: 'CivicPulse AI Universal Demand & Spatial Deficit Registry',
          },
        },
        fulfillment: {
          hotspot_count: hotspots.length,
          districts_covered: districts.length,
          citizen_records_aggregated: requests.length,
        },
      },
    },
    data: {
      hotspots: hotspots.map((h) => ({
        id: h.id,
        district: h.district,
        state: h.state,
        sector: h.sector,
        priority_rank: h.priorityRank,
        disparity_gap_index: h.disparityGapIndex,
        citizen_demand_count: h.requestCount,
        geo_coordinates: [h.lat, h.lng],
      })),
    },
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(becknDiscoveryPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(becknDiscoveryPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `jansamarth-dpg-open-dataset-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-sm w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="bg-slate-50 p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-sm bg-indigo-900 text-white flex items-center justify-center shadow-xs">
              <Globe2 className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-xs text-indigo-900 uppercase tracking-widest">Digital Public Good (DPG) Open Data Portal</h3>
                <span className="bg-emerald-100 text-emerald-900 text-[9px] px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider border border-emerald-300">
                  DPGA Certified Standard
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Open interoperable data exchange adhering to Beckn protocol &amp; Bhashini NLP specifications
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-sm bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer border border-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="bg-slate-50/60 px-5 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('beckn')}
              className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
                activeTab === 'beckn'
                  ? 'bg-indigo-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Beckn Protocol Discovery
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
                activeTab === 'api'
                  ? 'bg-indigo-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              REST &amp; Open Data Endpoints
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyJson}
              className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-sm flex items-center space-x-1.5 cursor-pointer text-xs font-bold uppercase tracking-wider shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
            <button
              onClick={handleDownloadJson}
              className="bg-indigo-900 hover:bg-indigo-800 text-white font-bold uppercase tracking-wider px-3 py-1.5 rounded-sm flex items-center space-x-1.5 cursor-pointer text-xs shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Dataset</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs bg-slate-50/30">
          {activeTab === 'beckn' && (
            <div className="space-y-3">
              <div className="bg-slate-900 border border-slate-800 rounded-sm p-4 font-mono text-[11px] text-emerald-400 overflow-x-auto shadow-inner">
                <pre>{JSON.stringify(becknDiscoveryPayload, null, 2)}</pre>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 border-l-4 border-l-orange-500 rounded-sm p-4 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-orange-600 uppercase tracking-wider font-mono">GET /api/public-dpg/export</span>
                  <span className="text-[10px] bg-orange-100 text-orange-900 border border-orange-200 px-2 py-0.5 rounded-sm font-mono font-bold">
                    Open DPG Endpoint
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] font-medium leading-relaxed">
                  Returns all live citizen demand clusters, NITI infrastructure gap indices, and approved DPR summaries in standardized JSON format.
                </p>
                <div className="bg-slate-900 p-2.5 rounded-sm font-mono text-[11px] text-emerald-400 shadow-inner">
                  curl -X GET https://jansamarth-dpg.gov.in/api/public-dpg/export
                </div>
              </div>

              <div className="bg-white border border-slate-200 border-l-4 border-l-indigo-600 rounded-sm p-4 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-indigo-900 uppercase tracking-wider font-mono">POST /api/ingest-citizen-request</span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-900 border border-indigo-200 px-2 py-0.5 rounded-sm font-mono font-bold">
                    Bhashini NLP Ingest
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] font-medium leading-relaxed">
                  Open endpoint for IVR telecom providers, state Sandes nodes, and CSC kiosks to submit citizen requests in any Indian language or audio format.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
