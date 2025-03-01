import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateDto } from '../utils/validator';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';

const router = express.Router();
const authController = new AuthController();

// Register a new user
router.post(
    '/register',
    validateDto(RegisterDto),
    authController.register.bind(authController),
);

// Login
router.post(
    '/login',
    validateDto(LoginDto),
    authController.login.bind(authController),
);

// Refresh token
router.post('/refresh-token', authController.refreshToken.bind(authController));

// Logout
router.post('/logout', authController.logout.bind(authController));

// Get current user (protected route)
router.get(
    '/me',
    authenticate,
    authController.getCurrentUser.bind(authController),
);

export default router;
