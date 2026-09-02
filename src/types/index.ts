export type AppScreen =
  | 'home'
  | 'chat'
  | 'library'
  | 'scanner'
  | 'contacts'
  | 'bookings'
  | 'profile'
  | 'admin';

export type UserRole = 'student' | 'staff' | 'admin' | 'guest';

export interface ClinicBooking {
  id: string;
  bookingNumber: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  serviceType: 'URGENT_TRIAGE' | 'FIRST_AID_CERT' | 'HEALTH_CHECKUP' | 'VACCINATION' | 'EQUIPMENT_RESERVE';
  serviceTitle: string;
  preferredDate: string;
  preferredTime: string;
  location: string;
  notes?: string;
  urgency: 'routine' | 'urgent' | 'emergency';
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: number;
  assignedStaff?: string;
  adminNotes?: string;
}

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: 'admin';
  badgeNumber?: string;
  department: string;
  createdAt: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  studentId?: string;
  department?: string;
  dormLocation?: string;
  bloodGroup?: string;
  allergies?: string;
  medicalNotes?: string;
  primaryEmergencyContact?: string;
  primaryEmergencyPhone?: string;
}

export interface CampusAdvisory {
  id: string;
  title: string;
  message: string;
  level: 'info' | 'warning' | 'danger';
  active: boolean;
  createdAt: number;
  location?: string;
}

export interface SOSDispatchRecord {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  location: string;
  timestamp: number;
  status: 'PENDING' | 'DISPATCHED' | 'ON_SCENE' | 'RESOLVED';
  bloodGroup?: string;
  allergies?: string;
  medicalNotes?: string;
  assignedResponder?: string;
  notes?: string;
}

export type LanguageCode =
  | 'en'
  | 'hi'
  | 'bn'
  | 'ta'
  | 'te'
  | 'mr'
  | 'gu'
  | 'kn'
  | 'ml';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
}

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface StructuredAIResponse {
  situationTitle: string;
  category: 'medical' | 'hazard' | 'safety';
  severity: 'low' | 'moderate' | 'high' | 'critical';
  summary?: string;
  immediateSteps: string[];
  thingsToAvoid: string[];
  warningSigns: string[];
  whenToSeekHelp: string;
  disclaimer: string;
  source?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text?: string;
  imageUrl?: string;
  audioUrl?: string;
  timestamp: Date;
  structuredResponse?: StructuredAIResponse;
  isLoading?: boolean;
}

export type FirstAidCategory =
  | 'wounds'
  | 'burns'
  | 'bleeding'
  | 'injuries'
  | 'heat_cold'
  | 'fainting'
  | 'breathing'
  | 'other';

export interface FirstAidGuide {
  id: string;
  category: FirstAidCategory;
  categoryLabel: string;
  categoryIcon: string;
  title: string;
  quickSummary: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  whatToDoSteps: string[];
  thingsToAvoid: string[];
  warningSigns: string[];
  recommendedTimerSeconds?: number;
  timerLabel?: string;
  whenToCallHelp: string;
  translations?: Record<LanguageCode, {
    title: string;
    quickSummary: string;
    whatToDoSteps: string[];
    warningSigns: string[];
    whenToCallHelp: string;
  }>;
}

export interface HazardReport {
  id: string;
  hazardType: 'Electrical' | 'Fire' | 'Slippery Floor' | 'Structural' | 'Chemical' | 'Other';
  location: string;
  description: string;
  imageUrl?: string | null;
  status: 'Report Received' | 'Investigating' | 'Maintenance Dispatched' | 'Resolved';
  timestamp: number;
  reportedBy: string;
  riskLevel: RiskLevel;
}

export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  availableHours: string;
  type: 'emergency' | 'security' | 'medical' | 'trusted';
  isCustom?: boolean;
  isDefault?: boolean;
  avatarIcon?: string;
}

export interface AccessibilitySettings {
  textSize: 'normal' | 'large' | 'xlarge';
  contrast: 'normal' | 'high';
  theme?: 'light' | 'dark' | 'system';
  voiceAssistance: boolean;
  reducedMotion?: boolean;
  selectedLanguage: LanguageCode;
}

export interface UserProfile {
  name: string;
  studentId: string;
  dormLocation: string;
  bloodGroup: string;
  allergies: string;
  medicalNotes: string;
  primaryEmergencyContact: string;
  primaryEmergencyPhone: string;
}
