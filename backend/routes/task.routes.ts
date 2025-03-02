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
router.post(
    '/',
    validateDto(CreateTaskDto),
    taskController.createTask.bind(taskController),
);

/**
 * Get all tasks for the current user
 * Supports filtering and sorting with the following query parameters:
 * - priorityIds[]: Filter by priority IDs (can provide multiple)
 * - statuses[]: Filter by task statuses (can provide multiple)
 * - dueDateFrom: Filter by due date >= this date
 * - dueDateTo: Filter by due date <= this date
 * - createdAtFrom: Filter by creation date >= this date
 * - createdAtTo: Filter by creation date <= this date
 * - sortBy: Sort by field (priority, status, dueDate, createdAt)
 * - sortDirection: Sort direction (asc, desc)
 */
router.get('/', taskController.getTasks.bind(taskController));

// Get a specific task by ID
router.get('/:id', taskController.getTaskById.bind(taskController));

// Update a task
router.patch(
    '/:id',
    validateDto(UpdateTaskDto),
    taskController.updateTask.bind(taskController),
);

// Delete a task
router.delete('/:id', taskController.deleteTask.bind(taskController));

export default router;
