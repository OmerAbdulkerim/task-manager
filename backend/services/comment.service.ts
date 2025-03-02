import { PrismaClient } from '@prisma/client';
import { CreateCommentDto, UpdateCommentDto } from '../dtos/comment.dto';

// Initialize Prisma client
const prisma = new PrismaClient();

export class CommentService {
    /**
     * Get all comments for a task
     *
     * @param taskId - The ID of the task to get comments for
     * @returns A list of all comments for the task
     */
    async getCommentsByTaskId(taskId: string) {
        try {
            const comments = await prisma.comment.findMany({
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
    }

    /**
     * Get a comment by ID
     *
     * @param id - The ID of the comment to get
     * @returns The comment with the given ID
     */
    async getCommentById(id: string) {
        try {
            const comment = await prisma.comment.findUnique({
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
    }

    /**
     * Create a new comment
     *
     * @param userId - The ID of the user creating the comment
     * @param commentData - The data for the new comment
     * @returns The newly created comment
     */
    async createComment(userId: string, commentData: CreateCommentDto) {
        try {
            // Check if task exists
            const task = await prisma.task.findUnique({
                where: { id: commentData.taskId },
            });

            if (!task) {
                throw new Error('Task not found');
            }

            const comment = await prisma.comment.create({
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
    }

    /**
     * Update a comment
     *
     * @param id - The ID of the comment to update
     * @param userId - The ID of the user updating the comment
     * @param commentData - The data to update the comment with
     * @returns The updated comment
     */
    async updateComment(
        id: string,
        userId: string,
        commentData: UpdateCommentDto,
    ) {
        try {
            // Check if comment exists and user is the author
            const existingComment = await prisma.comment.findUnique({
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

            const updatedComment = await prisma.comment.update({
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
    }

    /**
     * Delete a comment
     *
     * @param id - The ID of the comment to delete
     * @param userId - The ID of the user deleting the comment
     * @returns A success message
     */
    async deleteComment(id: string, userId: string) {
        try {
            // Check if comment exists
            const comment = await prisma.comment.findUnique({
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

            await prisma.comment.delete({
                where: { id },
            });

            return { message: 'Comment deleted successfully' };
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw error;
        }
    }
}
