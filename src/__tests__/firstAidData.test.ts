import { describe, it, expect } from 'vitest';
import {
  FIRST_AID_GUIDES,
  LANGUAGES,
  FIRST_AID_CATEGORIES
} from '../data/firstAidData';

describe('First Aid Data & Protocols Test Suite', () => {
  it('should provide comprehensive first-aid guides with required safety fields', () => {
    expect(FIRST_AID_GUIDES.length).toBeGreaterThan(5);

    FIRST_AID_GUIDES.forEach((guide) => {
      expect(guide.id).toBeDefined();
      expect(guide.title).toBeDefined();
      expect(guide.category).toBeDefined();
      expect(guide.severity).toMatch(/^(low|moderate|high|critical)$/);
      expect(guide.quickSummary.length).toBeGreaterThan(10);
      expect(guide.whatToDoSteps.length).toBeGreaterThanOrEqual(3);
      expect(guide.thingsToAvoid.length).toBeGreaterThanOrEqual(1);
      expect(guide.warningSigns.length).toBeGreaterThanOrEqual(1);
      expect(guide.whenToCallHelp).toBeDefined();
    });
  });

  it('should support multiple campus languages with codes and native labels', () => {
    expect(LANGUAGES.length).toBeGreaterThanOrEqual(5);
    const codes = LANGUAGES.map((l) => l.code);
    expect(codes).toContain('en');
    expect(codes).toContain('hi');
    expect(codes).toContain('ta');
    expect(codes).toContain('te');
  });

  it('should define structured first aid categories with icons', () => {
    expect(FIRST_AID_CATEGORIES.length).toBeGreaterThanOrEqual(6);
    FIRST_AID_CATEGORIES.forEach((cat) => {
      expect(cat.id).toBeDefined();
      expect(cat.label).toBeDefined();
      expect(cat.icon).toBeDefined();
    });
  });
});
