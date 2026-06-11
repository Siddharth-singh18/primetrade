import { Router } from 'express';
import { getAllUsers, getAllTasks, updateUserRole } from '../../controllers/admin.controller';
import { protect, authorize } from '../../middleware/authMiddleware';

const router = Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.get('/tasks', getAllTasks);
router.patch('/users/:id/role', updateUserRole);

export default router;
