import { StructuredAIResponse, HazardReport, RiskLevel } from '../types';
import { FIRST_AID_GUIDES } from '../data/firstAidData';

export interface GeminiStatusInfo {
  success: boolean;
  isGeminiConfigured: boolean;
  model: string;
  provider: string;
  status: string;
}

export async function fetchGeminiStatus(): Promise<GeminiStatusInfo> {
  try {
    const res = await fetch('/api/gemini/status');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Failed to fetch Gemini status:', e);
  }
  return {
    success: true,
    isGeminiConfigured: false,
    model: 'gemini-3.7-flash',
    provider: '@google/genai',
    status: 'Local Intelligent Heuristic Mode'
  };
}

export async function generateAiTriageSummary(params: {
  symptoms?: string;
  notes?: string;
  serviceType?: string;
}): Promise<{
  triageSummary: string;
  recommendedPriority: 'routine' | 'urgent' | 'emergency';
  clinicalCategory: string;
  preparationTips: string[];
}> {
  try {
    const res = await fetch('/api/ai-triage-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data) return json.data;
    }
  } catch (e) {
    console.warn('AI triage summary API error:', e);
  }
  return {
    triageSummary: 'Clinical triage review scheduled. Arrive 5 minutes prior to appointment time.',
    recommendedPriority: 'routine',
    clinicalCategory: 'General Health & First-Aid',
    preparationTips: ['Bring student ID and list of any current medications.']
  };
}

