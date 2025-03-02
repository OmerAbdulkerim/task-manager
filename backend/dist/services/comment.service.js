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
exports.CommentService = void 0;
const client_1 = require('@prisma/client');
// Initialize Prisma client
const prisma = new client_1.PrismaClient();
class CommentService {
    /**
     * Get all comments for a task
     *
     * @param taskId - The ID of the task to get comments for
     * @returns A list of all comments for the task
     */
    getCommentsByTaskId(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comments = yield prisma.comment.findMany({
                    where: { taskId },
                    include: {
                        author: {
                            select: {
                                id: true,
                                email: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                });
                return comments;
            } catch (error) {
                console.error('Error getting comments by task ID:', error);
                throw error;
            }
        });
    }
    /**
     * Get a comment by ID
     *
     * @param id - The ID of the comment to get
     * @returns The comment with the given ID
     */
    getCommentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comment = yield prisma.comment.findUnique({
                    where: { id },
                    include: {
                        author: {
                            select: {
                                id: true,
                                email: true,
                            },
                        },
                    },
                });
                if (!comment) {
                    throw new Error('Comment not found');
                }
                return comment;
            } catch (error) {
                console.error('Error getting comment by ID:', error);
                throw error;
            }
        });
    }
    /**
     * Create a new comment
     *
     * @param userId - The ID of the user creating the comment
     * @param commentData - The data for the new comment
     * @returns The newly created comment
     */
    createComment(userId, commentData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if task exists
                const task = yield prisma.task.findUnique({
                    where: { id: commentData.taskId },
                });
                if (!task) {
                    throw new Error('Task not found');
                }
                const comment = yield prisma.comment.create({
                    data: {
                        content: commentData.content,
                        taskId: commentData.taskId,
                        authorId: commentData.createdById || userId,
                    },
                    include: {
                        author: {
                            select: {
                                id: true,
                                email: true,
                            },
                        },
                    },
                });
                return comment;
            } catch (error) {
                console.error('Error creating comment:', error);
                throw error;
            }
        });
    }
    /**
     * Update a comment
     *
     * @param id - The ID of the comment to update
     * @param userId - The ID of the user updating the comment
     * @param commentData - The data to update the comment with
     * @returns The updated comment
     */
    updateComment(id, userId, commentData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if comment exists and user is the author
                const existingComment = yield prisma.comment.findUnique({
                    where: { id },
                    include: {
                        author: true,
                    },
                });
                if (!existingComment) {
                    throw new Error('Comment not found');
                }
                // Check if the user is the author of the comment
                if (existingComment.authorId !== userId) {
                    throw new Error('You can only update your own comments');
                }
                const updatedComment = yield prisma.comment.update({
                    where: { id },
                    data: {
                        content: commentData.content,
                    },
                    include: {
                        author: {
                            select: {
                                id: true,
                                email: true,
                            },
                        },
                    },
                });
                return updatedComment;
            } catch (error) {
                console.error('Error updating comment:', error);
                throw error;
            }
        });
    }
    /**
     * Delete a comment
     *
     * @param id - The ID of the comment to delete
     * @param userId - The ID of the user deleting the comment
     * @returns A success message
     */
    deleteComment(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if comment exists
                const comment = yield prisma.comment.findUnique({
                    where: { id },
                    include: {
                        author: true,
                        task: {
                            select: {
                                createdById: true,
                            },
                        },
                    },
                });
                if (!comment) {
                    throw new Error('Comment not found');
                }
                // Check if the user is the author of the comment or the task owner
                const isAuthor = comment.authorId === userId;
                const isTaskOwner = comment.task.createdById === userId;
                if (!isAuthor && !isTaskOwner) {
                    throw new Error(
                        'You can only delete your own comments or comments on your tasks',
                    );
                }
                yield prisma.comment.delete({
                    where: { id },
                });
                return { message: 'Comment deleted successfully' };
            } catch (error) {
                console.error('Error deleting comment:', error);
                throw error;
            }
        });
    }
}
exports.CommentService = CommentService;
