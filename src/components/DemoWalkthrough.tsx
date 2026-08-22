import React, { useEffect, useRef, useState } from 'react';
import {
  Mic,
  MapPin,
  BarChart3,
  FileSpreadsheet,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Volume2,
  Brain,
  Layers,
  ShieldCheck,
  TrendingUp,
  Loader2,
} from 'lucide-react';

/**
 * Interactive, fully self-contained product walkthrough. No backend calls.
 * Steps animate over time; users can play/pause, scrub manually, or restart.
 */

type ScenarioId = 'water' | 'health' | 'road' | 'power';

interface DemoStep {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string; // tailwind text-color class
  ringColor: string; // tailwind ring-color class
  render: (s: Scenario) => React.ReactNode;
}

interface Scenario {
  id: ScenarioId;
  title: string;
  language: string;
  languageFlag: string;
  dialect: string;
  citizen: string;
  channel: string;
  ivrText: string; // native-script text the "citizen" speaks
  translated: string; // AI English translation
  sector: string;
  subCategory: string;
  district: string;
  state: string;
  beneficiaries: number;
  urgency: number;
  sentiment: string;
  mission: string;
  capexCr: number;
  timelineMonths: number;
  sroi: string;
  impactMetric: { name: string; before: string; after: string }[];
}

const SCENARIOS: Record<ScenarioId, Scenario> = {
  water: {
    id: 'water',
    title: 'Mahoba — Arsenic in Drinking Water',
    language: 'Hindi',
    languageFlag: '🇮🇳',
    dialect: 'Bundelkhandi dialect',
    citizen: 'Smt. Kamla Devi, Gram Pradhan',
    channel: 'Toll-free IVR • Voice',
    ivrText:
      'हमारे गाँव में पीने का पानी पीला और बदबूदार है। बच्चों के पेट में दर्द रहता है। कुएँ में आर्सेनिक है।',
    translated:
      'The drinking water in our village is yellow and foul-smelling. Children have constant stomach pain. The wells contain arsenic contamination.',
    sector: 'Water & Sanitation',
    subCategory: 'Arsenic-contaminated groundwater',
    district: 'Mahoba',
    state: 'Uttar Pradesh',
    beneficiaries: 8400,
    urgency: 92,
    sentiment: 'Critical Distress',
    mission: 'Jal Jeevan Mission • Har Ghar Nal',
    capexCr: 142,
    timelineMonths: 18,
    sroi: '4.7×',
    impactMetric: [
      { name: 'Households with safe tap water', before: '12%', after: '100%' },
      { name: 'Waterborne morbidity (per 1k)', before: '38', after: '<5' },
      { name: 'Female school attendance', before: '64%', after: '91%' },
    ],
  },
  health: {
    id: 'health',
    title: 'Kalahandi — Absentee Medical Officer',
    language: 'Odia',
    languageFlag: '🇮🇳',
    dialect: 'Kalahandi tribal dialect',
    citizen: 'Sh. Bhagirathi Majhi, ASHA Worker',
    channel: 'WhatsApp bot • Voice note',
    ivrText:
      'ଆମ CHC ରେ ଡାକ୍ତର ଆସନ୍ତି ନାହିଁ। ଗର୍ଭବତୀ ମହିଳାଙ୍କ ପାଇଁ କେହି ନାହାନ୍ତି। ଔଷଧ ସବୁ ଶେଷ ।',
    translated:
      'No doctor attends our Community Health Centre. There is no one for pregnant women. Medicines are all finished.',
    sector: 'Primary Healthcare',
    subCategory: 'PHC doctor absenteeism & medicine stockout',
    district: 'Kalahandi',
    state: 'Odisha',
    beneficiaries: 142000,
    urgency: 96,
    sentiment: 'Critical Distress',
    mission: 'PM-ABHIM • Ayushman Bharat',
    capexCr: 88,
    timelineMonths: 9,
    sroi: '6.1×',
    impactMetric: [
      { name: 'Doctor attendance compliance', before: '38%', after: '95%' },
      { name: 'Maternal referral time', before: '4.2h', after: '<1h' },
      { name: 'Out-of-pocket health spend', before: '₹3,200', after: '₹420' },
    ],
  },
  road: {
    id: 'road',
    title: 'East Garo Hills — Monsoon Cutoff Village',
    language: 'English (Assamese-medium school)',
    languageFlag: '🇮🇳',
    dialect: 'Garo-medium student complaint',
    citizen: 'Master Salrang Sangma, Class 9 student',
    channel: 'CSC kiosk • SMS escalation',
    ivrText:
      'Sir, our village gets cut off every monsoon because the wooden culvert collapsed last June. School children cannot reach exam centres.',
    translated:
      'Our village is cut off every monsoon because the wooden culvert collapsed last June. School students cannot reach their exam centres.',
    sector: 'Rural Roads & Bridges',
    subCategory: 'Collapsed culvert / all-weather road deficit',
    district: 'East Garo Hills',
    state: 'Meghalaya',
    beneficiaries: 12500,
    urgency: 81,
    sentiment: 'Frustrated Concern',
    mission: 'PMGSY Phase IV',
    capexCr: 36,
    timelineMonths: 12,
    sroi: '3.4×',
    impactMetric: [
      { name: 'Monsoon-isolated days per year', before: '92', after: '0' },
      { name: 'School attendance in monsoon', before: '41%', after: '88%' },
      { name: 'Travel time to block HQ', before: '3.5h', after: '40min' },
    ],
  },
  power: {
    id: 'power',
    title: 'Barmer — Transformer Burnt for 11 Days',
    language: 'Rajasthani',
    languageFlag: '🇮🇳',
    dialect: 'Marwari dialect',
    citizen: 'Sh. Ghewar Ram Patel, Farmer',
    channel: 'Toll-free IVR • Voice',
    ivrText:
      'साढ़े ग्यारह दिन से ट्रांसफार्मर जल गयो है। खेत की सिंचाई नहीं हो पावे रही। बिजली विभाग कोई सुनै नहीं है।',
    translated:
      'The transformer has been burnt for eleven days. We cannot irrigate our farms. The electricity department does not listen to us.',
    sector: 'Rural Electrification & Solar',
    subCategory: 'Burnt distribution transformer',
    district: 'Barmer',
    state: 'Rajasthan',
    beneficiaries: 3200,
    urgency: 88,
    sentiment: 'Critical Distress',
    mission: 'PM Surya Ghar • Revamped Distribution Sector Scheme',
    capexCr: 24,
    timelineMonths: 4,
    sroi: '2.9×',
    impactMetric: [
      { name: 'Hours of supply per day', before: '4.5h', after: '22h' },
      { name: 'Mean transformer repair time', before: '11 days', after: '<36h' },
      { name: 'Agri-pump uptime in Rabi season', before: '38%', after: '94%' },
    ],
  },
};

