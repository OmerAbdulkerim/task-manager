import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { JWT_CONFIG } from '../config/jwt.config';

const prisma = new PrismaClient();

export class AuthService {
    /**
     * Register a new user
     */
    async register(email: string, password: string, roleId: string) {
        try {
            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                throw new Error('User with this email already exists');
            }

            // Verify role exists
            const role = await prisma.role.findUnique({
                where: { id: roleId },
            });

            if (!role) {
                throw new Error('Invalid role ID');
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create user
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    roleId,
                },
                include: {
                    role: true,
                },
            });

            // Generate token
            const token = this.generateToken(user.id);

            return {
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
                token,
            };
        } catch (error) {
            console.error('Registration service error:', error);
            throw error;
        }
    }

    /**
     * Login user
     */
    async login(email: string, password: string) {
        try {
            // Find user by email
            const user = await prisma.user.findUnique({
                where: { email },
                include: {
                    role: true,
                },
            });

            // Check if user exists
            if (!user) {
                throw new Error('Invalid email or password');
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(
                password,
                user.password,
            );
            if (!isPasswordValid) {
                throw new Error('Invalid email or password');
            }

            // Generate token
            const token = this.generateToken(user.id);

            return {
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
                token,
            };
        } catch (error) {
            console.error('Login service error:', error);
            throw error;
        }
    }

    /**
     * Generate JWT token
     */
    private generateToken(userId: string): string {
        return jwt.sign({ userId }, JWT_CONFIG.SECRET);
    }
}
