import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Basic CORS and headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type,Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// In-memory hazard reports store
const hazardReports: any[] = [
  {
    id: "rep-1",
    hazardType: "Electrical",
    location: "Engineering Lab B, 2nd Floor, Room 204",
    description: "Frayed exposed wire on power strip near workbench 4. Spark observed when plugging in multimeter.",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    status: "Investigating",
    timestamp: Date.now() - 3600000 * 2,
    reportedBy: "Campus Safety Scout",
    riskLevel: "HIGH"
  },
  {
    id: "rep-2",
    hazardType: "Slippery Floor",
    location: "Student Center West Entrance",
    description: "Water leaking from ceiling air handler after heavy rain. Puddle spans across the main walkway.",
    imageUrl: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80",
    status: "Maintenance Dispatched",
    timestamp: Date.now() - 3600000 * 5,
    reportedBy: "Student Volunteer",
    riskLevel: "MODERATE"
  }
];

// Helper to get Gemini client if key is configured
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  try {
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn("Failed to initialize GoogleGenAI client:", err);
    return null;
  }
}

// System prompt enforcing safety, structure, and disclaimer
const HEALTH_SAFETY_SYSTEM_PROMPT = `
You are CarePulse AI (formerly SafeAid AI), an Accessible Multimodal Health & Safety Companion for campus students, faculty, and emergency response teams.
Your role is to provide quick, calm, structured, step-by-step guidance for minor medical situations, triage assessments, or campus physical hazards.

CRITICAL INSTRUCTIONS & SAFETY RULES:
1. You are an educational and first-aid guidance tool, NEVER a doctor or replacement for emergency medical services (EMS).
2. DO NOT diagnose diseases or prescribe medications.
3. Use cautious, objective language: "This may be...", "General first-aid steps include...", "Consider seeking professional medical care...".
4. Always structure your response in JSON format with the following schema:
{
  "situationTitle": string (e.g. "Minor Finger Laceration", "First-Degree Thermal Burn", "Exposed Live Electrical Cable", "Heat Exhaustion"),
  "category": "medical" | "hazard" | "safety",
  "severity": "low" | "moderate" | "high" | "critical",
  "summary": string,
  "immediateSteps": string[] (3-5 concise, numbered imperative actions to take right now),
  "thingsToAvoid": string[] (2-4 things NOT to do),
  "warningSigns": string[] (3-4 symptoms/red flags requiring immediate medical or campus safety intervention),
  "whenToSeekHelp": string,
  "disclaimer": "CarePulse AI provides general first-aid guidance and does not replace emergency medical services or professional medical consultation. For severe injuries or life-threatening symptoms, call 911 or campus emergency dispatch immediately."
}
`;

// Gemini API Health and Status Check
app.get("/api/gemini/status", (req, res) => {
  const ai = getGeminiClient();
  const isConfigured = Boolean(ai);
  res.json({
    success: true,
    isGeminiConfigured: isConfigured,
    model: "gemini-3.7-flash",
    provider: "@google/genai",
    status: isConfigured ? "Connected" : "Key Not Configured (Local Fallback Active)"
  });
});

