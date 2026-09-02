import { describe, it, expect } from 'vitest';
import {
  sendAiChatRequest,
  analyzeHazardRequest,
  generateAiTriageSummary,
  fetchGeminiStatus
} from '../services/api';

describe('CarePulse Health & Safety API Service Test Suite', () => {
  it('should retrieve status configuration for Gemini API', async () => {
    const status = await fetchGeminiStatus();
    expect(status).toBeDefined();
    expect(status.success).toBe(true);
    expect(status.model).toContain('gemini');
  });

  it('should return a structured medical first-aid response for burn inquiries', async () => {
    const response = await sendAiChatRequest('burn on hand from hot liquid', undefined, 'English');
    expect(response).toBeDefined();
    expect(response.situationTitle).toBeDefined();
    expect(response.category).toBe('medical');
    expect(response.immediateSteps.length).toBeGreaterThanOrEqual(3);
    expect(response.thingsToAvoid.length).toBeGreaterThanOrEqual(1);
    expect(response.warningSigns.length).toBeGreaterThanOrEqual(1);
    expect(response.disclaimer).toBeDefined();
  });

  it('should return a structured medical response for bleeding and cuts', async () => {
    const response = await sendAiChatRequest('Deep cut bleeding on forearm', undefined, 'English');
    expect(response).toBeDefined();
    expect(response.immediateSteps.length).toBeGreaterThanOrEqual(3);
    expect(response.severity).toMatch(/^(low|moderate|high|critical)$/);
  });

  it('should return a structured hazard assessment for exposed wiring', async () => {
    const hazard = await analyzeHazardRequest('Exposed electrical wires sparking in chemistry lab');
    expect(hazard).toBeDefined();
    expect(hazard.hazardType).toBe('Electrical');
    expect(hazard.riskLevel).toBe('HIGH');
    expect(hazard.recommendedAction.length).toBeGreaterThan(10);
    expect(hazard.immediateSafetyRules.length).toBeGreaterThanOrEqual(1);
  });

  it('should generate clinical triage summary for clinic booking intake', async () => {
    const triage = await generateAiTriageSummary({
      symptoms: 'Sprained left ankle during basketball',
      notes: 'Sudden swelling, unable to bear full weight',
      serviceType: 'Sports Medicine & Injury'
    });
    expect(triage).toBeDefined();
    expect(triage.triageSummary).toBeDefined();
    expect(triage.recommendedPriority).toMatch(/^(routine|urgent|emergency)$/);
  });
});
