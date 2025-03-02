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
exports.TaskService = void 0;
const client_1 = require('@prisma/client');
const prisma = new client_1.PrismaClient();
class TaskService {
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
    createTask(createTaskDto, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verify category exists
                const category = yield prisma.taskCategory.findUnique({
                    where: { id: Number(createTaskDto.categoryId) },
                });
                if (!category) {
                    throw new Error('Invalid category ID');
                }
                // Verify priority exists
                const priority = yield prisma.taskPriority.findUnique({
                    where: { id: Number(createTaskDto.priorityId) },
                });
                if (!priority) {
                    throw new Error('Invalid priority ID');
                }
                // Create task
                const task = yield prisma.task.create({
                    data: {
                        title: createTaskDto.title,
                        description: createTaskDto.description,
                        status: createTaskDto.status,
                        priorityId: Number(createTaskDto.priorityId),
                        categoryId: Number(createTaskDto.categoryId),
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
        });
    }
    /**
     * Get all tasks with optional filtering
     *
     * @remarks
     * Method to get all tasks for the currently authenticated user.
     * Provides additional filtering options to refine the search based on various criteria.
     *
     * @param userId - The ID of the user
     * @param filterOptions - Optional filtering criteria
     * @returns An array of tasks matching the criteria
     */
    getTasks(userId, filterOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const whereClause = {
                    createdById: userId,
                };
                if (filterOptions) {
                    // Filter by priority IDs
                    if (
                        filterOptions.priorityIds &&
                        filterOptions.priorityIds.length > 0
                    ) {
                        whereClause.priorityId = {
                            in: filterOptions.priorityIds.map(Number),
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
                    if (
                        filterOptions.createdAtFrom ||
                        filterOptions.createdAtTo
                    ) {
                        whereClause.createdAt = {};
                        if (filterOptions.createdAtFrom) {
                            whereClause.createdAt.gte =
                                filterOptions.createdAtFrom;
                        }
                        if (filterOptions.createdAtTo) {
                            whereClause.createdAt.lte =
                                filterOptions.createdAtTo;
                        }
                    }
                }
                const orderBy = {};
                if (
                    filterOptions === null || filterOptions === void 0
                        ? void 0
                        : filterOptions.sortBy
                ) {
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
                        default:
                            orderBy.createdAt = direction;
                    }
                } else {
                    orderBy.createdAt = 'desc';
                }
                const tasks = yield prisma.task.findMany({
                    where: whereClause,
                    orderBy,
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
                return tasks;
            } catch (error) {
                console.error('Get tasks error:', error);
                throw error;
            }
        });
    }
    /**
     * Get a task by ID
     *
     * @remarks
     * Method to get a task by its ID for the currently authenticated user.
     * Needs to have the id of the task to retrieve.
     * Goes through a series of checks to ensure the task exists and belongs to the user.
     *
     * @param taskId - The ID of the task
     * @param userId - The ID of the user
     * @returns The task if found, otherwise null
     */
    getTaskById(taskId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const task = yield prisma.task.findUnique({
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
        });
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
    updateTask(taskId, updateTaskDto, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingTask = yield prisma.task.findUnique({
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
                if (updateTaskDto.categoryId !== undefined) {
                    const category = yield prisma.taskCategory.findUnique({
                        where: { id: Number(updateTaskDto.categoryId) },
                    });
                    if (!category) {
                        throw new Error('Invalid category ID');
                    }
                }
                if (updateTaskDto.priorityId !== undefined) {
                    const priority = yield prisma.taskPriority.findUnique({
                        where: { id: Number(updateTaskDto.priorityId) },
                    });
                    if (!priority) {
                        throw new Error('Invalid priority ID');
                    }
                }
                // Update task
                const updatedTask = yield prisma.task.update({
                    where: {
                        id: taskId,
                    },
                    data: Object.assign(
                        Object.assign(
                            Object.assign(
                                Object.assign(
                                    Object.assign(
                                        Object.assign(
                                            {},
                                            updateTaskDto.title && {
                                                title: updateTaskDto.title,
                                            },
                                        ),
                                        updateTaskDto.description !==
                                            undefined && {
                                            description:
                                                updateTaskDto.description,
                                        },
                                    ),
                                    updateTaskDto.status && {
                                        status: updateTaskDto.status,
                                    },
                                ),
                                updateTaskDto.priorityId !== undefined && {
                                    priorityId: Number(
                                        updateTaskDto.priorityId,
                                    ),
                                },
                            ),
                            updateTaskDto.categoryId !== undefined && {
                                categoryId: Number(updateTaskDto.categoryId),
                            },
                        ),
                        updateTaskDto.dueDate !== undefined && {
                            dueDate: updateTaskDto.dueDate,
                        },
                    ),
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
        });
    }
    /**
     * Delete a task
     *
     * @remarks
     * Method to delete a task for the currently authenticated user.
     * Needs to have the id of the task to delete.
     * Goes through a series of checks to ensure the task exists and belongs to the user.
     *
     * @param taskId - The ID of the task
     * @param userId - The ID of the user
     * @returns The deleted task
     */
    deleteTask(taskId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingTask = yield prisma.task.findUnique({
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
                const deletedTask = yield prisma.task.delete({
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
                return deletedTask;
            } catch (error) {
                console.error('Delete task error:', error);
                throw error;
            }
        });
    }
}
exports.TaskService = TaskService;
