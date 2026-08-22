import React, { useState, useEffect } from 'react';
import {
  Building2,
  ShieldCheck,
  Award,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  DollarSign,
  FileCheck2,
  Send,
  MessageSquare,
  Clock,
  Sparkles,
  ExternalLink,
  MapPin,
  Filter,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { DetailedProjectReport, HotspotCluster, CitizenClaimSubmission, DprAppraisalRecord } from '../types';
import { recordDprAppraisal, addOfficialCommentToClaim } from '../lib/firebase';
import confetti from 'canvas-confetti';

interface OfficialPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  dprs: DetailedProjectReport[];
  hotspots: HotspotCluster[];
  onSelectDpr: (dpr: DetailedProjectReport) => void;
}

export const OfficialPortalModal: React.FC<OfficialPortalModalProps> = ({
  isOpen,
  onClose,
  dprs,
  hotspots,
  onSelectDpr,
}) => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'dprs' | 'triage' | 'credentials'>('dprs');
  const [sanctioningDprCode, setSanctioningDprCode] = useState<string | null>(null);
  const [allocatedAmount, setAllocatedAmount] = useState<number>(14.2);
  const [remarks, setRemarks] = useState<string>('Approved under PM Gati Shakti National Infrastructure Convergence scheme. Sanction order issued for immediate tendering.');
  const [sanctionHistory, setSanctionHistory] = useState<DprAppraisalRecord[]>([]);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Mock claims for triage
  const [pendingClaims, setPendingClaims] = useState([
    {
      id: 'claim-live-101',
      title: 'Perennial Aquifer Depletion & Arsenic Ingress in Kabrai Block',
      sector: 'Water & Sanitation',
      district: 'Mahoba',
      state: 'Uttar Pradesh',
      citizenName: 'Savitri Devi (Sarpanch)',
      urgency: 'Critical',
      status: 'AI Verified',
      claimsCount: 284,
      date: 'Today, 08:30 AM',
    },
    {
      id: 'claim-live-102',
      title: 'Flash Flood Bridge Collapse on Tokapal Trunk Route',
      sector: 'Rural Roads & Bridges',
      district: 'Bastar',
      state: 'Chhattisgarh',
      citizenName: 'Rameshwar Kumar',
      urgency: 'Critical',
      status: 'Under Triaging',
      claimsCount: 198,
      date: 'Yesterday, 04:15 PM',
    },
    {
      id: 'claim-live-103',
      title: 'Solar Cold Storage Grid Deficit for Nuapada Minor Forest Produce',
      sector: 'Rural Electrification & Solar',
      district: 'Nuapada',
      state: 'Odisha',
      citizenName: 'Lalit Sahu',
      urgency: 'High',
      status: 'Under Triaging',
      claimsCount: 112,
      date: '2 days ago',
    },
  ]);

  if (!isOpen) return null;

  const official = currentUser?.officialDetails;

  const handleSanctionDpr = async (dpr: DetailedProjectReport) => {
    try {
      const record = {
        dprId: dpr.projectCode,
        dprTitle: dpr.projectTitle,
        officialUid: currentUser?.uid || 'official-1',
        officialName: currentUser?.displayName || 'Dr. Rajesh Sharma, IAS',
        designation: official?.designation || 'District Magistrate',
        department: official?.department || 'District Planning',
        action: 'SANCTIONED' as const,
        allocatedAmountCr: allocatedAmount,
        remarks: remarks,
      };

      const id = await recordDprAppraisal(record);
      const fullRecord: DprAppraisalRecord = {
        ...record,
        id,
        sanctionTimestamp: new Date().toISOString(),
        sanctionOrderNumber: `CP/SANCTION/2026/${Math.floor(1000 + Math.random() * 9000)}`,
      };

      setSanctionHistory([fullRecord, ...sanctionHistory]);
      setSuccessToast(`DPR ${dpr.projectCode} officially sanctioned! Order #${fullRecord.sanctionOrderNumber}`);
      setSanctioningDprCode(null);

      // Trigger celebratory confetti for official administrative sanction
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });

      setTimeout(() => setSuccessToast(null), 5000);
    } catch (err) {
      console.error('Sanction failed:', err);
    }
  };

  const handleValidateClaim = (claimId: string) => {
    setPendingClaims((prev) =>
      prev.map((c) => (c.id === claimId ? { ...c, status: 'Field Officer Validated' } : c))
    );
    setSuccessToast('Claim validated & fast-tracked into GIS Hotspot aggregation.');
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-sm max-w-4xl w-full my-8 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with Official Credentials Badge */}
        <div className="bg-indigo-950 text-white p-6 border-b border-indigo-900 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded bg-white/10 border border-white/20 flex items-center justify-center text-amber-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold tracking-tight">Official Command &amp; Appraisal Workbench</h2>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded font-mono font-bold uppercase">
                  {official?.clearanceLevel || 'Level-2 Clearance'}
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                {currentUser?.displayName} • {official?.designation || 'Planning Officer'} ({official?.jurisdictionState || 'National'})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white text-xl font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 pt-3 flex space-x-6 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('dprs')}
            className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'dprs'
                ? 'border-indigo-900 text-indigo-950'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Executive DPR Sanctions ({dprs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('triage')}
            className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'triage'
                ? 'border-indigo-900 text-indigo-950'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Citizen Claims Triage ({pendingClaims.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('credentials')}
            className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'credentials'
                ? 'border-indigo-900 text-indigo-950'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Official Identity &amp; Delegation</span>
          </button>
        </div>

        {/* Success Banner */}
        {successToast && (
          <div className="bg-emerald-600 text-white text-xs px-6 py-2.5 font-bold flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successToast}</span>
            </div>
            <button onClick={() => setSuccessToast(null)} className="text-white hover:text-emerald-100">
              ✕
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: DPR Sanctions */}
          {activeTab === 'dprs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Autonomous Bankable Project Dossiers Ready for Sanction
                  </h3>
                  <p className="text-slate-500 text-xs">
                    Review Bill of Quantities (BoQ), NITI synergy indices, and execute statutory administrative sanctions.
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-indigo-50 text-indigo-900 border border-indigo-200 px-2.5 py-1 rounded">
                  Official Sanction Power: Active
                </span>
              </div>

              {/* DPR Cards */}
              <div className="space-y-3">
                {dprs.map((dpr) => {
                  const isSanctioning = sanctioningDprCode === dpr.projectCode;

                  return (
                    <div
                      key={dpr.projectCode}
                      className="bg-white border border-slate-200 rounded-sm p-4 hover:border-indigo-300 transition-all shadow-2xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                              {dpr.projectCode}
                            </span>
                            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded">
                              {dpr.sector}
                            </span>
                            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded">
                              {dpr.status}
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-slate-900 mt-1">{dpr.projectTitle}</h4>
                          <p className="text-xs text-slate-500">{dpr.locationSummary}</p>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 p-2.5 rounded text-right min-w-[120px]">
                          <span className="text-[10px] text-slate-500 uppercase font-bold block">Est. Capex</span>
                          <span className="text-base font-bold font-mono text-indigo-900">
                            ₹{dpr.estimatedCapexCr.toFixed(2)} Cr
                          </span>
                        </div>
                      </div>

                      {/* Capex Components Snippet */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-2.5 rounded border border-slate-100 text-[11px]">
                        {dpr.capexBreakdown.slice(0, 4).map((c, i) => (
                          <div key={i}>
                            <span className="text-slate-500 block truncate">{c.component}</span>
                            <span className="font-bold font-mono text-slate-800">₹{c.costCr.toFixed(2)} Cr</span>
                          </div>
                        ))}
                      </div>

                      {/* Sanction Trigger & Actions */}
                      {isSanctioning ? (
                        <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded space-y-3">
                          <div className="flex items-center space-x-1.5 font-bold text-amber-900 text-xs">
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                            <span>Executive Sanction Order Formulation</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block font-bold text-slate-700 mb-1">
                                Sanctioned Capex Allocation (₹ Cr):
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                value={allocatedAmount}
                                onChange={(e) => setAllocatedAmount(parseFloat(e.target.value))}
                                className="w-full bg-white border border-slate-300 rounded p-1.5 font-mono font-bold text-xs"
                              />
                            </div>
                            <div>
                              <label className="block font-bold text-slate-700 mb-1">
                                Implementing Nodal Agency:
                              </label>
                              <input
                                type="text"
                                defaultValue={dpr.nodalStateAgency}
                                className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block font-bold text-slate-700 mb-1">
                              Statutory Remarks &amp; Direction:
                            </label>
                            <textarea
                              rows={2}
                              value={remarks}
                              onChange={(e) => setRemarks(e.target.value)}
                              className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs"
                            />
                          </div>

                          <div className="flex items-center justify-end space-x-2 pt-1">
                            <button
                              onClick={() => setSanctioningDprCode(null)}
                              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSanctionDpr(dpr)}
                              className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded shadow-xs flex items-center space-x-1.5 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Affix Digital Sanction Stamp</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between pt-1">
                          <button
                            onClick={() => onSelectDpr(dpr)}
                            className="text-indigo-700 hover:text-indigo-900 font-bold flex items-center space-x-1 cursor-pointer"
                          >
                            <span>Inspect Full Technical Dossier</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              setSanctioningDprCode(dpr.projectCode);
                              setAllocatedAmount(dpr.estimatedCapexCr);
                            }}
                            className="bg-indigo-900 hover:bg-indigo-800 text-white font-bold uppercase tracking-wider text-[10px] px-3.5 py-2 rounded shadow-xs flex items-center space-x-1.5 cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3 text-amber-300" />
                            <span>Issue Sanction Order</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Sanction History */}
              {sanctionHistory.length > 0 && (
                <div className="border-t border-slate-200 pt-4 space-y-3">
                  <h4 className="font-bold text-xs text-slate-900 uppercase tracking-widest flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Recent Administrative Sanction Orders (Issued)</span>
                  </h4>
                  <div className="space-y-2">
                    {sanctionHistory.map((s) => (
                      <div
                        key={s.id}
                        className="bg-emerald-50/50 border border-emerald-200 rounded p-3 text-xs flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-emerald-900 text-[11px]">
                              {s.sanctionOrderNumber}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">
                              {new Date(s.sanctionTimestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="font-bold text-slate-800 mt-0.5">{s.dprTitle}</p>
                          <p className="text-slate-600 text-[11px] italic mt-0.5">"{s.remarks}"</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 block">Sanctioned Capex</span>
                          <span className="font-mono font-bold text-emerald-800 text-sm">
                            ₹{s.allocatedAmountCr?.toFixed(2)} Cr
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Citizen Claims Triage */}
          {activeTab === 'triage' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Grassroots Citizen Claims Triage &amp; Validation Queue
                </h3>
                <p className="text-slate-500 text-xs">
                  Review raw grievances submitted by citizens across WhatsApp, IVR, SMS, and Gram Panchayat kiosks.
                </p>
              </div>

              <div className="space-y-3">
                {pendingClaims.map((claim) => (
                  <div
                    key={claim.id}
                    className="bg-white border border-slate-200 rounded-sm p-4 space-y-3 shadow-2xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                              claim.urgency === 'Critical'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-indigo-100 text-indigo-800'
                            }`}
                          >
                            {claim.urgency} Urgency
                          </span>
                          <span className="text-xs text-slate-500 font-semibold">
                            {claim.district}, {claim.state}
                          </span>
                          <span className="text-xs text-slate-400">• {claim.date}</span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 mt-1">{claim.title}</h4>
                        <p className="text-xs text-indigo-900 font-semibold mt-0.5">
                          Submitted by: {claim.citizenName} ({claim.claimsCount} community co-signers)
                        </p>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded border ${
                          claim.status === 'Field Officer Validated'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {claim.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleValidateClaim(claim.id)}
                        disabled={claim.status === 'Field Officer Validated'}
                        className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1 cursor-pointer ${
                          claim.status === 'Field Officer Validated'
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-indigo-900 hover:bg-indigo-800 text-white shadow-xs'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{claim.status === 'Field Officer Validated' ? 'Validated' : 'Validate Claim'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Credentials */}
          {activeTab === 'credentials' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded p-5 space-y-4">
                <div className="flex items-center space-x-3 border-b border-slate-200 pb-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-900 text-white flex items-center justify-center font-bold text-base">
                    {currentUser?.displayName?.slice(0, 2).toUpperCase() || 'GO'}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{currentUser?.displayName}</h3>
                    <p className="text-xs text-indigo-900 font-semibold">
                      {official?.designation} • Badge #{official?.officialBadgeNumber}
                    </p>
                    <p className="text-xs text-slate-500">{currentUser?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block uppercase tracking-wider text-[10px] font-bold">
                      Administrative Department
                    </span>
                    <span className="font-bold text-slate-800">{official?.department}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase tracking-wider text-[10px] font-bold">
                      Jurisdiction Territory
                    </span>
                    <span className="font-bold text-slate-800">
                      {official?.jurisdictionDistrict || 'All'}, {official?.jurisdictionState}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase tracking-wider text-[10px] font-bold">
                      Clearance Level
                    </span>
                    <span className="font-mono font-bold text-indigo-900">{official?.clearanceLevel}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase tracking-wider text-[10px] font-bold">
                      Statutory Powers
                    </span>
                    <span className="text-emerald-700 font-bold">
                      DPR Sanctions • Capex Commitment • Beckn DPG
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
