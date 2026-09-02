import { AdminAccount, AuthUser } from '../types';
import {
  getMasterAdminFromFirestore,
  registerMasterAdminFirestore,
  resetMasterAdminSlotFirestore
} from '../services/firestoreService';

const ADMIN_STORAGE_KEY = 'carepulse_master_admin';

/**
 * Hash password with SHA-256 for secure credential handling
 */
export async function hashAdminPassword(password: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + ':carepulse_salt_2026');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback deterministic hash
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = (hash << 5) - hash + password.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(64, '0');
}

export async function verifyAdminPassword(password: string, hash: string): Promise<boolean> {
  const calculated = await hashAdminPassword(password);
  return calculated === hash || password === hash;
}

export interface AdminCredentials {
  name: string;
  email: string;
  password: string;
  department: string;
  badgeNumber?: string;
}

// Local cache sync
export function getMasterAdminLocal(): AdminAccount | null {
  try {
    const saved = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to get master admin from local cache', e);
  }
  return null;
}

export async function fetchMasterAdmin(): Promise<AdminAccount | null> {
  const remote = await getMasterAdminFromFirestore();
  if (remote) {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(remote));
    return remote;
  }
  const local = getMasterAdminLocal();
  return local;
}

export async function isMasterAdminSlotAvailableAsync(): Promise<boolean> {
  const admin = await fetchMasterAdmin();
  return admin === null;
}

export function isMasterAdminSlotAvailable(): boolean {
  return getMasterAdminLocal() === null;
}

export async function registerMasterAdmin(
  data: AdminCredentials
): Promise<{ success: boolean; admin?: AdminAccount; error?: string }> {
  if (!data.name.trim() || !data.email.trim() || !data.password) {
    return {
      success: false,
      error: 'Please fill in all required administrator fields (Name, Email, Password).'
    };
  }

  // Attempt Firestore registration first
  const firestoreRes = await registerMasterAdminFirestore(data);
  if (firestoreRes.success && firestoreRes.admin) {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(firestoreRes.admin));
    return firestoreRes;
  }

  // If cloud rejected due to slot taken
  if (firestoreRes.error && firestoreRes.error.includes('already claimed')) {
    return firestoreRes;
  }

  // Local fallback
  const existing = getMasterAdminLocal();
  if (existing) {
    return {
      success: false,
      error: 'The single master administrator slot has already been claimed.'
    };
  }

  const fallbackAdmin: AdminAccount = {
    id: `admin-${Date.now()}`,
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    passwordHash: data.password,
    role: 'admin',
    department: data.department.trim() || 'Campus Safety & Health Administration',
    badgeNumber: data.badgeNumber?.trim() || `ADM-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: Date.now()
  };

  try {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(fallbackAdmin));
    return { success: true, admin: fallbackAdmin };
  } catch (e) {
    return { success: false, error: 'Could not write administrator account to storage.' };
  }
}

export async function authenticateAdmin(
  email: string,
  password: string
): Promise<{ success: boolean; admin?: AdminAccount; error?: string }> {
  let master = await fetchMasterAdmin();
  if (!master) {
    master = getMasterAdminLocal();
  }

  if (!master) {
    return {
      success: false,
      error: 'No master administrator account found. Please claim the single available admin slot to create your account.'
    };
  }

  if (
    master.email.toLowerCase() === email.trim().toLowerCase() &&
    master.passwordHash === password
  ) {
    return { success: true, admin: master };
  }

  return {
    success: false,
    error: 'Invalid administrator email or password. Please verify your credentials.'
  };
}

export function adminToAuthUser(admin: AdminAccount): AuthUser {
  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: 'admin',
    department: admin.department,
    dormLocation: `Safety HQ (Badge: ${admin.badgeNumber || 'ADM-01'})`,
    bloodGroup: 'A+',
    allergies: 'None recorded',
    medicalNotes: 'Certified Campus Safety Administrator & Triage Coordinator',
    primaryEmergencyContact: 'Campus Central Safety Dispatch',
    primaryEmergencyPhone: '(555) 019-9110'
  };
}

export async function resetMasterAdminSlot(): Promise<void> {
  localStorage.removeItem(ADMIN_STORAGE_KEY);
  await resetMasterAdminSlotFirestore();
}