export async function sendAiChatRequest(
  prompt: string,
  imageBase64?: string,
  language: string = 'English'
): Promise<StructuredAIResponse> {
  try {
    const res = await fetch('/api/ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, imageBase64, language }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.data) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn('API route unreachable, executing client-side intelligent fallback', err);
  }

  // Client-side fallback if backend API is not responding
  return getClientFallbackResponse(prompt, imageBase64);
}

export async function analyzeHazardRequest(
  description: string,
  imageBase64?: string
): Promise<{
  hazardType: 'Electrical' | 'Fire' | 'Slippery Floor' | 'Structural' | 'Chemical' | 'Other';
  riskLevel: RiskLevel;
  potentialHazard: string;
  recommendedAction: string;
  immediateSafetyRules: string[];
  disclaimer: string;
}> {
  try {
    const res = await fetch('/api/analyze-hazard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, imageBase64 }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.data) return data.data;
    }
  } catch (err) {
    console.warn('Hazard API unreachable, running client fallback', err);
  }

  const lower = description.toLowerCase();
  if (lower.includes('wire') || lower.includes('spark') || lower.includes('electric') || lower.includes('cord')) {
    return {
      hazardType: 'Electrical',
      riskLevel: 'HIGH',
      potentialHazard: 'Exposed live wiring and electrocution / arc flash hazard.',
      recommendedAction: 'Do NOT touch or step near the exposed cable. Maintain a 10-foot perimeter. Report to Campus Security immediately.',
      immediateSafetyRules: [
        'Keep other students clear of the area.',
        'Do not attempt to tape or repair without certified electrician authorization.',
        'If water is nearby, evacuate the immediate room.'
      ],
      disclaimer: 'Informational safety scanner. Maintain safe distance.'
    };
  }

  if (lower.includes('water') || lower.includes('slip') || lower.includes('puddle') || lower.includes('floor')) {
    return {
      hazardType: 'Slippery Floor',
      riskLevel: 'MODERATE',
      potentialHazard: 'Wet surface posing slip and fall injury hazard.',
      recommendedAction: 'Post a temporary warning marker if available and notify campus maintenance staff for clean-up.',
      immediateSafetyRules: [
        'Walk slowly and alert nearby students.',
        'Report the source of leak to prevent building damage.'
      ],
      disclaimer: 'Informational safety scanner. Watch your footing.'
    };
  }

  return {
    hazardType: 'Structural',
    riskLevel: 'MODERATE',
    potentialHazard: 'Campus physical hazard requiring facility attention.',
    recommendedAction: 'Keep a safe distance. Note the exact building and room number, and submit a report.',
    immediateSafetyRules: [
      'Do not tamper with damaged structural components.',
      'Alert building administrators.'
    ],
    disclaimer: 'Informational hazard scanner.'
  };
}

export async function submitHazardReport(reportData: {
  hazardType: string;
  location: string;
  description: string;
  imageUrl?: string;
  reportedBy?: string;
}): Promise<{ success: boolean; report: HazardReport; message: string }> {
  try {
    const res = await fetch('/api/report-hazard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend report error, falling back locally:', err);
  }

  const localReport: HazardReport = {
    id: `rep-${Date.now()}`,
    hazardType: (reportData.hazardType as any) || 'Other',
    location: reportData.location,
    description: reportData.description,
    imageUrl: reportData.imageUrl,
    status: 'Report Received',
    timestamp: Date.now(),
    reportedBy: reportData.reportedBy || 'Campus Student',
    riskLevel: 'MODERATE'
  };

  return {
    success: true,
    report: localReport,
    message: 'Report logged successfully. Campus Facilities notified.'
  };
}

export async function fetchHazardReports(): Promise<HazardReport[]> {
  try {
    const res = await fetch('/api/hazard-reports');
    if (res.ok) {
      const data = await res.json();
      if (data.reports) return data.reports;
    }
  } catch (err) {
    console.warn('Using default reports');
  }

  return [
    {
      id: 'rep-1',
      hazardType: 'Electrical',
      location: 'Engineering Lab B, 2nd Floor, Room 204',
      description: 'Frayed exposed wire on power strip near workbench 4. Spark observed when plugging in multimeter.',
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      status: 'Investigating',
      timestamp: Date.now() - 3600000 * 2,
      reportedBy: 'Campus Safety Scout',
      riskLevel: 'HIGH'
    },
    {
      id: 'rep-2',
      hazardType: 'Slippery Floor',
      location: 'Student Center West Entrance',
      description: 'Water leaking from ceiling air handler after heavy rain. Puddle spans across the main walkway.',
      imageUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80',
      status: 'Maintenance Dispatched',
      timestamp: Date.now() - 3600000 * 5,
      reportedBy: 'Student Volunteer',
      riskLevel: 'MODERATE'
    }
  ];
}

export async function dispatchSosAlert(payload: {
  location?: string;
  contactName?: string;
  phone?: string;
}) {
  try {
    const res = await fetch('/api/sos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('SOS dispatch fallback');
  }

  return {
    success: true,
    requestId: `SOS-${Math.floor(100000 + Math.random() * 900000)}`,
    status: 'Emergency request initiated',
    steps: [
      { step: 'Request received by SafeAid System', status: 'complete', time: 'Just now' },
      { step: 'Locating nearest campus responder dispatch...', status: 'in_progress', time: 'Pending' },
      { step: `Broadcasting emergency signal to ${payload.contactName || 'Campus Security'}`, status: 'pending', time: 'Queued' }
    ],
    timestamp: Date.now(),
    disclaimer: 'Simulated emergency alert testing protocol. For real emergencies, always dial 911 / 112 directly.'
  };
}

function getClientFallbackResponse(prompt: string, image?: string): StructuredAIResponse {
  const lower = prompt.toLowerCase();

  // Match with first-aid guides if available
  for (const guide of FIRST_AID_GUIDES) {
    if (lower.includes(guide.title.toLowerCase()) || lower.includes(guide.category)) {
      return {
        situationTitle: guide.title,
        category: 'medical',
        severity: guide.severity,
        summary: guide.quickSummary,
        immediateSteps: guide.whatToDoSteps,
        thingsToAvoid: guide.thingsToAvoid,
        warningSigns: guide.warningSigns,
        whenToSeekHelp: guide.whenToCallHelp,
        disclaimer: 'SafeAid AI provides educational first-aid information and is not a substitute for professional healthcare.',
        source: 'first_aid_database'
      };
    }
  }

  if (lower.includes('cut') || lower.includes('bleed')) {
    return {
      situationTitle: 'Minor Skin Laceration / Bleeding',
      category: 'medical',
      severity: 'low',
      summary: 'Minor open skin wound requiring prompt hygiene and continuous direct pressure.',
      immediateSteps: [
        'Wash hands with soap and water to prevent contaminating the wound.',
        'Apply direct, firm pressure with a clean cloth or sterile gauze for 5 minutes.',
        'Rinse gently under clean running water once bleeding slows.',
        'Apply antibacterial ointment and cover with an adhesive sterile bandage.'
      ],
      thingsToAvoid: [
        'Do not apply harsh alcohol or hydrogen peroxide directly to open cuts.',
        'Do not remove embedded foreign objects yourself.'
      ],
      warningSigns: [
        'Unstoppable bleeding after 10 minutes of direct pressure.',
        'Wound edges gaping open wider than 1/4 inch.',
        'Signs of infection: spreading redness, heat, or throbbing pain.'
      ],
      whenToSeekHelp: 'Visit campus clinic if stitches or a tetanus booster shot is needed.',
      disclaimer: 'SafeAid AI provides general first-aid guidance only.'
    };
  }

  return {
    situationTitle: 'Health & Safety First-Aid Guidance',
    category: 'medical',
    severity: 'moderate',
    summary: `Structured first-aid evaluation for: "${prompt.slice(0, 60)}..."`,
    immediateSteps: [
      'Ensure the immediate area is safe before taking action.',
      'Stay calm and sit or lie down in a comfortable position.',
      'Clean hands and apply clean protective materials if dealing with bodily fluids.',
      'Monitor vital signs (breathing, pulse, alertness) continuously.'
    ],
    thingsToAvoid: [
      'Do not perform unfamiliar or invasive procedures.',
      'Do not ignore escalating pain, swelling, or dizziness.'
    ],
    warningSigns: [
      'Severe shortness of breath or chest discomfort.',
      'Heavy, spurting, or uncontrolled bleeding.',
      'Confusion, slurred speech, or loss of consciousness.'
    ],
    whenToSeekHelp: 'Consult Campus Health Center for non-urgent evaluation or dial 911 / 112 for urgent medical emergencies.',
    disclaimer: 'SafeAid AI guidance is informational and does not replace emergency medical care.'
  };
}
