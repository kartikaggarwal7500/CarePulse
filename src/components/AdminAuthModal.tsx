import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  Mail,
  User,
  Building,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { AuthUser } from '../types';
import {
  getMasterAdminLocal,
  fetchMasterAdmin,
  isMasterAdminSlotAvailable,
  registerMasterAdmin,
  authenticateAdmin,
  adminToAuthUser,
  resetMasterAdminSlot
} from '../data/adminAuth';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminAuthenticated: (user: AuthUser) => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onAdminAuthenticated,
}) => {
  const [slotAvailable, setSlotAvailable] = useState<boolean>(isMasterAdminSlotAvailable());
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDepartment, setRegDepartment] = useState('Campus Safety & Health Administration');
  const [regBadge, setRegBadge] = useState('ADM-2026-01');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Status/Error Messages
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sync slot status whenever modal opens
  useEffect(() => {
    if (isOpen) {
      const checkSlot = async () => {
        const master = await fetchMasterAdmin();
        const isAvail = master === null;
        setSlotAvailable(isAvail);
        setErrorMessage(null);
        setSuccessMessage(null);
        if (isAvail) {
          setActiveTab('register');
        } else {
          setActiveTab('login');
          if (master) {
            setLoginEmail(master.email);
          }
        }
      };
      checkSlot();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const result = await registerMasterAdmin({
      name: regName,
      email: regEmail,
      password: regPassword,
      department: regDepartment,
      badgeNumber: regBadge,
    });
    setIsLoading(false);

    if (result.success && result.admin) {
      setSuccessMessage('Master Administrator Account successfully registered! Slot is now secured.');
      setSlotAvailable(false);
      setTimeout(() => {
        onAdminAuthenticated(adminToAuthUser(result.admin!));
        onClose();
      }, 1000);
    } else {
      setErrorMessage(result.error || 'Failed to create master admin account.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const result = await authenticateAdmin(loginEmail, loginPassword);
    setIsLoading(false);
    if (result.success && result.admin) {
      setSuccessMessage('Administrator authenticated successfully. Launching portal...');
      setTimeout(() => {
        onAdminAuthenticated(adminToAuthUser(result.admin!));
        onClose();
      }, 700);
    } else {
      setErrorMessage(result.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  const handleResetSlotDev = async () => {
    if (window.confirm('Reset the master administrator slot? This will allow registering a new single admin account.')) {
      await resetMasterAdminSlot();
      setSlotAvailable(true);
      setActiveTab('register');
      setErrorMessage(null);
      setSuccessMessage('Admin slot has been cleared and is now available for registration.');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-auth-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn"
    >
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden text-slate-800 max-h-[92vh] overflow-y-auto">
        {/* Top security stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-indigo-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Close admin modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Slot Badge */}
        <div className="text-center pt-2 pb-4">
          <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-2.5 shadow-xs border border-indigo-100">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <div className="inline-flex items-center gap-1.5 mb-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
            {slotAvailable ? (
              <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Single Admin Slot Available (1 of 1 Slot)
              </span>
            ) : (
              <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Lock className="w-3 h-3 text-indigo-600" />
                Master Admin Slot Claimed & Locked
              </span>
            )}
          </div>

          <h2 id="admin-auth-title" className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Campus Safety & Health Admin Portal
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-sm mx-auto">
            Authorized administrative access for managing campus bookings, emergency SOS dispatches, and hazard reports.
          </p>
        </div>

        {/* Navigation Tabs (Register Slot vs Login) */}
        <div className="flex rounded-xl bg-slate-100 p-1 mb-4 border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Admin Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (slotAvailable) {
                setActiveTab('register');
                setErrorMessage(null);
              }
            }}
            disabled={!slotAvailable}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'register'
                ? 'bg-white text-indigo-900 shadow-xs'
                : slotAvailable
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 cursor-not-allowed opacity-60'
            }`}
            title={slotAvailable ? 'Claim the single admin account slot' : 'Admin slot already claimed'}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Create Admin (1 Slot)</span>
            {!slotAvailable && <Lock className="w-3 h-3 ml-0.5 text-slate-400" />}
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs font-semibold flex items-start gap-2 animate-fadeIn">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* TAB: Admin Login */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Administrator Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@campus-safety.edu"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Master Admin Password
                </label>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Quick Demo Credentials Info */}
            <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-indigo-900 text-[11px] space-y-1">
              <div className="font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Default Initial Master Administrator Credentials:</span>
              </div>
              <div className="text-slate-600">
                Email: <span className="font-mono font-bold text-slate-800">m.chen@campus-safety.edu</span> • Pass: <span className="font-mono font-bold text-slate-800">admin123</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLoginEmail('m.chen@campus-safety.edu');
                  setLoginPassword('admin123');
                }}
                className="text-xs font-bold text-indigo-700 hover:underline pt-0.5 block"
              >
                Auto-fill demo credentials
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Sign In to Admin Portal</span>
            </button>
          </form>
        )}

        {/* TAB: Register Single Master Admin Slot */}
        {activeTab === 'register' && (
          <div>
            {!slotAvailable ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <Lock className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800">Admin Account Slot Locked</h4>
                <p className="text-xs text-slate-500">
                  The single administrator slot has already been claimed. No additional admin accounts can be registered.
                </p>
                <button
                  onClick={() => setActiveTab('login')}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
                >
                  Go to Admin Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-3">
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Single Slot Policy:</strong> You are claiming the 1 master administrator slot. Once created, nobody else can register.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Admin Full Name
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Commander Marcus Chen"
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Official Campus Email
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="admin@campus-safety.edu"
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Master Password
                    </label>
                    <div className="relative">
                      <KeyRound className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Create strong admin password"
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Badge / Officer ID
                    </label>
                    <input
                      type="text"
                      value={regBadge}
                      onChange={(e) => setRegBadge(e.target.value)}
                      placeholder="e.g. ADM-2026-01"
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Department / Division
                  </label>
                  <div className="relative">
                    <Building className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={regDepartment}
                      onChange={(e) => setRegDepartment(e.target.value)}
                      placeholder="e.g. Campus Safety & Emergency Response Division"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Claim Slot & Create Master Admin Account</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Footer info & Dev Reset option */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Security Protocol 2026.04</span>
          <button
            type="button"
            onClick={handleResetSlotDev}
            className="hover:text-red-600 flex items-center gap-1 transition-colors"
            title="Clear saved master admin and reopen slot (for testing)"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Slot</span>
          </button>
        </div>
      </div>
    </div>
  );
};
