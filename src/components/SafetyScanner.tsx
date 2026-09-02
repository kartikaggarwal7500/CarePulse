import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Camera,
  Upload,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  MapPin,
  Sparkles,
  Zap,
  Flame,
  Droplets,
  Building,
  FlaskConical,
  HelpCircle,
  Clock,
  RefreshCw,
  Plus
} from 'lucide-react';
import { analyzeHazardRequest, submitHazardReport, fetchHazardReports } from '../services/api';
import { HazardReport, RiskLevel } from '../types';
import { subscribeToHazardReports, createHazardReportFirestore } from '../services/firestoreService';

interface SafetyScannerProps {
  onContactSecurity: () => void;
  onOpenSos: () => void;
}

export const SafetyScanner: React.FC<SafetyScannerProps> = ({
  onContactSecurity,
  onOpenSos,
}) => {
  const [tab, setTab] = useState<'scan' | 'report' | 'feed'>('scan');
  const [hazardDescription, setHazardDescription] = useState('');
  const [hazardImage, setHazardImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    hazardType: 'Electrical' | 'Fire' | 'Slippery Floor' | 'Structural' | 'Chemical' | 'Other';
    riskLevel: RiskLevel;
    potentialHazard: string;
    recommendedAction: string;
    immediateSafetyRules: string[];
    disclaimer: string;
  } | null>(null);

  // Hazard Report Form State
  const [formHazardType, setFormHazardType] = useState<string>('Electrical');
  const [formLocation, setFormLocation] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formImage, setFormImage] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState<string | null>(null);

  // Live hazard feed
  const [reportsFeed, setReportsFeed] = useState<HazardReport[]>([]);

  useEffect(() => {
    loadReports();
    const unsubscribe = subscribeToHazardReports((liveHazards) => {
      if (liveHazards.length > 0) {
        setReportsFeed(liveHazards);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadReports = async () => {
    const data = await fetchHazardReports();
    setReportsFeed(data);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, isReportForm = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          if (isReportForm) {
            setFormImage(ev.target.result as string);
          } else {
            setHazardImage(ev.target.result as string);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeHazard = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!hazardDescription.trim() && !hazardImage) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const result = await analyzeHazardRequest(
        hazardDescription || 'Analyze visible physical hazard',
        hazardImage || undefined
      );
      setAnalysisResult(result);
    } catch (err) {
      console.error('Hazard analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormLocation(
            `Campus Coordinates: Lat ${pos.coords.latitude.toFixed(4)}, Lon ${pos.coords.longitude.toFixed(4)} (Near Science Complex)`
          );
          setIsLocating(false);
        },
        () => {
          setFormLocation('Campus Quadrangle / Library Lawn (Estimated)');
          setIsLocating(false);
        }
      );
    } else {
      setFormLocation('Campus Main STEM Center');
      setIsLocating(false);
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDescription.trim()) return;

    setIsSubmitting(true);
    setSubmitSuccessMsg(null);

    try {
      // 1. Try Firestore direct write
      await createHazardReportFirestore({
        hazardType: (formHazardType as any) || 'Other',
        location: formLocation || 'Campus Quad, Building B',
        description: formDescription,
        imageUrl: formImage || undefined,
        status: 'Report Received',
        reportedBy: 'Campus Student Safety Volunteer',
        riskLevel: 'MODERATE',
      });

      // 2. Also inform API / backend endpoint
      const res = await submitHazardReport({
        hazardType: formHazardType,
        location: formLocation || 'Campus Quad, Building B',
        description: formDescription,
        imageUrl: formImage || undefined,
        reportedBy: 'Campus Student Safety Volunteer',
      });

      setSubmitSuccessMsg(res.message || 'Report logged and synchronized with cloud database.');
      setFormDescription('');
      setFormLocation('');
      setFormImage(null);
      await loadReports();
    } catch (err) {
      console.error('Report submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickPreFill = (text: string) => {
    setHazardDescription(text);
  };

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'HIGH':
      case 'CRITICAL':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'MODERATE':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner (Clean Light Style) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 text-slate-900 shadow-xs border border-slate-200 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold uppercase tracking-wider border border-cyan-200">
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-600" />
              <span>Campus Safety & Hazards</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Safety Hazard Scanner
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Identify damaged wiring, leaks, structural faults, or laboratory spills. Receive safe perimeter guidelines and alert campus maintenance.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => {
                setTab('report');
                if (analysisResult) {
                  setFormHazardType(analysisResult.hazardType);
                  setFormDescription(analysisResult.potentialHazard);
                }
              }}
              className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs sm:text-sm font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Report Hazard</span>
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200 text-xs">
          <button
            onClick={() => setTab('scan')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              tab === 'scan'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Hazard Scanner
          </button>
          <button
            onClick={() => setTab('report')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              tab === 'report'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Submit Incident Report
          </button>
          <button
            onClick={() => setTab('feed')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              tab === 'feed'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Campus Logs ({reportsFeed.length})
          </button>
        </div>
      </div>

      {tab === 'scan' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Scanner Input Card */}
          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-cyan-600" />
                <span>Identify a Safety Hazard</span>
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Upload a photo of a damaged electrical cable, puddle, or structural damage.
              </p>

              {/* Image Input Selection */}
              <div className="space-y-3">
                {hazardImage ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-h-48 bg-slate-50 flex items-center justify-center">
                    <img
                      src={hazardImage}
                      alt="Hazard preview"
                      className="w-full h-auto max-h-48 object-cover"
                    />
                    <button
                      onClick={() => setHazardImage(null)}
                      className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-white/90 text-slate-700 text-xs font-bold border border-slate-200 hover:bg-red-50 hover:text-red-600 shadow-xs"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5">
                    <label className="p-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-cyan-400 bg-slate-50/60 hover:bg-cyan-50/30 flex flex-col items-center justify-center cursor-pointer text-center transition-colors">
                      <Camera className="w-5 h-5 text-cyan-600 mb-1" />
                      <span className="text-xs font-bold text-slate-700">
                        Take Photo
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => handleImageSelect(e)}
                        className="hidden"
                      />
                    </label>

                    <label className="p-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-cyan-400 bg-slate-50/60 hover:bg-cyan-50/30 flex flex-col items-center justify-center cursor-pointer text-center transition-colors">
                      <Upload className="w-5 h-5 text-indigo-600 mb-1" />
                      <span className="text-xs font-bold text-slate-700">
                        Upload Image
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageSelect(e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                {/* Description Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Describe what you see:
                  </label>
                  <textarea
                    rows={3}
                    value={hazardDescription}
                    onChange={(e) => setHazardDescription(e.target.value)}
                    placeholder="e.g. Exposed copper wire sparking on power strip in chemistry lab..."
                    className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-cyan-500/30 resize-none"
                  />
                </div>

                {/* Quick Samples */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400 self-center">Try:</span>
                  <button
                    type="button"
                    onClick={() => handleQuickPreFill('Frayed electrical cord on floor with visible copper strands')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-cyan-50 text-slate-600 hover:text-cyan-800"
                  >
                    Exposed wire
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPreFill('Large slippery water puddle near main stairwell entrance')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-cyan-50 text-slate-600 hover:text-cyan-800"
                  >
                    Slippery leak
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPreFill('Broken cracked glass pane on corridor emergency exit door')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-cyan-50 text-slate-600 hover:text-cyan-800"
                  >
                    Broken glass
                  </button>
                </div>

                {/* Submit button */}
                <button
                  onClick={() => handleAnalyzeHazard()}
                  disabled={(!hazardDescription.trim() && !hazardImage) || isAnalyzing}
                  className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 active:scale-98 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-2xs transition-all flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Scanning Hazard Context...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Analyze Hazard Risk</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Scanner Analysis Output */}
          <div className="lg:col-span-6 space-y-4">
            {analysisResult ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">
                      Hazard Category
                    </span>
                    <h3 className="text-lg font-black text-slate-900">
                      {analysisResult.hazardType}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">
                      Risk Level
                    </span>
                    <span
                      className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold border ${getRiskColor(
                        analysisResult.riskLevel
                      )}`}
                    >
                      {analysisResult.riskLevel}
                    </span>
                  </div>
                </div>

                {/* Potential Hazard */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Potential Hazard
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    {analysisResult.potentialHazard}
                  </p>
                </div>

                {/* Recommended Safe Action */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-800 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                    <span>Recommended Action</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed p-3.5 rounded-2xl bg-cyan-50/70 border border-cyan-200">
                    {analysisResult.recommendedAction}
                  </p>
                </div>

                {/* Safety Rules */}
                {analysisResult.immediateSafetyRules && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Safety Rules:
                    </h4>
                    <ul className="space-y-1.5">
                      {analysisResult.immediateSafetyRules.map((r, i) => (
                        <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                          <span className="text-amber-600 font-bold shrink-0">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setTab('report');
                      setFormHazardType(analysisResult.hazardType);
                      setFormDescription(analysisResult.potentialHazard);
                    }}
                    className="flex-1 min-w-[140px] px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-2xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Report Hazard</span>
                  </button>

                  <button
                    onClick={onContactSecurity}
                    className="flex-1 min-w-[140px] px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-2xs hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <PhoneCall className="w-4 h-4 text-cyan-400" />
                    <span>Campus Security</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 italic text-center">
                  {analysisResult.disclaimer}
                </p>
              </div>
            ) : (
              <div className="h-full min-h-[300px] rounded-3xl border border-slate-200 bg-white p-8 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-3">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-800">
                  Ready to Scan Safety Hazard
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
                  Provide a description or photo on the left. The AI scanner evaluates structural, electrical, and chemical hazards safely without advising risky interaction.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'report' && (
        <div className="max-w-2xl mx-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xs">
          <div className="mb-5">
            <h3 className="text-xl font-black text-slate-900">
              Submit Campus Hazard Report
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Dispatch Campus Facilities, janitorial maintenance, or campus police to fix hazards.
            </p>
          </div>

          {submitSuccessMsg && (
            <div className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm font-bold">
                  {submitSuccessMsg}
                </p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Your ticket has been logged and assigned to campus dispatch.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmitReport} className="space-y-4">
            {/* Hazard Type Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Hazard Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {['Electrical', 'Fire', 'Slippery Floor', 'Structural', 'Chemical', 'Other'].map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setFormHazardType(type)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-2 ${
                      formHazardType === type
                        ? 'bg-cyan-50 border-cyan-400 text-cyan-800 shadow-2xs font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {type === 'Electrical' && <Zap className="w-4 h-4 text-amber-500" />}
                    {type === 'Fire' && <Flame className="w-4 h-4 text-red-500" />}
                    {type === 'Slippery Floor' && <Droplets className="w-4 h-4 text-blue-500" />}
                    {type === 'Structural' && <Building className="w-4 h-4 text-stone-500" />}
                    {type === 'Chemical' && <FlaskConical className="w-4 h-4 text-emerald-500" />}
                    {type === 'Other' && <HelpCircle className="w-4 h-4 text-purple-500" />}
                    <span>{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Location with Geolocation Button */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Campus Location
                </label>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                  className="inline-flex items-center gap-1 text-xs font-bold text-cyan-600 hover:underline"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{isLocating ? 'Locating...' : 'Use Current Location'}</span>
                </button>
              </div>
              <input
                type="text"
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                placeholder="e.g. Science Complex B, 3rd Floor East Corridor, near Room 310"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-cyan-500/30 focus:outline-hidden"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Detailed Hazard Description
              </label>
              <textarea
                rows={3}
                required
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Describe the hazard, any warning signs you erected, or observed hazards..."
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-cyan-500/30 focus:outline-hidden resize-none"
              />
            </div>

            {/* Optional Photo Attachment */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Attach Photo (Optional)
              </label>
              {formImage ? (
                <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <img src={formImage} alt="Report attachment" className="w-10 h-10 rounded-lg object-cover" />
                  <span className="text-xs text-slate-600 flex-1 truncate">Image attached</span>
                  <button
                    type="button"
                    onClick={() => setFormImage(null)}
                    className="p-1 text-slate-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="p-3 rounded-2xl border-2 border-dashed border-slate-200 hover:border-cyan-400 bg-slate-50/60 flex items-center justify-center gap-2 cursor-pointer transition-colors text-xs font-semibold text-slate-600">
                  <Upload className="w-4 h-4 text-cyan-600" />
                  <span>Upload Hazard Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageSelect(e, true)}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !formDescription.trim()}
              className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 active:scale-98 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-2xs transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Submitting to Campus Dispatch...</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4" />
                  <span>Submit Hazard Report</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {tab === 'feed' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Recent Campus Hazard Logs
            </h3>
            <button
              onClick={loadReports}
              className="text-xs text-cyan-600 hover:underline flex items-center gap-1 font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Feed</span>
            </button>
          </div>

          <div className="space-y-3">
            {reportsFeed.map((rep) => (
              <div
                key={rep.id}
                className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs flex flex-col sm:flex-row items-start gap-4"
              >
                {rep.imageUrl && (
                  <img
                    src={rep.imageUrl}
                    alt={rep.hazardType}
                    className="w-full sm:w-24 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
                        {rep.hazardType}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getRiskColor(
                          rep.riskLevel
                        )}`}
                      >
                        {rep.riskLevel}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(rep.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-600" />
                    <span>{rep.location}</span>
                  </p>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {rep.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                    <span>Status: <strong className="text-cyan-600">{rep.status}</strong></span>
                    <span>Reported by: {rep.reportedBy}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
