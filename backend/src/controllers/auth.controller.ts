import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { cache } from '../config/redis';
import { env } from '../config/env';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ApiError(409, 'User already exists'));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Make first user admin for testing purposes
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? 'admin' : 'user';

    const user = await User.create({
      email,
      password: hashedPassword,
      role,
    });

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    res.status(201).json(new ApiResponse(201, 'User registered successfully', {
      user: { id: user._id, email: user.email, role: user.role },
      accessToken,
      refreshToken
    }));
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new ApiError(401, 'Invalid credentials'));
    }

    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      return next(new ApiError(401, 'Invalid credentials'));
    }

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    res.status(200).json(new ApiResponse(200, 'Login successful', {
      user: { id: user._id, email: user.email, role: user.role },
      accessToken,
      refreshToken
    }));
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      // Blacklist token in Redis for 15 minutes (match JWT expiry)
      await cache.setEx(`bl_${token}`, 15 * 60, 'true');
    }

    res.status(200).json(new ApiResponse(200, 'Logged out successfully'));
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(new ApiError(401, 'Refresh token required'));
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return next(new ApiError(401, 'Invalid refresh token'));
    }

    const accessToken = generateAccessToken(user._id, user.role);
    
    res.status(200).json(new ApiResponse(200, 'Token refreshed', { accessToken }));
  } catch (error) {
    next(new ApiError(401, 'Invalid or expired refresh token'));
  }
};
