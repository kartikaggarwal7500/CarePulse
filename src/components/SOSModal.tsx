import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  PhoneCall,
  X,
  CheckCircle2,
  Clock,
  Radio,
  MapPin,
  RotateCcw
} from 'lucide-react';
import { dispatchSosAlert } from '../services/api';
import { createSosDispatchFirestore } from '../services/firestoreService';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLocation?: string;
  trustedContactName?: string;
  trustedPhone?: string;
}

export const SOSModal: React.FC<SOSModalProps> = ({
  isOpen,
  onClose,
  userLocation = 'Campus Main Quad / STEM Hall B',
  trustedContactName = 'Campus Security & Primary Contact',
  trustedPhone = '(555) 019-2424',
}) => {
  const [step, setStep] = useState<'confirm' | 'active'>('confirm');
  const [timelineStep, setTimelineStep] = useState<number>(1);
  const [requestId, setRequestId] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setStep('confirm');
      setTimelineStep(1);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer1: any;
    let timer2: any;

    if (step === 'active') {
      setRequestId(`SOS-${Math.floor(100000 + Math.random() * 900000)}`);
      // Step 1: Request received immediately
      setTimelineStep(1);

      // Step 2: Contacting dispatch after 2.5s
      timer1 = setTimeout(() => {
        setTimelineStep(2);
      }, 2500);

      // Step 3: Response linked after 5s
      timer2 = setTimeout(() => {
        setTimelineStep(3);
      }, 5500);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [step]);

  if (!isOpen) return null;

  const handleConfirmSOS = async () => {
    setStep('active');
    // Save to Firestore real-time cloud dispatch
    try {
      await createSosDispatchFirestore({
        userId: 'user-active-student',
        userName: trustedContactName.split('&')[0].trim() || 'Alex Rivera (Student)',
        userRole: 'student',
        location: userLocation,
        status: 'DISPATCHED',
        bloodGroup: 'O+',
        allergies: 'Mild pollen sensitivity',
        medicalNotes: 'SOS triggered via mobile safety web client.',
        assignedResponder: 'Officer on Duty (Unit 1)',
        notes: 'Emergency broadcast received. Rapid response unit dispatched.',
      });
    } catch (e) {
      console.warn('Firestore SOS dispatch fallback:', e);
    }

    // Call standard backend endpoint
    await dispatchSosAlert({
      location: userLocation,
      contactName: trustedContactName,
      phone: trustedPhone,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sos-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
    >
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden text-slate-800">
        {/* Red emergency top border accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-600" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Close emergency modal"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'confirm' ? (
          <div className="text-center py-2">
            <div className="w-12 h-12 mx-auto rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-3">
              <ShieldAlert className="w-7 h-7 animate-pulse" />
            </div>

            <h3 id="sos-modal-title" className="text-lg sm:text-xl font-bold text-slate-900">
              Emergency Assistance Request
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Are you sure you want to request emergency assistance and initiate an alert to campus safety responders?
            </p>

            {/* Location & Contact Notice */}
            <div className="my-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-cyan-600 shrink-0" />
                <span>
                  <strong>Target Location:</strong> {userLocation}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Radio className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  <strong>Alert Dispatch:</strong> {trustedContactName}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2 mt-4">
              <button
                onClick={onClose}
                className="w-full sm:w-1/2 py-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmSOS}
                className="w-full sm:w-1/2 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Confirm Request</span>
              </button>
            </div>

            {/* Direct 911 Call Link */}
            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
              <span className="text-[11px] text-slate-500 block mb-1">
                Need immediate paramedic, police, or fire dispatch?
              </span>
              <a
                href="tel:911"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5 text-red-400" />
                <span>Direct Dial 911 (Instant Call)</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="py-2">
            <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Emergency Request Initiated
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">
                    ID: {requestId}
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                Live Status
              </span>
            </div>

            {/* Status Timeline */}
            <div className="my-4 space-y-3">
              {/* Step 1 */}
              <div className="flex items-start gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    timelineStep >= 1
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-sm font-bold text-slate-900">
                      Request received by CarePulse Gateway
                    </p>
                    <span className="text-[11px] text-slate-400">Just now</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    GPS coordinates logged & priority queue initiated.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    timelineStep >= 2
                      ? 'bg-emerald-600 text-white'
                      : timelineStep === 1
                      ? 'bg-cyan-600 text-white animate-pulse'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {timelineStep >= 2 ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-sm font-bold text-slate-900">
                      Contacting designated campus responders
                    </p>
                    <span className="text-[11px] text-slate-400">
                      {timelineStep >= 2 ? 'Connected' : 'In Progress'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Broadcasting location to Campus Safety & Security Desk.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    timelineStep >= 3
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {timelineStep >= 3 ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <Radio className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-sm font-bold text-slate-900">
                      {timelineStep >= 3 ? 'Responder Assigned' : 'Awaiting Responder Acknowledgment'}
                    </p>
                    <span className="text-[11px] text-slate-400">
                      {timelineStep >= 3 ? 'Confirmed' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {timelineStep >= 3
                      ? 'Patrol Unit 4 acknowledged signal. Estimated Arrival: ~3 mins.'
                      : 'Notification channel open for responder confirmation.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Calling options */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Campus Security Dispatch
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  (555) 019-2424
                </span>
              </div>
              <a
                href="tel:5550192424"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-2xs transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>
            </div>

            {/* Dismiss & Safety Note */}
            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                onClick={() => setStep('confirm')}
                className="text-xs text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo</span>
              </button>

              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-opacity"
              >
                Return to App
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
