'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const task_controller_1 = require('../controllers/task.controller');
const auth_middleware_1 = require('../middleware/auth.middleware');
const validator_1 = require('../utils/validator');
const task_dto_1 = require('../dtos/task.dto');
const router = express_1.default.Router();
const taskController = new task_controller_1.TaskController();
// All routes require authentication
router.use(auth_middleware_1.authenticate);
// Create new task
router.post(
    '/',
    (0, validator_1.validateDto)(task_dto_1.CreateTaskDto),
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
    (0, validator_1.validateDto)(task_dto_1.UpdateTaskDto),
    taskController.updateTask.bind(taskController),
);
// Delete a task
router.delete('/:id', taskController.deleteTask.bind(taskController));
exports.default = router;
