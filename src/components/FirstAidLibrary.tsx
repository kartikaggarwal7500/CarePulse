import React, { useState, useEffect } from 'react';
import {
  Search,
  Flame,
  Droplets,
  Activity,
  HeartPulse,
  Wind,
  AlertTriangle,
  Bandage,
  Thermometer,
  Sparkles,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  PhoneCall,
  Share2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Languages,
  X,
  BookOpen
} from 'lucide-react';
import { FIRST_AID_CATEGORIES, FIRST_AID_GUIDES, LANGUAGES } from '../data/firstAidData';
import { FirstAidGuide, LanguageCode } from '../types';
import { SpeechService } from '../services/speech';

interface FirstAidLibraryProps {
  onOpenSos: () => void;
  onContactHealth: () => void;
  selectedLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  initialGuideId?: string | null;
}

export const FirstAidLibrary: React.FC<FirstAidLibraryProps> = ({
  onOpenSos,
  onContactHealth,
  selectedLanguage,
  onSelectLanguage,
  initialGuideId = null,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeGuide, setActiveGuide] = useState<FirstAidGuide | null>(null);

  // Auto-open guide if initialGuideId provided
  useEffect(() => {
    if (initialGuideId) {
      const g = FIRST_AID_GUIDES.find((item) => item.id === initialGuideId);
      if (g) setActiveGuide(g);
    }
  }, [initialGuideId]);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bandage':
        return <Bandage className="w-4 h-4 text-cyan-600" />;
      case 'Flame':
        return <Flame className="w-4 h-4 text-rose-600" />;
      case 'Droplets':
        return <Droplets className="w-4 h-4 text-red-600" />;
      case 'Activity':
        return <Activity className="w-4 h-4 text-amber-600" />;
      case 'Thermometer':
        return <Thermometer className="w-4 h-4 text-orange-600" />;
      case 'HeartPulse':
        return <HeartPulse className="w-4 h-4 text-purple-600" />;
      case 'Wind':
        return <Wind className="w-4 h-4 text-indigo-600" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-cyan-600" />;
    }
  };

  const filteredGuides = FIRST_AID_GUIDES.filter((guide) => {
    const matchesCategory =
      selectedCategory === 'all' || guide.category === selectedCategory;
    const matchesSearch =
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.quickSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Header & Translation Bar (Clean Light Style) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-slate-50 text-slate-800 shadow-xs border border-slate-200 relative overflow-hidden">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-100 text-xs font-bold uppercase tracking-wider text-cyan-800 border border-cyan-200">
            <BookOpen className="w-3.5 h-3.5 text-cyan-600" />
            <span>Interactive First-Aid Library</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Verified Emergency Guides
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
            Step-by-step procedures, timing protocols, and critical warning signs translated into 9 Indian & global languages.
          </p>
        </div>

        {/* Translation Selector Pill */}
        <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-xs self-start md:self-auto">
          <Languages className="w-4 h-4 text-cyan-600 shrink-0 ml-1" />
          <span className="text-xs font-bold text-slate-700 whitespace-nowrap">
            Translate:
          </span>
          <select
            value={selectedLanguage}
            onChange={(e) => onSelectLanguage(e.target.value as LanguageCode)}
            className="bg-slate-50 text-slate-800 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-cyan-500/20 cursor-pointer"
            aria-label="Select translation language for first-aid guides"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name} ({lang.nativeName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-3.5">
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides (e.g. cut, burn, choking, nosebleed, sprain, fainting)..."
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-cyan-500/30 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {FIRST_AID_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {getCategoryIcon(cat.icon)}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Guides Grid (Clean Light Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGuides.map((guide) => {
          const trans =
            selectedLanguage !== 'en' && guide.translations?.[selectedLanguage]
              ? guide.translations[selectedLanguage]
              : null;
          const displayTitle = trans?.title || guide.title;
          const displaySummary = trans?.quickSummary || guide.quickSummary;

          return (
            <div
              key={guide.id}
              onClick={() => setActiveGuide(guide)}
              className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs hover:shadow-sm hover:border-cyan-400 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-50 text-slate-700 border border-slate-200">
                    {getCategoryIcon(guide.categoryIcon)}
                    <span>{guide.categoryLabel}</span>
                  </span>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                      guide.severity === 'critical'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : guide.severity === 'high'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : guide.severity === 'moderate'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {guide.severity}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                  {displayTitle}
                </h3>
                <p className="mt-1.5 text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {displaySummary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-cyan-600">
                <span>
                  {guide.whatToDoSteps.length} Steps
                  {guide.recommendedTimerSeconds && ' • Protocol Timer'}
                </span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>View Guide</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredGuides.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            No first-aid guides match your search
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Try searching for terms like "cut", "burn", "bleed", "sprain", or "faint".
          </p>
        </div>
      )}

      {/* Guide Detail Modal */}
      {activeGuide && (
        <FirstAidGuideModal
          guide={activeGuide}
          selectedLanguage={selectedLanguage}
          onSelectLanguage={onSelectLanguage}
          onClose={() => setActiveGuide(null)}
          onOpenSos={onOpenSos}
          onContactHealth={onContactHealth}
        />
      )}
    </div>
  );
};

interface FirstAidGuideModalProps {
  guide: FirstAidGuide;
  selectedLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  onClose: () => void;
  onOpenSos: () => void;
  onContactHealth: () => void;
}

const FirstAidGuideModal: React.FC<FirstAidGuideModalProps> = ({
  guide,
  selectedLanguage,
  onSelectLanguage,
  onClose,
  onOpenSos,
  onContactHealth,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(guide.recommendedTimerSeconds || 0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  // Translation support
  const trans =
    selectedLanguage !== 'en' && guide.translations?.[selectedLanguage]
      ? guide.translations[selectedLanguage]
      : null;

  const displayTitle = trans?.title || guide.title;
  const displaySummary = trans?.quickSummary || guide.quickSummary;
  const displaySteps = trans?.whatToDoSteps || guide.whatToDoSteps;
  const displayWarningSigns = trans?.warningSigns || guide.warningSigns;
  const displayWhenToCall = trans?.whenToCallHelp || guide.whenToCallHelp;

  // Countdown timer logic
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const handleToggleSpeech = () => {
    if (isPlayingAudio) {
      SpeechService.stop();
      setIsPlayingAudio(false);
    } else {
      const speechText = `${displayTitle}. What to do: ${displaySteps.join('. ')}. Warning signs: ${displayWarningSigns.join('. ')}. ${displayWhenToCall}`;
      setIsPlayingAudio(true);
      SpeechService.speak(speechText, () => {
        setIsPlayingAudio(false);
      });
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      const shareText = `[CarePulse First-Aid Guide: ${displayTitle}]\n\nSteps:\n${displaySteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nWhen to get help: ${displayWhenToCall}`;
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn"
    >
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden my-auto text-slate-800 flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50 flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
                {guide.categoryLabel}
              </span>

              {/* Language switcher inside modal */}
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600">
                <Languages className="w-3.5 h-3.5 text-cyan-600" />
                <select
                  value={selectedLanguage}
                  onChange={(e) => onSelectLanguage(e.target.value as LanguageCode)}
                  className="bg-transparent font-semibold focus:outline-hidden cursor-pointer"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <h2 id="guide-title" className="text-xl sm:text-2xl font-black text-slate-900">
              {displayTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {displaySummary}
            </p>
          </div>

          <button
            onClick={() => {
              SpeechService.stop();
              onClose();
            }}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            aria-label="Close guide dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Guide Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Audio read aloud & Share row */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-cyan-50/70 border border-cyan-200/80">
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleSpeech}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                  isPlayingAudio
                    ? 'bg-cyan-600 text-white animate-pulse'
                    : 'bg-white text-slate-800 border border-slate-200 hover:bg-cyan-50'
                }`}
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Stop Voice</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-cyan-600" />
                    <span>Listen Aloud</span>
                  </>
                )}
              </button>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-semibold shadow-2xs hover:bg-slate-50"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Share Guide'}</span>
              </button>
            </div>

            {/* Protocol Timer if available */}
            {guide.recommendedTimerSeconds && (
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-cyan-600" />
                <span className="font-mono font-bold text-xs text-slate-900">
                  {formatTimer(timerSeconds)}
                </span>
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="p-1 rounded-md hover:bg-slate-100 text-cyan-600"
                  aria-label={isTimerRunning ? 'Pause timer' : 'Start timer'}
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds(guide.recommendedTimerSeconds || 300);
                  }}
                  className="p-1 rounded-md hover:bg-slate-100 text-slate-400"
                  aria-label="Reset timer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Steps List */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-800 flex items-center gap-1.5 mb-3">
              <CheckCircle2 className="w-4 h-4 text-cyan-600" />
              <span>Step-by-Step Action Protocol</span>
            </h3>
            <div className="space-y-2.5">
              {displaySteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3"
                >
                  <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-cyan-600 text-white font-bold text-xs shadow-2xs">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Things to Avoid */}
          {guide.thingsToAvoid && guide.thingsToAvoid.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5 mb-2">
                <XCircle className="w-4 h-4 text-amber-600" />
                <span>Things to Avoid (Do Not Do)</span>
              </h3>
              <ul className="space-y-1.5">
                {guide.thingsToAvoid.map((avoid, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-amber-900 flex items-start gap-2">
                    <span className="text-amber-600 font-bold shrink-0">•</span>
                    <span>{avoid}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Warning Signs */}
          {displayWarningSigns && displayWarningSigns.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Critical Warning Signs</span>
              </h3>
              <ul className="space-y-1.5">
                {displayWarningSigns.map((sign, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-rose-950 flex items-start gap-2">
                    <span className="text-rose-600 font-bold shrink-0">!</span>
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* When to call for help */}
          {displayWhenToCall && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <PhoneCall className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                <strong className="text-slate-900 block font-bold mb-0.5">
                  When to Seek Emergency Help:
                </strong>
                {displayWhenToCall}
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              SpeechService.stop();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors shadow-2xs"
          >
            Close Guide
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onContactHealth}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 active:scale-95 text-white text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Campus Health</span>
            </button>
            <button
              onClick={onOpenSos}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>SOS Alert</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
