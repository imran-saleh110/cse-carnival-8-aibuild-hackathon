import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { cookieOptions, ACCESS_COOKIE_MAXAGE } from '../utils/auth';
import { AuthPayload } from '../types/student.types';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  jwt.verify(token, env.JWT_SECRET, {}, (err, user) => {
    if (err) {
      res.clearCookie('token', cookieOptions(ACCESS_COOKIE_MAXAGE));
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = user as AuthPayload;
    next();
  });
};
