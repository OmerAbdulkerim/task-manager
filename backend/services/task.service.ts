import { PrismaClient, Task, TaskStatus } from '@prisma/client';
import { CreateTaskDto, TaskFilterDto, UpdateTaskDto } from '../dtos/task.dto';

const prisma = new PrismaClient();

export class TaskService {
    /**
     * Create a new task
     *
     * @remarks
     * Method to create a new task for the currently authenticated user.
     *
     * @param createTaskDto - The task data to create
     * @param userId - The ID of the user creating the task
     * @returns The created task
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
     * Get all tasks for a user with optional filtering and sorting
     *
     * @remarks
     * Method to get all tasks for the currently authenticated user with optional filtering and sorting.
     * Default sorting is by createdAt in descending order.
     * Supports filtering and sorting by priority, status, due date, and create date.
     *
     * @param userId - The ID of the user
     * @param filterOptions - The filter options
     * @returns An array of tasks
     */
    async getTasks(
        userId: string,
        filterOptions?: TaskFilterDto,
    ): Promise<Task[]> {
        try {
            // Start with base where clause for user
            const whereClause: any = {
                createdById: userId,
            };

            // Add filters if provided
            if (filterOptions) {
                // Filter by priority IDs
                if (
                    filterOptions.priorityIds &&
                    filterOptions.priorityIds.length > 0
                ) {
                    whereClause.priorityId = {
                        in: filterOptions.priorityIds,
                    };
                }

                // Filter by statuses
                if (
                    filterOptions.statuses &&
                    filterOptions.statuses.length > 0
                ) {
                    whereClause.status = {
                        in: filterOptions.statuses,
                    };
                }

                // Filter by due date range
                if (filterOptions.dueDateFrom || filterOptions.dueDateTo) {
                    whereClause.dueDate = {};

                    if (filterOptions.dueDateFrom) {
                        whereClause.dueDate.gte = filterOptions.dueDateFrom;
                    }

                    if (filterOptions.dueDateTo) {
                        whereClause.dueDate.lte = filterOptions.dueDateTo;
                    }
                }

                // Filter by creation date range
                if (filterOptions.createdAtFrom || filterOptions.createdAtTo) {
                    whereClause.createdAt = {};

                    if (filterOptions.createdAtFrom) {
                        whereClause.createdAt.gte = filterOptions.createdAtFrom;
                    }

                    if (filterOptions.createdAtTo) {
                        whereClause.createdAt.lte = filterOptions.createdAtTo;
                    }
                }
            }

            const orderBy: any = {};

            if (filterOptions?.sortBy) {
                const direction = filterOptions.sortDirection || 'desc';

                switch (filterOptions.sortBy) {
                    case 'priority':
                        orderBy.priority = { level: direction };
                        break;
                    case 'status':
                        orderBy.status = direction;
                        break;
                    case 'dueDate':
                        orderBy.dueDate = direction;
                        break;
                    case 'createdAt':
                    default:
                        orderBy.createdAt = direction;
                        break;
                }
            } else {
                orderBy.createdAt = 'desc';
            }

            const tasks = await prisma.task.findMany({
                where: whereClause,
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
                orderBy: orderBy,
            });

            return tasks;
        } catch (error) {
            console.error('Get tasks error:', error);
            throw error;
        }
    }

    /**
     * Get a task by ID
     *
     * @remarks
     * Method to get a task by ID for the currently authenticated user.
     *
     * @param taskId - The ID of the task
     * @param userId - The ID of the user
     * @returns The task
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
     *
     * @remarks
     * Method to update a task for the currently authenticated user.
     * Needs to have the id of the task to update and the updated data.
     * Goes through a series of checks to ensure the task exists and belongs to the user.
     *
     * @param taskId - The ID of the task
     * @param updateTaskDto - The updated task data
     * @param userId - The ID of the user
     * @returns The updated task
     */
    async updateTask(
        taskId: string,
        updateTaskDto: UpdateTaskDto,
        userId: string,
    ): Promise<Task | null> {
        try {
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

            if (updateTaskDto.categoryId) {
                const category = await prisma.taskCategory.findUnique({
                    where: { id: updateTaskDto.categoryId },
                });

                if (!category) {
                    throw new Error('Invalid category ID');
                }
            }

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
     *
     * @remarks
     * Method to delete a task for the currently authenticated user.
     * Needs to have the id of the task to delete.
     *
     * @param taskId - The ID of the task
     * @param userId - The ID of the user
     * @returns True if the task was deleted, false otherwise
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