// AI Chat & Multimodal Triage Route
app.post("/api/ai-chat", async (req, res) => {
  try {
    const { prompt, imageBase64, language = "English" } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      const contents: any[] = [];
      const userPromptText = `User inquiry (respond in ${language}): "${prompt || "Analyze this situation"}"\nEnsure all user-facing string fields in the JSON response are translated accurately to ${language} if requested, but maintain clean JSON keys.`;

      if (imageBase64) {
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        contents.push({
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Data
          }
        });
      }
      contents.push({ text: userPromptText });

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents,
        config: {
          systemInstruction: HEALTH_SAFETY_SYSTEM_PROMPT,
          responseMimeType: "application/json"
        }
      });

      const responseText = response.text || "{}";
      try {
        const parsed = JSON.parse(responseText);
        return res.json({ success: true, data: parsed, source: "gemini-3.7-flash" });
      } catch (parseErr) {
        return res.json({
          success: true,
          data: {
            situationTitle: "Health & Safety Guidance",
            category: "medical",
            severity: "moderate",
            summary: responseText,
            immediateSteps: [
              "Ensure the scene is safe before proceeding.",
              "Stay calm and apply basic first aid precautions.",
              "Clean hands with soap and water if addressing wounds.",
              "Monitor for any worsening symptoms."
            ],
            thingsToAvoid: [
              "Do not apply unverified home remedies or irritants.",
              "Do not delay seeking emergency care if severe pain or heavy bleeding occurs."
            ],
            warningSigns: [
              "Uncontrolled bleeding or deep wound gaping.",
              "Difficulty breathing or chest tightness.",
              "Signs of infection: spreading redness, heat, pus.",
              "Dizziness or loss of consciousness."
            ],
            whenToSeekHelp: "Consult campus health or emergency services if symptoms worsen or don't improve.",
            disclaimer: "CarePulse AI provides educational guidance only and is not a substitute for professional medical care."
          },
          source: "gemini_fallback"
        });
      }
    }

    // Smart heuristic mock generation when Gemini key is not injected
    return res.json({
      success: true,
      data: generateFallbackGuidance(prompt, imageBase64),
      source: "local_heuristic"
    });
  } catch (error: any) {
    console.error("AI Chat error:", error);
    res.json({
      success: true,
      data: generateFallbackGuidance(req.body.prompt || "general inquiry"),
      source: "local_heuristic"
    });
  }
});

