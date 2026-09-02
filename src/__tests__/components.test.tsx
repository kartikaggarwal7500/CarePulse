import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DisclaimerCard } from '../components/DisclaimerCard';
import { StructuredResponseCard } from '../components/StructuredResponseCard';
import { ErrorBoundary } from '../components/ErrorBoundary';

describe('CarePulse UI Components & Accessibility Test Suite', () => {
  it('renders DisclaimerCard with medical emergency warnings and phone links', () => {
    render(<DisclaimerCard />);
    expect(screen.getByText(/Emergency & Medical Disclaimer/i)).toBeInTheDocument();
    const emergencyLinks = screen.getAllByText(/911/i);
    expect(emergencyLinks.length).toBeGreaterThan(0);
  });

  it('renders StructuredResponseCard with title, steps, warnings, and severity', () => {
    const mockResponse = {
      situationTitle: 'Thermal Burn Treatment',
      category: 'medical' as const,
      severity: 'moderate' as const,
      summary: 'Superficial skin redness from hot water.',
      immediateSteps: [
        'Cool the burn under cool running tap water for 10-15 minutes.',
        'Remove restrictive jewelry before swelling begins.',
        'Apply soothing aloe vera and a sterile dressing.'
      ],
      thingsToAvoid: [
        'Do not apply ice directly to the burn.',
        'Do not burst any blisters.'
      ],
      warningSigns: [
        'Blistering larger than 2 inches.',
        'Signs of infection or increasing pain.'
      ],
      whenToSeekHelp: 'Visit campus clinic if burn is on joints or face.',
      disclaimer: 'CarePulse AI provides educational first aid only.'
    };

    render(
      <StructuredResponseCard
        data={mockResponse}
        onOpenSos={() => {}}
        onContactHealth={() => {}}
        onFindNearby={() => {}}
      />
    );

    expect(screen.getByText('Thermal Burn Treatment')).toBeInTheDocument();
    expect(screen.getByText('Immediate First-Aid Steps')).toBeInTheDocument();
    expect(screen.getByText(/Cool the burn under cool running tap water/i)).toBeInTheDocument();
    expect(screen.getByText(/Things to Avoid/i)).toBeInTheDocument();
    expect(screen.getByText(/Red Flags & Warning Signs/i)).toBeInTheDocument();
    expect(screen.getByText(/When to Seek Medical Care:/i)).toBeInTheDocument();
  });

  it('renders ErrorBoundary fallback safely when child component errors', () => {
    const ProblemChild = () => {
      throw new Error('Test rendering crash');
    };

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
