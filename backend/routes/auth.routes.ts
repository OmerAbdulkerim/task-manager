import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateDto } from '../utils/validator';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();
const authController = new AuthController();

// Register new user
router.post('/register', validateDto(RegisterDto), authController.register);

// Login user
router.post('/login', validateDto(LoginDto), authController.login);

// Get current user (protected route)
router.get('/me', authenticate, authController.getCurrentUser);

export default router;
