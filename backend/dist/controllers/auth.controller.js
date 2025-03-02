'use strict';
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator['throw'](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step(
                (generator = generator.apply(thisArg, _arguments || [])).next(),
            );
        });
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.AuthController = void 0;
const auth_service_1 = require('../services/auth.service');
const authService = new auth_service_1.AuthService();
class AuthController {
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
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, roleId } = req.body;
                const result = yield authService.register({
                    email,
                    password,
                    roleId: Number(roleId),
                });
                res.status(201).json({
                    status: 'success',
                    message: 'User registered successfully',
                    data: result,
                });
            } catch (error) {
                console.error('Registration error:', error);
                res.status(400).json({
                    status: 'error',
                    message: error.message || 'Registration failed',
                });
            }
        });
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
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const result = yield authService.login({ email, password });
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
            } catch (error) {
                console.error('Login error:', error);
                res.status(401).json({
                    status: 'error',
                    message: error.message || 'Login failed',
                });
            }
        });
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
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = req.cookies.refreshToken;
                if (!refreshToken) {
                    res.status(401).json({
                        status: 'error',
                        message: 'Refresh token not found',
                    });
                    return;
                }
                const result = yield authService.refreshToken(refreshToken);
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
            } catch (error) {
                console.error('Refresh token error:', error);
                res.status(401).json({
                    status: 'error',
                    message: error.message || 'Failed to refresh token',
                });
            }
        });
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
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = req.cookies.refreshToken;
                if (refreshToken) {
                    yield authService.logout(refreshToken);
                }
                res.clearCookie('refreshToken');
                res.status(200).json({
                    status: 'success',
                    message: 'Logged out successfully',
                });
            } catch (error) {
                console.error('Logout error:', error);
                res.status(500).json({
                    status: 'error',
                    message: error.message || 'Logout failed',
                });
            }
        });
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
    getCurrentUser(req, res) {
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
        } catch (error) {
            console.error('Get user error:', error);
            res.status(500).json({
                status: 'error',
                message: error.message || 'Failed to get user information',
            });
        }
    }
}
exports.AuthController = AuthController;
