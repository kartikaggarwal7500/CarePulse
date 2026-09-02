import React from 'react';
import { AlertCircle, PhoneCall, ShieldAlert, ChevronRight, X } from 'lucide-react';

interface DisclaimerCardProps {
  compact?: boolean;
  onOpenSos?: () => void;
}

export const DisclaimerCard: React.FC<DisclaimerCardProps> = ({ compact = false, onOpenSos }) => {
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed && compact) return null;

  return (
    <div
      role="region"
      aria-label="Medical and Emergency Disclaimer"
      className={`rounded-xl border transition-all ${
        compact
          ? 'bg-amber-50 border-amber-200 p-3'
          : 'bg-amber-50 border-amber-200 p-4 sm:p-5 shadow-xs'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700 shrink-0 mt-0.5">
          <AlertCircle className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-xs sm:text-sm font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
              <span>Emergency & Medical Disclaimer</span>
            </h4>
            {compact && (
              <button
                onClick={() => setDismissed(true)}
                className="text-slate-400 hover:text-slate-600 p-1"
                aria-label="Dismiss disclaimer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-700 leading-relaxed">
            CarePulse is an <strong>educational first-aid and safety guidance companion</strong>, NOT a doctor, medical diagnosis tool, or replacement for emergency services.
            For severe injuries, chest pain, choking, or life-threatening hazards, immediately contact local emergency dispatch (<strong>911 / 112</strong>) or campus security.
          </p>
          {!compact && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <a
                href="tel:911"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition-colors"
                aria-label="Call 911 Emergency Services"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call 911 (Emergency)</span>
              </a>
              {onOpenSos && (
                <button
                  onClick={onOpenSos}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold transition-colors"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Campus SOS Alert</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
