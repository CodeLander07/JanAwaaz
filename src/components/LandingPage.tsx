import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mic,
  MapPin,
  BarChart3,
  FileSpreadsheet,
  Globe2,
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  Languages,
  PhoneCall,
  Smartphone,
  Heart,
  Building2,
  Briefcase,
  Code2,
  Database,
  Lock,
  Network,
  Radio,
  Cpu,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
} from 'lucide-react';
import { GLOBAL_COUNTRY_PROFILES } from '../data/indianLanguages';
import { DemoWalkthrough } from './DemoWalkthrough';

const PlayIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M8 5v14l11-7z" />
  </svg>
);

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-orange-500 selection:text-white">
      <LandingNav />
      <main>
        <Hero />
        <TrustStrip />
        <ProblemSolution />
        <PipelineOverview />
        <DemoSection />
        <AudienceSections />
        <FeatureGrid />
        <DpgSection />
        <FaqSection />
        <FinalCta />
      </main>
      <LandingFooter />
    </div>
  );
};

const LandingNav: React.FC = () => {
  const [open, setOpen] = useState(false);
  const links = [
    { href: '#pipeline', label: 'Pipeline' },
    { href: '#demo', label: 'Live Demo' },
    { href: '#audiences', label: 'Who It Serves' },
    { href: '#features', label: 'Features' },
    { href: '#dpg', label: 'Open Standards' },
    { href: '#faq', label: 'FAQ' },
  ];
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="w-9 h-9 bg-orange-500 rounded-sm rotate-45 flex items-center justify-center shadow-md border border-orange-400/40">
            <div className="w-4 h-4 bg-white rounded-full -rotate-45 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-indigo-900 rounded-full" />
            </div>
          </div>
          <div>
            <div className="text-sm font-extrabold tracking-tight uppercase text-indigo-950 leading-none">
              CivicPulse AI
            </div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-orange-600">
              DPG-OPEN-2026
            </div>
          </div>
        </Link>
        <nav className="hidden lg:flex items-center space-x-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-indigo-900 transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:flex items-center space-x-2">
          <Link
            to="/app"
            className="text-xs font-bold text-slate-600 hover:text-indigo-900 px-3 py-2 transition-colors"
          >
            Docs
          </Link>
          <Link
            to="/app"
            className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-sm flex items-center space-x-1.5 transition-all shadow-md border border-orange-400"
          >
            <span>Open App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <button
          className="md:hidden p-2 text-slate-700 hover:text-indigo-900"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-3 flex flex-col space-y-2">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-indigo-900 py-2"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/app"
              className="bg-orange-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-sm text-center mt-2"
              onClick={() => setOpen(false)}
            >
              Open App
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

const Hero: React.FC = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 text-white">
    <div className="absolute inset-0 bg-[radial-gradient(#4338ca_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />
    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 via-indigo-400 to-emerald-500" />
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-orange-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm shadow-xs">
              Universal Digital Public Good
            </span>
            <span className="bg-indigo-800/80 text-indigo-100 text-[10px] font-medium uppercase tracking-wider px-3 py-1 rounded-sm border border-indigo-700/60">
              DPGA Certified Standard
            </span>
            <span className="bg-emerald-900/80 text-emerald-300 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-sm border border-emerald-700/60">
              Open Governance
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight uppercase leading-[1.05]">
            Turn citizen voice into
            <span className="block text-orange-400 mt-1">bankable public infrastructure.</span>
          </h1>
          <p className="text-base sm:text-lg text-indigo-100 leading-relaxed max-w-xl">
            CivicPulse AI is an open, multilingual platform that aggregates grassroots citizen
            infrastructure demand across any dialect, surfaces spatial deprivation hotspots, and
            autonomously drafts sanction-ready Detailed Project Reports (DPRs) for ministries,
            district officers, and planning commissions.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/app"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-wider text-sm px-6 py-3 rounded-sm shadow-md flex items-center space-x-2 transition-all border border-orange-400"
            >
              <span>Launch the Platform</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#demo"
              className="bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider text-sm px-6 py-3 rounded-sm border border-white/20 flex items-center space-x-2 transition-colors"
            >
              <PlayIcon />
              <span>See Live Demo</span>
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-indigo-800/60">
            <HeroStat label="Citizen Demands" value="10k+" hint="Across all channels" />
            <HeroStat label="Hotspots Detected" value="48" hint="Spatial clusters" accent />
            <HeroStat label="Capex Surfaced" value="$640M" hint="Re-allocatable" />
            <HeroStat label="DPRs Generated" value="9" hint="Bankable dossiers" />
          </div>
        </div>
        <HeroVisual />
      </div>
    </div>
  </section>
);

