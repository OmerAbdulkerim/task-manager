import { Request, Response } from 'express';
import { CommentService } from '../services/comment.service';

// Initialize CommentService
const commentService = new CommentService();

export class CommentController {
    /**
     * Get all comments for a task
     *
     * @remarks
     * This route is protected and requires authentication.
     *
     * @param req - The request object
     * @param res - The response object
     * @returns A list of all comments for the task
     */
    async getCommentsByTaskId(req: Request, res: Response) {
        try {
            const { taskId } = req.params;
            const comments = await commentService.getCommentsByTaskId(taskId);
            res.status(200).json({ status: 'success', data: { comments } });
        } catch (error: any) {
            console.error('Get comments by task ID error:', error);
            res.status(500).json({
                status: 'error',
                message: error.message || 'Failed to get comments',
            });
        }
    }

    /**
     * Get a comment by ID
     *
     * @remarks
     * This route is protected and requires authentication.
     *
     * @param req - The request object
     * @param res - The response object
     * @returns The comment with the specified ID
     */
    async getCommentById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const comment = await commentService.getCommentById(id);
            res.status(200).json({ status: 'success', data: { comment } });
        } catch (error: any) {
            console.error('Get comment by ID error:', error);
            res.status(404).json({
                status: 'error',
                message: error.message || 'Comment not found',
            });
        }
    }

    /**
     * Create a new comment
     *
     * @remarks
     * This route is protected and requires authentication.
     *
     * @param req - The request object
     * @param res - The response object
     * @returns The newly created comment
     */
    async createComment(req: Request, res: Response) {
        try {
            // Get user ID from the authenticated user
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    status: 'error',
                    message: 'User not authenticated',
                });
            }

            // If createdById is not set in the request body, use the authenticated user's ID
            if (!req.body.createdById) {
                req.body.createdById = userId;
            }

            const comment = await commentService.createComment(
                userId,
                req.body,
            );
            res.status(201).json({
                status: 'success',
                message: 'Comment created successfully',
                data: { comment },
            });
        } catch (error: any) {
            console.error('Create comment error:', error);
            res.status(400).json({
                status: 'error',
                message: error.message || 'Failed to create comment',
            });
        }
    }

    /**
     * Update a comment
     *
     * @remarks
     * This route is protected and requires authentication.
     * Users can only update their own comments.
     *
     * @param req - The request object
     * @param res - The response object
     * @returns The updated comment
     */
    async updateComment(req: Request, res: Response) {
        try {
            // Get user ID from the authenticated user
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    status: 'error',
                    message: 'User not authenticated',
                });
            }

            const { id } = req.params;
            const comment = await commentService.updateComment(
                id,
                userId,
                req.body,
            );
            res.status(200).json({
                status: 'success',
                message: 'Comment updated successfully',
                data: { comment },
            });
        } catch (error: any) {
            console.error('Update comment error:', error);

            // Differentiate between not found and permission errors
            if (error.message.includes('not found')) {
                return res
                    .status(404)
                    .json({ status: 'error', message: error.message });
            } else if (error.message.includes('can only update your own')) {
                return res
                    .status(403)
                    .json({ status: 'error', message: error.message });
            }

            res.status(400).json({
                status: 'error',
                message: error.message || 'Failed to update comment',
            });
        }
    }

    /**
     * Delete a comment
     *
     * @remarks
     * This route is protected and requires authentication.
     * Users can only delete their own comments or comments on their tasks.
     *
     * @param req - The request object
     * @param res - The response object
     * @returns A success message
     */
    async deleteComment(req: Request, res: Response) {
        try {
            // Get user ID from the authenticated user
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    status: 'error',
                    message: 'User not authenticated',
                });
            }

            const { id } = req.params;
            await commentService.deleteComment(id, userId);
            res.status(200).json({
                status: 'success',
                message: 'Comment deleted successfully',
            });
        } catch (error: any) {
            console.error('Delete comment error:', error);

            // Differentiate between not found and permission errors
            if (error.message.includes('not found')) {
                return res
                    .status(404)
                    .json({ status: 'error', message: error.message });
            } else if (error.message.includes('can only delete')) {
                return res
                    .status(403)
                    .json({ status: 'error', message: error.message });
            }

            res.status(400).json({
                status: 'error',
                message: error.message || 'Failed to delete comment',
            });
        }
    }
}
