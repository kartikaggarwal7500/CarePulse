import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Activity,
  CheckCircle2,
  Clock,
  PhoneCall,
  MapPin,
  User,
  Plus,
  Trash2,
  Download,
  Filter,
  Search,
  Megaphone,
  Stethoscope,
  RefreshCw,
  Eye,
  FileText,
  Building,
  Check,
  Zap,
  ArrowUpRight,
  LogOut,
  SlidersHorizontal,
  ChevronRight,
  Calendar,
  Lock,
  Mail,
  X,
  Package,
  GraduationCap,
  Sparkles,
  Edit3
} from 'lucide-react';
import {
  AuthUser,
  HazardReport,
  RiskLevel,
  CampusAdvisory,
  SOSDispatchRecord,
  ClinicBooking
} from '../types';
import { getStoredBookings, saveStoredBookings } from '../data/bookingData';
import { getMasterAdminLocal } from '../data/adminAuth';
import {
  subscribeToBookings,
  createClinicBookingFirestore,
  updateClinicBookingFirestore,
  deleteClinicBookingFirestore,
  subscribeToSosDispatches,
  updateSosDispatchFirestore,
  subscribeToHazardReports,
  updateHazardReportFirestore,
  subscribeToAdvisories,
  saveAdvisoryFirestore,
  deleteAdvisoryFirestore,
  seedInitialBookingsIfEmpty
} from '../services/firestoreService';

interface AdminPortalProps {
  currentUser: AuthUser;
  onNavigateHome: () => void;
  onSignOut: () => void;
}

const INITIAL_SOS_RECORDS: SOSDispatchRecord[] = [
  {
    id: 'sos-101',
    userId: 'user-student-1',
    userName: 'Alex Rivera',
    userRole: 'student',
    location: 'West Hall, STEM Room 304',
    timestamp: Date.now() - 1000 * 60 * 4,
    status: 'DISPATCHED',
    bloodGroup: 'O+',
    allergies: 'Mild Penicillin sensitivity, seasonal pollen',
    medicalNotes: 'Mild asthma inhaler for sports.',
    assignedResponder: 'Officer Davis (Unit 3)',
    notes: 'Unit en route with first aid kit and AED.',
  },
  {
    id: 'sos-102',
    userId: 'user-student-2',
    userName: 'Maya Patel',
    userRole: 'student',
    location: 'Science Complex, Chemistry Lab B',
    timestamp: Date.now() - 1000 * 60 * 18,
    status: 'ON_SCENE',
    bloodGroup: 'B+',
    allergies: 'Latex allergy',
    medicalNotes: 'Minor chemical splash to forearm, rinsed under eyewash station.',
    assignedResponder: 'Nurse Vance & Officer Miller',
    notes: 'Wound irrigated, vitals stable.',
  },
  {
    id: 'sos-103',
    userId: 'user-student-3',
    userName: 'Jordan Lee',
    userRole: 'student',
    location: 'Recreation Center, Basketball Court 2',
    timestamp: Date.now() - 1000 * 60 * 65,
    status: 'RESOLVED',
    bloodGroup: 'A-',
    allergies: 'None recorded',
    medicalNotes: 'Ankle sprain, cold pack and splint applied.',
    assignedResponder: 'Paramedic Hayes',
    notes: 'Transported to Student Health Center for X-ray.',
  },
];

const INITIAL_HAZARDS: HazardReport[] = [
  {
    id: 'HAZ-901',
    hazardType: 'Electrical',
    location: 'Engineering Lab 204',
    description: 'Exposed high-voltage conduit sparking near workbench 3',
    status: 'Maintenance Dispatched',
    timestamp: Date.now() - 1000 * 60 * 30,
    reportedBy: 'Alex Rivera',
    riskLevel: 'HIGH',
  },
  {
    id: 'HAZ-902',
    hazardType: 'Slippery Floor',
    location: 'Dining Commons Entrance West',
    description: 'Large puddle from leaking condenser unit, high foot-traffic slip risk',
    status: 'Investigating',
    timestamp: Date.now() - 1000 * 60 * 75,
    reportedBy: 'Staff Member J. Doe',
    riskLevel: 'MODERATE',
  },
  {
    id: 'HAZ-903',
    hazardType: 'Fire',
    location: 'Graduate Student Lounge B',
    description: 'Faulty microwave smoking outlet, room ventilated and breaker tripped',
    status: 'Resolved',
    timestamp: Date.now() - 1000 * 60 * 180,
    reportedBy: 'RA Sarah Jenkins',
    riskLevel: 'CRITICAL',
  },
  {
    id: 'HAZ-904',
    hazardType: 'Chemical',
    location: 'Life Sciences Bio Storage 1',
    description: 'Minor ethanol solvent container leak inside safety cabinet',
    status: 'Report Received',
    timestamp: Date.now() - 1000 * 60 * 12,
    reportedBy: 'Lab Tech K. Sharma',
    riskLevel: 'MODERATE',
  },
];

