import { PrismaClient, Task } from '@prisma/client';
import { CreateTaskDto, UpdateTaskDto } from '../dtos/task.dto';

const prisma = new PrismaClient();

export class TaskService {
    /**
     * Create a new task
     */
    async createTask(
        createTaskDto: CreateTaskDto,
        userId: string,
    ): Promise<Task> {
        try {
            // Verify category exists
            const category = await prisma.taskCategory.findUnique({
                where: { id: createTaskDto.categoryId },
            });

            if (!category) {
                throw new Error('Invalid category ID');
            }

            // Verify priority exists
            const priority = await prisma.taskPriority.findUnique({
                where: { id: createTaskDto.priorityId },
            });

            if (!priority) {
                throw new Error('Invalid priority ID');
            }

            // Create task
            const task = await prisma.task.create({
                data: {
                    title: createTaskDto.title,
                    description: createTaskDto.description,
                    status: createTaskDto.status,
                    priorityId: createTaskDto.priorityId,
                    categoryId: createTaskDto.categoryId,
                    dueDate: createTaskDto.dueDate,
                    createdById: userId,
                },
                include: {
                    category: true,
                    priority: true,
                    createdBy: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                },
            });

            return task;
        } catch (error) {
            console.error('Create task error:', error);
            throw error;
        }
    }

    /**
     * Get all tasks for a user
     */
    async getTasks(userId: string): Promise<Task[]> {
        try {
            const tasks = await prisma.task.findMany({
                where: {
                    createdById: userId,
                },
                include: {
                    category: true,
                    priority: true,
                    createdBy: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });

            return tasks;
        } catch (error) {
            console.error('Get tasks error:', error);
            throw error;
        }
    }

    /**
     * Get a task by ID
     */
    async getTaskById(taskId: string, userId: string): Promise<Task | null> {
        try {
            const task = await prisma.task.findUnique({
                where: {
                    id: taskId,
                },
                include: {
                    category: true,
                    priority: true,
                    createdBy: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                },
            });

            // Check if task exists and belongs to the user
            if (!task || task.createdById !== userId) {
                return null;
            }

            return task;
        } catch (error) {
            console.error('Get task by ID error:', error);
            throw error;
        }
    }

    /**
     * Update a task
     */
    async updateTask(
        taskId: string,
        updateTaskDto: UpdateTaskDto,
        userId: string,
    ): Promise<Task | null> {
        try {
            // Check if task exists and belongs to the user
            const existingTask = await prisma.task.findUnique({
                where: {
                    id: taskId,
                },
            });

            if (!existingTask) {
                throw new Error('Task not found');
            }

            if (existingTask.createdById !== userId) {
                throw new Error(
                    'You do not have permission to update this task',
                );
            }

            // Verify category if provided
            if (updateTaskDto.categoryId) {
                const category = await prisma.taskCategory.findUnique({
                    where: { id: updateTaskDto.categoryId },
                });

                if (!category) {
                    throw new Error('Invalid category ID');
                }
            }

            // Verify priority if provided
            if (updateTaskDto.priorityId) {
                const priority = await prisma.taskPriority.findUnique({
                    where: { id: updateTaskDto.priorityId },
                });

                if (!priority) {
                    throw new Error('Invalid priority ID');
                }
            }

            // Update task
            const updatedTask = await prisma.task.update({
                where: {
                    id: taskId,
                },
                data: {
                    ...(updateTaskDto.title && { title: updateTaskDto.title }),
                    ...(updateTaskDto.description !== undefined && {
                        description: updateTaskDto.description,
                    }),
                    ...(updateTaskDto.status && {
                        status: updateTaskDto.status,
                    }),
                    ...(updateTaskDto.priorityId && {
                        priorityId: updateTaskDto.priorityId,
                    }),
                    ...(updateTaskDto.categoryId && {
                        categoryId: updateTaskDto.categoryId,
                    }),
                    ...(updateTaskDto.dueDate && {
                        dueDate: updateTaskDto.dueDate,
                    }),
                },
                include: {
                    category: true,
                    priority: true,
                    createdBy: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                },
            });

            return updatedTask;
        } catch (error) {
            console.error('Update task error:', error);
            throw error;
        }
    }

    /**
     * Delete a task
     */
    async deleteTask(taskId: string, userId: string): Promise<boolean> {
        try {
            // Check if task exists and belongs to the user
            const existingTask = await prisma.task.findUnique({
                where: {
                    id: taskId,
                },
            });

            if (!existingTask) {
                throw new Error('Task not found');
            }

            if (existingTask.createdById !== userId) {
                throw new Error(
                    'You do not have permission to delete this task',
                );
            }

            // Delete task
            await prisma.task.delete({
                where: {
                    id: taskId,
                },
            });

            return true;
        } catch (error) {
            console.error('Delete task error:', error);
            throw error;
        }
    }
}
