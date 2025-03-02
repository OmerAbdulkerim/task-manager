'use strict';
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator['throw'](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step(
                (generator = generator.apply(thisArg, _arguments || [])).next(),
            );
        });
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.TaskController = void 0;
const task_service_1 = require('../services/task.service');
const task_dto_1 = require('../dtos/task.dto');
const class_transformer_1 = require('class-transformer');
const class_validator_1 = require('class-validator');
const taskService = new task_service_1.TaskService();
class TaskController {
    /**
     * Create a new task
     *
     * @remarks
     * Method to create a new task for the currently authenticated user.
     *
     * @param req - The request object
     * @param res - The response object
     */
    createTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const taskData = req.body;
                const task = yield taskService.createTask(taskData, userId);
                res.status(201).json({
                    status: 'success',
                    message: 'Task created successfully',
                    data: {
                        task,
                    },
                });
            } catch (error) {
                console.error('Create task error:', error);
                res.status(400).json({
                    status: 'error',
                    message: error.message || 'Failed to create task',
                });
            }
        });
    }
    /**
     * Get all tasks for the current user
     *
     * @remarks
     * The function checks if the user is authenticated and
     * returns all tasks if so. If not, it returns a 404 error.
     * Supports filtering and sorting by priority, status, due date, and create date
     *
     * @param req - The request object
     * @param res - The response object
     *
     * @example
     * GET /tasks?priorityIds=1,3&statuses=IN_PROGRESS,COMPLETED&dueDateFrom=2024-01-01&dueDateTo=2024-12-31&createdAtFrom=2024-01-01&createdAtTo=2024-12-31&sortBy=dueDate&sortDirection=desc
     */
    getTasks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                // Extract filter and sort parameters from query
                const filterOptions = (0, class_transformer_1.plainToClass)(
                    task_dto_1.TaskFilterDto,
                    req.query,
                );
                // Validate filter options if any were provided
                if (Object.keys(req.query).length > 0) {
                    try {
                        yield (0, class_validator_1.validateOrReject)(
                            filterOptions,
                        );
                    } catch (validationErrors) {
                        return res.status(400).json({
                            status: 'error',
                            message: 'Invalid filter parameters',
                            errors: validationErrors,
                        });
                    }
                }
                // Get tasks with filters applied
                const tasks = yield taskService.getTasks(userId, filterOptions);
                res.status(200).json({
                    status: 'success',
                    data: {
                        tasks,
                        count: tasks.length,
                    },
                });
            } catch (error) {
                console.error('Get tasks error:', error);
                res.status(500).json({
                    status: 'error',
                    message: error.message || 'Failed to retrieve tasks',
                });
            }
        });
    }
    /**
     * Get a task by ID
     *
     * @remarks
     * The function checks if the user is authenticated and
     * returns the task if so. If not, it returns a 404 error.
     *
     * @param req - The request object
     * @param res - The response object
     */
    getTaskById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const taskId = req.params.id;
                const task = yield taskService.getTaskById(taskId, userId);
                if (!task) {
                    res.status(404).json({
                        status: 'error',
                        message:
                            'Task not found or you do not have permission to view it',
                    });
                    return;
                }
                res.status(200).json({
                    status: 'success',
                    data: {
                        task,
                    },
                });
            } catch (error) {
                console.error('Get task by ID error:', error);
                res.status(500).json({
                    status: 'error',
                    message: error.message || 'Failed to retrieve task',
                });
            }
        });
    }
    /**
     * Update a task
     *
     * @remarks
     * Method to update a task for the currently authenticated user.
     * Needs to have the id of the task to update and the updated data.
     *
     * @param req - The request object
     * @param res - The response object
     */
    updateTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const taskId = req.params.id;
                const taskData = req.body;
                const updatedTask = yield taskService.updateTask(
                    taskId,
                    taskData,
                    userId,
                );
                res.status(200).json({
                    status: 'success',
                    message: 'Task updated successfully',
                    data: {
                        task: updatedTask,
                    },
                });
            } catch (error) {
                console.error('Update task error:', error);
                if (error.message.includes('permission')) {
                    res.status(403).json({
                        status: 'error',
                        message: error.message,
                    });
                    return;
                }
                if (error.message.includes('not found')) {
                    res.status(404).json({
                        status: 'error',
                        message: error.message,
                    });
                    return;
                }
                res.status(400).json({
                    status: 'error',
                    message: error.message || 'Failed to update task',
                });
            }
        });
    }
    /**
     * Delete a task
     *
     * @remarks
     * Method to delete a task for the currently authenticated user.
     * Needs to have the id of the task to delete.
     *
     * @param req - The request object
     * @param res - The response object
     */
    deleteTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const taskId = req.params.id;
                yield taskService.deleteTask(taskId, userId);
                res.status(200).json({
                    status: 'success',
                    message: 'Task deleted successfully',
                });
            } catch (error) {
                console.error('Delete task error:', error);
                if (error.message.includes('permission')) {
                    res.status(403).json({
                        status: 'error',
                        message: error.message,
                    });
                    return;
                }
                if (error.message.includes('not found')) {
                    res.status(404).json({
                        status: 'error',
                        message: error.message,
                    });
                    return;
                }
                res.status(500).json({
                    status: 'error',
                    message: error.message || 'Failed to delete task',
                });
            }
        });
    }
}
exports.TaskController = TaskController;
