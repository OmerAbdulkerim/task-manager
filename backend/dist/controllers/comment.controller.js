"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = void 0;
const comment_service_1 = require("../services/comment.service");
// Initialize CommentService
const commentService = new comment_service_1.CommentService();
class CommentController {
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
    getCommentsByTaskId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { taskId } = req.params;
                const comments = yield commentService.getCommentsByTaskId(taskId);
                res.status(200).json({ status: 'success', data: { comments } });
            }
            catch (error) {
                console.error('Get comments by task ID error:', error);
                res.status(500).json({
                    status: 'error',
                    message: error.message || 'Failed to get comments',
                });
            }
        });
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
    getCommentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const comment = yield commentService.getCommentById(id);
                res.status(200).json({ status: 'success', data: { comment } });
            }
            catch (error) {
                console.error('Get comment by ID error:', error);
                res.status(404).json({
                    status: 'error',
                    message: error.message || 'Comment not found',
                });
            }
        });
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
    createComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Get user ID from the authenticated user
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
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
                const comment = yield commentService.createComment(userId, req.body);
                res.status(201).json({
                    status: 'success',
                    message: 'Comment created successfully',
                    data: { comment },
                });
            }
            catch (error) {
                console.error('Create comment error:', error);
                res.status(400).json({
                    status: 'error',
                    message: error.message || 'Failed to create comment',
                });
            }
        });
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
    updateComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Get user ID from the authenticated user
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return res.status(401).json({
                        status: 'error',
                        message: 'User not authenticated',
                    });
                }
                const { id } = req.params;
                const comment = yield commentService.updateComment(id, userId, req.body);
                res.status(200).json({
                    status: 'success',
                    message: 'Comment updated successfully',
                    data: { comment },
                });
            }
            catch (error) {
                console.error('Update comment error:', error);
                // Differentiate between not found and permission errors
                if (error.message.includes('not found')) {
                    return res
                        .status(404)
                        .json({ status: 'error', message: error.message });
                }
                else if (error.message.includes('can only update your own')) {
                    return res
                        .status(403)
                        .json({ status: 'error', message: error.message });
                }
                res.status(400).json({
                    status: 'error',
                    message: error.message || 'Failed to update comment',
                });
            }
        });
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
    deleteComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Get user ID from the authenticated user
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return res.status(401).json({
                        status: 'error',
                        message: 'User not authenticated',
                    });
                }
                const { id } = req.params;
                yield commentService.deleteComment(id, userId);
                res.status(200).json({
                    status: 'success',
                    message: 'Comment deleted successfully',
                });
            }
            catch (error) {
                console.error('Delete comment error:', error);
                // Differentiate between not found and permission errors
                if (error.message.includes('not found')) {
                    return res
                        .status(404)
                        .json({ status: 'error', message: error.message });
                }
                else if (error.message.includes('can only delete')) {
                    return res
                        .status(403)
                        .json({ status: 'error', message: error.message });
                }
                res.status(400).json({
                    status: 'error',
                    message: error.message || 'Failed to delete comment',
                });
            }
        });
    }
}
exports.CommentController = CommentController;
