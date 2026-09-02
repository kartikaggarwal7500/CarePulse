import { describe, it, expect } from 'vitest';
import {
  CAMPUS_CLINICS,
  AVAILABLE_DOCTORS,
  SERVICE_TYPES,
  TIME_SLOTS,
  INITIAL_BOOKINGS
} from '../data/bookingData';

describe('Clinic Booking System Test Suite', () => {
  it('should list all accredited campus health centers and clinics', () => {
    expect(CAMPUS_CLINICS.length).toBeGreaterThanOrEqual(3);
    CAMPUS_CLINICS.forEach((clinic) => {
      expect(clinic.id).toBeDefined();
      expect(clinic.name).toBeDefined();
      expect(clinic.location).toBeDefined();
      expect(clinic.hours).toBeDefined();
      expect(clinic.phone).toBeDefined();
      expect(clinic.services.length).toBeGreaterThan(0);
    });
  });

  it('should list certified medical doctors and clinicians', () => {
    expect(AVAILABLE_DOCTORS.length).toBeGreaterThanOrEqual(3);
    AVAILABLE_DOCTORS.forEach((doc) => {
      expect(doc.id).toBeDefined();
      expect(doc.name).toBeDefined();
      expect(doc.specialty).toBeDefined();
      expect(doc.rating).toBeGreaterThanOrEqual(4.0);
    });
  });

  it('should provide clinical service types with descriptions and duration', () => {
    expect(SERVICE_TYPES.length).toBeGreaterThan(0);
    SERVICE_TYPES.forEach((st) => {
      expect(st.id).toBeDefined();
      expect(st.name).toBeDefined();
      expect(st.duration).toBeDefined();
      expect(st.category).toBeDefined();
    });
  });

  it('should offer selectable booking time slots', () => {
    expect(TIME_SLOTS.length).toBeGreaterThanOrEqual(5);
    TIME_SLOTS.forEach((slot) => {
      expect(typeof slot).toBe('string');
      expect(slot).toMatch(/(AM|PM)/);
    });
  });

  it('should have properly formed initial clinic bookings', () => {
    expect(INITIAL_BOOKINGS.length).toBeGreaterThan(0);
    INITIAL_BOOKINGS.forEach((booking) => {
      expect(booking.id).toBeDefined();
      expect(booking.userName).toBeDefined();
      expect(booking.serviceType).toBeDefined();
      expect(booking.status).toBeDefined();
    });
  });
});
