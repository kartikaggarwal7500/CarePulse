import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  GraduationCap,
  ShieldPlus,
  Package,
  Sparkles,
  PhoneCall,
  User,
  Mail,
  ChevronRight,
  Filter,
  Search,
  Check,
  X,
  FileText,
  CloudCheck,
  RefreshCw
} from 'lucide-react';
import { ClinicBooking, AuthUser, UserProfile } from '../types';
import { getStoredBookings, saveStoredBookings } from '../data/bookingData';
import { generateAiTriageSummary } from '../services/api';
import {
  subscribeToBookings,
  createClinicBookingFirestore,
  updateClinicBookingFirestore,
  seedInitialBookingsIfEmpty
} from '../services/firestoreService';

interface BookingsViewProps {
  currentUser: AuthUser | null;
  userProfile?: UserProfile;
  onOpenSos?: () => void;
  onOpenAuth?: () => void;
  onNavigate?: (screen: any, params?: any) => void;
}

const AVAILABLE_SERVICES = [
  {
    type: 'URGENT_TRIAGE',
    title: 'Urgent Triage & Minor Injury Dressing',
    category: 'Immediate Care',
    duration: '15 - 20 mins',
    location: 'Student Health Center - Triage Suite 101',
    description: 'Fast-track evaluation for cuts, minor burns, sprains, insect stings, or sudden acute discomfort.',
    icon: Stethoscope,
    badgeColor: 'bg-red-50 text-red-700 border-red-200',
    urgencyDefault: 'urgent' as const,
  },
  {
    type: 'FIRST_AID_CERT',
    title: 'AHA Certified CPR & AED Practical Workshop',
    category: 'Safety Training',
    duration: '60 mins',
    location: 'Public Safety Training Center - Hall A',
    description: 'Hands-on chest compression, rescue breathing, and automated external defibrillator (AED) practice.',
    icon: GraduationCap,
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    urgencyDefault: 'routine' as const,
  },
  {
    type: 'HEALTH_CHECKUP',
    title: 'Athletics & General Health Physical Screening',
    category: 'Wellness & Prevention',
    duration: '30 mins',
    location: 'Student Health Center - Exam Suite 3',
    description: 'Baseline blood pressure, pulse oximetry, respiratory review, and sports intramural clearance checks.',
    icon: ShieldPlus,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    urgencyDefault: 'routine' as const,
  },
  {
    type: 'VACCINATION',
    title: 'Campus Seasonal Immunization & Allergy Shots',
    category: 'Immunization',
    duration: '15 mins',
    location: 'Student Health Center - Clinic Suite 102',
    description: 'Seasonal influenza vaccines, tetanus boosters, and regular allergy immunotherapy administrations.',
    icon: Sparkles,
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    urgencyDefault: 'routine' as const,
  },
  {
    type: 'EQUIPMENT_RESERVE',
    title: 'Field Trip & Dorm First-Aid Kit Checkout',
    category: 'Equipment Loan',
    duration: '5 mins',
    location: 'Public Safety Operations Desk',
    description: 'Reserve comprehensive trauma and first-aid kits for student club trips, lab experiments, or sports outings.',
    icon: Package,
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    urgencyDefault: 'routine' as const,
  },
];

const TIME_SLOTS = [
  '08:30 AM',
  '09:15 AM',
  '10:00 AM',
  '10:45 AM',
  '11:30 AM',
  '01:15 PM',
  '02:00 PM',
  '02:45 PM',
  '03:30 PM',
  '04:15 PM',
];

