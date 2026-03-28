import { describe, it, expect } from 'vitest';
import { setPassword, verifyPassword, isSetup } from '../auth';

describe('auth', () => {
  describe('isSetup', () => {
    it('returns false when no password is set', () => {
      expect(isSetup()).toBe(false);
    });

    it('returns true after password is set', () => {
      setPassword('testpass');
      expect(isSetup()).toBe(true);
    });
  });

  describe('setPassword / verifyPassword', () => {
    it('verifies a correct password', () => {
      setPassword('mypassword');
      expect(verifyPassword('mypassword')).toBe(true);
    });

    it('rejects an incorrect password', () => {
      setPassword('mypassword');
      expect(verifyPassword('wrongpassword')).toBe(false);
    });

    it('allows changing the password', () => {
      setPassword('first');
      setPassword('second');
      expect(verifyPassword('first')).toBe(false);
      expect(verifyPassword('second')).toBe(true);
    });
  });
});
