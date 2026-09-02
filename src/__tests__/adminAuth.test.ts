import { describe, it, expect, beforeEach } from 'vitest';
import {
  hashAdminPassword,
  verifyAdminPassword,
  isMasterAdminSlotAvailable,
  registerMasterAdmin,
  authenticateAdmin,
  resetMasterAdminSlot,
  adminToAuthUser
} from '../data/adminAuth';

describe('Admin Single-Slot Security & Authentication Test Suite', () => {
  beforeEach(async () => {
    localStorage.clear();
    await resetMasterAdminSlot();
  });

  it('should securely hash and verify passwords using SHA-256', async () => {
    const raw = 'CampusSafety2026!';
    const hashed = await hashAdminPassword(raw);
    expect(hashed).toBeDefined();
    expect(hashed.length).toBe(64); // SHA-256 hex string length
    expect(hashed).not.toBe(raw);

    const isValid = await verifyAdminPassword(raw, hashed);
    expect(isValid).toBe(true);

    const isWrong = await verifyAdminPassword('WrongPassword123', hashed);
    expect(isWrong).toBe(false);
  });

  it('should correctly manage single-slot master admin registration and lockout', async () => {
    expect(isMasterAdminSlotAvailable()).toBe(true);

    const regResult = await registerMasterAdmin({
      name: 'Director Chief Safety',
      email: 'chief@campus.edu',
      password: 'StrongMasterPassword123!',
      department: 'Emergency & Safety Operations',
      badgeNumber: 'ADM-01'
    });

    expect(regResult.success).toBe(true);
    expect(regResult.admin).toBeDefined();
    expect(regResult.admin?.email).toBe('chief@campus.edu');

    // Second registration MUST be blocked (single-slot rule)
    expect(isMasterAdminSlotAvailable()).toBe(false);
    const secondReg = await registerMasterAdmin({
      name: 'Intruder Admin',
      email: 'intruder@campus.edu',
      password: 'Password999!',
      department: 'Hacking'
    });
    expect(secondReg.success).toBe(false);
    expect(secondReg.error).toMatch(/already/i);
  });

  it('should authenticate the master admin with correct credentials', async () => {
    await registerMasterAdmin({
      name: 'Chief Admin',
      email: 'chief@campus.edu',
      password: 'CorrectPassword!',
      department: 'Safety'
    });

    const authSuccess = await authenticateAdmin('chief@campus.edu', 'CorrectPassword!');
    expect(authSuccess.success).toBe(true);
    expect(authSuccess.admin).toBeDefined();

    const authUser = adminToAuthUser(authSuccess.admin!);
    expect(authUser.role).toBe('admin');
    expect(authUser.email).toBe('chief@campus.edu');

    const authFail = await authenticateAdmin('chief@campus.edu', 'IncorrectPassword');
    expect(authFail.success).toBe(false);
  });
});
