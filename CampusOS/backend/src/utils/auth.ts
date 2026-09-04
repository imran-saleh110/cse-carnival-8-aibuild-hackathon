import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const ACCESS_TOKEN_EXPIRY = '15m';
export const REFRESH_TOKEN_EXPIRY = '7d';

export const ACCESS_COOKIE_MAXAGE = 15 * 60 * 1000;
export const REFRESH_COOKIE_MAXAGE = 7 * 24 * 60 * 60 * 1000;

export const cookieOptions = (maxAge: number) => ({
  maxAge,
  httpOnly: true,
  secure: true,
  sameSite: 'none' as const,
  path: '/',
});

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateAccessToken = (studentId: string, studentName: string) => {
  return jwt.sign(
    { id: studentId, student_name: studentName },
    env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

export const generateRefreshToken = (studentId: string) => {
  return jwt.sign(
    { id: studentId },
    env.REFRESH_TOKEN,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
};
