import React, { useState } from 'react';
import {
  Users,
  Send,
  Sparkles,
  MapPin,
  ThumbsUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Radio,
  Award,
  ArrowRight,
  Flame,
  Droplets,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { HotspotCluster, SectorType } from '../types';
import { submitCitizenClaim, upvoteClaim } from '../lib/firebase';
import confetti from 'canvas-confetti';

interface CitizenPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotspots: HotspotCluster[];
  onSelectHotspot: (hotspot: HotspotCluster) => void;
}

export const CitizenPortalModal: React.FC<CitizenPortalModalProps> = ({
  isOpen,
  onClose,
  hotspots,
  onSelectHotspot,
}) => {
  const { currentUser, updateUserProfileState } = useAuth();
  const [activeTab, setActiveTab] = useState<'submit' | 'my_claims' | 'endorse'>('submit');

  // Form State
  const [sector, setSector] = useState<SectorType>('Water & Sanitation');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [district, setDistrict] = useState(currentUser?.citizenDetails?.district || 'Mahoba');
  const [state, setState] = useState(currentUser?.citizenDetails?.state || 'Uttar Pradesh');
  const [blockTehsil, setBlockTehsil] = useState(currentUser?.citizenDetails?.blockTehsil || 'Kabrai');
  const [urgency, setUrgency] = useState<'Critical' | 'High' | 'Medium'>('Critical');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Local user's claim history
  const [myClaims, setMyClaims] = useState([
    {
      id: 'my-c-1',
      title: 'Solar Powered Mini-Piped Water Scheme for Harijan Basti',
      sector: 'Water & Sanitation' as SectorType,
      district: 'Mahoba',
      state: 'Uttar Pradesh',
      date: 'Aug 18, 2026',
      status: 'DPR_FORMULATED' as const,
      upvotes: 42,
      progressStep: 4,
    },
    {
      id: 'my-c-2',
      title: 'All-Weather Culvert over River Nullah connecting Gram Path',
      sector: 'Rural Roads & Bridges' as SectorType,
      district: 'Mahoba',
      state: 'Uttar Pradesh',
      date: 'Aug 10, 2026',
      status: 'SANCTIONED' as const,
      upvotes: 89,
      progressStep: 5,
    },
  ]);

  if (!isOpen) return null;

  const citizen = currentUser?.citizenDetails;

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await submitCitizenClaim({
        userId: currentUser?.uid || 'citizen-anon',
        userName: currentUser?.displayName || 'Savitri Devi',
        userPhone: currentUser?.phone,
        sector,
        title,
        description: description || 'Citizen voice infrastructure demand submitted via CivicPulse AI portal.',
        language: citizen?.preferredLanguage || 'hi',
        location: {
          state,
          district,
          blockTehsil,
          lat: 25.293,
          lng: 79.872,
        },
        urgencyLevel: urgency,
      });

      const newClaim = {
        id: `my-c-${Date.now()}`,
        title,
        sector,
        district,
        state,
        date: 'Just now',
        status: 'SUBMITTED' as const,
        upvotes: 1,
        progressStep: 1,
      };

      setMyClaims([newClaim, ...myClaims]);
      setSuccessToast('Your infrastructure grievance was registered in Firebase and broadcast to planning officials!');
      setTitle('');
      setDescription('');
      setActiveTab('my_claims');

      // Karma boost
      updateUserProfileState({
        citizenDetails: {
          ...citizen!,
          claimsSubmittedCount: (citizen?.claimsSubmittedCount || 0) + 1,
          endorsementKarma: (citizen?.endorsementKarma || 0) + 25,
        },
      });

      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.8 },
      });

      setTimeout(() => setSuccessToast(null), 5000);
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-sm max-w-3xl w-full my-8 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-emerald-950 text-white p-6 border-b border-emerald-900 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded bg-white/10 border border-white/20 flex items-center justify-center text-emerald-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold tracking-tight">Citizen Action &amp; Grievance Tracker</h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded font-mono font-bold uppercase">
                  Verified Citizen Voice
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-0.5">
                {currentUser?.displayName} • Gram Panchayat {citizen?.villagePanchayat || 'Kabra'}, {citizen?.district || 'Mahoba'}
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
            onClick={() => setActiveTab('submit')}
            className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'submit'
                ? 'border-emerald-600 text-emerald-950'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Voice / Submit Claim</span>
          </button>

          <button
            onClick={() => setActiveTab('my_claims')}
            className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'my_claims'
                ? 'border-emerald-600 text-emerald-950'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>My Grievance Lifecycle ({myClaims.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('endorse')}
            className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'endorse'
                ? 'border-emerald-600 text-emerald-950'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>Community Hotspots Endorsements</span>
          </button>
        </div>

        {/* Success Banner */}
        {successToast && (
          <div className="bg-emerald-600 text-white text-xs px-6 py-2.5 font-bold flex items-center justify-between">
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
          {/* TAB 1: Submit Claim Form */}
          {activeTab === 'submit' && (
            <form onSubmit={handleSubmitClaim} className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Submit Direct Grassroots Infrastructure Grievance
                </h3>
                <p className="text-slate-500 text-xs">
                  Your claim is analyzed in real time with AI, translated, geocoded, and routed directly to District Collectors and Planning Ministries.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sector Category:</label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value as SectorType)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold"
                  >
                    <option value="Water & Sanitation">Water &amp; Sanitation (JJM)</option>
                    <option value="Rural Roads & Bridges">Rural Roads &amp; Bridges (PMGSY)</option>
                    <option value="Primary Healthcare">Primary Healthcare (PM-ABHIM)</option>
                    <option value="Rural Electrification & Solar">Rural Electrification &amp; Solar</option>
                    <option value="Education & Anganwadi">Education &amp; Anganwadi</option>
                    <option value="Irrigation & Flood Mitigation">Irrigation &amp; Flood Mitigation</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Urgency Level:</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold"
                  >
                    <option value="Critical">Critical Distress (Immediate Intervention)</option>
                    <option value="High">High Urgency (Severe Access Gap)</option>
                    <option value="Medium">Medium Urgency (Community Improvement)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Infrastructure Problem Title:
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Broken culvert isolating 400 households during monsoons"
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-medium focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Ground Details / Vernacular Voice Transcript:
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the affected population, distance to nearest facility, months without water/access, or any historical context..."
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 bg-emerald-50/50 border border-emerald-100 rounded">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">State:</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">District:</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Block / Tehsil:</label>
                  <input
                    type="text"
                    value={blockTehsil}
                    onChange={(e) => setBlockTehsil(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold uppercase tracking-widest text-xs rounded transition-all flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>{isSubmitting ? 'Registering Claim...' : 'Publish Grassroots Grievance to Cloud'}</span>
              </button>
            </form>
          )}

          {/* TAB 2: My Claims Lifecycle */}
          {activeTab === 'my_claims' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Track Your Grievances from Ingestion to Administrative Sanction
                </h3>
                <p className="text-slate-500 text-xs">
                  Full transparent visibility into how citizen claims are synthesized into DPRs and funded by ministries.
                </p>
              </div>

              <div className="space-y-4">
                {myClaims.map((claim) => (
                  <div
                    key={claim.id}
                    className="bg-white border border-slate-200 rounded-sm p-4 space-y-3 shadow-2xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                          {claim.sector}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 mt-1">{claim.title}</h4>
                        <p className="text-xs text-slate-500">{claim.district}, {claim.state} • {claim.date}</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">
                        {claim.upvotes} Upvotes
                      </span>
                    </div>

                    {/* Progress Stepper */}
                    <div className="bg-slate-50 p-3 rounded border border-slate-100 space-y-2">
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block">
                        Lifecycle Pipeline Progress
                      </span>
                      <div className="grid grid-cols-5 gap-1.5 text-center text-[9px] font-bold">
                        {[
                          { label: 'Submitted', step: 1 },
                          { label: 'GIS Clustered', step: 2 },
                          { label: 'NITI Ranked', step: 3 },
                          { label: 'DPR Formulated', step: 4 },
                          { label: 'Sanctioned', step: 5 },
                        ].map((s) => {
                          const isDone = claim.progressStep >= s.step;
                          return (
                            <div
                              key={s.label}
                              className={`p-1.5 rounded transition-all ${
                                isDone
                                  ? 'bg-emerald-600 text-white shadow-2xs'
                                  : 'bg-slate-200 text-slate-400'
                              }`}
                            >
                              {s.label}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Community Hotspots Endorsement */}
          {activeTab === 'endorse' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Endorse &amp; Upvote Critical Infrastructure Priorities
                </h3>
                <p className="text-slate-500 text-xs">
                  Your votes directly increase the Disparity Gap Index, propelling the issue up for priority government budget allocation.
                </p>
              </div>

              <div className="space-y-3">
                {hotspots.map((h) => (
                  <div
                    key={h.id}
                    className="bg-white border border-slate-200 rounded-sm p-3.5 flex items-center justify-between hover:border-emerald-300 transition-all shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[9px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                          {h.sector}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">
                          {h.district}, {h.state}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 mt-1">{h.title}</h4>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {h.requestCount} verified claims • {h.affectedPopulation.toLocaleString()} citizens affected
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onSelectHotspot(h);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs rounded transition-colors flex items-center space-x-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>View &amp; Endorse</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
