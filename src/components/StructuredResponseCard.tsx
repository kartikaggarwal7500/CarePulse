import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Volume2,
  VolumeX,
  PhoneCall,
  MapPin,
  Stethoscope,
  Sparkles,
  Share2
} from 'lucide-react';
import { StructuredAIResponse } from '../types';
import { SpeechService } from '../services/speech';

interface StructuredResponseCardProps {
  data: StructuredAIResponse;
  onOpenSos: () => void;
  onContactHealth: () => void;
  onFindNearby: () => void;
  onShare?: () => void;
}

export const StructuredResponseCard: React.FC<StructuredResponseCardProps> = ({
  data,
  onOpenSos,
  onContactHealth,
  onFindNearby,
  onShare,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);

  const getSeverityBadge = () => {
    switch (data.severity) {
      case 'critical':
        return {
          bg: 'bg-red-50 text-red-700 border-red-200',
          label: 'CRITICAL / URGENT',
          dot: 'bg-red-500 animate-ping',
        };
      case 'high':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          label: 'HIGH ATTENTION',
          dot: 'bg-rose-500',
        };
      case 'moderate':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          label: 'MODERATE CARE',
          dot: 'bg-amber-500',
        };
      default:
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          label: 'FIRST AID / SELF-CARE',
          dot: 'bg-emerald-500',
        };
    }
  };

  const severityInfo = getSeverityBadge();

  const handleToggleSpeech = () => {
    if (isPlayingAudio) {
      SpeechService.stop();
      setIsPlayingAudio(false);
    } else {
      const speechText = `Situation: ${data.situationTitle}. Immediate steps: ${data.immediateSteps.join(
        '. '
      )}. Warning signs: ${data.warningSigns.join('. ')}. ${data.whenToSeekHelp}`;
      setIsPlayingAudio(true);
      SpeechService.speak(speechText, () => {
        setIsPlayingAudio(false);
      });
    }
  };

  return (
    <div
      role="article"
      aria-label={`First Aid Guidance: ${data.situationTitle}`}
      className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden transition-all text-slate-800"
    >
      {/* Header bar */}
      <div className="p-4 border-b border-slate-100 bg-slate-50">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${severityInfo.bg}`}
            >
              <span className={`w-2 h-2 rounded-full ${severityInfo.dot}`} />
              {severityInfo.label}
            </span>
            {data.source === 'gemini' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-700 bg-white px-2 py-0.5 rounded border border-cyan-200">
                <Sparkles className="w-3 h-3 text-cyan-600" />
                AI Verified
              </span>
            )}
          </div>

          {/* TTS Audio narration button */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleToggleSpeech}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                isPlayingAudio
                  ? 'bg-cyan-600 text-white animate-pulse'
                  : 'bg-white hover:bg-cyan-50 text-slate-700 border border-slate-200'
              }`}
              aria-label={isPlayingAudio ? 'Stop voice reading' : 'Read guidance aloud'}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Stop Voice</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Read Aloud</span>
                </>
              )}
            </button>

            {onShare && (
              <button
                onClick={onShare}
                className="p-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors"
                aria-label="Share guidance"
                title="Share Guide"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <h3 className="mt-2 text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          {data.situationTitle}
        </h3>
        {data.summary && (
          <p className="mt-0.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
            {data.summary}
          </p>
        )}
      </div>

      <div className="p-4 space-y-3.5">
        {/* Section 1: Immediate Steps */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-600" />
              <span>Immediate First-Aid Steps</span>
            </h4>
            <span className="text-[11px] font-medium text-slate-500">
              {data.immediateSteps.length} Steps
            </span>
          </div>

          <div className="space-y-1.5">
            {data.immediateSteps.map((step, idx) => (
              <div
                key={idx}
                onClick={() => setActiveStepIndex(activeStepIndex === idx ? null : idx)}
                className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-start gap-2.5 ${
                  activeStepIndex === idx
                    ? 'bg-cyan-50 border-cyan-300'
                    : 'bg-slate-50 border-slate-200 hover:bg-cyan-50/50 hover:border-cyan-200'
                }`}
              >
                <span className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-cyan-600 text-white font-bold text-xs">
                  {idx + 1}
                </span>
                <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed flex-1">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Things to Avoid */}
        {data.thingsToAvoid && data.thingsToAvoid.length > 0 && (
          <div className="rounded-lg p-3 bg-amber-50 border border-amber-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5 mb-1.5">
              <XCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Things to Avoid (Do Not Do)</span>
            </h4>
            <ul className="space-y-1">
              {data.thingsToAvoid.map((avoid, idx) => (
                <li
                  key={idx}
                  className="text-xs sm:text-sm text-amber-900 flex items-start gap-2"
                >
                  <span className="text-amber-600 font-bold shrink-0">•</span>
                  <span>{avoid}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Section 3: Warning Signs */}
        {data.warningSigns && data.warningSigns.length > 0 && (
          <div className="rounded-lg p-3 bg-rose-50 border border-rose-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5 mb-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Red Flags & Warning Signs</span>
            </h4>
            <ul className="space-y-1">
              {data.warningSigns.map((sign, idx) => (
                <li
                  key={idx}
                  className="text-xs sm:text-sm text-rose-950 flex items-start gap-2"
                >
                  <span className="text-rose-600 font-bold shrink-0">!</span>
                  <span>{sign}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Section 4: When to Seek Professional Help */}
        {data.whenToSeekHelp && (
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5">
            <Stethoscope className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              <strong className="text-slate-900 block font-bold mb-0.5">
                When to Seek Medical Care:
              </strong>
              {data.whenToSeekHelp}
            </div>
          </div>
        )}

        {/* Section 5: Action Buttons */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenSos}
            className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold shadow-xs transition-all"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Emergency Help</span>
          </button>

          <button
            onClick={onContactHealth}
            className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 active:scale-95 text-white text-xs font-bold shadow-xs transition-all"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Campus Health</span>
          </button>

          <button
            onClick={onFindNearby}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
          >
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span>Find Nearby</span>
          </button>
        </div>

        {/* Disclaimer footer */}
        <p className="text-[11px] text-slate-500 text-center italic border-t border-slate-100 pt-2">
          {data.disclaimer}
        </p>
      </div>
    </div>
  );
};
