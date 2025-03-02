"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comment_controller_1 = require("../controllers/comment.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validator_1 = require("../utils/validator");
const comment_dto_1 = require("../dtos/comment.dto");
const router = express_1.default.Router();
const commentController = new comment_controller_1.CommentController();
// Apply authentication middleware to all routes
router.use(auth_middleware_1.authenticate);
// Comment routes
router.get('/task/:taskId', commentController.getCommentsByTaskId.bind(commentController));
router.get('/:id', commentController.getCommentById.bind(commentController));
router.post('/', (0, validator_1.validateDto)(comment_dto_1.CreateCommentDto), commentController.createComment.bind(commentController));
router.patch('/:id', (0, validator_1.validateDto)(comment_dto_1.UpdateCommentDto), commentController.updateComment.bind(commentController));
router.delete('/:id', commentController.deleteComment.bind(commentController));
exports.default = router;
