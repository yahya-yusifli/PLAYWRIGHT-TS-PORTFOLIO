import { randomBytes } from 'crypto';

/**
 * Generate a pseudo-unique email. Optionally provide a domain.
 */
export function randomEmail(domain = 'test.com'): string {
  return `user_${Date.now()}_${randomString(6)}@${domain}`;
}

/**
 * Generate a random alphanumeric string of the requested length.
 * Uses Node's crypto module for stronger randomness and guarantees length.
 */
export function randomString(length: number): string {
  if (!Number.isFinite(length) || length <= 0) return '';
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = randomBytes(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}

/**
 * Return a random integer between min and max (inclusive).
 * If min > max, the values are swapped. Inputs are rounded to integers.
 */
export function randomNumber(min: number, max: number): number {
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    throw new TypeError('min and max must be finite numbers');
  }

  let _min = Math.ceil(min);
  let _max = Math.floor(max);
  if (_min > _max) [_min, _max] = [_max, _min];
  return Math.floor(Math.random() * (_max - _min + 1)) + _min;
}