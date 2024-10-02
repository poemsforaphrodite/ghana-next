import jwt from 'jsonwebtoken';

interface DecodedToken {
  userId: string;
  role: string;
}

export function verifyToken(token: string): DecodedToken | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}