// Hazard Scanner API
app.post("/api/analyze-hazard", async (req, res) => {
  try {
    const { description, imageBase64 } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      const contents: any[] = [];
      if (imageBase64) {
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        contents.push({
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Data
          }
        });
      }
      contents.push({
        text: `Analyze this physical hazard in detail: "${description || "Campus hazard inspection"}". Return valid JSON with:
        {
          "hazardType": "Electrical" | "Fire" | "Slippery Floor" | "Structural" | "Chemical" | "Other",
          "riskLevel": "LOW" | "MODERATE" | "HIGH",
          "potentialHazard": string,
          "recommendedAction": string,
          "immediateSafetyRules": string[],
          "disclaimer": "Informational hazard assessment powered by CarePulse AI. Keep a safe distance and report immediately to campus security."
        }`
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents,
        config: {
          responseMimeType: "application/json"
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({ success: true, data: parsed, source: "gemini-3.7-flash" });
    }

    return res.json({
      success: true,
      data: generateFallbackHazardAnalysis(description),
      source: "local_heuristic"
    });
  } catch (err) {
    console.error("Hazard scan error:", err);
    return res.json({
      success: true,
      data: generateFallbackHazardAnalysis(req.body.description),
      source: "local_heuristic"
    });
  }
});

// AI Triage & Clinical Summary Generator
app.post("/api/ai-triage-summary", async (req, res) => {
  try {
    const { symptoms, notes, serviceType } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: `Generate a concise 2-sentence clinical triage summary and recommended priority level (Routine, Urgent, Emergency) for a campus student appointment request:
        Service: ${serviceType || "Clinical Consultation"}
        Symptoms/Notes: "${notes || symptoms || "Routine checkup"}"
        
        Return JSON with:
        {
          "triageSummary": string,
          "recommendedPriority": "routine" | "urgent" | "emergency",
          "clinicalCategory": string,
          "preparationTips": string[]
        }`,
        config: {
          responseMimeType: "application/json"
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({ success: true, data: parsed, source: "gemini-3.7-flash" });
    }

    return res.json({
      success: true,
      data: {
        triageSummary: "Standard clinical intake triage. Patient advised to arrive 5 minutes early.",
        recommendedPriority: "routine",
        clinicalCategory: "General Health & Safety",
        preparationTips: ["Bring student ID and list of any current medications."]
      },
      source: "local_heuristic"
    });
  } catch (err) {
    console.error("Triage summary error:", err);
    return res.json({
      success: true,
      data: {
        triageSummary: "Standard clinical intake triage. Patient advised to arrive 5 minutes early.",
        recommendedPriority: "routine",
        clinicalCategory: "General Health & Safety",
        preparationTips: ["Bring student ID."]
      },
      source: "local_heuristic"
    });
  }
});

// Hazard reporting
app.post("/api/report-hazard", (req, res) => {
  const { hazardType, location, description, imageUrl, reportedBy } = req.body;
  const newReport = {
    id: `rep-${Date.now()}`,
    hazardType: hazardType || "Other",
    location: location || "Campus Location",
    description: description || "Reported hazard",
    imageUrl: imageUrl || null,
    status: "Report Received",
    timestamp: Date.now(),
    reportedBy: reportedBy || "Anonymous Campus User",
    riskLevel: "MODERATE"
  };
  hazardReports.unshift(newReport);
  res.json({ success: true, report: newReport, message: "Report submitted successfully. Campus Facilities & Security notified." });
});

app.get("/api/hazard-reports", (req, res) => {
  res.json({ success: true, reports: hazardReports });
});

// SOS simulation endpoint
app.post("/api/sos", (req, res) => {
  const { location, contactName, userDetails } = req.body;
  res.json({
    success: true,
    requestId: `SOS-${Math.floor(100000 + Math.random() * 900000)}`,
    status: "Emergency request initiated",
    steps: [
      { step: "Request received by SafeAid System", status: "complete", time: "Just now" },
      { step: "Locating campus responder dispatch...", status: "in_progress", time: "Pending" },
      { step: `Broadcasting emergency signal to ${contactName || "Campus Security"}`, status: "pending", time: "Queued" }
    ],
    timestamp: Date.now(),
    disclaimer: "Simulated emergency alert testing protocol. In real life, always call 911 / 112 directly."
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: Date.now(), service: "SafeAid AI Backend" });
});

// Heuristic fallback generator
function generateFallbackGuidance(prompt: string = "", image?: string) {
  const lower = (prompt || "").toLowerCase();

  if (lower.includes("burn") || lower.includes("fire") || lower.includes("hot")) {
    return {
      situationTitle: "First-Degree / Minor Thermal Burn",
      category: "medical",
      severity: "moderate",
      summary: "Thermal skin injury causing redness, mild swelling, and localized burning pain.",
      immediateSteps: [
        "Immediately hold the burned skin under cool (not ice cold), gentle running water for 10 to 15 minutes.",
        "Gently remove tight jewelry, watches, or restrictive clothing around the area before swelling begins.",
        "Apply clean aloe vera gel or soothing petroleum jelly to keep the skin hydrated.",
        "Cover the area loosely with a sterile, non-stick bandage or clean cling film."
      ],
      thingsToAvoid: [
        "NEVER apply ice directly to burns (causes further tissue damage).",
        "NEVER use butter, oils, toothpaste, or unverified folk remedies.",
        "Do not pop or pierce any blisters that develop."
      ],
      warningSigns: [
        "Blisters covering an area larger than 2 inches / the palm of your hand.",
        "Burn on the face, hands, joints, feet, or groin.",
        "Skin appears white, leathery, charred black, or numb (3rd-degree signs).",
        "Severe pain that does not subside after 30 minutes."
      ],
      whenToSeekHelp: "Visit campus health center for dressing changes or if the burn is larger than 3 inches. Call 911/112 for electrical or chemical burns.",
      disclaimer: "SafeAid AI provides educational guidance only. Seek urgent medical care for moderate to severe burns."
    };
  }

  if (lower.includes("bleed") || lower.includes("cut") || lower.includes("scrape") || lower.includes("laceration")) {
    return {
      situationTitle: "Minor Cut / Skin Laceration",
      category: "medical",
      severity: "low",
      summary: "Superficial laceration or abrasion with mild localized bleeding.",
      immediateSteps: [
        "Wash your hands thoroughly with soap and clean water to prevent wound contamination.",
        "Apply direct, steady pressure using a clean gauze or cloth for 5 continuous minutes without lifting to check.",
        "Once bleeding slows, gently rinse the cut under cool running tap water to remove dirt particles.",
        "Apply a thin layer of antibacterial ointment or petroleum jelly, then protect with an adhesive sterile bandage."
      ],
      thingsToAvoid: [
        "Do not pick at clots or scrub the wound aggressively.",
        "Do not use harsh rubbing alcohol or hydrogen peroxide directly in deep open cuts as it harms healing tissue.",
        "Do not remove embedded foreign objects (like glass shards) yourself—seek urgent medical removal."
      ],
      warningSigns: [
        "Blood spurts or soaks through cloth continuously after 10 minutes of direct pressure.",
        "Wound edges gape open wider than 1/4 inch or fat/muscle tissue is visible.",
        "Wound caused by rusty metal, animal bite, or dirty needle (tetanus risk).",
        "Red streaks spreading outward or increasing warmth/swelling 24h later."
      ],
      whenToSeekHelp: "Seek medical attention within 6 hours if stitches or a tetanus booster shot are needed.",
      disclaimer: "SafeAid AI provides general first-aid guidance. If bleeding is uncontrolled, call emergency services immediately."
    };
  }

  if (lower.includes("faint") || lower.includes("dizzy") || lower.includes("blackout") || lower.includes("syncope")) {
    return {
      situationTitle: "Presyncope / Fainting Episode",
      category: "medical",
      severity: "moderate",
      summary: "Temporary loss of consciousness or intense lightheadedness from reduced blood flow to the brain.",
      immediateSteps: [
        "Help the person lie flat on their back immediately in a safe, cool area.",
        "Elevate their feet about 12 inches (30 cm) above heart level to assist blood return.",
        "Loosen tight collars, ties, belts, or restrictive clothing around the neck and chest.",
        "Ensure good airflow: open a window or gently fan them; encourage slow, deep breaths once conscious."
      ],
      thingsToAvoid: [
        "Do NOT let the person stand up quickly—keep them resting flat for at least 10–15 minutes.",
        "Do NOT give food, water, or medication while they are semi-conscious or drowsy.",
        "Do NOT splash cold water on their face or slap their cheeks."
      ],
      warningSigns: [
        "Person does not regain full consciousness within 60 seconds.",
        "Fainting accompanied by chest pain, irregular pulse, or sudden shortness of breath.",
        "Seizure-like jerking, head injury from falling, or confusion after waking up.",
        "Fainting occurred while exercising or sitting still."
      ],
      whenToSeekHelp: "Call campus emergency or 911 if recovery takes more than 1 minute or if the person hit their head.",
      disclaimer: "SafeAid AI guidance is informational. Any unexplained fainting should be evaluated by a healthcare professional."
    };
  }

  if (lower.includes("chok") || lower.includes("airway") || lower.includes("breath")) {
    return {
      situationTitle: "Suspected Airway Obstruction / Choking",
      category: "medical",
      severity: "critical",
      summary: "Blockage of the windpipe preventing normal oxygen intake.",
      immediateSteps: [
        "Quickly ask: 'Are you choking? Can you speak or cough?'",
        "If they can cough loudly or speak, encourage them to keep coughing forcefully.",
        "If they cannot speak, breathe, or make sound (silent choking), stand behind them and lean them slightly forward.",
        "Perform 5 firm back blows between shoulder blades using the heel of your hand, followed by 5 quick inward/upward abdominal thrusts (Heimlich maneuver)."
      ],
      thingsToAvoid: [
        "Do NOT perform blind finger sweeps in the mouth (it can push the obstruction deeper).",
        "Do NOT give water to someone actively choking.",
        "Do NOT slap the back if the person is coughing effectively on their own."
      ],
      warningSigns: [
        "Inability to speak, cry, or breathe.",
        "Lips, fingernails, or skin turning blue/grey (cyanosis).",
        "Person clutching their throat with both hands (universal choking sign).",
        "Loss of responsiveness or collapse."
      ],
      whenToSeekHelp: "Call 911 / 112 IMMEDIATELY for any severe choking event. Start CPR if the person becomes unresponsive.",
      disclaimer: "EMERGENCY: If breathing is blocked, activate local emergency response immediately."
    };
  }

  // Default structured response
  return {
    situationTitle: "Health & Safety First-Aid Assessment",
    category: "medical",
    severity: "moderate",
    summary: "General structured guidance based on your query.",
    immediateSteps: [
      "Ensure personal safety: step away from any active hazard or danger zone.",
      "Stay calm and sit or lie down in a comfortable position.",
      "Clean hands and apply clean protective materials if dealing with bodily fluids.",
      "Monitor vital signs (breathing, pulse, alertness) continuously."
    ],
    thingsToAvoid: [
      "Do not panic or perform unfamiliar invasive procedures.",
      "Do not take prescription medications without a doctor's advice.",
      "Do not ignore escalating pain, swelling, or dizziness."
    ],
    warningSigns: [
      "Severe or worsening shortness of breath.",
      "Sudden intense pain, numbness, or loss of motor function.",
      "Profuse bleeding that does not stop with direct pressure.",
      "High fever, confusion, or severe allergic reaction (swollen lips/tongue)."
    ],
    whenToSeekHelp: "Visit campus health clinic for minor issues, or call 911/112 for severe emergencies.",
    disclaimer: "SafeAid AI provides educational guidance only and does not replace emergency services or a physician's advice."
  };
}

function generateFallbackHazardAnalysis(description: string = "") {
  const desc = (description || "").toLowerCase();
  if (desc.includes("wire") || desc.includes("electric") || desc.includes("spark") || desc.includes("cable")) {
    return {
      hazardType: "Electrical",
      riskLevel: "HIGH",
      potentialHazard: "Exposed live wiring and electrocution / electrical fire hazard.",
      recommendedAction: "Do NOT touch or step near the exposed cable. Maintain at least a 10-foot safety perimeter. Report immediately to Campus Facilities & Security.",
      immediateSafetyRules: [
        "Do not attempt to push or wrap the wire with makeshift materials.",
        "Warn other students in the immediate vicinity to keep clear.",
        "Turn off the circuit breaker ONLY if you are trained and the panel is safely accessible away from the wire."
      ],
      disclaimer: "Informational hazard assessment. Keep safe distance and notify campus authorities."
    };
  }
  if (desc.includes("water") || desc.includes("spill") || desc.includes("slip") || desc.includes("floor") || desc.includes("leak")) {
    return {
      hazardType: "Slippery Floor",
      riskLevel: "MODERATE",
      potentialHazard: "Liquid slip hazard capable of causing falls, concussions, or musculoskeletal injuries.",
      recommendedAction: "Place a visible warning marker or chair near the wet area if safe to do so. Submit a quick hazard report to dispatch campus janitorial staff.",
      immediateSafetyRules: [
        "Walk with slow, flat-footed steps if you must traverse the area.",
        "Do not allow running in high-traffic corridors.",
        "Check overhead ceiling for structural damage or dripping wires."
      ],
      disclaimer: "Informational assessment. Report to facility maintenance."
    };
  }
  return {
    hazardType: "Structural",
    riskLevel: "MODERATE",
    potentialHazard: "Potential physical hazard requiring campus maintenance review.",
    recommendedAction: "Keep a safe distance. Photograph the area from afar and submit a hazard report to campus safety personnel.",
    immediateSafetyRules: [
      "Do not enter cordoned-off or damaged zones.",
      "Alert building attendants or campus security desk nearby."
    ],
    disclaimer: "Informational hazard assessment. Safety first."
  };
}

// Start Server (only if not running in a Serverless environment like Vercel)
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CarePulse AI Server running on http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  startServer();
}

export { app };
export default app;
