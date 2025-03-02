import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export class AuthController {
    /**
     * Register a new user
     *
     * @remarks
     * This route is public.
     * The function registers a new user and returns a success message.
     *
     * @param req - The request object
     * @param res - The response object
     * @returns The registration response
     */
    async register(req: Request, res: Response) {
        try {
            const { email, password, roleId } = req.body;
            const result = await authService.register({
                email,
                password,
                roleId: Number(roleId),
            });

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
     *
     * @remarks
     * This route is public.
     * The function validates the user credentials and
     * returns an access token and refresh token.
     *
     * @param req - The request object
     * @param res - The response object
     * @returns The login response
     */
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const result = await authService.login({ email, password });

            // Set refresh token in HTTP-only cookie
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            res.status(200).json({
                status: 'success',
                message: 'Login successful',
                data: {
                    user: result.user,
                    accessToken: result.accessToken,
                },
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
     * Refresh access token
     *
     * @remarks
     * This route is protected and requires authentication.
     * The function checks if the user is authenticated and
     * returns a new access token.
     *
     * @param req - The request object
     * @param res - The response object
     * @returns The refreshed access token
     */
    async refreshToken(req: Request, res: Response) {
        try {
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                res.status(401).json({
                    status: 'error',
                    message: 'Refresh token not found',
                });
                return;
            }

            const result = await authService.refreshToken(refreshToken);

            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.status(200).json({
                status: 'success',
                data: {
                    accessToken: result.accessToken,
                    user: result.user,
                },
            });
        } catch (error: any) {
            console.error('Refresh token error:', error);
            res.status(401).json({
                status: 'error',
                message: error.message || 'Failed to refresh token',
            });
        }
    }

    /**
     * Logout user
     *
     * @remarks
     * This route is protected and requires authentication.
     * The function checks if the user is authenticated and
     * logs the user out by clearing the refresh token cookie.
     *
     * @param req - The request object
     * @param res - The response object
     * @returns The logout status
     */
    async logout(req: Request, res: Response) {
        try {
            const refreshToken = req.cookies.refreshToken;

            if (refreshToken) {
                await authService.logout(refreshToken);
            }

            res.clearCookie('refreshToken');

            res.status(200).json({
                status: 'success',
                message: 'Logged out successfully',
            });
        } catch (error: any) {
            console.error('Logout error:', error);
            res.status(500).json({
                status: 'error',
                message: error.message || 'Logout failed',
            });
        }
    }

    /**
     * Get current user information (protected route)
     *
     * @remarks
     * This route is protected and requires authentication.
     * The function checks if the user is authenticated and
     * returns the user information if so.
     *
     * @param req - The request object
     * @param res - The response object
     * @returns The current user information
     */
    getCurrentUser(req: Request, res: Response) {
        try {
            const user = req.user;

            if (!user) {
                res.status(401).json({
                    status: 'error',
                    message: 'Not authenticated',
                });
                return;
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
