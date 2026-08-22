import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut as fbSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth, saveUserProfile, getUserProfile } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';

export type DemoPresetType =
  | 'official_collector'
  | 'official_ministry'
  | 'citizen_leader'
  | 'citizen_resident';

interface AuthContextType {
  currentUser: UserProfile | null;
  firebaseUser: User | null;
  isLoading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, profile: Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  quickDemoLogin: (preset: DemoPresetType) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfileState: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo profile presets with realistic governance credentials
export const DEMO_PRESETS: Record<DemoPresetType, Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'> & { email: string; label: string; desc: string }> = {
  official_collector: {
    email: 'collector.mahoba@nic.in',
    displayName: 'Dr. Rajesh Sharma, IAS',
    role: 'official',
    phone: '+91 94150 88201',
    label: 'District Magistrate & Collector',
    desc: 'Mahoba District Administration (UP) • Level-2 Clearance',
    officialDetails: {
      employeeId: 'IAS-UP-2012-089',
      designation: 'District Magistrate & Chairman (DDMA)',
      department: 'District Planning & Revenue Administration',
      jurisdictionState: 'Uttar Pradesh',
      jurisdictionDistrict: 'Mahoba',
      clearanceLevel: 'L2_DISTRICT_MAGISTRATE',
      canApproveDPR: true,
      canAllocateCapex: true,
      canPublishDPG: true,
      officialBadgeNumber: 'DM-MHB-7721',
    },
  },
  official_ministry: {
    email: 'advisor.infra@gov.in',
    displayName: 'Ananya Deshmukh',
    role: 'official',
    phone: '+91 98110 44321',
    label: 'National Infrastructure Advisor',
    desc: 'NITI Aayog Infrastructure & Capex Allocation Vertical',
    officialDetails: {
      employeeId: 'NITI-ADV-2018-044',
      designation: 'Joint Secretary & Strategic Infrastructure Advisor',
      department: 'NITI Aayog Infrastructure Vertical & PM Gati Shakti Nodal Cell',
      jurisdictionState: 'All States (National)',
      jurisdictionDistrict: 'All Districts',
      clearanceLevel: 'L4_CABINET_ADVISOR',
      canApproveDPR: true,
      canAllocateCapex: true,
      canPublishDPG: true,
      officialBadgeNumber: 'CAB-NITI-0994',
    },
  },
  citizen_leader: {
    email: 'sarpanch.kabra@panchayat.in',
    displayName: 'Savitri Devi',
    role: 'citizen',
    phone: '+91 87654 32109',
    label: 'Panchayat Citizen Leader',
    desc: 'Gram Panchayat Kabra, Mahoba • Verified Citizen Voice',
    citizenDetails: {
      state: 'Uttar Pradesh',
      district: 'Mahoba',
      blockTehsil: 'Kabrai',
      villagePanchayat: 'Kabra',
      preferredLanguage: 'hi',
      verifiedCitizen: true,
      claimsSubmittedCount: 4,
      upvotedHotspotIds: ['hs-1', 'hs-2'],
      endorsementKarma: 340,
    },
  },
  citizen_resident: {
    email: 'ramesh.farmer@bharat.in',
    displayName: 'Rameshwar Kumar',
    role: 'citizen',
    phone: '+91 76543 21098',
    label: 'Grassroots Citizen & Farmer',
    desc: 'Bastar Tribal Belt, Chhattisgarh • Community Voice',
    citizenDetails: {
      state: 'Chhattisgarh',
      district: 'Bastar',
      blockTehsil: 'Tokapal',
      villagePanchayat: 'Dharampura',
      preferredLanguage: 'hi',
      verifiedCitizen: true,
      claimsSubmittedCount: 2,
      upvotedHotspotIds: ['hs-2', 'hs-5'],
      endorsementKarma: 120,
    },
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    // Initial load from localStorage for immediate responsiveness
    const saved = localStorage.getItem('civicpulse_active_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default to the District Magistrate demo preset so user immediately experiences rich governance features!
    const defaultPreset = DEMO_PRESETS.official_collector;
    const defaultProfile: UserProfile = {
      ...defaultPreset,
      uid: 'demo-official-collector-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return defaultProfile;
  });

  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        // Try fetching profile from Firestore
        const profile = await getUserProfile(fbUser.uid);
        if (profile) {
          setCurrentUser(profile);
          localStorage.setItem('civicpulse_active_user', JSON.stringify(profile));
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const profile = await getUserProfile(cred.user.uid);
      if (profile) {
        setCurrentUser(profile);
        localStorage.setItem('civicpulse_active_user', JSON.stringify(profile));
      }
    } catch (err: any) {
      console.warn('Firebase email login error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithEmail = async (
    email: string,
    pass: string,
    profileData: Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>
  ) => {
    setIsLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const newProfile: UserProfile = {
        ...profileData,
        uid: cred.user.uid,
        email: cred.user.email || email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await saveUserProfile(newProfile);
      setCurrentUser(newProfile);
      localStorage.setItem('civicpulse_active_user', JSON.stringify(newProfile));
    } catch (err: any) {
      console.warn('Firebase signup error:', err);
      // If Firebase Auth fails (e.g., in offline or mock test mode), create local profile
      const localProfile: UserProfile = {
        ...profileData,
        uid: `local-${Date.now()}`,
        email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCurrentUser(localProfile);
      localStorage.setItem('civicpulse_active_user', JSON.stringify(localProfile));
    } finally {
      setIsLoading(false);
    }
  };

  const quickDemoLogin = async (presetKey: DemoPresetType) => {
    setIsLoading(true);
    const preset = DEMO_PRESETS[presetKey];
    const demoProfile: UserProfile = {
      ...preset,
      uid: `demo-${presetKey}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      // Also try anonymous signin in Firebase if possible
      const anonCred = await signInAnonymously(auth);
      demoProfile.uid = anonCred.user.uid;
      await saveUserProfile(demoProfile);
    } catch (e) {
      console.info('Anonymous signin fallback to local profile:', e);
    }

    setCurrentUser(demoProfile);
    localStorage.setItem('civicpulse_active_user', JSON.stringify(demoProfile));
    setIsLoading(false);
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.info('Signout:', e);
    }
    setCurrentUser(null);
    localStorage.removeItem('civicpulse_active_user');
    setIsLoading(false);
  };

  const updateUserProfileState = async (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    setCurrentUser(updated);
    localStorage.setItem('civicpulse_active_user', JSON.stringify(updated));
    await saveUserProfile(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        firebaseUser,
        isLoading,
        signInWithEmail,
        signUpWithEmail,
        quickDemoLogin,
        signOut,
        updateUserProfileState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
