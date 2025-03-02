import express from 'express';
import { CommentController } from '../controllers/comment.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateDto } from '../utils/validator';
import { CreateCommentDto, UpdateCommentDto } from '../dtos/comment.dto';

const router = express.Router();
const commentController = new CommentController();

// Apply authentication middleware to all routes
router.use(authenticate);

// Comment routes
router.get(
    '/task/:taskId',
    commentController.getCommentsByTaskId.bind(commentController),
);
router.get('/:id', commentController.getCommentById.bind(commentController));
router.post(
    '/',
    validateDto(CreateCommentDto),
    commentController.createComment.bind(commentController),
);
router.patch(
    '/:id',
    validateDto(UpdateCommentDto),
    commentController.updateComment.bind(commentController),
);
router.delete('/:id', commentController.deleteComment.bind(commentController));

export default router;
