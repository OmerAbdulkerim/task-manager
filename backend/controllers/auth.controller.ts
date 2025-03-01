import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export class AuthController {
    /**
     * Register a new user
     */
    async register(req: Request, res: Response) {
        try {
            const { email, password, roleId } = req.body;
            const result = await authService.register(email, password, roleId);

            res.status(201).json({
                status: 'success',
                message: 'User registered successfully',
                data: result,
            });
        } catch (error: any) {
            console.error('Registration error:', error);
            res.status(400).json({
                status: 'error',
                message: error.message || 'Registration failed',
            });
        }
    }

    /**
     * Login user
     */
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password);

            res.status(200).json({
                status: 'success',
                message: 'Login successful',
                data: result,
            });
        } catch (error: any) {
            console.error('Login error:', error);
            res.status(401).json({
                status: 'error',
                message: error.message || 'Login failed',
            });
        }
    }

    /**
     * Get current user
     */
    getCurrentUser(req: Request, res: Response) {
        try {
            const user = req.user;

            if (!user) {
                res.status(401).json({
                    status: 'error',
                    message: 'Not authenticated',
                });
            }

            res.status(200).json({
                status: 'success',
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                    },
                },
            });
        } catch (error: any) {
            console.error('Get user error:', error);
            res.status(500).json({
                status: 'error',
                message: error.message || 'Failed to get user information',
            });
        }
    }
}
