import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
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

export async function authenticate(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        // Get token from header
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
        const decoded = jwt.verify(token, JWT_CONFIG.SECRET) as {
            userId: string;
        };

        // Find user by id
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
        res.status(401).json({
            status: 'error',
            message: 'Invalid token. Please log in again.',
        });
    }
}

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
