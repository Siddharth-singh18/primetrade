import { Router } from 'express';
import authRoutes from './auth.route';
import taskRoutes from './task.route';
import adminRoutes from './admin.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/admin', adminRoutes);

export default router;
