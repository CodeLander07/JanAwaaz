import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  Building2,
  Users,
  Lock,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Award,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Key,
  BadgeCheck,
  ArrowRight,
  Compass,
} from 'lucide-react';
import { useAuth, DEMO_PRESETS, DemoPresetType } from '../contexts/AuthContext';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'official',
}) => {
  const { signInWithEmail, signUpWithEmail, quickDemoLogin, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<UserRole>(initialRole);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Official specific form state
  const [employeeId, setEmployeeId] = useState('');
  const [designation, setDesignation] = useState('District Planning Officer');
  const [department, setDepartment] = useState('District Planning & Revenue Administration');
  const [jurisdictionState, setJurisdictionState] = useState('Uttar Pradesh');
  const [jurisdictionDistrict, setJurisdictionDistrict] = useState('Mahoba');
  const [clearanceLevel, setClearanceLevel] = useState<
    'L1_FIELD_OFFICER' | 'L2_DISTRICT_MAGISTRATE' | 'L3_STATE_SECRETARY' | 'L4_CABINET_ADVISOR'
  >('L2_DISTRICT_MAGISTRATE');

  // Citizen specific form state
  const [citizenState, setCitizenState] = useState('Uttar Pradesh');
  const [citizenDistrict, setCitizenDistrict] = useState('Mahoba');
  const [citizenTehsil, setCitizenTehsil] = useState('Kabrai');
  const [preferredLang, setPreferredLang] = useState('hi');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (authMode === 'signin') {
        await signInWithEmail(email, password);
        setSuccessMessage('Signed in successfully.');
        setTimeout(() => onClose(), 600);
      } else {
        if (activeTab === 'official') {
          await signUpWithEmail(email, password, {
            displayName: fullName || 'Government Official',
            role: 'official',
            phone,
            email,
            officialDetails: {
              employeeId: employeeId || `OFF-${Date.now().toString().slice(-4)}`,
              designation,
              department,
              jurisdictionState,
              jurisdictionDistrict,
              clearanceLevel,
              canApproveDPR: true,
              canAllocateCapex: true,
              canPublishDPG: true,
              officialBadgeNumber: `GOV-${Math.floor(1000 + Math.random() * 9000)}`,
            },
          });
        } else {
          await signUpWithEmail(email, password, {
            displayName: fullName || 'Citizen Representative',
            role: 'citizen',
            phone,
            email,
            citizenDetails: {
              state: citizenState,
              district: citizenDistrict,
              blockTehsil: citizenTehsil,
              preferredLanguage: preferredLang,
              verifiedCitizen: true,
              claimsSubmittedCount: 1,
              upvotedHotspotIds: [],
              endorsementKarma: 50,
            },
          });
        }
        setSuccessMessage('Account provisioned & authorized successfully.');
        setTimeout(() => onClose(), 600);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error. Please verify credentials.');
    }
  };

  const handleQuickDemo = async (presetKey: DemoPresetType) => {
    try {
      await quickDemoLogin(presetKey);
      onClose();
    } catch (e: any) {
      setErrorMessage(e.message || 'Quick login failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-sm max-w-2xl w-full my-8 shadow-2xl overflow-hidden flex flex-col">
        {/* Header Bar */}
        <div className="bg-indigo-950 text-white p-6 border-b border-indigo-900 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded bg-white/10 border border-white/20 flex items-center justify-center text-orange-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold tracking-tight">CivicPulse Identity &amp; Auth Hub</h2>
                <span className="text-[9px] bg-orange-500/20 text-orange-300 border border-orange-400/30 px-2 py-0.5 rounded font-mono font-bold uppercase">
                  Firebase Auth
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                Role-based access control for Government Planning Officials &amp; Grassroots Citizens
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

        {/* 1-Click Fast Track Presets Bar */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>1-Click Verified Role Presets (Instant Access)</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">No password required</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Collector Preset */}
            <button
              type="button"
              onClick={() => handleQuickDemo('official_collector')}
              className="bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 p-2.5 rounded text-left transition-all group flex items-start space-x-2.5 cursor-pointer shadow-2xs"
            >
              <div className="w-7 h-7 rounded bg-indigo-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                DM
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-xs text-slate-900 group-hover:text-indigo-900 truncate">
                    Dr. Rajesh Sharma, IAS
                  </span>
                  <span className="text-[9px] font-bold bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded shrink-0">
                    Official
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 truncate">
                  District Collector (Mahoba) • Approve DPRs &amp; Sanction
                </p>
              </div>
            </button>

            {/* Ministry Preset */}
            <button
              type="button"
              onClick={() => handleQuickDemo('official_ministry')}
              className="bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 p-2.5 rounded text-left transition-all group flex items-start space-x-2.5 cursor-pointer shadow-2xs"
            >
              <div className="w-7 h-7 rounded bg-amber-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                JS
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-xs text-slate-900 group-hover:text-indigo-900 truncate">
                    Ananya Deshmukh
                  </span>
                  <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded shrink-0">
                    Ministry
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 truncate">
                  NITI Strategic Advisor • Capex Budget Allocation
                </p>
              </div>
            </button>

            {/* Citizen Sarpanch Preset */}
            <button
              type="button"
              onClick={() => handleQuickDemo('citizen_leader')}
              className="bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 p-2.5 rounded text-left transition-all group flex items-start space-x-2.5 cursor-pointer shadow-2xs"
            >
              <div className="w-7 h-7 rounded bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                GP
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-xs text-slate-900 group-hover:text-emerald-900 truncate">
                    Savitri Devi (Sarpanch)
                  </span>
                  <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded shrink-0">
                    Citizen Leader
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 truncate">
                  Panchayat Kabra • Submit Claims &amp; Track Lifecycle
                </p>
              </div>
            </button>

            {/* Resident Farmer Preset */}
            <button
              type="button"
              onClick={() => handleQuickDemo('citizen_resident')}
              className="bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 p-2.5 rounded text-left transition-all group flex items-start space-x-2.5 cursor-pointer shadow-2xs"
            >
              <div className="w-7 h-7 rounded bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                CZ
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-xs text-slate-900 group-hover:text-emerald-900 truncate">
                    Rameshwar Kumar
                  </span>
                  <span className="text-[9px] font-bold bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded shrink-0">
                    Resident
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 truncate">
                  Bastar Tribal Area • Upvote Hotspots &amp; Vernacular Voice
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Role Tab Switcher: Official Portal vs Citizen Portal */}
        <div className="p-6 space-y-5">
          <div className="flex border-b border-slate-200">
            <button
              type="button"
              onClick={() => {
                setActiveTab('official');
                setEmail('collector.mahoba@nic.in');
              }}
              className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer border-b-2 ${
                activeTab === 'official'
                  ? 'border-indigo-900 text-indigo-950'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>Government Planning Official</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('citizen');
                setEmail('sarpanch.kabra@panchayat.in');
              }}
              className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer border-b-2 ${
                activeTab === 'citizen'
                  ? 'border-emerald-600 text-emerald-950'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Citizen &amp; Community Rep</span>
            </button>
          </div>

          {/* Mode Switch: Sign In vs Sign Up */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">
              {authMode === 'signin' ? 'Sign in with Credentials' : 'Register New Verified Profile'}
            </span>
            <div className="space-x-2">
              <button
                type="button"
                onClick={() => setAuthMode('signin')}
                className={`font-semibold cursor-pointer ${
                  authMode === 'signin' ? 'text-indigo-900 underline font-bold' : 'text-slate-500'
                }`}
              >
                Sign In
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`font-semibold cursor-pointer ${
                  authMode === 'signup' ? 'text-indigo-900 underline font-bold' : 'text-slate-500'
                }`}
              >
                Create Account
              </button>
            </div>
          </div>

          {/* Alerts */}
          {errorMessage && (
            <div className="p-3 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {authMode === 'signup' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Full Name:</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={activeTab === 'official' ? 'Dr. Rajesh Sharma' : 'Savitri Devi'}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone Number:</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Official Registration Fields */}
            {authMode === 'signup' && activeTab === 'official' && (
              <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded space-y-3">
                <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-widest block">
                  Official Administrative Governance Credentials
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Designation:</label>
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Department:</label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">State / Jurisdiction:</label>
                    <input
                      type="text"
                      value={jurisdictionState}
                      onChange={(e) => setJurisdictionState(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">District / Territory:</label>
                    <input
                      type="text"
                      value={jurisdictionDistrict}
                      onChange={(e) => setJurisdictionDistrict(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Citizen Registration Fields */}
            {authMode === 'signup' && activeTab === 'citizen' && (
              <div className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded space-y-3">
                <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-widest block">
                  Citizen Community Demographics
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">State:</label>
                    <input
                      type="text"
                      value={citizenState}
                      onChange={(e) => setCitizenState(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">District:</label>
                    <input
                      type="text"
                      value={citizenDistrict}
                      onChange={(e) => setCitizenDistrict(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Block / Tehsil:</label>
                    <input
                      type="text"
                      value={citizenTehsil}
                      onChange={(e) => setCitizenTehsil(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Email & Password Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Official Email / ID:</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={activeTab === 'official' ? 'collector.mahoba@nic.in' : 'sarpanch.kabra@panchayat.in'}
                    className="w-full bg-slate-50 border border-slate-200 rounded pl-8 pr-2 py-2 text-xs focus:ring-1 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Password:</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded pl-8 pr-2 py-2 text-xs focus:ring-1 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 text-white font-bold uppercase tracking-widest text-xs rounded transition-all flex items-center justify-center space-x-2 shadow-xs cursor-pointer ${
                activeTab === 'official'
                  ? 'bg-indigo-900 hover:bg-indigo-800'
                  : 'bg-emerald-700 hover:bg-emerald-600'
              }`}
            >
              {isLoading ? (
                <span>Authenticating with Firebase...</span>
              ) : (
                <>
                  <span>
                    {authMode === 'signin'
                      ? `Sign In as ${activeTab === 'official' ? 'Official' : 'Citizen'}`
                      : `Complete ${activeTab === 'official' ? 'Official' : 'Citizen'} Registration`}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
