import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Lock,
  PhoneCall,
  Calendar,
  BookOpen,
  Camera,
  HeartPulse,
  ExternalLink,
  ChevronRight,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { AppScreen, AuthUser } from '../types';
import { isMasterAdminSlotAvailable, getMasterAdminLocal } from '../data/adminAuth';

interface FooterProps {
  onNavigate: (screen: AppScreen) => void;
  onOpenSos: () => void;
  onOpenAccessibility: () => void;
  onOpenAdminAuth: () => void;
  currentUser: AuthUser | null;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenSos,
  onOpenAccessibility,
  onOpenAdminAuth,
  currentUser,
}) => {
  const [adminSlotAvail, setAdminSlotAvail] = useState<boolean>(isMasterAdminSlotAvailable());
  const masterAdmin = getMasterAdminLocal();

  useEffect(() => {
    setAdminSlotAvail(isMasterAdminSlotAvailable());
  }, [currentUser]);

  const handleAdminClick = () => {
    if (currentUser && currentUser.role === 'admin') {
      onNavigate('admin');
    } else {
      onOpenAdminAuth();
    }
  };

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white text-slate-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-8 border-b border-slate-100">
          {/* Brand & Purpose */}
          <div className="lg:col-span-4 space-y-3">
            <div
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-cyan-600 text-white flex items-center justify-center shadow-xs group-hover:bg-cyan-700 transition-colors">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-slate-900">
                  CarePulse
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-cyan-50 text-cyan-700 border border-cyan-200">
                  Campus Safety
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              An accessible, intelligent campus first-aid and safety platform providing multimodal emergency guidance, instant SOS dispatch coordination, and clinic appointment bookings.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={onOpenSos}
                className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Emergency SOS Dispatch</span>
              </button>
              <button
                onClick={onOpenAccessibility}
                className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-600" />
                <span>Accessibility</span>
              </button>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-3 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Campus Safety Services
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-slate-600 hover:text-cyan-700 transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span>Interactive Emergency Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('bookings')}
                  className="text-slate-600 hover:text-cyan-700 transition-colors flex items-center gap-1 font-semibold text-cyan-700"
                >
                  <ChevronRight className="w-3 h-3 text-cyan-600" />
                  <span>Book Clinic & Triage Appointments</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('library')}
                  className="text-slate-600 hover:text-cyan-700 transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span>First-Aid Visual Protocols</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('scanner')}
                  className="text-slate-600 hover:text-cyan-700 transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span>Hazard & Defibrillator Scanner</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contacts')}
                  className="text-slate-600 hover:text-cyan-700 transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span>24/7 Campus Emergency Lines</span>
                </button>
              </li>
            </ul>
          </div>

          {/* 24/7 Helplines */}
          <div className="lg:col-span-2 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Emergency Hotlines
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Campus Police</span>
                <a href="tel:5550199110" className="font-bold text-slate-900 hover:text-cyan-700">
                  (555) 019-9110
                </a>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Student Health</span>
                <a href="tel:5550194325" className="font-bold text-slate-900 hover:text-cyan-700">
                  (555) 019-4325
                </a>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Poison Control</span>
                <a href="tel:18002221222" className="font-bold text-slate-900 hover:text-cyan-700">
                  1-800-222-1222
                </a>
              </div>
            </div>
          </div>

          {/* Dedicated Admin Portal Access in Footer */}
          <div className="lg:col-span-3 space-y-2.5 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Admin Portal</span>
              </h4>
              {adminSlotAvail ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  1 Slot Open
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center gap-0.5">
                  <Lock className="w-2.5 h-2.5" />
                  Locked
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-600 leading-normal">
              Manage website bookings, review triage appointments, handle live SOS dispatches, and broadcast safety advisories.
            </p>

            {/* Admin Slot Status & Trigger Button */}
            <div className="pt-1">
              <button
                id="footer-admin-btn"
                type="button"
                onClick={handleAdminClick}
                className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                {currentUser?.role === 'admin' ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Open Admin Panel</span>
                  </>
                ) : adminSlotAvail ? (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Admin Setup (Claim 1 Slot) / Sign In</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Admin Sign In</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-slate-400 text-center mt-1.5">
                {adminSlotAvail
                  ? '⚡ Single administrator registration slot is available.'
                  : '🔒 Master admin configured. Additional registrations blocked.'}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <p>© 2026 CarePulse Campus First-Aid & Safety. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Medical Triage Protocol v4.2</span>
            <span>•</span>
            <span className="text-slate-500">For life-threatening emergencies, always dial 911.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
