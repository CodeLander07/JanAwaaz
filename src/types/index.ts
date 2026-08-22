export type ChannelType = 'voice_ivr' | 'whatsapp' | 'sandes_bot' | 'csc_portal' | 'sms' | 'gram_panchayat_kiosk';

export type SectorType =
  | 'Water & Sanitation'
  | 'Rural Roads & Bridges'
  | 'Primary Healthcare'
  | 'Rural Electrification & Solar'
  | 'Education & Anganwadi'
  | 'Irrigation & Flood Mitigation'
  | 'Digital & Telecom';

export interface LocationInfo {
  state: string;
  district: string;
  blockTehsil?: string;
  villagePanchayat?: string;
  lat: number;
  lng: number;
  isAspirationalDistrict?: boolean;
  isTribalDominant?: boolean;
}

export interface CitizenRequest {
  id: string;
  timestamp: string;
  channel: ChannelType;
  rawVernacularText: string;
  sourceLanguageCode: string;
  sourceLanguageName: string;
  translatedEnglish: string;
  sector: SectorType;
  subCategory: string;
  urgencyScore: number; // 1-100
  estimatedBeneficiaries: number;
  sentiment: 'Critical Distress' | 'Frustrated Concern' | 'Constructive Suggestion' | 'General Query';
  location: LocationInfo;
  problemEntities: string[];
  recommendedMission: string;
  citizenReplyNative: string;
  citizenReplyEnglish?: string;
  verificationStatus: 'AI Verified' | 'Field Officer Validated' | 'Aggregated into Hotspot' | 'Under Triaging';
  audioSimulated?: boolean;
}

export interface DistrictIndicator {
  state: string;
  district: string;
  isAspirational: boolean;
  isTribalDominant: boolean;
  population: number;
  ruralRatio: number; // 0-1
  povertyIndex: number; // 0-100
  jalJeevanCoveragePercent: number; // 0-100
  pmgsyRoadConnectivityPercent: number; // 0-100
  phcDeficitPer10k: number; // higher is worse
  powerSupplyHoursPerDay: number; // 0-24
  digitalBharatNetPercent: number; // 0-100
  approvedCapexCr: number; // In Crores
  utilizedCapexPercent: number;
  nitiDeltaRank: number; // 1 to 112
  lat: number;
  lng: number;
}

export interface HotspotCluster {
  id: string;
  title: string;
  state: string;
  district: string;
  blockTehsil: string;
  sector: SectorType;
  requestCount: number;
  aggregateUrgency: number; // 1-100
  infrastructureDeficitScore: number; // 1-100
  disparityGapIndex: number; // Combined weighted index 1-100
  affectedPopulation: number;
  primaryDeficit: string;
  topCitizenQuotes: {
    vernacular: string;
    english: string;
    lang: string;
  }[];
  recommendedMission: string;
  priorityRank: 'CRITICAL PRIORITY' | 'HIGH PRIORITY' | 'MEDIUM PRIORITY';
  lat: number;
  lng: number;
  hasDprGenerated?: boolean;
  dprId?: string;
}

export interface DetailedProjectReport {
  projectTitle: string;
  projectCode: string;
  implementingMinistry: string;
  nodalStateAgency: string;
  sector: SectorType;
  locationSummary: string;
  estimatedCapexCr: number;
  timelineMonths: number;
  executiveSummary: string;
  groundEvidence: string;
  technicalSolution: string;
  capexBreakdown: {
    component: string;
    costCr: number;
    description?: string;
  }[];
  timelinePhases: {
    phase: string;
    durationMonths: number;
    deliverables: string;
  }[];
  gatiShaktiSynergy: string;
  sdgGoals: string[];
  impactMetrics: {
    metric: string;
    baseline: string;
    target: string;
  }[];
  climateResilience: string;
  citizenBriefVernacular: string;
  citizenBriefEnglish: string;
  riskMitigation: {
    risk: string;
    mitigation: string;
  }[];
  recommendedActionForPolicymakers: string;
  status: 'Draft DPR' | 'Under NITI Appraisal' | 'Sanctioned & Fast-Tracked';
  sanctionDate?: string;
}

export interface GlobalLanguage {
  code: string;
  name: string;
  nativeName: string;
  script: string;
  greeting: string;
  bhashiniCode: string;
  flag?: string;
  sampleScenarios: {
    title: string;
    sector: SectorType;
    district: string;
    state: string;
    vernacularText: string;
    englishSummary: string;
  }[];
}

export type IndianLanguage = GlobalLanguage;

export type UserRole = 'official' | 'citizen';

export interface OfficialDetails {
  employeeId: string;
  designation: string;
  department: string;
  jurisdictionState: string;
  jurisdictionDistrict?: string;
  clearanceLevel: 'L1_FIELD_OFFICER' | 'L2_DISTRICT_MAGISTRATE' | 'L3_STATE_SECRETARY' | 'L4_CABINET_ADVISOR';
  canApproveDPR: boolean;
  canAllocateCapex: boolean;
  canPublishDPG: boolean;
  officialBadgeNumber: string;
}

export interface CitizenDetails {
  state: string;
  district: string;
  blockTehsil?: string;
  villagePanchayat?: string;
  preferredLanguage: string;
  verifiedCitizen: boolean;
  claimsSubmittedCount: number;
  upvotedHotspotIds: string[];
  endorsementKarma: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string;
  officialDetails?: OfficialDetails;
  citizenDetails?: CitizenDetails;
}

export interface CitizenClaimSubmission {
  id: string;
  userId: string;
  userName: string;
  userPhone?: string;
  createdAt: string;
  sector: SectorType;
  title: string;
  description: string;
  language: string;
  audioUrl?: string;
  location: {
    state: string;
    district: string;
    blockTehsil: string;
    village?: string;
    lat: number;
    lng: number;
  };
  urgencyLevel: 'Critical' | 'High' | 'Medium';
  status: 'SUBMITTED' | 'SPATIALLY_CLUSTERED' | 'APPRAISED' | 'DPR_FORMULATED' | 'BUDGET_ALLOCATED' | 'SANCTIONED';
  upvoteCount: number;
  upvotedByUsers?: string[];
  officialComments?: {
    officialName: string;
    officialDesignation: string;
    timestamp: string;
    comment: string;
    statusUpdate?: string;
  }[];
}

export interface DprAppraisalRecord {
  id: string;
  dprId: string;
  dprTitle: string;
  officialUid: string;
  officialName: string;
  designation: string;
  department: string;
  action: 'SANCTIONED' | 'AMENDED' | 'REJECTED' | 'BUDGET_ALLOCATED';
  allocatedAmountCr?: number;
  remarks: string;
  sanctionTimestamp: string;
  sanctionOrderNumber: string;
}

export interface GlobalCountryProfile {
  id: string;
  name: string;
  flag: string;
  currencySymbol: string;
  currencyName: string;
  adminTier1: string; // e.g. State, Province, Department, Region
  adminTier2: string; // e.g. District, County, Municipality, Shire
  adminTier3: string; // e.g. Block/Tehsil, Subdistrict, Ward
  planningAgency: string; // e.g. National Planning Commission, Ministry of Infrastructure
  defaultLanguages: string[];
}
