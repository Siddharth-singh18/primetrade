import { Response, NextFunction } from 'express';
import { User } from '../models/User.model';
import { Task } from '../models/Task.model';
import { AuthRequest } from '../middleware/authMiddleware';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';

export const getAllUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    // Aggregate task count
    const usersWithCounts = await Promise.all(users.map(async (user) => {
      const taskCount = await Task.countDocuments({ userId: user._id });
      return { ...user.toObject(), taskCount };
    }));

    res.status(200).json(new ApiResponse(200, 'Users retrieved', usersWithCounts));
  } catch (error) {
    next(error);
  }
};

export const getAllTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tasks = await Task.find().populate('userId', 'email').sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, 'All tasks retrieved', tasks));
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return next(new ApiError(400, 'Invalid role'));
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    res.status(200).json(new ApiResponse(200, 'User role updated', user));
  } catch (error) {
    next(error);
  }
};
