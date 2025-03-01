import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';

const taskService = new TaskService();

export class TaskController {
    /**
     * Create a new task
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
     */
    async getTasks(req: Request, res: Response) {
        try {
            const userId = req.user.id;
            const tasks = await taskService.getTasks(userId);

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
