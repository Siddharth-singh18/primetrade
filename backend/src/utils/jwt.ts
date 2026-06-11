import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { Types } from 'mongoose';

export const generateAccessToken = (userId: Types.ObjectId | string, role: string) => {
  return jwt.sign({ userId, role }, env.JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (userId: Types.ObjectId | string) => {
  return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET) as { userId: string; role: string };
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string };
};
