import { ClinicBooking } from '../types';

export const CAMPUS_CLINICS = [
  {
    id: 'clinic-shc',
    name: 'Student Health & Urgent Care Center',
    location: 'Campus North Quad, Building 4',
    hours: '24/7 Triage & 8:00 AM - 8:00 PM Clinic',
    phone: '(555) 019-4325',
    services: ['Urgent Triage', 'Wound Dressing', 'Physicals', 'Vaccinations']
  },
  {
    id: 'clinic-safety-hq',
    name: 'Public Safety Training Center',
    location: 'Campus West Gate, Station 1',
    hours: '8:00 AM - 6:00 PM Mon-Fri',
    phone: '(555) 019-9110',
    services: ['CPR Certification', 'AED Training', 'First Aid Workshops']
  },
  {
    id: 'clinic-sports',
    name: 'Athletics & Sports Medicine Clinic',
    location: 'Varsity Fieldhouse, Ground Floor',
    hours: '7:00 AM - 7:00 PM Mon-Sat',
    phone: '(555) 019-7700',
    services: ['Sports Physicals', 'Orthopedic Triage', 'Rehab Consultation']
  }
];

export const AVAILABLE_DOCTORS = [
  {
    id: 'doc-patel',
    name: 'Dr. H. Patel, MD',
    specialty: 'Emergency Medicine & Student Health',
    rating: 4.9,
    availability: 'Mon - Fri'
  },
  {
    id: 'doc-vance',
    name: 'Nurse Elena Vance, RN',
    specialty: 'Urgent Care & Triage Specialist',
    rating: 4.95,
    availability: 'Daily'
  },
  {
    id: 'doc-chen',
    name: 'Commander Marcus Chen',
    specialty: 'Campus Safety & CPR/AED Instructor',
    rating: 4.85,
    availability: 'Tue, Thu, Sat'
  }
];

export const SERVICE_TYPES = [
  {
    id: 'URGENT_TRIAGE',
    name: 'Urgent Triage & Minor Wound Evaluation',
    duration: '20 mins',
    category: 'Urgent Care'
  },
  {
    id: 'FIRST_AID_CERT',
    name: 'AHA Certified CPR & AED Practical Workshop',
    duration: '60 mins',
    category: 'Certification'
  },
  {
    id: 'HEALTH_CHECKUP',
    name: 'Athletics & General Health Physical Screening',
    duration: '30 mins',
    category: 'Routine Care'
  },
  {
    id: 'VACCINATION',
    name: 'Seasonal Flu & Tetanus Booster Immunization',
    duration: '15 mins',
    category: 'Immunization'
  }
];

export const TIME_SLOTS = [
  '09:00 AM',
  '10:00 AM',
  '11:30 AM',
  '01:15 PM',
  '02:00 PM',
  '03:15 PM',
  '04:30 PM'
];