export const BookingsView: React.FC<BookingsViewProps> = ({
  currentUser,
  userProfile,
  onOpenSos,
  onOpenAuth,
}) => {
  const [bookings, setBookings] = useState<ClinicBooking[]>(() => getStoredBookings());
  const [selectedService, setSelectedService] = useState<typeof AVAILABLE_SERVICES[0]>(AVAILABLE_SERVICES[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [userName, setUserName] = useState(currentUser?.name || userProfile.name || '');
  const [userEmail, setUserEmail] = useState(currentUser?.email || 'alex.rivera@campus.edu');
  const [userPhone, setUserPhone] = useState(userProfile.primaryEmergencyPhone || '(555) 019-2424');
  const [preferredDate, setPreferredDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState(TIME_SLOTS[2]);
  const [urgency, setUrgency] = useState<'routine' | 'urgent' | 'emergency'>('routine');
  const [notes, setNotes] = useState('');
  const [isTriaging, setIsTriaging] = useState(false);
  const [aiTriageResult, setAiTriageResult] = useState<{
    triageSummary: string;
    recommendedPriority: 'routine' | 'urgent' | 'emergency';
    clinicalCategory: string;
    preparationTips: string[];
  } | null>(null);
  
  // Feedback
  const [submittedBooking, setSubmittedBooking] = useState<ClinicBooking | null>(null);
  const [myBookingsTab, setMyBookingsTab] = useState<'book' | 'my-list'>('book');

  const handleRunAiTriage = async () => {
    if (!notes.trim()) return;
    setIsTriaging(true);
    try {
      const res = await generateAiTriageSummary({
        symptoms: notes,
        serviceType: selectedService.title,
      });
      setAiTriageResult(res);
      if (res.recommendedPriority) {
        setUrgency(res.recommendedPriority);
      }
    } catch (e) {
      console.warn('AI Triage error:', e);
    } finally {
      setIsTriaging(false);
    }
  };

  // Real-time Firestore synchronization
  useEffect(() => {
    seedInitialBookingsIfEmpty();
    const unsubscribe = subscribeToBookings((updatedList) => {
      setBookings(updatedList);
      saveStoredBookings(updatedList);
    });
    return () => unsubscribe();
  }, []);

  // Filter bookings for the current user
  const userBookings = bookings.filter(
    (b) =>
      b.userEmail.toLowerCase() === (currentUser?.email || userEmail).toLowerCase() ||
      b.userName.toLowerCase() === (currentUser?.name || userName).toLowerCase()
  );

  const handleSelectService = (service: typeof AVAILABLE_SERVICES[0]) => {
    setSelectedService(service);
    setUrgency(service.urgencyDefault);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) return;

    setIsSubmitting(true);

    const bookingPayload = {
      bookingNumber: `BK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      userName: userName.trim(),
      userEmail: userEmail.trim(),
      userPhone: userPhone.trim() || '(555) 019-2424',
      serviceType: selectedService.type as any,
      serviceTitle: selectedService.title,
      preferredDate,
      preferredTime,
      location: selectedService.location,
      notes: notes.trim() || 'No additional medical instructions provided.',
      urgency,
      status: (urgency === 'urgent' ? 'CONFIRMED' : 'PENDING') as ClinicBooking['status'],
      assignedStaff: urgency === 'urgent' ? 'Nurse Elena Vance, RN' : undefined,
      adminNotes: urgency === 'urgent' ? 'Auto-prioritized for urgent clinical triage.' : undefined,
    };

    // Push to Firestore Cloud Database
    const res = await createClinicBookingFirestore(bookingPayload);
    setIsSubmitting(false);

    if (res.success && res.booking) {
      setSubmittedBooking(res.booking);
      setNotes('');
    } else {
      // Local fallback
      const fallbackBooking: ClinicBooking = {
        ...bookingPayload,
        id: `bk-${Date.now()}`,
        createdAt: Date.now(),
      };
      const updated = [fallbackBooking, ...bookings];
      setBookings(updated);
      saveStoredBookings(updated);
      setSubmittedBooking(fallbackBooking);
      setNotes('');
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    await updateClinicBookingFirestore(bookingId, { status: 'CANCELLED' });
    const updated = bookings.map((b) =>
      b.id === bookingId ? { ...b, status: 'CANCELLED' as const } : b
    );
    setBookings(updated);
    saveStoredBookings(updated);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-100">
              <Stethoscope className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  Campus Health & Safety Appointments
                </h1>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Firebase Synced
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Book urgent triage consultations, CPR/AED certifications, health physicals, and first-aid kits.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0 self-start sm:self-auto">
          <button
            onClick={() => {
              setMyBookingsTab('book');
              setSubmittedBooking(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              myBookingsTab === 'book'
                ? 'bg-white text-cyan-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            New Appointment
          </button>
          <button
            onClick={() => setMyBookingsTab('my-list')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              myBookingsTab === 'my-list'
                ? 'bg-white text-cyan-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>My Bookings</span>
            {userBookings.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-cyan-100 text-cyan-800 text-[10px] font-black">
                {userBookings.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Booking Confirmation View */}
      {submittedBooking && (
        <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-4 shadow-sm animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-emerald-900">
                  Appointment Request Confirmed!
                </h3>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-200/80 text-emerald-900 text-xs font-mono font-bold">
                  {submittedBooking.bookingNumber}
                </span>
              </div>
              <p className="text-xs text-emerald-800 mt-1">
                Your appointment details have been dispatched to the Campus Health Clinic & Safety Desk via Firebase Firestore.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white/80 p-3.5 rounded-xl border border-emerald-200 text-xs">
            <div>
              <span className="text-slate-500 font-semibold block text-[10px] uppercase">Service</span>
              <span className="font-bold text-slate-800">{submittedBooking.serviceTitle}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block text-[10px] uppercase">Date & Time</span>
              <span className="font-bold text-slate-800">
                {submittedBooking.preferredDate} at {submittedBooking.preferredTime}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block text-[10px] uppercase">Location</span>
              <span className="font-bold text-slate-800">{submittedBooking.location}</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <p className="text-[11px] text-emerald-700">
              Need immediate emergency help? Call campus dispatch directly at (555) 019-9110.
            </p>
            <button
              onClick={() => setSubmittedBooking(null)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
            >
              Book Another
            </button>
          </div>
        </div>
      )}

      {myBookingsTab === 'my-list' ? (
        /* My Bookings List View */
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Active Bookings & Requests ({userBookings.length})
            </h2>
            <button
              onClick={() => setMyBookingsTab('book')}
              className="text-xs font-bold text-cyan-700 hover:underline"
            >
              + Book New Service
            </button>
          </div>

          {userBookings.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
              <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No appointments scheduled yet</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Schedule a fast-track triage assessment, CPR workshop, or health clearance anytime.
              </p>
              <button
                onClick={() => setMyBookingsTab('book')}
                className="mt-2 px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-700 transition-colors shadow-xs"
              >
                Schedule Appointment
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {userBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {b.bookingNumber}
                      </span>
                      <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                        {b.serviceTitle}
                      </h3>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        b.status === 'CONFIRMED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : b.status === 'PENDING'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : b.status === 'IN_PROGRESS'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : b.status === 'COMPLETED'
                          ? 'bg-slate-100 text-slate-700 border-slate-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-800">
                        {b.preferredDate} at {b.preferredTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{b.location}</span>
                    </div>
                    {b.assignedStaff && (
                      <div className="flex items-center gap-1.5 text-cyan-700 font-semibold">
                        <User className="w-3.5 h-3.5 shrink-0" />
                        <span>Assigned: {b.assignedStaff}</span>
                      </div>
                    )}
                  </div>

                  {b.notes && (
                    <p className="text-xs text-slate-500 italic bg-white p-2 rounded-lg border border-slate-100 line-clamp-2">
                      "{b.notes}"
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                    <span className="text-[10px] text-slate-400">
                      Urgency:{' '}
                      <span
                        className={`font-bold uppercase ${
                          b.urgency === 'urgent' || b.urgency === 'emergency'
                            ? 'text-red-600'
                            : 'text-slate-700'
                        }`}
                      >
                        {b.urgency}
                      </span>
                    </span>

                    {b.status !== 'CANCELLED' && b.status !== 'COMPLETED' && (
                      <button
                        onClick={() => handleCancelBooking(b.id)}
                        className="text-[11px] font-semibold text-red-600 hover:text-red-700 hover:underline"
                      >
                        Cancel Request
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Booking Creation Form */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Step 1: Select Service */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-cyan-600 text-white text-[11px] font-bold flex items-center justify-center">
                1
              </span>
              <span>Choose Required Campus Service</span>
            </h2>

            <div className="space-y-2.5">
              {AVAILABLE_SERVICES.map((srv) => {
                const IconComponent = srv.icon;
                const isSelected = selectedService.type === srv.type;
                return (
                  <div
                    key={srv.type}
                    onClick={() => handleSelectService(srv)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-50/50 border-cyan-500 shadow-xs ring-2 ring-cyan-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${srv.badgeColor}`}>
                            {srv.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">{srv.duration}</span>
                        </div>
                        <h3 className="text-xs font-bold text-slate-900 leading-snug">{srv.title}</h3>
                        <p className="text-[11px] text-slate-500 mt-1 leading-normal line-clamp-2">
                          {srv.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Time & Patient Details */}
          <div className="lg:col-span-7">
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <span className="w-5 h-5 rounded-full bg-cyan-600 text-white text-[11px] font-bold flex items-center justify-center">
                  2
                </span>
                <span>Select Appointment Details & Confirm</span>
              </h2>

              <form onSubmit={handleSubmitBooking} className="space-y-4">
                {/* Selected Service Card Preview */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-cyan-600 text-white flex items-center justify-center shrink-0">
                      <selectedService.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Selected Service</span>
                      <span className="text-xs font-bold text-slate-900">{selectedService.title}</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 font-semibold text-right hidden sm:block">
                    {selectedService.location}
                  </span>
                </div>

                {/* Date & Time Slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Preferred Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-cyan-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Available Time Slot
                    </label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-cyan-500/20"
                    >
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Alex Rivera"
                        className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-cyan-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Campus / Contact Email
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="alex.rivera@campus.edu"
                        className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-cyan-500/20"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <PhoneCall className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="tel"
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        placeholder="(555) 019-2424"
                        className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-cyan-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Urgency Level
                    </label>
                    <select
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-cyan-500/20"
                    >
                      <option value="routine">Routine (Standard Scheduling)</option>
                      <option value="urgent">Urgent (Clinical Evaluation Today)</option>
                      <option value="emergency">High Priority / Immediate Care</option>
                    </select>
                  </div>
                </div>

                {/* Medical reason / notes */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700">
                      Symptoms or Specific Requirements (Optional)
                    </label>
                    <button
                      type="button"
                      onClick={handleRunAiTriage}
                      disabled={!notes.trim() || isTriaging}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-700 hover:text-cyan-800 disabled:opacity-40 transition-colors"
                    >
                      <Sparkles className="w-3 h-3 text-cyan-600" />
                      <span>{isTriaging ? 'Assessing with Gemini...' : 'Assess Priority with Gemini AI'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Sustained minor scrape during chemistry lab; needing clean dressing and tetanus booster check."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-cyan-500/20"
                  />

                  {aiTriageResult && (
                    <div className="p-3 rounded-xl bg-cyan-50/60 border border-cyan-200 text-xs space-y-1.5 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-cyan-900 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                          <span>Gemini AI Triage Assessment</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white text-cyan-800 border border-cyan-200">
                          {aiTriageResult.clinicalCategory}
                        </span>
                      </div>
                      <p className="text-slate-700 text-[11px] leading-relaxed">
                        {aiTriageResult.triageSummary}
                      </p>
                      {aiTriageResult.preparationTips && aiTriageResult.preparationTips.length > 0 && (
                        <div className="pt-1 border-t border-cyan-100 flex items-center gap-1 text-[10px] text-cyan-800">
                          <CheckCircle2 className="w-3 h-3 text-cyan-600 shrink-0" />
                          <span>Tip: {aiTriageResult.preparationTips.join(' ')}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving to Cloud Database...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Book Appointment</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
