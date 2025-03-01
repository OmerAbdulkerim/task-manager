import express from 'express';
import { TaskController } from '../controllers/task.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateDto } from '../utils/validator';
import { CreateTaskDto, UpdateTaskDto } from '../dtos/task.dto';

const router = express.Router();
const taskController = new TaskController();

// All routes require authentication
router.use(authenticate);

// Create new task
router.post('/', validateDto(CreateTaskDto), taskController.createTask);

// Get all tasks for the current user
router.get('/', taskController.getTasks);

// Get a specific task by ID
router.get('/:id', taskController.getTaskById);

// Update a task
router.patch('/:id', validateDto(UpdateTaskDto), taskController.updateTask);

// Delete a task
router.delete('/:id', taskController.deleteTask);

export default router;
