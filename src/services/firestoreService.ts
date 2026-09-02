import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  ClinicBooking,
  HazardReport,
  SOSDispatchRecord,
  CampusAdvisory,
  AdminAccount,
  UserProfile
} from '../types';
import { INITIAL_BOOKINGS } from '../data/bookingData';

// Firestore collection names
export const COLLECTIONS = {
  BOOKINGS: 'clinic_bookings',
  HAZARDS: 'hazard_reports',
  SOS: 'sos_dispatches',
  ADVISORIES: 'campus_advisories',
  ADMINS: 'admin_accounts',
  SYSTEM: 'system_config',
  PROFILES: 'user_profiles'
};

// ==========================================
// 1. CLINIC BOOKINGS REAL-TIME FIRESTORE
// ==========================================

export async function seedInitialBookingsIfEmpty(): Promise<void> {
  try {
    const colRef = collection(db, COLLECTIONS.BOOKINGS);
    const snap = await getDocs(colRef);
    if (snap.empty) {
      for (const b of INITIAL_BOOKINGS) {
        const docRef = doc(db, COLLECTIONS.BOOKINGS, b.id);
        await setDoc(docRef, {
          ...b,
          firestoreCreatedAt: serverTimestamp()
        });
      }
      console.log('Seeded initial bookings to Firestore database.');
    }
  } catch (err) {
    console.warn('Firestore seeding check fallback (using local cache):', err);
  }
}

export function subscribeToBookings(
  callback: (bookings: ClinicBooking[]) => void
): Unsubscribe {
  const colRef = collection(db, COLLECTIONS.BOOKINGS);
  const q = query(colRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        // If empty, return initial fallback
        callback(INITIAL_BOOKINGS);
        return;
      }
      const list: ClinicBooking[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          bookingNumber: data.bookingNumber || `BK-${docSnap.id}`,
          userName: data.userName || 'Anonymous Student',
          userEmail: data.userEmail || '',
          userPhone: data.userPhone || '',
          serviceType: data.serviceType || 'URGENT_TRIAGE',
          serviceTitle: data.serviceTitle || 'Clinic Appointment',
          preferredDate: data.preferredDate || '',
          preferredTime: data.preferredTime || '',
          location: data.location || 'Student Health Center',
          notes: data.notes || '',
          urgency: data.urgency || 'routine',
          status: data.status || 'PENDING',
          createdAt: data.createdAt || Date.now(),
          assignedStaff: data.assignedStaff || undefined,
          adminNotes: data.adminNotes || undefined
        });
      });
      callback(list);
    },
    (error) => {
      console.warn('Firestore bookings snapshot error, falling back:', error);
    }
  );
}

export async function createClinicBookingFirestore(
  booking: Omit<ClinicBooking, 'id' | 'createdAt' | 'status'> & { id?: string; status?: ClinicBooking['status'] }
): Promise<{ success: boolean; booking: ClinicBooking; error?: string }> {
  try {
    const id = booking.id || `bk-${Date.now()}`;
    const newBooking: ClinicBooking = {
      ...booking,
      id,
      status: booking.status || 'PENDING',
      createdAt: Date.now()
    };

    const docRef = doc(db, COLLECTIONS.BOOKINGS, id);
    await setDoc(docRef, {
      ...newBooking,
      firestoreTimestamp: serverTimestamp()
    });

    return { success: true, booking: newBooking };
  } catch (err: any) {
    console.error('Error creating booking in Firestore:', err);
    return { success: false, booking: booking as any, error: err?.message || 'Database write error' };
  }
}

export async function updateClinicBookingFirestore(
  bookingId: string,
  updates: Partial<ClinicBooking>
): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, COLLECTIONS.BOOKINGS, bookingId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Date.now()
    });
    return { success: true };
  } catch (err: any) {
    console.error('Error updating booking in Firestore:', err);
    return { success: false, error: err?.message };
  }
}

export async function deleteClinicBookingFirestore(bookingId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, COLLECTIONS.BOOKINGS, bookingId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (err: any) {
    console.error('Error deleting booking in Firestore:', err);
    return { success: false, error: err?.message };
  }
}

// ==========================================
// 2. MASTER ADMIN PERSISTENCE (SINGLE SLOT)
// ==========================================

export async function getMasterAdminFromFirestore(): Promise<AdminAccount | null> {
  try {
    const docRef = doc(db, COLLECTIONS.ADMINS, 'master_admin');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as AdminAccount;
    }
  } catch (err) {
    console.warn('Could not read master admin from Firestore:', err);
  }
  return null;
}