const INITIAL_ADVISORIES: CampusAdvisory[] = [
  {
    id: 'adv-1',
    title: 'Severe Thunderstorm & High Winds Watch',
    message: 'Campus Safety advises securing outdoor equipment and using covered skyways between 3:00 PM - 8:00 PM.',
    level: 'warning',
    active: true,
    createdAt: Date.now() - 1000 * 60 * 120,
    location: 'All Campus Sectors',
  },
  {
    id: 'adv-2',
    title: 'Chemistry Lab B Chemical Hygiene Maintenance',
    message: 'Eyewash stations and vent hoods undergoing scheduled maintenance. Exercise standard precautions.',
    level: 'info',
    active: true,
    createdAt: Date.now() - 1000 * 60 * 360,
    location: 'Science Complex',
  },
];

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentUser,
  onNavigateHome,
  onSignOut,
}) => {
  // Navigation Tabs: Default to 'bookings' as the primary focus
  const [activeTab, setActiveTab] = useState<'bookings' | 'dispatches' | 'hazards' | 'advisories' | 'analytics'>('bookings');
  
  // Bookings State
  const [bookings, setBookings] = useState<ClinicBooking[]>(() => getStoredBookings());
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('all');
  const [bookingFilterService, setBookingFilterService] = useState<string>('all');
  const [bookingSearch, setBookingSearch] = useState<string>('');
  const [selectedBookingForModal, setSelectedBookingForModal] = useState<ClinicBooking | null>(null);
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);

  // New Booking Desk Form
  const [newBkName, setNewBkName] = useState('');
  const [newBkEmail, setNewBkEmail] = useState('');
  const [newBkPhone, setNewBkPhone] = useState('(555) 019-2424');
  const [newBkService, setNewBkService] = useState<ClinicBooking['serviceType']>('URGENT_TRIAGE');
  const [newBkDate, setNewBkDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newBkTime, setNewBkTime] = useState('10:00 AM');
  const [newBkUrgency, setNewBkUrgency] = useState<ClinicBooking['urgency']>('urgent');
  const [newBkNotes, setNewBkNotes] = useState('');

  // SOS & Hazard & Advisory states
  const [sosRecords, setSosRecords] = useState<SOSDispatchRecord[]>(INITIAL_SOS_RECORDS);
  const [hazards, setHazards] = useState<HazardReport[]>(() => {
    const saved = localStorage.getItem('safeaid_hazards');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_HAZARDS;
  });
  const [advisories, setAdvisories] = useState<CampusAdvisory[]>(INITIAL_ADVISORIES);
  const [hazardFilter, setHazardFilter] = useState<string>('all');
  const [hazardSearch, setHazardSearch] = useState<string>('');

  // New Advisory State
  const [showNewAdvisoryModal, setShowNewAdvisoryModal] = useState(false);
  const [newAdvisoryTitle, setNewAdvisoryTitle] = useState('');
  const [newAdvisoryMessage, setNewAdvisoryMessage] = useState('');
  const [newAdvisoryLevel, setNewAdvisoryLevel] = useState<'info' | 'warning' | 'danger'>('warning');
  const [newAdvisoryLocation, setNewAdvisoryLocation] = useState('Campus Wide');

  // Real-time Firestore synchronizations for Bookings, Dispatches, Hazards, and Advisories
  useEffect(() => {
    seedInitialBookingsIfEmpty();
    const unsubBookings = subscribeToBookings((updatedList) => {
      setBookings(updatedList);
      saveStoredBookings(updatedList);
    });

    const unsubSos = subscribeToSosDispatches((updatedSos) => {
      if (updatedSos.length > 0) {
        setSosRecords(updatedSos);
      }
    });

    const unsubHazards = subscribeToHazardReports((updatedHaz) => {
      if (updatedHaz.length > 0) {
        setHazards(updatedHaz);
      }
    });

    const unsubAdvisories = subscribeToAdvisories((updatedAdv) => {
      if (updatedAdv.length > 0) {
        setAdvisories(updatedAdv);
      }
    });

    return () => {
      unsubBookings();
      unsubSos();
      unsubHazards();
      unsubAdvisories();
    };
  }, []);

  const masterAdmin = getMasterAdminLocal();

  // Metrics
  const totalBookingsCount = bookings.length;
  const pendingBookingsCount = bookings.filter((b) => b.status === 'PENDING').length;
  const confirmedBookingsCount = bookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS').length;
  const urgentBookingsCount = bookings.filter((b) => b.urgency === 'urgent' || b.urgency === 'emergency').length;
  const activeSosCount = sosRecords.filter((r) => r.status === 'PENDING' || r.status === 'DISPATCHED' || r.status === 'ON_SCENE').length;
  const openHazardsCount = hazards.filter((h) => h.status !== 'Resolved').length;

  // Filter Bookings
  const filteredBookings = bookings.filter((b) => {
    if (bookingFilterStatus !== 'all' && b.status !== bookingFilterStatus) return false;
    if (bookingFilterService !== 'all' && b.serviceType !== bookingFilterService) return false;
    if (bookingSearch.trim()) {
      const q = bookingSearch.toLowerCase();
      const matchName = b.userName.toLowerCase().includes(q);
      const matchNumber = b.bookingNumber.toLowerCase().includes(q);
      const matchEmail = b.userEmail.toLowerCase().includes(q);
      const matchLoc = b.location.toLowerCase().includes(q);
      if (!matchName && !matchNumber && !matchEmail && !matchLoc) return false;
    }
    return true;
  });

  // Filter Hazards
  const filteredHazards = hazards.filter((h) => {
    if (hazardFilter !== 'all' && h.status !== hazardFilter) return false;
    if (hazardSearch.trim()) {
      const q = hazardSearch.toLowerCase();
      const matchDesc = h.description.toLowerCase().includes(q);
      const matchLoc = h.location.toLowerCase().includes(q);
      const matchType = h.hazardType.toLowerCase().includes(q);
      if (!matchDesc && !matchLoc && !matchType) return false;
    }
    return true;
  });

  // Update Booking Status
  const handleUpdateBookingStatus = async (id: string, newStatus: ClinicBooking['status']) => {
    const updated = bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b));
    setBookings(updated);
    saveStoredBookings(updated);
    if (selectedBookingForModal && selectedBookingForModal.id === id) {
      setSelectedBookingForModal({ ...selectedBookingForModal, status: newStatus });
    }
    await updateClinicBookingFirestore(id, { status: newStatus });
  };

  // Update Booking Staff / Notes
  const handleUpdateBookingDetails = async (id: string, staff: string, adminNotes: string) => {
    const updated = bookings.map((b) =>
      b.id === id ? { ...b, assignedStaff: staff, adminNotes } : b
    );
    setBookings(updated);
    saveStoredBookings(updated);
    if (selectedBookingForModal && selectedBookingForModal.id === id) {
      setSelectedBookingForModal({
        ...selectedBookingForModal,
        assignedStaff: staff,
        adminNotes,
      });
    }
    await updateClinicBookingFirestore(id, { assignedStaff: staff, adminNotes });
  };

  // Create New Booking from Desk
  const handleCreateDeskBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBkName.trim() || !newBkEmail.trim()) return;

    const titles: Record<string, string> = {
      URGENT_TRIAGE: 'Urgent Triage & Minor Wound Dressing',
      FIRST_AID_CERT: 'AHA Certified CPR & AED Practical Workshop',
      HEALTH_CHECKUP: 'Athletics & General Health Physical Screening',
      VACCINATION: 'Campus Seasonal Immunization & Allergy Shots',
      EQUIPMENT_RESERVE: 'Field Trip & Dorm First-Aid Kit Checkout',
    };

    const newBooking = {
      bookingNumber: `BK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      userName: newBkName.trim(),
      userEmail: newBkEmail.trim(),
      userPhone: newBkPhone.trim(),
      serviceType: newBkService,
      serviceTitle: titles[newBkService] || 'Health & Safety Consultation',
      preferredDate: newBkDate,
      preferredTime: newBkTime,
      location: 'Student Health Center - Exam Suite 1',
      notes: newBkNotes.trim() || 'Booked directly via Campus Safety Admin Desk.',
      urgency: newBkUrgency,
      status: 'CONFIRMED' as ClinicBooking['status'],
      assignedStaff: currentUser.name,
      adminNotes: 'Booked directly by Admin Officer.',
    };

    const res = await createClinicBookingFirestore(newBooking);
    if (!res.success) {
      const fallback: ClinicBooking = {
        ...newBooking,
        id: `bk-${Date.now()}`,
        createdAt: Date.now(),
      };
      const updated = [fallback, ...bookings];
      setBookings(updated);
      saveStoredBookings(updated);
    }

    setShowNewBookingModal(false);
    setNewBkName('');
    setNewBkEmail('');
    setNewBkNotes('');
  };

  // Export Bookings (CSV)
  const handleExportBookingsCSV = () => {
    const headers = ['Booking ID,Patient Name,Email,Phone,Service,Date,Time,Urgency,Status,Assigned Staff,Notes'];
    const rows = bookings.map((b) =>
      `"${b.bookingNumber}","${b.userName}","${b.userEmail}","${b.userPhone}","${b.serviceTitle}","${b.preferredDate}","${b.preferredTime}","${b.urgency}","${b.status}","${b.assignedStaff || ''}","${(b.notes || '').replace(/"/g, '""')}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CarePulse_Bookings_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Update SOS Status
  const handleUpdateSosStatus = async (id: string, newStatus: SOSDispatchRecord['status']) => {
    setSosRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    await updateSosDispatchFirestore(id, { status: newStatus });
  };

  // Update Hazard Status
  const handleUpdateHazardStatus = async (id: string, newStatus: HazardReport['status']) => {
    const updated = hazards.map((h) => (h.id === id ? { ...h, status: newStatus } : h));
    setHazards(updated);
    localStorage.setItem('safeaid_hazards', JSON.stringify(updated));
    await updateHazardReportFirestore(id, { status: newStatus });
  };

  // Add Advisory
  const handleCreateAdvisory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdvisoryTitle.trim() || !newAdvisoryMessage.trim()) return;

    const newAdv: CampusAdvisory = {
      id: `adv-${Date.now()}`,
      title: newAdvisoryTitle.trim(),
      message: newAdvisoryMessage.trim(),
      level: newAdvisoryLevel,
      active: true,
      createdAt: Date.now(),
      location: newAdvisoryLocation.trim() || 'Campus Wide',
    };

    setAdvisories([newAdv, ...advisories]);
    await saveAdvisoryFirestore(newAdv);
    setNewAdvisoryTitle('');
    setNewAdvisoryMessage('');
    setShowNewAdvisoryModal(false);
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Top Admin Header Bar */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Campus Safety & Health Administration
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold border border-indigo-200">
                Master Admin Portal
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
              <span>Logged in: <strong>{currentUser.name}</strong> ({currentUser.email})</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-indigo-700 font-semibold">
                <Lock className="w-3 h-3" />
                Single Admin Slot: Claimed & Active
              </span>
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setBookings(getStoredBookings())}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
            title="Refresh bookings and records"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
            <span>Refresh Data</span>
          </button>

          <button
            onClick={onNavigateHome}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Back to App</span>
          </button>

          <button
            onClick={onSignOut}
            className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div
          onClick={() => setActiveTab('bookings')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeTab === 'bookings'
              ? 'bg-indigo-50/70 border-indigo-300 shadow-xs ring-2 ring-indigo-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Bookings</span>
            <Calendar className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalBookingsCount}</div>
          <div className="text-[11px] text-indigo-700 font-semibold mt-1">
            {pendingBookingsCount} pending approval
          </div>
        </div>

        <div
          onClick={() => setActiveTab('bookings')}
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs cursor-pointer hover:border-slate-300 transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Urgent Requests</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-black text-red-600">{urgentBookingsCount}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Fast-track triage & medical slots
          </div>
        </div>

        <div
          onClick={() => setActiveTab('dispatches')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeTab === 'dispatches'
              ? 'bg-red-50/70 border-red-300 shadow-xs ring-2 ring-red-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active SOS Dispatches</span>
            <ShieldAlert className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{activeSosCount}</div>
          <div className="text-[11px] text-red-600 font-semibold mt-1">
            Live emergency units on scene
          </div>
        </div>

        <div
          onClick={() => setActiveTab('hazards')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeTab === 'hazards'
              ? 'bg-amber-50/70 border-amber-300 shadow-xs ring-2 ring-amber-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Open Hazards</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{openHazardsCount}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Under investigation / repair
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'bookings'
              ? 'bg-white text-indigo-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
          <span>Website Bookings ({totalBookingsCount})</span>
          {pendingBookingsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black">
              {pendingBookingsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('dispatches')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'dispatches'
              ? 'bg-white text-indigo-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
          <span>SOS Dispatches ({sosRecords.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('hazards')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'hazards'
              ? 'bg-white text-indigo-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          <span>Campus Hazards ({hazards.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('advisories')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'advisories'
              ? 'bg-white text-indigo-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Megaphone className="w-3.5 h-3.5 text-indigo-600" />
          <span>Safety Advisories ({advisories.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: WEBSITE BOOKINGS MANAGEMENT (MAIN USER REQUIREMENT) */}
      {/* ========================================================================= */}
      {activeTab === 'bookings' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Controls Bar: Filters, Search & Actions */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                placeholder="Search bookings by student name, booking #, email, or room..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={bookingFilterStatus}
                onChange={(e) => setBookingFilterStatus(e.target.value)}
                className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-bold focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="PENDING">Pending Approval</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>

              <select
                value={bookingFilterService}
                onChange={(e) => setBookingFilterService(e.target.value)}
                className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-semibold focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Service Types</option>
                <option value="URGENT_TRIAGE">Urgent Triage & Injury</option>
                <option value="FIRST_AID_CERT">CPR/AED Certification</option>
                <option value="HEALTH_CHECKUP">Health Physical</option>
                <option value="VACCINATION">Vaccination / Immunization</option>
                <option value="EQUIPMENT_RESERVE">Kit / Equipment Loan</option>
              </select>

              {/* Action Buttons */}
              <button
                onClick={handleExportBookingsCSV}
                className="px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                title="Export all bookings as CSV spreadsheet"
              >
                <Download className="w-3.5 h-3.5 text-indigo-600" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => setShowNewBookingModal(true)}
                className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Booking (Desk)</span>
              </button>
            </div>
          </div>

          {/* Bookings Table / List */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  All Website Bookings & Clinical Requests
                </h3>
                <span className="text-xs text-slate-500">
                  ({filteredBookings.length} of {bookings.length} showing)
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                Click any booking to update responder, clinic notes, or status.
              </span>
            </div>

            {filteredBookings.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">No bookings match the selected filters</p>
                <p className="text-xs text-slate-500">
                  Adjust your search keyword or status filters above.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Booking #</th>
                      <th className="py-3 px-4">Patient / Student</th>
                      <th className="py-3 px-4">Service & Location</th>
                      <th className="py-3 px-4">Schedule (Date & Time)</th>
                      <th className="py-3 px-4">Urgency</th>
                      <th className="py-3 px-4">Assigned Staff</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="hover:bg-indigo-50/30 transition-colors cursor-pointer"
                        onClick={() => setSelectedBookingForModal(booking)}
                      >
                        {/* Booking Number */}
                        <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">
                          {booking.bookingNumber}
                        </td>

                        {/* Patient Name & Contact */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{booking.userName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {booking.userEmail}
                          </div>
                          <div className="text-[11px] text-slate-500">{booking.userPhone}</div>
                        </td>

                        {/* Service Title */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="font-bold text-slate-800 line-clamp-1">
                            {booking.serviceTitle}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{booking.location}</span>
                          </div>
                        </td>

                        {/* Schedule */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-bold text-slate-900">{booking.preferredDate}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{booking.preferredTime}</span>
                          </div>
                        </td>

                        {/* Urgency */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              booking.urgency === 'emergency'
                                ? 'bg-red-100 text-red-800 border border-red-200 font-extrabold'
                                : booking.urgency === 'urgent'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {booking.urgency}
                          </span>
                        </td>

                        {/* Assigned Staff */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-800">
                            {booking.assignedStaff || (
                              <span className="text-slate-400 italic">Unassigned</span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                              booking.status === 'CONFIRMED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : booking.status === 'IN_PROGRESS'
                                ? 'bg-blue-100 text-blue-800'
                                : booking.status === 'COMPLETED'
                                ? 'bg-slate-100 text-slate-700'
                                : booking.status === 'CANCELLED'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {booking.status === 'CONFIRMED' && <Check className="w-3 h-3" />}
                            {booking.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            {booking.status === 'PENDING' && (
                              <button
                                onClick={() => handleUpdateBookingStatus(booking.id, 'CONFIRMED')}
                                className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors shadow-2xs"
                                title="Approve & Confirm Appointment"
                              >
                                Approve
                              </button>
                            )}
                            {booking.status === 'CONFIRMED' && (
                              <button
                                onClick={() => handleUpdateBookingStatus(booking.id, 'COMPLETED')}
                                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-colors"
                                title="Mark Finished"
                              >
                                Mark Done
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedBookingForModal(booking)}
                              className="p-1 rounded text-indigo-600 hover:bg-indigo-50 transition-colors"
                              title="View & Edit Booking Details"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SOS DISPATCHES */}
      {/* ========================================================================= */}
      {activeTab === 'dispatches' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 gap-3">
            {sosRecords.map((record) => (
              <div
                key={record.id}
                className={`p-5 rounded-2xl bg-white border transition-all ${
                  record.status === 'PENDING'
                    ? 'border-red-300 ring-2 ring-red-500/20 shadow-sm'
                    : 'border-slate-200 shadow-2xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{record.userName}</h3>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {record.userRole}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span className="font-semibold">{record.location}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        record.status === 'PENDING'
                          ? 'bg-red-100 text-red-700 animate-pulse'
                          : record.status === 'DISPATCHED'
                          ? 'bg-amber-100 text-amber-800'
                          : record.status === 'ON_SCENE'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {record.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3 text-xs bg-slate-50/70 p-3 rounded-xl mt-3 border border-slate-100">
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px] uppercase">Blood Group & Allergies</span>
                    <span className="font-bold text-slate-800">{record.bloodGroup || 'Unknown'}</span> • <span className="text-slate-600">{record.allergies || 'None'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px] uppercase">Medical History</span>
                    <span className="text-slate-700">{record.medicalNotes || 'No notes reported.'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px] uppercase">Assigned Unit</span>
                    <span className="font-bold text-indigo-700">{record.assignedResponder || 'Central Unit'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-3">
                  <div className="text-xs text-slate-500 font-medium">
                    Status Transition:
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleUpdateSosStatus(record.id, 'DISPATCHED')}
                      className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold"
                    >
                      Dispatched
                    </button>
                    <button
                      onClick={() => handleUpdateSosStatus(record.id, 'ON_SCENE')}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold"
                    >
                      On Scene
                    </button>
                    <button
                      onClick={() => handleUpdateSosStatus(record.id, 'RESOLVED')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold"
                    >
                      Resolved
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CAMPUS HAZARD QUEUE */}
      {/* ========================================================================= */}
      {activeTab === 'hazards' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={hazardSearch}
                onChange={(e) => setHazardSearch(e.target.value)}
                placeholder="Search hazards by location or type..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50 text-slate-900"
              />
            </div>
            <select
              value={hazardFilter}
              onChange={(e) => setHazardFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-bold"
            >
              <option value="all">All Hazard Statuses</option>
              <option value="Report Received">Report Received</option>
              <option value="Investigating">Investigating</option>
              <option value="Maintenance Dispatched">Maintenance Dispatched</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredHazards.map((hazard) => (
              <div
                key={hazard.id}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500">{hazard.id}</span>
                    <span className="font-bold text-sm text-slate-900">{hazard.hazardType}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      hazard.riskLevel === 'CRITICAL'
                        ? 'bg-red-100 text-red-800 font-black'
                        : hazard.riskLevel === 'HIGH'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {hazard.riskLevel} RISK
                  </span>
                </div>

                <p className="text-xs text-slate-700">{hazard.description}</p>

                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                    <MapPin className="w-3.5 h-3.5 text-cyan-600" />
                    {hazard.location}
                  </span>
                  <span>Reported by {hazard.reportedBy}</span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {hazard.status}
                  </span>
                  <select
                    value={hazard.status}
                    onChange={(e) => handleUpdateHazardStatus(hazard.id, e.target.value as any)}
                    className="text-xs font-bold border border-slate-200 rounded-lg px-2 py-1 bg-slate-50 text-slate-700 cursor-pointer"
                  >
                    <option value="Report Received">Report Received</option>
                    <option value="Investigating">Investigating</option>
                    <option value="Maintenance Dispatched">Maintenance Dispatched</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SAFETY ADVISORIES */}
      {/* ========================================================================= */}
      {activeTab === 'advisories' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Active Campus Advisories & Broadcast Alerts
            </h3>
            <button
              onClick={() => setShowNewAdvisoryModal(true)}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Broadcast New Advisory</span>
            </button>
          </div>

          <div className="space-y-3">
            {advisories.map((adv) => (
              <div
                key={adv.id}
                className={`p-4 sm:p-5 rounded-2xl border space-y-2 ${
                  adv.level === 'danger'
                    ? 'bg-red-50/70 border-red-200 text-red-950'
                    : adv.level === 'warning'
                    ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                    : 'bg-cyan-50/70 border-cyan-200 text-cyan-950'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-indigo-600" />
                    <h4 className="font-bold text-sm text-slate-900">{adv.title}</h4>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    {adv.location} • {new Date(adv.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{adv.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: BOOKING DETAIL & TRIAGE RESOLUTION */}
      {/* ========================================================================= */}
      {selectedBookingForModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn"
        >
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {selectedBookingForModal.bookingNumber}
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  Booking Details & Action Desk
                </h3>
              </div>
              <button
                onClick={() => setSelectedBookingForModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Service & Patient Info */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Service:</span>
                <span className="font-bold text-slate-800">{selectedBookingForModal.serviceTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Student / Patient:</span>
                <span className="font-bold text-slate-800">{selectedBookingForModal.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Email & Phone:</span>
                <span className="font-mono text-slate-700">{selectedBookingForModal.userEmail} ({selectedBookingForModal.userPhone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Scheduled Date & Time:</span>
                <span className="font-bold text-slate-900">
                  {selectedBookingForModal.preferredDate} at {selectedBookingForModal.preferredTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Location:</span>
                <span className="text-slate-800">{selectedBookingForModal.location}</span>
              </div>
            </div>

            {/* Patient Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Student Stated Reason / Symptoms
              </label>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                {selectedBookingForModal.notes || 'No extra notes provided.'}
              </div>
            </div>

            {/* Admin / Clinic Coordinator Notes & Staff Assignment */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assigned Clinical Staff / Responder
                </label>
                <input
                  type="text"
                  value={selectedBookingForModal.assignedStaff || ''}
                  onChange={(e) =>
                    setSelectedBookingForModal({
                      ...selectedBookingForModal,
                      assignedStaff: e.target.value,
                    })
                  }
                  placeholder="e.g. Nurse Elena Vance, RN or Dr. Patel"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Internal Clinic Notes & Instructions
                </label>
                <textarea
                  rows={2}
                  value={selectedBookingForModal.adminNotes || ''}
                  onChange={(e) =>
                    setSelectedBookingForModal({
                      ...selectedBookingForModal,
                      adminNotes: e.target.value,
                    })
                  }
                  placeholder="Add clinic preparation notes, room assignment, or triage instructions..."
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-900 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Update Booking Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateBookingStatus(selectedBookingForModal.id, st)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                        selectedBookingForModal.status === st
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Save & Close Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedBookingForModal.userPhone}`}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1"
                >
                  <PhoneCall className="w-3 h-3 text-cyan-600" />
                  <span>Call</span>
                </a>
                <a
                  href={`mailto:${selectedBookingForModal.userEmail}`}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1"
                >
                  <Mail className="w-3 h-3 text-indigo-600" />
                  <span>Email</span>
                </a>
              </div>

              <button
                type="button"
                onClick={() => {
                  handleUpdateBookingDetails(
                    selectedBookingForModal.id,
                    selectedBookingForModal.assignedStaff || '',
                    selectedBookingForModal.adminNotes || ''
                  );
                  setSelectedBookingForModal(null);
                }}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: NEW BOOKING DIRECTLY FROM ADMIN DESK */}
      {/* ========================================================================= */}
      {showNewBookingModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn"
        >
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>Create Walk-in / Desk Booking</span>
              </h3>
              <button
                onClick={() => setShowNewBookingModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDeskBooking} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Student / Patient Name
                </label>
                <input
                  type="text"
                  required
                  value={newBkName}
                  onChange={(e) => setNewBkName(e.target.value)}
                  placeholder="e.g. Samuel Green"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Campus Email
                  </label>
                  <input
                    type="email"
                    required
                    value={newBkEmail}
                    onChange={(e) => setNewBkEmail(e.target.value)}
                    placeholder="s.green@campus.edu"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newBkPhone}
                    onChange={(e) => setNewBkPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Service Type
                </label>
                <select
                  value={newBkService}
                  onChange={(e) => setNewBkService(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-900 font-bold"
                >
                  <option value="URGENT_TRIAGE">Urgent Triage & Minor Wound Dressing</option>
                  <option value="FIRST_AID_CERT">AHA Certified CPR & AED Practical Workshop</option>
                  <option value="HEALTH_CHECKUP">Athletics & General Health Physical</option>
                  <option value="VACCINATION">Campus Seasonal Immunization & Allergy Shots</option>
                  <option value="EQUIPMENT_RESERVE">Field Trip & Dorm First-Aid Kit Checkout</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newBkDate}
                    onChange={(e) => setNewBkDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Time Slot
                  </label>
                  <input
                    type="text"
                    required
                    value={newBkTime}
                    onChange={(e) => setNewBkTime(e.target.value)}
                    placeholder="10:00 AM"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reason / Clinical Notes
                </label>
                <textarea
                  rows={2}
                  value={newBkNotes}
                  onChange={(e) => setNewBkNotes(e.target.value)}
                  placeholder="Notes taken during intake..."
                  className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-900 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewBookingModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs"
                >
                  Create Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: BROADCAST NEW ADVISORY */}
      {/* ========================================================================= */}
      {showNewAdvisoryModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn"
        >
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Megaphone className="w-4 h-4 text-indigo-600" />
                <span>Create Campus Safety Advisory</span>
              </h3>
              <button
                onClick={() => setShowNewAdvisoryModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAdvisory} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Advisory Headline
                </label>
                <input
                  type="text"
                  required
                  value={newAdvisoryTitle}
                  onChange={(e) => setNewAdvisoryTitle(e.target.value)}
                  placeholder="e.g. Ice Hazard on West Steps"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alert Severity Level
                </label>
                <select
                  value={newAdvisoryLevel}
                  onChange={(e) => setNewAdvisoryLevel(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-900 font-bold"
                >
                  <option value="info">Informational (Blue)</option>
                  <option value="warning">Warning / Caution (Amber)</option>
                  <option value="danger">Critical Danger / Immediate (Red)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Broadcast Target Area
                </label>
                <input
                  type="text"
                  value={newAdvisoryLocation}
                  onChange={(e) => setNewAdvisoryLocation(e.target.value)}
                  placeholder="e.g. North Quad & Dining Hall"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Advisory Content
                </label>
                <textarea
                  rows={3}
                  required
                  value={newAdvisoryMessage}
                  onChange={(e) => setNewAdvisoryMessage(e.target.value)}
                  placeholder="Enter detailed safety directions..."
                  className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-900 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewAdvisoryModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs"
                >
                  Broadcast Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
