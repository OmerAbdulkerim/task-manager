import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { JWT_CONFIG } from '../config/jwt.config';

const prisma = new PrismaClient();

// Extend Express Request type to include user property
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

/**
 * Authenticate user
 *
 * @remarks
 * This route is protected and requires authentication.
 * The function checks if the user is authenticated and
 * returns a new access token.
 *
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 * @returns The refreshed access token
 */
export async function authenticate(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                status: 'error',
                message: 'Authentication required. Please log in.',
            });
            return;
        }

        // Verify token
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(
            token,
            JWT_CONFIG.ACCESS_TOKEN.SECRET as Secret,
        ) as {
            userId: string;
        };

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: { role: true },
        });

        if (!user) {
            res.status(401).json({
                status: 'error',
                message: 'User not found or token is invalid',
            });
            return;
        }

        // Add user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth error:', error);

        // Check if error is due to token expiration
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                status: 'error',
                message: 'Access token expired',
                code: 'TOKEN_EXPIRED',
            });
            return;
        }

        res.status(401).json({
            status: 'error',
            message: 'Invalid token. Please log in again.',
        });
    }
}

/**
 * Authorize user
 *
 * @remarks
 * This middleware checks if the user is authenticated and
 * has the required role to access the route.
 *
 * @param roles - The roles that are allowed to access the route
 * @returns The authorize middleware
 */
export function authorize(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            res.status(401).json({
                status: 'error',
                message: 'Authentication required',
            });
            return;
        }

        if (!roles.includes(req.user.role.name)) {
            res.status(403).json({
                status: 'error',
                message:
                    'Forbidden: You do not have permission to access this resource',
            });
            return;
        }

        next();
    };
}