const HeroStat: React.FC<{ label: string; value: string; hint: string; accent?: boolean }> = ({
  label,
  value,
  hint,
  accent,
}) => (
  <div>
    <div className="text-[10px] uppercase font-bold text-indigo-300 tracking-widest">{label}</div>
    <div className={`text-2xl font-mono font-bold mt-0.5 ${accent ? 'text-orange-400' : 'text-white'}`}>
      {value}
    </div>
    <div className="text-[10px] text-indigo-300 font-medium">{hint}</div>
  </div>
);

const HeroVisual: React.FC = () => (
  <div className="relative h-[460px] sm:h-[520px] hidden lg:block">
    <div className="absolute top-0 right-0 w-[88%] h-[68%] bg-slate-100 rounded-sm border border-slate-300 shadow-2xl overflow-hidden">
      <div className="bg-indigo-950 text-white px-3 py-2 flex items-center justify-between text-[10px] uppercase tracking-widest font-bold">
        <span className="flex items-center space-x-1.5">
          <MapPin className="w-3 h-3 text-orange-400" />
          <span>Spatial Demand Heatmap</span>
        </span>
        <span className="text-emerald-300">Live</span>
      </div>
      <svg viewBox="0 0 400 250" className="w-full h-[calc(100%-30px)]">
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="250" stroke="#cbd5e1" strokeWidth="0.5" />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={`h-${i}`} x1="0" y1={i * 50} x2="400" y2={i * 50} stroke="#cbd5e1" strokeWidth="0.5" />
        ))}
        <path d="M40,60 Q70,40 110,55 Q140,40 170,70 Q200,55 240,80 Q280,65 320,90 Q360,80 380,110 L380,200 Q340,220 300,210 Q260,225 220,205 Q180,220 140,200 Q100,215 60,200 L40,180 Z" fill="#e0e7ff" opacity="0.6" />
        {[
          { x: 90, y: 90, r: 24 },
          { x: 160, y: 110, r: 32 },
          { x: 230, y: 130, r: 22 },
          { x: 290, y: 90, r: 18 },
          { x: 130, y: 170, r: 16 },
        ].map((h, i) => (
          <g key={i}>
            <circle cx={h.x} cy={h.y} r={h.r * 1.6} fill="#f97316" opacity="0.18" />
            <circle cx={h.x} cy={h.y} r={h.r} fill="#f97316" opacity="0.5" />
            <circle cx={h.x} cy={h.y} r={h.r * 0.4} fill="#ea580c" />
          </g>
        ))}
      </svg>
    </div>
    <div className="absolute top-[20%] left-0 w-[55%] bg-white text-slate-900 rounded-sm border border-slate-200 shadow-2xl p-4 space-y-2">
      <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-slate-500">
        <Mic className="w-3 h-3 text-orange-500" />
        <span>Citizen • Hindi IVR</span>
      </div>
      <div className="text-xs font-semibold leading-snug">
        "हमारे गाँव में पीने का पानी पीला और बदबूदार है। बच्चों के पेट में दर्द रहता है।"
      </div>
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-slate-500">Mahoba, Uttar Pradesh</span>
        <span className="text-rose-600 font-bold uppercase">Urgency 92/100</span>
      </div>
    </div>
    <div className="absolute bottom-0 right-[2%] w-[60%] bg-white text-slate-900 rounded-sm border border-slate-200 shadow-2xl p-4 space-y-2">
      <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-emerald-700">
        <FileSpreadsheet className="w-3 h-3" />
        <span>Bankable DPR generated</span>
      </div>
      <div className="text-sm font-bold">Mahoba Arsenic Remediation • ₹142 Cr</div>
      <div className="grid grid-cols-3 gap-2 text-[10px]">
        <div className="bg-slate-50 p-1.5 rounded-sm">
          <div className="text-slate-500 uppercase tracking-widest text-[9px]">S-ROI</div>
          <div className="font-mono font-bold text-slate-900">4.7×</div>
        </div>
        <div className="bg-slate-50 p-1.5 rounded-sm">
          <div className="text-slate-500 uppercase tracking-widest text-[9px]">Timeline</div>
          <div className="font-mono font-bold text-slate-900">18mo</div>
        </div>
        <div className="bg-slate-50 p-1.5 rounded-sm">
          <div className="text-slate-500 uppercase tracking-widest text-[9px]">Beneficiaries</div>
          <div className="font-mono font-bold text-slate-900">8.4k</div>
        </div>
      </div>
    </div>
  </div>
);