export const INITIAL_BOOKINGS: ClinicBooking[] = [
  {
    id: 'bk-101',
    bookingNumber: 'BK-2026-8941',
    userName: 'Alex Rivera',
    userEmail: 'alex.rivera@campus.edu',
    userPhone: '(555) 019-2424',
    serviceType: 'URGENT_TRIAGE',
    serviceTitle: 'Urgent Triage & Minor Wound Dressing',
    preferredDate: '2026-09-02',
    preferredTime: '10:00 AM',
    location: 'Student Health Center - Triage Room 1',
    notes: 'Sustained minor burn from hot lab beaker. First aid applied; requesting wound evaluation.',
    urgency: 'urgent',
    status: 'CONFIRMED',
    createdAt: Date.now() - 1000 * 60 * 45,
    assignedStaff: 'Nurse Elena Vance, RN',
    adminNotes: 'Assigned fast-track slot. Dressing supplies prepped in Room 1.',
  },
  {
    id: 'bk-102',
    bookingNumber: 'BK-2026-8942',
    userName: 'Maya Patel',
    userEmail: 'm.patel@science.campus.edu',
    userPhone: '(555) 019-3382',
    serviceType: 'FIRST_AID_CERT',
    serviceTitle: 'AHA Certified CPR & AED Practical Workshop',
    preferredDate: '2026-09-04',
    preferredTime: '02:00 PM',
    location: 'Public Safety Training Center - Hall A',
    notes: 'Graduate Teaching Assistant requiring CPR/AED renewal for Chemistry Lab supervision.',
    urgency: 'routine',
    status: 'CONFIRMED',
    createdAt: Date.now() - 1000 * 60 * 180,
    assignedStaff: 'Commander Marcus Chen',
    adminNotes: 'Registered for Cohort B (Max 12 seats). Training mannequins allocated.',
  },
  {
    id: 'bk-103',
    bookingNumber: 'BK-2026-8943',
    userName: 'Jordan Lee',
    userEmail: 'jordan.lee@arts.campus.edu',
    userPhone: '(555) 019-7719',
    serviceType: 'HEALTH_CHECKUP',
    serviceTitle: 'Athletics & General Health Physical Screening',
    preferredDate: '2026-09-03',
    preferredTime: '11:30 AM',
    location: 'Student Health Center - Exam Suite 3',
    notes: 'Pre-season physical form checkup and baseline blood pressure evaluation for intramural soccer.',
    urgency: 'routine',
    status: 'PENDING',
    createdAt: Date.now() - 1000 * 60 * 30,
    assignedStaff: 'Dr. H. Patel, MD',
    adminNotes: 'Awaiting sports clearance medical history document.',
  },
  {
    id: 'bk-104',
    bookingNumber: 'BK-2026-8944',
    userName: 'Sophia Zhang',
    userEmail: 'sophia.z@eng.campus.edu',
    userPhone: '(555) 019-5561',
    serviceType: 'EQUIPMENT_RESERVE',
    serviceTitle: 'Field Trip First-Aid & Trauma Kit Checkout',
    preferredDate: '2026-09-05',
    preferredTime: '08:30 AM',
    location: 'Public Safety Operations Desk',
    notes: 'Field robotics competition off-campus (25 students attending). Need 2 comprehensive first-aid packs.',
    urgency: 'routine',
    status: 'CONFIRMED',
    createdAt: Date.now() - 1000 * 60 * 720,
    assignedStaff: 'Officer Davis (Unit 3)',
    adminNotes: 'Kits #04 and #07 inspected and tagged for checkout.',
  },
  {
    id: 'bk-105',
    bookingNumber: 'BK-2026-8945',
    userName: 'David Miller',
    userEmail: 'dmiller@residentlife.campus.edu',
    userPhone: '(555) 019-8902',
    serviceType: 'VACCINATION',
    serviceTitle: 'Seasonal Flu & Tetanus Booster Immunization',
    preferredDate: '2026-09-02',
    preferredTime: '03:15 PM',
    location: 'Student Health Center - Clinic Suite 102',
    notes: 'Resident Assistant requiring updated immunization record before freshman move-in.',
    urgency: 'routine',
    status: 'COMPLETED',
    createdAt: Date.now() - 1000 * 60 * 1440,
    assignedStaff: 'Nurse Elena Vance, RN',
    adminNotes: 'Vaccine batch #FL-882 administered. Student card updated.',
  },
  {
    id: 'bk-106',
    bookingNumber: 'BK-2026-8946',
    userName: 'Emma Watson',
    userEmail: 'e.watson@med.campus.edu',
    userPhone: '(555) 019-1122',
    serviceType: 'URGENT_TRIAGE',
    serviceTitle: 'Post-Fall Orthopedic & Concussion Assessment',
    preferredDate: '2026-09-01',
    preferredTime: '04:00 PM',
    location: 'Student Health Center - Emergency Bay 2',
    notes: 'Slipped on wet stairs outside library; reporting wrist swelling and mild dizziness.',
    urgency: 'emergency',
    status: 'COMPLETED',
    createdAt: Date.now() - 1000 * 60 * 300,
    assignedStaff: 'Dr. H. Patel, MD & Nurse Vance',
    adminNotes: 'Wrist splinted. Ice applied. No signs of concussion; follow up in 5 days.',
  },
];

const STORAGE_KEY = 'carepulse_clinic_bookings';

export function getStoredBookings(): ClinicBooking[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load bookings from storage', e);
  }
  // Store default initial bookings
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BOOKINGS));
  return INITIAL_BOOKINGS;
}

export function saveStoredBookings(bookings: ClinicBooking[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  } catch (e) {
    console.error('Failed to save bookings to storage', e);
  }
}
