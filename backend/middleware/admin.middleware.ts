import { Request, Response, NextFunction } from 'express';
import { authenticate } from './auth.middleware';

/**
 * Admin authorization middleware
 *
 * @remarks
 * This middleware checks if the authenticated user has admin privileges.
 * It first authenticates the user using the authenticate middleware,
 * then checks if the user's roleId is 1 (admin).
 *
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 */
export async function requireAdmin(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    // First authenticate the user
    authenticate(req, res, (err) => {
        if (err) {
            return next(err);
        }

        // Check if user exists and has admin role (roleId === 1)
        if (!req.user || req.user.roleId !== 1) {
            return res.status(403).json({
                status: 'error',
                message: 'Access denied: Admin privileges required',
            });
        }

        // User is authenticated and has admin privileges
        next();
    });
}