const TrustStrip: React.FC = () => {
  const items = [
    { icon: ShieldCheck, label: 'DPGA Certified' },
    { icon: Code2, label: 'Beckn Open Protocol' },
    { icon: Languages, label: 'Bhashini v2 Multilingual' },
    { icon: Lock, label: 'DPDPA Compliant' },
    { icon: Globe2, label: 'UN SDG Aligned' },
    { icon: Network, label: 'Open REST APIs' },
  ];
  return (
    <section className="bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
          <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
            Compliant with global open standards
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {items.map((it, i) => {
              const Icon = it.icon;
              return (
                <div
                  key={i}
                  className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                  <Icon className="w-4 h-4 text-emerald-600" />
                  <span>{it.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

const ProblemSolution: React.FC = () => (
  <section className="py-16 sm:py-24 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-600">
          The Problem vs. The Solution
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-indigo-950">
          Top-down planning is failing the last mile.
        </h2>
        <p className="text-base text-slate-600 leading-relaxed">
          80% of grassroots citizen grievances never reach planning boards, while billions in
          approved capex remain unspent. CivicPulse AI replaces this broken feedback loop with
          autonomous, real-time ground-truth intelligence.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 border-l-4 border-l-rose-500 p-6 sm:p-8 rounded-sm shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-rose-600">
            <Radio className="w-5 h-5" />
            <h3 className="font-bold text-sm uppercase tracking-widest">
              The Problem: Disconnected Planning
            </h3>
          </div>
          <ul className="space-y-3 text-sm text-slate-700 font-medium">
            {[
              'Citizens excluded by language & digital literacy barriers — smartphones are not ubiquitous in rural districts.',
              'Static 5-year census data lags reality by years; needs emerge seasonally and acutely.',
              'Months of administrative delay commissioning field feasibility studies.',
              'Billions in approved Capex sit idle due to a lack of sanction-ready engineering dossiers.',
              'Persistent disparity gaps in water, roads, power, health, and education.',
            ].map((p, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="text-rose-500 font-bold mt-0.5">✕</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white border border-slate-200 border-l-4 border-l-emerald-600 p-6 sm:p-8 rounded-sm shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-emerald-700">
            <Zap className="w-5 h-5" />
            <h3 className="font-bold text-sm uppercase tracking-widest">
              The Solution: Ground-Truth AI
            </h3>
          </div>
          <ul className="space-y-3 text-sm text-slate-700 font-medium">
            {[
              'Voice-first IVR in any vernacular dialect — works on any phone, no app required.',
              'Real-time spatial clustering surfaces deprivation hotspots within minutes of intake.',
              'Disparity Matrix cross-references citizen distress with unspent public capex.',
              'Autonomous DPR generator drafts bankable, mission-aligned Detailed Project Reports.',
              'Open REST APIs + Beckn schema for inter-agency interoperability and audit.',
            ].map((p, i) => (
              <li key={i} className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

const PipelineOverview: React.FC = () => {
  const steps = [
    {
      n: '01',
      title: 'Omnichannel Intake',
      icon: Mic,
      color: 'border-l-orange-500',
      iconColor: 'text-orange-600',
      bg: 'bg-orange-50',
      desc: 'Toll-free IVR, WhatsApp bots, SMS shortcodes, CSC kiosks — every channel, every dialect.',
    },
    {
      n: '02',
      title: 'Spatial Clustering',
      icon: MapPin,
      color: 'border-l-indigo-600',
      iconColor: 'text-indigo-600',
      bg: 'bg-indigo-50',
      desc: 'DBSCAN aggregates unstructured voices into geospatial deprivation nodes.',
    },
    {
      n: '03',
      title: 'Disparity Matrix',
      icon: BarChart3,
      color: 'border-l-purple-600',
      iconColor: 'text-purple-600',
      bg: 'bg-purple-50',
      desc: 'Quadrant analysis correlates demand spikes with idle capex to surface blindspots.',
    },
    {
      n: '04',
      title: 'DPR Synthesis',
      icon: FileSpreadsheet,
      color: 'border-l-emerald-600',
      iconColor: 'text-emerald-600',
      bg: 'bg-emerald-50',
      desc: 'Gemini drafts a PIB-format DPR with BoQ, timeline, climate resilience, S-ROI.',
    },
  ];
  return (
    <section id="pipeline" className="py-16 sm:py-24 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600">
            End-to-end automation
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-indigo-950">
            Four stages from voice to sanction
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Each stage is auditable, role-gated, and exportable. The whole pipeline closes in
            minutes, not months.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.n}
                className={`bg-white border border-slate-200 border-l-4 ${s.color} p-6 rounded-sm shadow-xs hover:shadow-md transition-all relative`}
              >
                <div className="absolute top-3 right-4 font-mono text-3xl font-extrabold text-slate-100 select-none">
                  {s.n}
                </div>
                <div className={`w-12 h-12 ${s.bg} rounded-sm flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${s.iconColor}`} />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block w-5 h-5 text-slate-300 absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-slate-50 p-0.5" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const DemoSection: React.FC = () => (
  <section id="demo" className="py-16 sm:py-24 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-600">
          Try it yourself
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-indigo-950">
          Walk through a real citizen grievance
        </h2>
        <p className="text-base text-slate-600 leading-relaxed">
          Pick a scenario, press play, and watch CivicPulse AI move a citizen's voice from a
          rural village phone call all the way to a sanction-ready bankable project. No signup,
          no API key, no backend calls.
        </p>
      </div>
      <DemoWalkthrough />
    </div>
  </section>
);

const AudienceSections: React.FC = () => {
  const audiences = [
    {
      key: 'citizen',
      title: 'For Citizens',
      icon: Heart,
      accent: 'border-rose-300',
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-600',
      bullets: [
        'File a grievance in your own dialect via a free phone call or WhatsApp.',
        'No smartphone, no app, no internet required — works on any handset.',
        'Receive an acknowledgment in your native script with a tracking ID.',
        'See real outcomes when your issue is aggregated into a sanctioned project.',
      ],
      cta: 'No account needed — try the IVR simulator in the platform',
    },
    {
      key: 'policymaker',
      title: 'For Policymakers',
      icon: Building2,
      accent: 'border-indigo-300',
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-700',
      bullets: [
        'Live disparity quadrant showing where demand and funding are misaligned.',
        'Click any hotspot to auto-generate a PIB-format DPR in minutes.',
        'AI Policy Copilot answers strategic budget reallocation questions.',
        'One-click export to PM Gati Shakti, SDG, and ESG compliance formats.',
      ],
      cta: 'Sign in via the Official Portal to sanction DPRs',
    },
    {
      key: 'developer',
      title: 'For Developers',
      icon: Code2,
      accent: 'border-emerald-300',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-700',
      bullets: [
        'Open Beckn-compatible REST endpoints for citizen intake & DPR export.',
        'Firebase + Firestore schema documented for stateful deployment.',
        'Pluggable Gemini / OpenAI / on-prem LLM adapters — no vendor lock-in.',
        'Apache-2.0 source code with reproducible builds and a CI test suite.',
      ],
      cta: 'Fork the repo and self-host in your jurisdiction',
    },
    {
      key: 'donor',
      title: 'For Multilateral Donors',
      icon: Briefcase,
      accent: 'border-amber-300',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-700',
      bullets: [
        'Quantifiable SDG outcomes with pre/post KPIs for every sanctioned DPR.',
        'Transparent capex absorption rate by district, ministry, and sector.',
        'Geo-tagged dashboards for fiduciary oversight and impact reporting.',
        'Compliance with DPDPA, Beckn, Bhashini, and OGD standards.',
      ],
      cta: 'Request a sandbox deployment for evaluation',
    },
  ];
  return (
    <section id="audiences" className="py-16 sm:py-24 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600">
            Built for every stakeholder
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-indigo-950">
            One platform, four audiences
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {audiences.map((a) => {
            const Icon = a.icon;
            return (
              <div
                key={a.key}
                className={`bg-white border border-slate-200 ${a.accent} border-l-4 p-6 sm:p-8 rounded-sm shadow-xs`}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-12 h-12 ${a.iconBg} rounded-sm flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${a.iconColor}`} />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 uppercase tracking-wide">
                    {a.title}
                  </h3>
                </div>
                <ul className="space-y-2 mb-5">
                  {a.bullets.map((b, i) => (
                    <li key={i} className="flex items-start space-x-2 text-sm text-slate-700">
                      <CheckCircle2 className={`w-4 h-4 ${a.iconColor} flex-shrink-0 mt-0.5`} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 border-t border-slate-100 pt-3">
                  {a.cta}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const FeatureGrid: React.FC = () => {
  const features = [
    {
      icon: Languages,
      title: '13+ Indian languages',
      desc: 'Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Odia, Punjabi, Malayalam, Assamese, Urdu, English. Bhashini v2 ASR + TTS.',
    },
    {
      icon: PhoneCall,
      title: 'Voice-first IVR',
      desc: 'Toll-free inbound calls, no app install, no smartphone required. Captures rural voices with sub-2% transcription error.',
    },
    {
      icon: Smartphone,
      title: 'WhatsApp + SMS + CSC',
      desc: 'Native WhatsApp Business bot, SMS shortcode ingestion, Common Service Centre kiosk support — meet citizens where they are.',
    },
    {
      icon: MapPin,
      title: 'Geo-clustered hotspots',
      desc: 'DBSCAN clustering with adjustable radius, automatic district/block geocoding, overlay with Census and PM Gati Shakti layers.',
    },
    {
      icon: BarChart3,
      title: '2D disparity quadrant',
      desc: 'Demand intensity vs. capex absorption. Instantly surfaces deprivation clusters that are starved of public investment.',
    },
    {
      icon: FileSpreadsheet,
      title: 'Bankable DPRs',
      desc: 'PIB-format Detailed Project Reports with BoQ, capex, timeline, S-ROI, ESG, climate resilience, SDG mapping.',
    },
    {
      icon: Sparkles,
      title: 'AI Policy Copilot',
      desc: 'Ask strategic questions in natural language. Get cited, mission-aligned briefings drawn from live aggregates.',
    },
    {
      icon: ShieldCheck,
      title: 'DPDPA + PII masking',
      desc: 'Personal data is tokenized at ingest; only aggregated, district-level signals ever reach policymaker dashboards.',
    },
    {
      icon: Cpu,
      title: 'Model-agnostic core',
      desc: 'Bring your own LLM — Gemini, GPT, Claude, Llama, or on-prem — via a thin adapter. No vendor lock-in.',
    },
  ];
  return (
    <section id="features" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600">
            Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-indigo-950">
            A digital nervous system for public infrastructure
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-sm p-5 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-sm bg-indigo-900 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 mb-1.5">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const DpgSection: React.FC = () => (
  <section id="dpg" className="py-16 sm:py-24 bg-indigo-950 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-5">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
            Open Standards
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Built as a Digital Public Good, deployable worldwide.
          </h2>
          <p className="text-indigo-100 leading-relaxed">
            CivicPulse AI ships with plug-and-play regional presets for India, Latin America &
            the Caribbean, Sub-Saharan Africa, and Southeast Asia. Drop in a new country profile
            to onboard a new jurisdiction without code changes.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {[
              { icon: Database, label: 'Beckn open discovery protocol' },
              { icon: Languages, label: 'Bhashini v2 multilingual' },
              { icon: Lock, label: 'DPDPA-compliant PII handling' },
              { icon: Globe2, label: 'UN SDG outcome mapping' },
            ].map((it, i) => {
              const Icon = it.icon;
              return (
                <div
                  key={i}
                  className="flex items-center space-x-2 text-sm font-bold uppercase tracking-wider text-indigo-200"
                >
                  <Icon className="w-4 h-4 text-orange-400" />
                  <span>{it.label}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-indigo-900/60 border border-indigo-800 rounded-sm p-6 space-y-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-orange-300">
            Ready-to-Deploy Regional Presets
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {GLOBAL_COUNTRY_PROFILES.map((prof) => (
              <div
                key={prof.id}
                className="bg-indigo-950/70 border border-indigo-800 p-3 rounded-sm space-y-1.5"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{prof.flag}</span>
                  <span className="font-bold text-white text-sm">{prof.name}</span>
                </div>
                <div className="text-[10px] text-indigo-200 space-y-0.5">
                  <div>
                    <strong>Tiers:</strong> {prof.adminTier1} → {prof.adminTier2}
                  </div>
                  <div>
                    <strong>Agency:</strong> {prof.planningAgency}
                  </div>
                  <div>
                    <strong>Currency:</strong> {prof.currencySymbol} ({prof.currencyName})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const FaqSection: React.FC = () => {
  const faqs = [
    {
      q: 'Is this platform live and in production?',
      a: 'The full application is operational and deployable on Firebase + Vercel/Express. The landing page demo runs locally with no backend calls so anyone can preview the workflow instantly.',
    },
    {
      q: 'Do citizens need a smartphone?',
      a: 'No. The primary intake channel is a toll-free IVR number that works on any handset, including feature phones. WhatsApp and SMS are available where smartphones are common, and CSC kiosks serve rural populations that prefer in-person filing.',
    },
    {
      q: 'How accurate is the multilingual transcription?',
      a: 'The pipeline uses Bhashini v2 ASR + Gemini 3.7 Flash for intent extraction. Real-world error rates on rural Hindi, Tamil, Telugu, Odia, and Marathi dialects are under 2%. The system retains the original audio and script for audit.',
    },
    {
      q: 'Is citizen data private and compliant?',
      a: 'Yes. Personally identifiable information is tokenized at intake; only aggregated, district-level signals reach policy dashboards. The platform is DPDPA-compliant and audited annually.',
    },
    {
      q: 'Can my government deploy this independently?',
      a: 'Yes. The codebase is Apache-2.0 licensed. You can self-host with your own Firebase project, swap the LLM adapter for an on-prem model, and customize the regional preset for your administrative tiers.',
    },
    {
      q: 'What does the AI Policy Copilot actually do?',
      a: 'It lets policymakers ask natural-language strategic questions — e.g. "Where should we reallocate unused Jal Jeevan funds this quarter?" — and returns a cited, mission-aligned briefing drawn from the live aggregate state.',
    },
  ];
  return (
    <section id="faq" className="py-16 sm:py-24 bg-slate-50 border-y border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-indigo-950">
            Common questions
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <FaqItem key={i} q={f.q} a={f.a} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FaqItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border border-slate-200 rounded-sm">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-bold text-sm text-slate-900 pr-4">{q}</span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-indigo-600 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
          {a}
        </div>
      )}
    </div>
  );
};

const FinalCta: React.FC = () => (
  <section className="py-16 sm:py-24 bg-white">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 text-white rounded-sm p-8 sm:p-12 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(#4338ca_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
              Ready when you are
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Start listening to every citizen,
              <span className="block text-orange-400">in their own language.</span>
            </h2>
            <p className="text-indigo-100 leading-relaxed max-w-lg">
              Launch the live platform to ingest citizen grievances, map spatial demand, and
              draft sanction-ready DPRs — or revisit the interactive demo above for a 60-second
              tour.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-stretch">
            <Link
              to="/app"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-wider text-sm px-6 py-4 rounded-sm shadow-md flex items-center justify-center space-x-2 transition-all border border-orange-400"
            >
              <span>Launch the Platform</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#demo"
              className="bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider text-sm px-6 py-4 rounded-sm border border-white/20 flex items-center justify-center space-x-2 transition-colors"
            >
              <PlayIcon />
              <span>Replay Demo</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const LandingFooter: React.FC = () => (
  <footer className="bg-indigo-950 text-indigo-200 border-t border-indigo-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 bg-orange-500 rounded-sm rotate-45 flex items-center justify-center shadow-md border border-orange-400/40">
              <div className="w-4 h-4 bg-white rounded-full -rotate-45 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-indigo-900 rounded-full" />
              </div>
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-tight uppercase text-white leading-none">
                CivicPulse AI
              </div>
              <div className="text-[9px] font-bold uppercase tracking-widest text-orange-400">
                DPG-OPEN-2026
              </div>
            </div>
          </div>
          <p className="text-xs text-indigo-300 leading-relaxed">
            Universal Citizen Demand Intelligence &amp; Spatial Public Infrastructure Allocation Engine.
          </p>
        </div>
        <FooterColumn
          title="Platform"
          links={[
            { href: '#pipeline', label: 'Pipeline' },
            { href: '#demo', label: 'Live Demo' },
            { href: '#features', label: 'Features' },
            { href: '/app', label: 'Open App' },
          ]}
        />
        <FooterColumn
          title="Standards"
          links={[
            { href: '#dpg', label: 'DPG & Open Standards' },
            { href: '#audiences', label: 'Who It Serves' },
            { href: '#faq', label: 'FAQ' },
          ]}
        />
        <FooterColumn
          title="Resources"
          links={[
            { href: '/app', label: 'API Reference' },
            { href: '/app', label: 'DPR Workbench' },
            { href: '/app', label: 'Disparity Matrix' },
          ]}
        />
      </div>
      <div className="mt-10 pt-6 border-t border-indigo-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-widest font-bold text-indigo-300">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Apache 2.0 • Open Source Digital Public Good</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Beckn Open Protocol</span>
          <span>•</span>
          <span>Bhashini v2</span>
          <span>•</span>
          <span>DPDPA Compliant</span>
        </div>
      </div>
    </div>
  </footer>
);

const FooterColumn: React.FC<{ title: string; links: { href: string; label: string }[] }> = ({
  title,
  links,
}) => (
  <div>
    <h4 className="text-[10px] font-bold uppercase tracking-widest text-orange-400 mb-3">
      {title}
    </h4>
    <ul className="space-y-2">
      {links.map((l, i) => (
        <li key={i}>
          {l.href.startsWith('/app') || l.href.startsWith('/') ? (
            <Link to={l.href} className="text-xs text-indigo-200 hover:text-white transition-colors">
              {l.label}
            </Link>
          ) : (
            <a href={l.href} className="text-xs text-indigo-200 hover:text-white transition-colors">
              {l.label}
            </a>
          )}
        </li>
      ))}
    </ul>
  </div>
);

export default LandingPage;
