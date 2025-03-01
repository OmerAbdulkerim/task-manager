import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwt.config';

const prisma = new PrismaClient();

interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

export class AuthService {
    /**
     * Register a new user
     *
     * @remarks
     * This function registers a new user and returns a success message.
     * The flow of the function is as follows:
     * 1. Check if a user with the given email already exists. If so, return an error.
     * 2. Hash the password.
     * 3. Create a new user.
     * 4. Return a success message.
     * Password is hashed using bcrypt.
     *
     * @param email - The email of the user
     * @param password - The password of the user
     * @param roleId - The role ID of the user
     * @returns The registration response
     */
    async register({
        email,
        password,
        roleId,
    }: {
        email: string;
        password: string;
        roleId: string;
    }) {
        try {
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                throw new Error('User with this email already exists');
            }

            const role = await prisma.role.findUnique({
                where: { id: roleId },
            });

            if (!role) {
                throw new Error('Invalid role ID');
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

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

            const tokens = this.generateTokens(user.id);

            await this.saveRefreshToken(user.id, tokens.refreshToken);

            return {
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
                ...tokens,
            };
        } catch (error) {
            console.error('Registration service error:', error);
            throw error;
        }
    }

    /**
     * Login a user
     *
     * @remarks
     * This function validates the user credentials and
     * returns an access token and refresh token.
     *
     * @param email - The email of the user
     * @param password - The password of the user
     * @returns The login response
     */
    async login({ email, password }: { email: string; password: string }) {
        try {
            const user = await prisma.user.findUnique({
                where: { email },
                include: {
                    role: true,
                },
            });

            if (!user) {
                throw new Error('Invalid email or password');
            }

            const isPasswordValid = await bcrypt.compare(
                password,
                user.password,
            );
            if (!isPasswordValid) {
                throw new Error('Invalid email or password');
            }

            const tokens = this.generateTokens(user.id);

            await this.saveRefreshToken(user.id, tokens.refreshToken);

            return {
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
                ...tokens,
            };
        } catch (error) {
            console.error('Login service error:', error);
            throw error;
        }
    }

    /**
     * Refresh access token using refresh token
     *
     * @remarks
     * This function verifies the refresh token and returns a new access token.
     * The flow is as follows:
     *
     * 1. Verify the refresh token
     * 2. Check if token is expired
     * 3. Generate new token pair
     * 4. Revoke old refresh token
     * 5. Save new refresh token
     * 6. Return new access token
     *
     * @param refreshToken - The refresh token to be verified
     * @returns The new access token
     */
    async refreshToken(refreshToken: string) {
        try {
            const decoded = jwt.verify(
                refreshToken,
                JWT_CONFIG.REFRESH_TOKEN.SECRET as Secret,
            ) as { userId: string; tokenId: string };

            const tokenRecord = await prisma.refreshToken.findFirst({
                where: {
                    userId: decoded.userId,
                    id: decoded.tokenId,
                    revoked: false,
                },
                include: {
                    user: {
                        include: {
                            role: true,
                        },
                    },
                },
            });

            if (!tokenRecord) {
                throw new Error('Invalid refresh token');
            }

            const tokenExpiry = new Date(tokenRecord.expiresAt);
            if (tokenExpiry < new Date()) {
                throw new Error('Refresh token expired');
            }

            const tokens = this.generateTokens(decoded.userId);

            await prisma.refreshToken.update({
                where: { id: tokenRecord.id },
                data: { revoked: true },
            });

            await this.saveRefreshToken(decoded.userId, tokens.refreshToken);

            return {
                user: {
                    id: tokenRecord.user.id,
                    email: tokenRecord.user.email,
                    role: tokenRecord.user.role,
                },
                ...tokens,
            };
        } catch (error) {
            console.error('Refresh token error:', error);
            throw error;
        }
    }

    /**
     * Logout a user by revoking their refresh token
     *
     * @remarks
     * This function verifies the refresh token and revokes it.
     *
     * @param refreshToken - The refresh token to be verified
     * @returns True if the logout was successful, False otherwise
     */
    async logout(refreshToken: string) {
        try {
            // Verify the refresh token
            const decoded = jwt.verify(
                refreshToken,
                JWT_CONFIG.REFRESH_TOKEN.SECRET as Secret,
            ) as { userId: string; tokenId: string };

            // Revoke the refresh token
            await prisma.refreshToken.updateMany({
                where: {
                    userId: decoded.userId,
                    id: decoded.tokenId,
                    revoked: false,
                },
                data: { revoked: true },
            });

            return true;
        } catch (error) {
            console.error('Logout error:', error);
            // Even if token verification fails, we consider logout successful
            return true;
        }
    }

    /**
     * Generate access and refresh tokens
     *
     * @remarks
     * This function generates a new pair of access and refresh tokens.
     * The flow is as follows:
     *
     * 1. Generate a unique ID for the refresh token
     * 2. Generate access token
     * 3. Generate refresh token
     * 4. Save refresh token
     * 5. Return access token and refresh token
     *
     * Token id is generated using a combination of random characters
     * and substrings of the user's ID.
     *
     * @param userId - The ID of the user
     * @returns The generated tokens
     */
    private generateTokens(userId: string): TokenPair {
        const tokenId =
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);

        const accessToken = jwt.sign(
            { userId },
            JWT_CONFIG.ACCESS_TOKEN.SECRET as Secret,
            { expiresIn: JWT_CONFIG.ACCESS_TOKEN.EXPIRES_IN } as SignOptions,
        );

        const refreshToken = jwt.sign(
            { userId, tokenId },
            JWT_CONFIG.REFRESH_TOKEN.SECRET as Secret,
            { expiresIn: JWT_CONFIG.REFRESH_TOKEN.EXPIRES_IN } as SignOptions,
        );

        return { accessToken, refreshToken };
    }

    /**
     * Save refresh token to database
     *
     * @remarks
     * This function stores a refresh token in the database.
     * The token id is generated using a combination of random characters
     * and substrings of the user's ID.
     *
     * @param userId - The ID of the user
     * @param refreshToken - The refresh token
     */
    private async saveRefreshToken(userId: string, refreshToken: string) {
        try {
            const decoded = jwt.decode(refreshToken) as { exp: number };

            const expiresAt = new Date(decoded.exp * 1000);

            const { tokenId } = jwt.verify(
                refreshToken,
                JWT_CONFIG.REFRESH_TOKEN.SECRET as Secret,
            ) as { userId: string; tokenId: string };

            await prisma.refreshToken.create({
                data: {
                    id: tokenId,
                    userId,
                    expiresAt,
                },
            });
        } catch (error) {
            console.error('Save refresh token error:', error);
            throw error;
        }
    }
}
