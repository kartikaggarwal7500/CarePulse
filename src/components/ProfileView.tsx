import React, { useState } from 'react';
import {
  HeartPulse,
  PhoneCall,
  Save,
  CheckCircle2,
  Sliders,
  Sparkles,
  ShieldCheck,
  LogOut,
  LogIn,
  User,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { UserProfile, AccessibilitySettings, AuthUser } from '../types';
import { DisclaimerCard } from './DisclaimerCard';

interface ProfileViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  accessibilitySettings: AccessibilitySettings;
  onOpenAccessibilityModal: () => void;
  currentUser: AuthUser | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  onUpdateProfile,
  accessibilitySettings,
  onOpenAccessibilityModal,
  currentUser,
  onOpenAuth,
  onSignOut,
}) => {
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (field: keyof UserProfile, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-12 animate-fadeIn">
      {/* Header Profile Hero */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white text-slate-900 shadow-xs border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl text-white font-black text-lg flex items-center justify-center shadow-xs ${
              currentUser?.role === 'admin'
                ? 'bg-indigo-600'
                : currentUser?.role === 'staff'
                ? 'bg-emerald-600'
                : 'bg-cyan-600'
            }`}
          >
            {currentUser?.name.charAt(0) || formData.name.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {currentUser?.name || formData.name || 'Campus Student'}
              </h2>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                  currentUser?.role === 'admin'
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                    : currentUser?.role === 'staff'
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    : 'bg-cyan-100 text-cyan-700 border border-cyan-200'
                }`}
              >
                {currentUser?.role || 'Guest'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {currentUser?.email || 'Guest Session'} • {formData.dormLocation || 'West Hall'}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {currentUser ? (
            <button
              type="button"
              onClick={onSignOut}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 text-xs font-bold border border-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Switch Account</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenAccessibilityModal}
            className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-600" />
            <span>Accessibility</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2.5 animate-fadeIn text-xs sm:text-sm font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Emergency medical profile saved securely on this device!</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Section: Medical & Allergy Info */}
        <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900 pb-2 border-b border-slate-100">
            <HeartPulse className="w-4 h-4 text-red-500" />
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800">
              Emergency Medical Information (For Responders)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Blood Group
              </label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => handleChange('bloodGroup', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-cyan-500/20 cursor-pointer"
              >
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'Unknown'].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Campus Dorm / Location
              </label>
              <input
                type="text"
                value={formData.dormLocation}
                onChange={(e) => handleChange('dormLocation', e.target.value)}
                placeholder="e.g. STEM Dorm B, Room 214"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Known Allergies (Penicillin, Peanuts, Latex, etc.)
            </label>
            <input
              type="text"
              value={formData.allergies}
              onChange={(e) => handleChange('allergies', e.target.value)}
              placeholder="e.g. Mild Penicillin allergy, seasonal pollen"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Emergency Medical Notes / Conditions
            </label>
            <textarea
              rows={2}
              value={formData.medicalNotes}
              onChange={(e) => handleChange('medicalNotes', e.target.value)}
              placeholder="e.g. Mild asthma (uses inhaler during sport), contact lenses."
              className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-cyan-500/20 resize-none"
            />
          </div>
        </div>

        {/* Section: Primary Trusted Emergency Contact */}
        <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900 pb-2 border-b border-slate-100">
            <PhoneCall className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800">
              Designated Emergency Contact
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contact Name & Relation
              </label>
              <input
                type="text"
                value={formData.primaryEmergencyContact}
                onChange={(e) => handleChange('primaryEmergencyContact', e.target.value)}
                placeholder="e.g. Sarah Rivera (Parent / Guardian)"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contact Phone Number
              </label>
              <input
                type="tel"
                value={formData.primaryEmergencyPhone}
                onChange={(e) => handleChange('primaryEmergencyPhone', e.target.value)}
                placeholder="e.g. (555) 019-2424"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs sm:text-sm shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Settings</span>
          </button>
        </div>
      </form>

      {/* Required Disclaimer */}
      <DisclaimerCard compact={true} />

      {/* About CarePulse */}
      <div className="p-3.5 rounded-xl border border-slate-200 bg-white text-center space-y-0.5 shadow-2xs">
        <div className="inline-flex items-center gap-1 text-slate-900 font-bold text-xs">
          <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
          <span>CarePulse • Multimodal First-Aid & Campus Safety Companion</span>
        </div>
        <p className="text-[11px] text-slate-500">
          Fast Guidance. Safer Decisions.
        </p>
      </div>
    </div>
  );
};
