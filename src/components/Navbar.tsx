import React from 'react';
import { AppScreen, LanguageCode, AuthUser } from '../types';
import { LANGUAGES } from '../data/firstAidData';
import {
  Sparkles,
  ShieldAlert,
  Sliders,
  Sun,
  Moon,
  BookOpen,
  Camera,
  PhoneCall,
  User,
  MessageSquare,
  Home,
  ShieldCheck,
  LogIn,
  LogOut,
  Calendar
} from 'lucide-react';

interface NavbarProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  onOpenSos: () => void;
  onOpenAccessibility: () => void;
  selectedLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  currentUser: AuthUser | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  onOpenSos,
  onOpenAccessibility,
  selectedLanguage,
  onSelectLanguage,
  isDarkMode,
  onToggleTheme,
  currentUser,
  onOpenAuth,
  onSignOut,
}) => {
  const navItems: { id: AppScreen; label: string; icon: any }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'chat', label: 'AI Assistant', icon: MessageSquare },
    { id: 'library', label: 'First Aid', icon: BookOpen },
    { id: 'bookings', label: 'Clinic Bookings', icon: Calendar },
    { id: 'scanner', label: 'Hazard Scanner', icon: Camera },
    { id: 'contacts', label: 'Contacts', icon: PhoneCall },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand & Tagline */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-600 text-white flex items-center justify-center shadow-xs group-hover:bg-cyan-700 transition-colors">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold tracking-tight text-slate-900">
                CarePulse
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-cyan-50 text-cyan-700 border border-cyan-200">
                Safety
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white text-cyan-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Utility Controls & Auth */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Multilingual Selector */}
          <div className="relative hidden xl:flex items-center">
            <select
              value={selectedLanguage}
              onChange={(e) => onSelectLanguage(e.target.value as LanguageCode)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold px-2 py-1.5 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-cyan-500/30 cursor-pointer"
              aria-label="Select application language"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* Accessibility Settings Button */}
          <button
            onClick={onOpenAccessibility}
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
            title="Accessibility Settings"
            aria-label="Accessibility Settings"
          >
            <Sliders className="w-4 h-4 text-cyan-600" />
          </button>

          {/* Dark/Light Mode Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle dark and light theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Auth Button / User Profile Pill */}
          {currentUser ? (
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-1 rounded-lg">
              <button
                onClick={() => onNavigate('profile')}
                className="flex items-center gap-1.5 px-2 py-0.5 text-xs font-bold text-slate-800 hover:text-cyan-700"
                title={`Logged in as ${currentUser.name} (${currentUser.role})`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-bold ${
                    currentUser.role === 'admin'
                      ? 'bg-indigo-600'
                      : currentUser.role === 'staff'
                      ? 'bg-emerald-600'
                      : 'bg-cyan-600'
                  }`}
                >
                  {currentUser.name.charAt(0)}
                </div>
                <span className="hidden sm:inline max-w-[90px] truncate">{currentUser.name}</span>
                <span
                  className={`text-[9px] uppercase font-bold px-1 rounded ${
                    currentUser.role === 'admin'
                      ? 'bg-indigo-100 text-indigo-700'
                      : currentUser.role === 'staff'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-cyan-100 text-cyan-700'
                  }`}
                >
                  {currentUser.role}
                </span>
              </button>
              <button
                onClick={onSignOut}
                className="p-1 text-slate-400 hover:text-red-600 rounded"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Emergency SOS Button */}
          <button
            onClick={onOpenSos}
            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1"
            aria-label="Emergency SOS button"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>SOS</span>
          </button>
        </div>
      </div>
    </header>
  );
};

