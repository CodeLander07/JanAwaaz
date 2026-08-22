import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  Building2,
  Users,
  ShieldCheck,
  ChevronDown,
  LogOut,
  Sparkles,
  Award,
  FileCheck2,
  Send,
  Lock,
  ArrowRightLeft,
} from 'lucide-react';
import { useAuth, DEMO_PRESETS, DemoPresetType } from '../contexts/AuthContext';

interface UserNavProfileProps {
  onOpenAuthModal: (role?: 'official' | 'citizen') => void;
  onOpenOfficialPortal: () => void;
  onOpenCitizenPortal: () => void;
}

export const UserNavProfile: React.FC<UserNavProfileProps> = ({
  onOpenAuthModal,
  onOpenOfficialPortal,
  onOpenCitizenPortal,
}) => {
  const { currentUser, signOut, quickDemoLogin } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onOpenAuthModal('official')}
          className="px-3 py-1.5 bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer"
        >
          <Building2 className="w-3.5 h-3.5 text-amber-300" />
          <span>Official Portal</span>
        </button>

        <button
          onClick={() => onOpenAuthModal('citizen')}
          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer"
        >
          <Users className="w-3.5 h-3.5 text-emerald-200" />
          <span>Citizen Login</span>
        </button>
      </div>
    );
  }

  const isOfficial = currentUser.role === 'official';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2.5 px-3 py-1.5 rounded-sm border transition-all cursor-pointer ${
          isOfficial
            ? 'bg-indigo-950/80 hover:bg-indigo-900 text-white border-indigo-800'
            : 'bg-emerald-950/80 hover:bg-emerald-900 text-white border-emerald-800'
        }`}
      >
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
            isOfficial ? 'bg-amber-500 text-indigo-950' : 'bg-emerald-400 text-emerald-950'
          }`}
        >
          {isOfficial ? <Building2 className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
        </div>

        <div className="text-left hidden sm:block">
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-bold leading-none truncate max-w-[120px]">
              {currentUser.displayName}
            </span>
            <span
              className={`text-[8px] font-mono font-bold uppercase px-1 py-0.2 rounded ${
                isOfficial ? 'bg-amber-400/20 text-amber-300' : 'bg-emerald-400/20 text-emerald-300'
              }`}
            >
              {isOfficial ? 'Official' : 'Citizen'}
            </span>
          </div>
          <p className="text-[10px] text-slate-300 leading-none mt-0.5 truncate max-w-[120px]">
            {isOfficial
              ? currentUser.officialDetails?.designation || 'Planning Officer'
              : `Panchayat ${currentUser.citizenDetails?.villagePanchayat || 'Voice'}`}
          </p>
        </div>

        <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-sm shadow-xl z-50 overflow-hidden text-xs">
          {/* User Details Header */}
          <div
            className={`p-3.5 border-b ${
              isOfficial ? 'bg-indigo-950 text-white' : 'bg-emerald-950 text-white'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  isOfficial ? 'bg-amber-400 text-indigo-950' : 'bg-emerald-400 text-emerald-950'
                }`}
              >
                {currentUser.displayName.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs truncate">{currentUser.displayName}</div>
                <div className="text-[10px] text-slate-300 truncate">{currentUser.email}</div>
                <div className="text-[9px] font-mono text-amber-300 mt-0.5">
                  {isOfficial
                    ? `Clearance: ${currentUser.officialDetails?.clearanceLevel || 'Level-2'}`
                    : `Verified Citizen • Karma ${currentUser.citizenDetails?.endorsementKarma || 100}`}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-2 border-b border-slate-100 space-y-1">
            {isOfficial ? (
              <button
                onClick={() => {
                  onOpenOfficialPortal();
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-left font-bold text-indigo-950 hover:bg-indigo-50 rounded flex items-center space-x-2 transition-colors cursor-pointer"
              >
                <FileCheck2 className="w-4 h-4 text-indigo-600" />
                <span>Official DPR Appraisal Workbench</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onOpenCitizenPortal();
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-left font-bold text-emerald-950 hover:bg-emerald-50 rounded flex items-center space-x-2 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4 text-emerald-600" />
                <span>Citizen Action &amp; Grievance Hub</span>
              </button>
            )}

            {/* Cross-view access */}
            <button
              onClick={() => {
                if (isOfficial) {
                  onOpenCitizenPortal();
                } else {
                  onOpenOfficialPortal();
                }
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-left text-slate-600 hover:bg-slate-50 rounded flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {isOfficial ? 'Open Citizen View & Grievances' : 'Open Official Appraisal View'}
              </span>
            </button>
          </div>

          {/* 1-Click Role Switcher */}
          <div className="p-2.5 bg-slate-50 border-b border-slate-100">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
              Switch Verified Identity (Demo Presets):
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
              <button
                onClick={() => {
                  quickDemoLogin('official_collector');
                  setIsOpen(false);
                }}
                className="p-1.5 bg-white border border-slate-200 hover:border-indigo-400 rounded text-left font-semibold text-slate-800 transition-all cursor-pointer"
              >
                <span className="block font-bold text-indigo-900">District Magistrate</span>
                <span className="text-[9px] text-slate-500">Official</span>
              </button>

              <button
                onClick={() => {
                  quickDemoLogin('citizen_leader');
                  setIsOpen(false);
                }}
                className="p-1.5 bg-white border border-slate-200 hover:border-emerald-400 rounded text-left font-semibold text-slate-800 transition-all cursor-pointer"
              >
                <span className="block font-bold text-emerald-900">Sarpanch Devi</span>
                <span className="text-[9px] text-slate-500">Citizen</span>
              </button>
            </div>
          </div>

          {/* Sign in / Sign out footer */}
          <div className="p-2 flex items-center justify-between text-[11px]">
            <button
              onClick={() => {
                onOpenAuthModal();
                setIsOpen(false);
              }}
              className="text-indigo-700 hover:underline font-semibold cursor-pointer"
            >
              Manage Account
            </button>

            <button
              onClick={() => {
                signOut();
                setIsOpen(false);
              }}
              className="text-red-600 hover:text-red-700 font-semibold flex items-center space-x-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
