import crypto from 'crypto';

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

export function verifyPassword(password: string, hash: string): boolean {
  const parts = hash.split(':');
  if (parts.length !== 2) return false;
  const [salt, key] = parts;
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return key === derivedKey.toString('hex');
}
