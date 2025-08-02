import jwt from 'jsonwebtoken';
import { UserRole } from '@/models/userModel';

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) throw new Error('Missing JWT_SECRET in env');

export function signJWT(payload: { userId: string; role: UserRole }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyJWT(token: string): { userId: string; role: UserRole } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: UserRole };
  } catch {
    return null;
  }
}
