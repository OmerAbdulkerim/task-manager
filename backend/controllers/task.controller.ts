import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { TaskFilterDto } from '../dtos/task.dto';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';

const taskService = new TaskService();

export class TaskController {
    /**
     * Create a new task
     *
     * @remarks
     * Method to create a new task for the currently authenticated user.
     *
     * @param req - The request object
     * @param res - The response object
     */
    async createTask(req: Request, res: Response) {
        try {
            const userId = req.user.id;
            const taskData = req.body;
            const task = await taskService.createTask(taskData, userId);

            res.status(201).json({
                status: 'success',
                message: 'Task created successfully',
                data: {
                    task,
                },
            });
        } catch (error: any) {
            console.error('Create task error:', error);
            res.status(400).json({
                status: 'error',
                message: error.message || 'Failed to create task',
            });
        }
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
    async getTasks(req: Request, res: Response) {
        try {
            const userId = req.user.id;

            // Extract filter and sort parameters from query
            const filterOptions = plainToClass(TaskFilterDto, req.query);

            // Validate filter options if any were provided
            if (Object.keys(req.query).length > 0) {
                try {
                    await validateOrReject(filterOptions);
                } catch (validationErrors) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Invalid filter parameters',
                        errors: validationErrors,
                    });
                }
            }

            // Get tasks with filters applied
            const tasks = await taskService.getTasks(userId, filterOptions);

            res.status(200).json({
                status: 'success',
                data: {
                    tasks,
                    count: tasks.length,
                },
            });
        } catch (error: any) {
            console.error('Get tasks error:', error);
            res.status(500).json({
                status: 'error',
                message: error.message || 'Failed to retrieve tasks',
            });
        }
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
    async getTaskById(req: Request, res: Response) {
        try {
            const userId = req.user.id;
            const taskId = req.params.id;
            const task = await taskService.getTaskById(taskId, userId);

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
        } catch (error: any) {
            console.error('Get task by ID error:', error);
            res.status(500).json({
                status: 'error',
                message: error.message || 'Failed to retrieve task',
            });
        }
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
    async updateTask(req: Request, res: Response) {
        try {
            const userId = req.user.id;
            const taskId = req.params.id;
            const taskData = req.body;

            const updatedTask = await taskService.updateTask(
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
        } catch (error: any) {
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
    async deleteTask(req: Request, res: Response) {
        try {
            const userId = req.user.id;
            const taskId = req.params.id;

            await taskService.deleteTask(taskId, userId);

            res.status(200).json({
                status: 'success',
                message: 'Task deleted successfully',
            });
        } catch (error: any) {
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
    }
}
