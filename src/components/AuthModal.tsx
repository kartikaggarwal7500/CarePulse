import React, { useState } from 'react';
import {
  X,
  LogIn,
  UserPlus,
  ShieldCheck,
  User,
  Stethoscope,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { AuthUser, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: AuthUser) => void;
}

export const DEMO_USERS: AuthUser[] = [
  {
    id: 'user-student-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@campus.edu',
    role: 'student',
    studentId: 'UNIV-2026-8942',
    department: 'Computer Science & Engineering',
    dormLocation: 'West Hall, STEM Room 304',
    bloodGroup: 'O+',
    allergies: 'Mild Penicillin sensitivity, seasonal pollen',
    medicalNotes: 'Carries mild asthma inhaler for sports.',
    primaryEmergencyContact: 'Sarah Rivera (Parent)',
    primaryEmergencyPhone: '(555) 019-2424',
  },
  {
    id: 'user-staff-1',
    name: 'Nurse Elena Vance, RN',
    email: 'e.vance@campus-health.org',
    role: 'staff',
    department: 'Student Health & Urgent Care Center',
    dormLocation: 'Health Center, Clinic Suite 102',
    bloodGroup: 'B+',
    allergies: 'Latex sensitivity (mild)',
    medicalNotes: 'Triage Nurse on Duty',
    primaryEmergencyContact: 'Health Center Director',
    primaryEmergencyPhone: '(555) 019-4325',
  },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [dormLocation, setDormLocation] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    const user: AuthUser = {
      id: `user-${Date.now()}`,
      name: name.trim() || email.split('@')[0],
      email: email.trim(),
      role: selectedRole,
      dormLocation: dormLocation.trim() || 'Campus Center',
      bloodGroup: 'Unknown',
      allergies: 'None recorded',
      medicalNotes: '',
      primaryEmergencyContact: 'Campus Emergency Desk',
      primaryEmergencyPhone: '(555) 019-9110',
    };

    onLogin(user);
    onClose();
  };

  const handleQuickLogin = (demoUser: AuthUser) => {
    onLogin(demoUser);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
    >
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden text-slate-800 max-h-[90vh] overflow-y-auto">
        {/* Top bar accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Close authentication modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center pt-2 pb-4">
          <div className="w-11 h-11 mx-auto rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-2.5 shadow-xs border border-cyan-100">
            {isSignUp ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
          </div>
          <h2 id="auth-modal-title" className="text-lg sm:text-xl font-bold text-slate-900">
            {isSignUp ? 'Create Campus Account' : 'Sign in to CarePulse'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isSignUp
              ? 'Register your student or staff profile for personalized safety alerts.'
              : 'Access saved emergency preferences, medical info, and admin portal.'}
          </p>
        </div>

        {/* Quick Demo Sign In Section */}
        <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Quick One-Click Sign In:
            </span>
            <span className="text-[10px] text-cyan-700 font-semibold">Demo Profiles</span>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {DEMO_USERS.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => handleQuickLogin(user)}
                className="w-full px-2.5 py-2 rounded-lg bg-white hover:bg-cyan-50/70 border border-slate-200 hover:border-cyan-300 text-left transition-all flex items-center justify-between group shadow-2xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${
                      user.role === 'admin'
                        ? 'bg-indigo-100 text-indigo-700'
                        : user.role === 'staff'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-cyan-100 text-cyan-700'
                    }`}
                  >
                    {user.role === 'admin' ? (
                      <ShieldCheck className="w-4 h-4" />
                    ) : user.role === 'staff' ? (
                      <Stethoscope className="w-4 h-4" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-cyan-700 truncate">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">
                      {user.role === 'admin'
                        ? 'Safety Administrator'
                        : user.role === 'staff'
                        ? 'Health Center Staff'
                        : 'Student Profile'}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded capitalize shrink-0 ${
                    user.role === 'admin'
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : user.role === 'staff'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                  }`}
                >
                  {user.role}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-3.5">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-2 text-[11px] text-slate-400 font-medium uppercase tracking-wider absolute">
            or continue with email
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {isSignUp && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jordan Smith"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Account Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['student', 'staff'] as UserRole[]).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className={`py-1.5 text-xs font-bold rounded-lg border capitalize transition-all ${
                        selectedRole === role
                          ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {role === 'staff' ? 'Clinic Staff / Nurse' : 'Campus Student'}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  * Administrator access is restricted and managed via the dedicated Admin Portal in the footer.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Campus Location / Dorm</label>
                <input
                  type="text"
                  value={dormLocation}
                  onChange={(e) => setDormLocation(e.target.value)}
                  placeholder="e.g. North Hall, Room 201"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Campus Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@campus.edu"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer switch */}
        <div className="mt-4 pt-3 border-t border-slate-100 text-center text-xs text-slate-600">
          {isSignUp ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="font-bold text-cyan-600 hover:underline"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="font-bold text-cyan-600 hover:underline"
              >
                Register
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
