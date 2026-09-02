import React from 'react';
import {
  Eye,
  Type,
  Volume2,
  Languages,
  X
} from 'lucide-react';
import { AccessibilitySettings, LanguageCode } from '../types';
import { LANGUAGES } from '../data/firstAidData';

interface AccessibilityPanelProps {
  settings: AccessibilitySettings;
  onUpdateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({
  settings,
  onUpdateSettings,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
    >
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-800 relative overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 id="accessibility-title" className="text-base sm:text-lg font-black text-slate-900">
                Accessibility Preferences
              </h3>
              <p className="text-xs text-slate-500">
                Customize readability, audio assistance, and contrast.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label="Close accessibility modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-5">
          {/* Text Size */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-2">
              <Type className="w-4 h-4 text-cyan-600" />
              <span>Typography & Text Sizing</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'normal', label: 'Default', desc: '14-16px' },
                { id: 'large', label: 'Large', desc: '18px' },
                { id: 'xlarge', label: 'Extra Large', desc: '20px+' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onUpdateSettings({ textSize: opt.id as any })}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    settings.textSize === opt.id
                      ? 'bg-cyan-50 border-cyan-500 text-cyan-800 shadow-2xs font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold block">{opt.label}</span>
                  <span className="text-[10px] text-slate-400">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* High Contrast Mode */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-2">
              <Eye className="w-4 h-4 text-indigo-600" />
              <span>Color Contrast Level</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onUpdateSettings({ contrast: 'normal' })}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  settings.contrast === 'normal'
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-2xs font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="text-xs font-bold block">Normal Contrast</span>
                <span className="text-[10px] text-slate-500">Standard clean light palette</span>
              </button>

              <button
                onClick={() => onUpdateSettings({ contrast: 'high' })}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  settings.contrast === 'high'
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-2xs font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="text-xs font-bold block">High Contrast (AAA)</span>
                <span className="text-[10px] text-slate-500">Maximum border & text definition</span>
              </button>
            </div>
          </div>

          {/* Voice Assistance */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Voice Speech Assistance
                </span>
                <span className="text-[11px] text-slate-500">
                  Read first-aid steps aloud during emergencies
                </span>
              </div>
            </div>

            <button
              onClick={() => onUpdateSettings({ voiceAssistance: !settings.voiceAssistance })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.voiceAssistance ? 'bg-cyan-600' : 'bg-slate-300'
              }`}
              aria-label="Toggle voice assistance"
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  settings.voiceAssistance ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Language Selection */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-1.5">
              <Languages className="w-4 h-4 text-cyan-600" />
              <span>Primary Translation Language</span>
            </label>
            <select
              value={settings.selectedLanguage}
              onChange={(e) => onUpdateSettings({ selectedLanguage: e.target.value as LanguageCode })}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-cyan-500/30 cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs sm:text-sm font-bold shadow-2xs transition-colors"
          >
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
};
