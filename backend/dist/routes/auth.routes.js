"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validator_1 = require("../utils/validator");
const auth_dto_1 = require("../dtos/auth.dto");
const router = express_1.default.Router();
const authController = new auth_controller_1.AuthController();
// Register a new user
router.post('/register', (0, validator_1.validateDto)(auth_dto_1.RegisterDto), authController.register.bind(authController));
// Login
router.post('/login', (0, validator_1.validateDto)(auth_dto_1.LoginDto), authController.login.bind(authController));
// Refresh token
router.post('/refresh-token', authController.refreshToken.bind(authController));
// Logout
router.post('/logout', authController.logout.bind(authController));
// Get current user (protected route)
router.get('/me', auth_middleware_1.authenticate, authController.getCurrentUser.bind(authController));
exports.default = router;
