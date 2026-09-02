import React, { useState } from 'react';
import {
  Sparkles,
  Mic,
  Image as ImageIcon,
  Send,
  ShieldAlert,
  PhoneCall,
  Flame,
  Droplets,
  Activity,
  HeartPulse,
  Wind,
  Bandage,
  ChevronRight,
  Zap,
  Camera,
  ArrowRight,
  ShieldCheck,
  Search,
  MapPin,
  Megaphone
} from 'lucide-react';
import { AppScreen, CampusAdvisory } from '../types';
import { DisclaimerCard } from './DisclaimerCard';
import { VoiceRecorder } from './VoiceRecorder';
import { ImageUploader } from './ImageUploader';

interface HomeDashboardProps {
  onNavigate: (screen: AppScreen, params?: any) => void;
  onOpenSos: () => void;
  onOpenVoice: () => void;
  selectedLanguageName: string;
  activeAdvisories?: CampusAdvisory[];
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigate,
  onOpenSos,
  selectedLanguageName,
  activeAdvisories = [],
}) => {
  const [promptInput, setPromptInput] = useState('');
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const handleStartSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (promptInput.trim()) {
      onNavigate('chat', { prompt: promptInput.trim() });
    }
  };

  const handlePromptChip = (text: string) => {
    onNavigate('chat', { prompt: text });
  };

  const handleVoiceTranscribed = (text: string) => {
    setShowVoiceModal(false);
    if (text.trim()) {
      onNavigate('chat', { prompt: text.trim() });
    }
  };

  const handleImageUploaded = (base64: string, promptText?: string) => {
    setShowImageModal(false);
    onNavigate('chat', {
      prompt: promptText || 'Please assess this condition and provide structured first aid steps.',
      image: base64,
    });
  };

  const quickProtocols = [
    {
      id: 'wounds-cut',
      title: 'Wounds & Cuts',
      icon: <Bandage className="w-4 h-4 text-cyan-600" />,
      desc: 'Clean, disinfect & bandage wounds',
      badge: 'Step-by-Step',
    },
    {
      id: 'burns-thermal',
      title: 'Thermal Burns',
      icon: <Flame className="w-4 h-4 text-rose-600" />,
      desc: 'Cool water flush & protection',
      badge: 'Immediate',
    },
    {
      id: 'bleeding-severe',
      title: 'Heavy Bleeding',
      icon: <Droplets className="w-4 h-4 text-red-600" />,
      desc: 'Direct pressure & elevation',
      badge: 'High Priority',
    },
    {
      id: 'sprain-strain',
      title: 'Sprains & Strains',
      icon: <Activity className="w-4 h-4 text-amber-600" />,
      desc: 'R.I.C.E. protocol & support',
      badge: 'Care Guide',
    },
    {
      id: 'fainting-syncope',
      title: 'Fainting & Dizziness',
      icon: <HeartPulse className="w-4 h-4 text-purple-600" />,
      desc: 'Recovery position & airflow',
      badge: 'Vital Check',
    },
    {
      id: 'choking-airway',
      title: 'Choking Relief',
      icon: <Wind className="w-4 h-4 text-indigo-600" />,
      desc: 'Back blows & abdominal thrusts',
      badge: 'Airway',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-4 pb-12 animate-fadeIn">
      {/* 1. Active Campus Advisory Banner (if active) */}
      {activeAdvisories.filter((a) => a.active).map((adv) => (
        <div
          key={adv.id}
          className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
            adv.level === 'danger'
              ? 'bg-rose-50 border-rose-300 text-rose-950'
              : adv.level === 'warning'
              ? 'bg-amber-50 border-amber-300 text-amber-950'
              : 'bg-cyan-50 border-cyan-300 text-cyan-950'
          }`}
        >
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 shrink-0 text-cyan-700" />
            <div>
              <strong className="font-bold mr-1.5">{adv.title}:</strong>
              <span>{adv.message}</span>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/80 shrink-0">
            {adv.location || 'Campus Wide'}
          </span>
        </div>
      ))}

      {/* 2. Top Emergency Action Strip (Compact, High-Contrast) */}
      <div className="p-2.5 sm:p-3 rounded-xl bg-red-600 text-white shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-xs sm:text-sm font-bold tracking-tight">
            Urgent Assistance:
          </span>
          <span className="text-[11px] text-white/90 hidden md:inline">
            Severe trauma, chest pain, or life-threatening emergency? Call immediately.
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <a
            href="tel:911"
            className="px-2.5 py-1 rounded-lg bg-white text-red-700 hover:bg-red-50 text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
          >
            <PhoneCall className="w-3 h-3 fill-current" />
            <span>Dial 911</span>
          </a>
          <button
            onClick={onOpenSos}
            className="px-2.5 py-1 rounded-lg bg-red-800 hover:bg-red-900 text-white text-xs font-bold border border-white/20 transition-colors shadow-2xs"
          >
            Campus SOS
          </button>
        </div>
      </div>

      {/* 3. Emergency-First Triage Search Card (Minimal Vertical Footprint, Visually Distinct) */}
      <div className="rounded-xl p-4 sm:p-5 bg-white border border-slate-300 text-slate-800 shadow-xs relative">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold text-slate-900">
                First-Aid Triage & Guidance
              </span>
              <span className="text-[10px] font-semibold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                {selectedLanguageName}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Voice, text, or photo assessment
            </span>
          </div>

          {/* Streamlined Multimodal Input Form */}
          <form
            onSubmit={handleStartSearch}
            className="flex items-center gap-1.5"
          >
            <div className="relative flex-1 bg-slate-50 rounded-lg border-2 border-slate-300 focus-within:border-cyan-600 focus-within:bg-white transition-all flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Describe condition (e.g. cut finger with glass, thermal burn, twisted ankle)..."
                className="w-full pl-8 pr-16 py-2 bg-transparent text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-hidden"
              />

              {/* In-Input Quick Action Icons */}
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowVoiceModal(true)}
                  className="p-1 rounded text-slate-600 hover:text-cyan-700 hover:bg-slate-200 transition-colors"
                  title="Voice input"
                  aria-label="Speak your emergency concern"
                >
                  <Mic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowImageModal(true)}
                  className="p-1 rounded text-slate-600 hover:text-cyan-700 hover:bg-slate-200 transition-colors"
                  title="Upload photo"
                  aria-label="Upload photo of emergency or hazard"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-1 shrink-0"
            >
              <span>Triage</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Scenario Chips (Tight spacing) */}
          <div className="flex flex-wrap items-center gap-1 text-xs pt-0.5">
            <span className="text-slate-500 text-[11px] font-semibold mr-1">Quick:</span>
            {[
              'Bleeding cut',
              'Hot water burn',
              'Fainting / dizziness',
              'Twisted ankle',
              'Choking',
              'Chemical splash',
            ].map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handlePromptChip(prompt)}
                className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-cyan-50 text-slate-700 hover:text-cyan-800 text-[11px] font-medium border border-slate-200 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Immediate First-Aid Protocols (High-Density 6-Grid) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700">
            Emergency Care Protocols
          </h2>
          <button
            onClick={() => onNavigate('library')}
            className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-0.5"
          >
            <span>All Protocols</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {quickProtocols.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('library', { guideId: cat.id })}
              className="p-2.5 rounded-lg border border-slate-200 bg-white shadow-2xs hover:border-cyan-400 hover:bg-cyan-50/20 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {cat.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-cyan-700 truncate">
                      {cat.title}
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">
                    {cat.desc}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 shrink-0 ml-1" />
            </div>
          ))}
        </div>
      </div>

      {/* 5. Direct Action Duo: Hazard Scanner & Emergency Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Physical Hazard Scanner Box */}
        <div className="rounded-xl p-3.5 bg-white border border-slate-200 shadow-2xs flex flex-col justify-between space-y-2">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-indigo-600" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  Environmental Hazard Scanner
                </h3>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700">
                AI Vision
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Identify electrical sparks, chemical leaks, or physical tripping hazards.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => onNavigate('scanner')}
              className="flex-1 py-1.5 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Scan Hazard</span>
            </button>
            <button
              onClick={() => onNavigate('scanner', { tab: 'report' })}
              className="py-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              Report Incident
            </button>
          </div>
        </div>

        {/* Emergency Contacts Direct Lines */}
        <div className="rounded-xl p-3.5 bg-white border border-slate-200 shadow-2xs flex flex-col justify-between space-y-2">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-cyan-600" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  24/7 Campus Emergency Lines
                </h3>
              </div>
              <button
                onClick={() => onNavigate('contacts')}
                className="text-xs font-bold text-cyan-600 hover:text-cyan-700"
              >
                Directory
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Direct connection to campus security and student health triage.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href="tel:5550199110"
              className="p-2 rounded-lg bg-slate-50 hover:bg-cyan-50 border border-slate-200 flex items-center gap-2 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-600 shrink-0" />
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-900 block truncate">Campus Police</span>
                <span className="text-[10px] text-slate-500">24/7 Desk</span>
              </div>
            </a>

            <a
              href="tel:5550194325"
              className="p-2 rounded-lg bg-slate-50 hover:bg-cyan-50 border border-slate-200 flex items-center gap-2 transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-900 block truncate">Health Clinic</span>
                <span className="text-[10px] text-slate-500">Urgent Nurse</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* 6. Educational Medical Disclaimer (Compact) */}
      <DisclaimerCard compact={true} onOpenSos={onOpenSos} />

      {/* Modals for Voice & Image */}
      {showVoiceModal && (
        <VoiceRecorder
          isOpen={showVoiceModal}
          onTranscribe={handleVoiceTranscribed}
          onCancel={() => setShowVoiceModal(false)}
        />
      )}

      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md relative">
            <ImageUploader
              onAnalyzeImage={handleImageUploaded}
              isLoading={false}
              onClose={() => setShowImageModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
