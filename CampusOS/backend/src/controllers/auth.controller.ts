import { Request, Response } from 'express';
import { RefreshTokenModel } from '../models/RefreshToken';
import { StudentModel } from '../models/Student';
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  cookieOptions,
  ACCESS_COOKIE_MAXAGE,
  REFRESH_COOKIE_MAXAGE,
} from '../utils/auth';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email or password is required' });
  }

  const student = await StudentModel.findByEmail(email);

  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const isSame = await comparePassword(password, student.password);

  if (!isSame) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const accessToken = generateAccessToken(student.student_id, student.student_name);
  const refreshToken = generateRefreshToken(student.student_id);

  await RefreshTokenModel.create(
    student.student_id,
    refreshToken,
    new Date(Date.now() + REFRESH_COOKIE_MAXAGE)
  );

  res.cookie('token', accessToken, cookieOptions(ACCESS_COOKIE_MAXAGE));
  res.cookie('refreshToken', refreshToken, cookieOptions(REFRESH_COOKIE_MAXAGE));

  const { password: _, ...studentWithoutPassword } = student;
  return res.status(200).json(studentWithoutPassword);
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token is required' });
  }

  try {
    const payload = jwt.verify(refreshToken, env.REFRESH_TOKEN) as { id: string };

    const stored = await RefreshTokenModel.find(refreshToken);
    if (!stored || new Date(stored.expires_at) < new Date()) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    const student = await StudentModel.findById(payload.id);
    if (!student) {
      return res.status(401).json({ error: 'Student not found' });
    }

    await RefreshTokenModel.delete(refreshToken);

    const newAccessToken = generateAccessToken(student.student_id, student.student_name);
    const newRefreshToken = generateRefreshToken(student.student_id);

    await RefreshTokenModel.create(
      student.student_id,
      newRefreshToken,
      new Date(Date.now() + REFRESH_COOKIE_MAXAGE)
    );

    res.cookie('token', newAccessToken, cookieOptions(ACCESS_COOKIE_MAXAGE));
    res.cookie('refreshToken', newRefreshToken, cookieOptions(REFRESH_COOKIE_MAXAGE));

    return res.status(200).json({ message: 'Token refreshed successfully' });
  } catch {
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
};

export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    await RefreshTokenModel.delete(refreshToken);
  }

  res.clearCookie('token', cookieOptions(ACCESS_COOKIE_MAXAGE));
  res.clearCookie('refreshToken', cookieOptions(REFRESH_COOKIE_MAXAGE));

  return res.status(200).json({ message: 'Logout successful' });
};