const STEPS: DemoStep[] = [
  {
    id: 'voice',
    label: 'Citizen Voice Ingested',
    icon: Mic,
    accent: 'text-orange-500',
    ringColor: 'ring-orange-500',
    render: (s) => (
      <div className="space-y-3">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-slate-500">
          <span className="flex items-center space-x-1.5">
            <Volume2 className="w-3 h-3 text-orange-500" />
            <span>Channel • {s.channel}</span>
          </span>
          <span className="text-emerald-600">▸ Live</span>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-sm p-3 space-y-2">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            Citizen • {s.citizen} • {s.dialect}
          </div>
          <div className="text-base font-semibold text-slate-900 leading-snug">{s.ivrText}</div>
        </div>
        <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          <Mic className="w-3 h-3 text-orange-500" />
          <span>Speech-to-Intent pipeline detected language</span>
        </div>
        <div className="bg-indigo-50 border border-indigo-200 rounded-sm px-3 py-2 text-xs text-indigo-900 font-semibold">
          {s.languageFlag} {s.language} detected — Bhashini v2 ASR model
        </div>
      </div>
    ),
  },
  {
    id: 'classify',
    label: 'AI Classification',
    icon: Brain,
    accent: 'text-indigo-600',
    ringColor: 'ring-indigo-600',
    render: (s) => (
      <div className="space-y-3">
        <div className="bg-indigo-950 text-white rounded-sm p-3 font-mono text-[11px] leading-relaxed">
          <div className="text-orange-300 mb-1">// Gemini 3.7 Flash — structured extract</div>
          <div>{`{`}</div>
          <div className="pl-3">{`"sector": "${s.sector}",`}</div>
          <div className="pl-3">{`"subCategory": "${s.subCategory}",`}</div>
          <div className="pl-3">{`"urgency": ${s.urgency},`}</div>
          <div className="pl-3">{`"beneficiaries": ${s.beneficiaries.toLocaleString()},`}</div>
          <div className="pl-3">{`"sentiment": "${s.sentiment}",`}</div>
          <div className="pl-3">{`"mission": "${s.mission}"`}</div>
          <div>{`}`}</div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="border border-rose-200 bg-rose-50 p-2 rounded-sm">
            <div className="text-[9px] font-bold text-rose-700 uppercase tracking-widest">Urgency</div>
            <div className="text-lg font-mono font-bold text-rose-700">{s.urgency}/100</div>
          </div>
          <div className="border border-indigo-200 bg-indigo-50 p-2 rounded-sm">
            <div className="text-[9px] font-bold text-indigo-700 uppercase tracking-widest">Beneficiaries</div>
            <div className="text-lg font-mono font-bold text-indigo-700">
              {(s.beneficiaries / 1000).toFixed(s.beneficiaries >= 1000 ? 0 : 1)}k
            </div>
          </div>
          <div className="border border-emerald-200 bg-emerald-50 p-2 rounded-sm">
            <div className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest">Sentiment</div>
            <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider pt-1">
              {s.sentiment}
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'map',
    label: 'Spatial Hotspot Cluster',
    icon: MapPin,
    accent: 'text-purple-600',
    ringColor: 'ring-purple-600',
    render: (s) => <MockMap scenario={s} />,
  },
  {
    id: 'matrix',
    label: 'Disparity Matrix Trigger',
    icon: BarChart3,
    accent: 'text-amber-600',
    ringColor: 'ring-amber-600',
    render: (s) => <MockMatrix scenario={s} />,
  },
  {
    id: 'dpr',
    label: 'Bankable DPR Synthesized',
    icon: FileSpreadsheet,
    accent: 'text-emerald-600',
    ringColor: 'ring-emerald-600',
    render: (s) => (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest font-bold text-emerald-700">
              Project Code • DPG-{s.district.slice(0, 3).toUpperCase()}-2026
            </div>
            <div className="text-sm font-bold text-slate-900 leading-tight">
              {s.title}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
              Capex
            </div>
            <div className="text-lg font-mono font-bold text-emerald-700">
              ₹{s.capexCr} Cr
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-50 border border-slate-200 rounded-sm p-2">
            <div className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">
              Timeline
            </div>
            <div className="font-bold text-slate-900">{s.timelineMonths} months</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-sm p-2">
            <div className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">
              S-ROI
            </div>
            <div className="font-bold text-slate-900">{s.sroi}</div>
          </div>
        </div>
        <div className="border-t border-slate-200 pt-2 space-y-1.5">
          <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
            Impact Metrics
          </div>
          {s.impactMetric.map((m, i) => (
            <div
              key={i}
              className="flex items-center justify-between text-[11px] border-b border-slate-100 pb-1 last:border-0"
            >
              <span className="text-slate-700 font-medium">{m.name}</span>
              <span className="font-mono">
                <span className="text-slate-400">{m.before}</span>
                <ArrowRight className="w-3 h-3 inline mx-1 text-emerald-500" />
                <span className="font-bold text-emerald-700">{m.after}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

function MockMap({ scenario }: { scenario: Scenario }) {
  // Pure SVG mock — no real map library, no external assets.
  const hotspots = [
    { x: 30, y: 30, r: 18, intensity: 'high' as const },
    { x: 55, y: 45, r: 22, intensity: 'high' as const },
    { x: 75, y: 28, r: 12, intensity: 'med' as const },
    { x: 42, y: 70, r: 14, intensity: 'med' as const },
    { x: 18, y: 60, r: 8, intensity: 'low' as const },
    { x: 80, y: 75, r: 6, intensity: 'low' as const },
  ];
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-slate-500">
        <span>{scenario.district}, {scenario.state}</span>
        <span className="text-purple-600">Density-based cluster</span>
      </div>
      <div className="relative bg-gradient-to-br from-indigo-50 to-slate-100 border border-slate-200 rounded-sm aspect-[16/9] overflow-hidden">
        {/* graticule */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 60" preserveAspectRatio="none">
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`v-${i}`} x1={i * 10} y1="0" x2={i * 10} y2="60" stroke="#cbd5e1" strokeWidth="0.2" />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={i * 10} x2="100" y2={i * 10} stroke="#cbd5e1" strokeWidth="0.2" />
          ))}
          {hotspots.map((h, idx) => (
            <g key={idx}>
              <circle
                cx={h.x}
                cy={h.y}
                r={h.r * 1.6}
                fill="#f97316"
                opacity="0.18"
              />
              <circle cx={h.x} cy={h.y} r={h.r} fill="#f97316" opacity="0.45" />
              <circle cx={h.x} cy={h.y} r={h.r * 0.4} fill="#ea580c" />
            </g>
          ))}
          {/* highlighted cluster */}
          <circle cx={55} cy={45} r={26} fill="none" stroke="#7c3aed" strokeWidth="0.5" strokeDasharray="1,1" />
          <circle cx={55} cy={45} r={2.4} fill="#7c3aed" />
        </svg>
        <div className="absolute top-2 left-2 bg-white/90 border border-slate-200 rounded-sm px-2 py-1 text-[10px] font-bold text-purple-700 uppercase tracking-widest shadow-xs">
          🔥 Active cluster
        </div>
        <div className="absolute bottom-2 right-2 bg-white/90 border border-slate-200 rounded-sm px-2 py-1 text-[10px] font-mono text-slate-700 shadow-xs">
          {(scenario.beneficiaries / 1000).toFixed(0)}k beneficiaries
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1 text-[10px] text-center font-bold uppercase tracking-widest">
        <div className="bg-orange-100 text-orange-800 py-1 rounded-sm">High · {scenario.sector.split(' ')[0]}</div>
        <div className="bg-orange-50 text-orange-700 py-1 rounded-sm">Med · 2</div>
        <div className="bg-slate-100 text-slate-600 py-1 rounded-sm">Low · 2</div>
      </div>
    </div>
  );
}

function MockMatrix({ scenario }: { scenario: Scenario }) {
  const x = scenario.urgency; // demand 0-100
  const y = 100 - scenario.urgency * 0.7; // funding absorption inverse (higher = lower fund use = worse)
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-slate-500">
        <span>2D Disparity Quadrant</span>
        <span className="text-amber-600">Quadrant IV — critical</span>
      </div>
      <div className="relative bg-slate-50 border border-slate-200 rounded-sm aspect-[16/10] overflow-hidden">
        {/* axes */}
        <div className="absolute inset-y-0 left-1/2 w-px bg-slate-300" />
        <div className="absolute inset-x-0 top-1/2 h-px bg-slate-300" />
        {/* quadrant labels */}
        <div className="absolute top-1 left-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          Q-II
        </div>
        <div className="absolute top-1 right-1 text-[9px] font-bold text-rose-600 uppercase tracking-widest">
          Q-I — Critical
        </div>
        <div className="absolute bottom-1 left-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          Q-III
        </div>
        <div className="absolute bottom-1 right-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          Q-IV
        </div>
        {/* district dots (scatter) */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {[
            { x: 18, y: 70 },
            { x: 25, y: 55 },
            { x: 35, y: 40 },
            { x: 48, y: 35 },
            { x: 60, y: 30 },
            { x: 70, y: 60 },
            { x: 80, y: 25 },
            { x: 88, y: 45 },
            { x: 12, y: 40 },
          ].map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r="2" fill="#94a3b8" opacity="0.7" />
          ))}
          {/* highlighted point */}
          <circle cx={x} cy={y} r="10" fill="#f59e0b" opacity="0.25" />
          <circle cx={x} cy={y} r="3.5" fill="#d97706" />
        </svg>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-amber-300 rounded-sm px-2 py-1 text-[10px] font-bold text-amber-800 shadow-xs whitespace-nowrap">
          {scenario.district}
        </div>
      </div>
      <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest">
        <span>← Low Demand</span>
        <span>Citizen Demand →</span>
      </div>
    </div>
  );
}

const STEP_DURATION_MS = 4200;

export const DemoWalkthrough: React.FC = () => {
  const [scenarioId, setScenarioId] = useState<ScenarioId>('water');
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<number | null>(null);

  const scenario = SCENARIOS[scenarioId];

  // Auto-advance while playing
  useEffect(() => {
    if (!isPlaying) return;
    timerRef.current = window.setTimeout(() => {
      setStepIndex((i) => (i + 1) % STEPS.length);
    }, STEP_DURATION_MS);
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, stepIndex, scenarioId]);

  // Reset to step 0 when scenario changes
  useEffect(() => {
    setStepIndex(0);
  }, [scenarioId]);

  const currentStep = STEPS[stepIndex];
  const StepIcon = currentStep.icon;

  return (
    <div className="bg-slate-900 text-white rounded-sm border border-slate-800 shadow-2xl overflow-hidden">
      {/* Top toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-slate-800 bg-slate-950">
        <div className="flex items-center space-x-2 text-xs">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold uppercase tracking-widest text-emerald-400">
            Live Demo • No backend required
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying((p) => !p)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-widest flex items-center space-x-1.5 transition-colors"
            aria-label={isPlaying ? 'Pause demo' : 'Play demo'}
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
          <button
            onClick={() => {
              setStepIndex(0);
              setIsPlaying(true);
            }}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-widest flex items-center space-x-1.5 transition-colors"
            aria-label="Restart demo"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restart</span>
          </button>
        </div>
      </div>

      {/* Scenario picker */}
      <div className="flex flex-wrap gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 self-center mr-2">
          Try a scenario:
        </span>
        {(Object.keys(SCENARIOS) as ScenarioId[]).map((id) => {
          const active = id === scenarioId;
          return (
            <button
              key={id}
              onClick={() => setScenarioId(id)}
              className={`px-3 py-1.5 rounded-sm text-[11px] font-bold uppercase tracking-wider transition-all border ${
                active
                  ? 'bg-orange-500 border-orange-400 text-white shadow-md'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-500'
              }`}
            >
              {SCENARIOS[id].sector}
            </button>
          );
        })}
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
        {/* Left: narrative */}
        <div className="lg:col-span-2 p-6 border-r border-slate-800 space-y-5">
          <div className="space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-widest text-orange-400">
              How it works — 60 second tour
            </div>
            <h3 className="text-2xl font-extrabold leading-tight text-white">{scenario.title}</h3>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-800 px-2 py-1 rounded-sm text-slate-200">
                {scenario.languageFlag} {scenario.language}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-800 px-2 py-1 rounded-sm text-slate-200">
                {scenario.channel}
              </span>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
              Citizen's translated statement
            </div>
            <blockquote className="text-sm leading-relaxed text-slate-100 border-l-4 border-orange-500 pl-3 italic">
              "{scenario.translated}"
            </blockquote>
            <div className="text-[10px] text-slate-400 mt-2 font-medium">— {scenario.citizen}</div>
          </div>

          {/* Stepper */}
          <ol className="space-y-2 pt-2">
            {STEPS.map((step, idx) => {
              const isActive = idx === stepIndex;
              const isDone = idx < stepIndex;
              const Icon = step.icon;
              return (
                <li key={step.id}>
                  <button
                    onClick={() => {
                      setStepIndex(idx);
                      setIsPlaying(false);
                    }}
                    className={`w-full flex items-center space-x-3 text-left rounded-sm px-3 py-2 transition-all border ${
                      isActive
                        ? `bg-slate-800 border-slate-700 ring-1 ${step.ringColor}`
                        : isDone
                          ? 'bg-slate-900/40 border-slate-800/60 opacity-70 hover:opacity-100'
                          : 'bg-transparent border-transparent hover:bg-slate-800/40'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 ${
                        isActive
                          ? 'bg-orange-500 text-white'
                          : isDone
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-xs font-bold uppercase tracking-widest ${
                            isActive ? 'text-white' : 'text-slate-300'
                          }`}
                        >
                          Step {idx + 1} • {step.label}
                        </span>
                        {isActive && isPlaying && (
                          <Loader2 className="w-3 h-3 text-orange-400 animate-spin" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {idx === 0 && 'Multilingual IVR/SMS/kiosk capture, native-script preservation.'}
                        {idx === 1 && 'Gemini extracts sector, urgency, beneficiaries, sentiment.'}
                        {idx === 2 && 'DBSCAN clustering creates a geospatial hotspot node.'}
                        {idx === 3 && 'Cross-references unspent capex to surface a disparity blindspot.'}
                        {idx === 4 && 'Gemini drafts a bankable PIB-format DPR with BoQ + S-ROI.'}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="text-[10px] text-slate-400 leading-relaxed">
            The full app adds live Firebase persistence, role-based auth (citizen vs. official), and the
            AI Policy Copilot. See the platform at <span className="font-mono text-orange-300">/app</span>.
          </div>
        </div>

        {/* Right: live panel */}
        <div className="lg:col-span-3 p-6 bg-slate-950">
          <div className="bg-white text-slate-900 rounded-sm border border-slate-200 shadow-2xl overflow-hidden min-h-[420px] flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-7 h-7 rounded-sm flex items-center justify-center bg-slate-100 ${currentStep.accent}`}
                >
                  <StepIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                    Step {stepIndex + 1} of {STEPS.length}
                  </div>
                  <div className="text-xs font-bold text-slate-900">{currentStep.label}</div>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all ${
                      i === stepIndex ? 'w-6 bg-orange-500' : i < stepIndex ? 'w-3 bg-emerald-500' : 'w-2 bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Progress bar tied to auto-advance */}
            <div className="h-0.5 bg-slate-100">
              <div
                key={`${scenarioId}-${stepIndex}-${isPlaying ? 'p' : 's'}`}
                className={`h-full bg-orange-500 ${
                  isPlaying ? 'animate-[progressbar_4.2s_linear_forwards]' : 'w-0'
                }`}
                style={isPlaying ? undefined : { width: 0 }}
              />
            </div>

            <div className="p-5 flex-1">{currentStep.render(scenario)}</div>

            <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-[10px]">
              <div className="flex items-center space-x-2 text-slate-500 font-bold uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>PII masked • DPDPA-compliant</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-500 font-bold uppercase tracking-widest">
                <TrendingUp className="w-3 h-3 text-indigo-600" />
                <span>Mission-aligned: {scenario.mission}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inline animation keyframes (scoped to component) */}
      <style>{`
        @keyframes progressbar {
          from { width: 0% }
          to { width: 100% }
        }
      `}</style>
    </div>
  );
};

export default DemoWalkthrough;
