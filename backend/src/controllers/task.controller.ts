import { Response, NextFunction } from 'express';
import { Task } from '../models/Task.model';
import { AuthRequest } from '../middleware/authMiddleware';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { cache } from '../config/redis';

const CACHE_TTL = 60;

export const getTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const cacheKey = `tasks_${userId}`;

    const cachedTasks = await cache.get(cacheKey);
    if (cachedTasks) {
      return res.status(200).json(new ApiResponse(200, 'Tasks retrieved from cache', JSON.parse(cachedTasks)));
    }

    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    
    await cache.setEx(cacheKey, CACHE_TTL, JSON.stringify(tasks));

    res.status(200).json(new ApiResponse(200, 'Tasks retrieved', tasks));
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    
    const task = await Task.create({
      ...req.body,
      userId
    });

    // Invalidate cache
    await cache.del(`tasks_${userId}`);

    res.status(201).json(new ApiResponse(201, 'Task created successfully', task));
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const task = await Task.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return next(new ApiError(404, 'Task not found or unauthorized'));
    }

    // Invalidate cache
    await cache.del(`tasks_${userId}`);

    res.status(200).json(new ApiResponse(200, 'Task updated successfully', task));
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const task = await Task.findOneAndDelete({ _id: id, userId });

    if (!task) {
      return next(new ApiError(404, 'Task not found or unauthorized'));
    }

    // Invalidate cache
    await cache.del(`tasks_${userId}`);

    res.status(200).json(new ApiResponse(200, 'Task deleted successfully'));
  } catch (error) {
    next(error);
  }
};