export async function registerMasterAdminFirestore(data: {
  name: string;
  email: string;
  password: string;
  department: string;
  badgeNumber?: string;
}): Promise<{ success: boolean; admin?: AdminAccount; error?: string }> {
  try {
    const docRef = doc(db, COLLECTIONS.ADMINS, 'master_admin');
    const existingSnap = await getDoc(docRef);

    if (existingSnap.exists()) {
      return {
        success: false,
        error: 'The single master administrator slot is already claimed in the cloud database. Only 1 administrator account is permitted.'
      };
    }

    const newAdmin: AdminAccount = {
      id: `admin-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      passwordHash: data.password,
      role: 'admin',
      department: data.department.trim() || 'Campus Safety & Health Administration',
      badgeNumber: data.badgeNumber?.trim() || `ADM-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: Date.now()
    };

    await setDoc(docRef, {
      ...newAdmin,
      firestoreCreatedAt: serverTimestamp()
    });

    return { success: true, admin: newAdmin };
  } catch (err: any) {
    console.error('Error registering master admin in Firestore:', err);
    return { success: false, error: err?.message || 'Database error' };
  }
}

export async function resetMasterAdminSlotFirestore(): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.ADMINS, 'master_admin');
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Error resetting master admin slot in Firestore:', err);
  }
}

// ==========================================
// 3. SOS DISPATCH RECORDS FIRESTORE
// ==========================================

export function subscribeToSosDispatches(
  callback: (records: SOSDispatchRecord[]) => void
): Unsubscribe {
  const colRef = collection(db, COLLECTIONS.SOS);
  const q = query(colRef, orderBy('timestamp', 'desc'), limit(50));

  return onSnapshot(
    q,
    (snapshot) => {
      const list: SOSDispatchRecord[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as SOSDispatchRecord);
      });
      callback(list);
    },
    (error) => {
      console.warn('Firestore SOS subscription error:', error);
    }
  );
}

export async function createSosDispatchFirestore(
  record: Omit<SOSDispatchRecord, 'id' | 'timestamp'>
): Promise<{ success: boolean; record: SOSDispatchRecord; error?: string }> {
  try {
    const id = `sos-${Date.now()}`;
    const newRecord: SOSDispatchRecord = {
      ...record,
      id,
      timestamp: Date.now()
    };

    const docRef = doc(db, COLLECTIONS.SOS, id);
    await setDoc(docRef, {
      ...newRecord,
      firestoreTimestamp: serverTimestamp()
    });

    return { success: true, record: newRecord };
  } catch (err: any) {
    console.error('Error logging SOS to Firestore:', err);
    return { success: false, record: record as any, error: err?.message };
  }
}

export async function updateSosDispatchFirestore(
  id: string,
  updates: Partial<SOSDispatchRecord>
): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, COLLECTIONS.SOS, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Date.now()
    });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

// ==========================================
// 4. HAZARD REPORTS FIRESTORE
// ==========================================

export function subscribeToHazardReports(
  callback: (reports: HazardReport[]) => void
): Unsubscribe {
  const colRef = collection(db, COLLECTIONS.HAZARDS);
  const q = query(colRef, orderBy('timestamp', 'desc'), limit(50));

  return onSnapshot(
    q,
    (snapshot) => {
      const list: HazardReport[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as HazardReport);
      });
      callback(list);
    },
    (error) => {
      console.warn('Firestore hazard reports error:', error);
    }
  );
}

export async function createHazardReportFirestore(
  reportData: Omit<HazardReport, 'id' | 'timestamp' | 'status'> & { id?: string; status?: HazardReport['status'] }
): Promise<{ success: boolean; report: HazardReport; error?: string }> {
  try {
    const id = reportData.id || `haz-${Date.now()}`;
    const newReport: HazardReport = {
      ...reportData,
      id,
      status: reportData.status || 'Report Received',
      timestamp: Date.now()
    };

    const docRef = doc(db, COLLECTIONS.HAZARDS, id);
    await setDoc(docRef, {
      ...newReport,
      firestoreTimestamp: serverTimestamp()
    });

    return { success: true, report: newReport };
  } catch (err: any) {
    console.error('Error writing hazard report to Firestore:', err);
    return { success: false, report: reportData as any, error: err?.message };
  }
}

export async function updateHazardReportFirestore(
  id: string,
  updates: Partial<HazardReport>
): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, COLLECTIONS.HAZARDS, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Date.now()
    });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

// ==========================================
// 5. CAMPUS ADVISORIES FIRESTORE
// ==========================================

export function subscribeToAdvisories(
  callback: (advisories: CampusAdvisory[]) => void
): Unsubscribe {
  const colRef = collection(db, COLLECTIONS.ADVISORIES);
  const q = query(colRef, orderBy('createdAt', 'desc'), limit(20));

  return onSnapshot(
    q,
    (snapshot) => {
      const list: CampusAdvisory[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as CampusAdvisory);
      });
      callback(list);
    },
    (error) => {
      console.warn('Firestore advisories subscription error:', error);
    }
  );
}

export async function saveAdvisoryFirestore(
  advisory: CampusAdvisory
): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, COLLECTIONS.ADVISORIES, advisory.id);
    await setDoc(docRef, {
      ...advisory,
      firestoreTimestamp: serverTimestamp()
    });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function deleteAdvisoryFirestore(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, COLLECTIONS.ADVISORIES, id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}
