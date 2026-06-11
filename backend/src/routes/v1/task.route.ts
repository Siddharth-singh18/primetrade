import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../../controllers/task.controller';
import { protect } from '../../middleware/authMiddleware';
import { validate } from '../../middleware/validate';
import { createTaskSchema, updateTaskSchema, taskIdSchema } from '../../validators/task.validator';

const router = Router();

router.use(protect);

router.get('/', getTasks);
router.post('/', validate(createTaskSchema), createTask);
router.put('/:id', validate(updateTaskSchema), updateTask);
router.delete('/:id', validate(taskIdSchema), deleteTask);

export default router;
