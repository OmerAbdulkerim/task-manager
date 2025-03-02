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
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.AuthService = void 0;
const client_1 = require('@prisma/client');
const bcrypt_1 = __importDefault(require('bcrypt'));
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const jwt_config_1 = require('../config/jwt.config');
const prisma = new client_1.PrismaClient();
class AuthService {
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
    register(_a) {
        return __awaiter(
            this,
            arguments,
            void 0,
            function* ({ email, password, roleId }) {
                try {
                    const existingUser = yield prisma.user.findUnique({
                        where: { email },
                    });
                    if (existingUser) {
                        throw new Error('User with this email already exists');
                    }
                    const role = yield prisma.role.findUnique({
                        where: { id: roleId },
                    });
                    if (!role) {
                        throw new Error('Invalid role ID');
                    }
                    const salt = yield bcrypt_1.default.genSalt(10);
                    const hashedPassword = yield bcrypt_1.default.hash(
                        password,
                        salt,
                    );
                    const user = yield prisma.user.create({
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
                    yield this.saveRefreshToken(user.id, tokens.refreshToken);
                    return Object.assign(
                        {
                            user: {
                                id: user.id,
                                email: user.email,
                                role: user.role,
                            },
                        },
                        tokens,
                    );
                } catch (error) {
                    console.error('Registration service error:', error);
                    throw error;
                }
            },
        );
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
    login(_a) {
        return __awaiter(
            this,
            arguments,
            void 0,
            function* ({ email, password }) {
                try {
                    const user = yield prisma.user.findUnique({
                        where: { email },
                        include: {
                            role: true,
                        },
                    });
                    if (!user) {
                        throw new Error('Invalid email or password');
                    }
                    const isPasswordValid = yield bcrypt_1.default.compare(
                        password,
                        user.password,
                    );
                    if (!isPasswordValid) {
                        throw new Error('Invalid email or password');
                    }
                    const tokens = this.generateTokens(user.id);
                    yield this.saveRefreshToken(user.id, tokens.refreshToken);
                    return Object.assign(
                        {
                            user: {
                                id: user.id,
                                email: user.email,
                                role: user.role,
                            },
                        },
                        tokens,
                    );
                } catch (error) {
                    console.error('Login service error:', error);
                    throw error;
                }
            },
        );
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
    refreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = jsonwebtoken_1.default.verify(
                    refreshToken,
                    jwt_config_1.JWT_CONFIG.REFRESH_TOKEN.SECRET,
                );
                const tokenRecord = yield prisma.refreshToken.findFirst({
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
                yield prisma.refreshToken.update({
                    where: { id: tokenRecord.id },
                    data: { revoked: true },
                });
                yield this.saveRefreshToken(
                    decoded.userId,
                    tokens.refreshToken,
                );
                return Object.assign(
                    {
                        user: {
                            id: tokenRecord.user.id,
                            email: tokenRecord.user.email,
                            role: tokenRecord.user.role,
                        },
                    },
                    tokens,
                );
            } catch (error) {
                console.error('Refresh token error:', error);
                throw error;
            }
        });
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
    logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verify the refresh token
                const decoded = jsonwebtoken_1.default.verify(
                    refreshToken,
                    jwt_config_1.JWT_CONFIG.REFRESH_TOKEN.SECRET,
                );
                // Revoke the refresh token
                yield prisma.refreshToken.updateMany({
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
        });
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
    generateTokens(userId) {
        const tokenId =
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
        const accessToken = jsonwebtoken_1.default.sign(
            { userId },
            jwt_config_1.JWT_CONFIG.ACCESS_TOKEN.SECRET,
            { expiresIn: jwt_config_1.JWT_CONFIG.ACCESS_TOKEN.EXPIRES_IN },
        );
        const refreshToken = jsonwebtoken_1.default.sign(
            { userId, tokenId },
            jwt_config_1.JWT_CONFIG.REFRESH_TOKEN.SECRET,
            { expiresIn: jwt_config_1.JWT_CONFIG.REFRESH_TOKEN.EXPIRES_IN },
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
    saveRefreshToken(userId, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = jsonwebtoken_1.default.decode(refreshToken);
                const expiresAt = new Date(decoded.exp * 1000);
                const { tokenId } = jsonwebtoken_1.default.verify(
                    refreshToken,
                    jwt_config_1.JWT_CONFIG.REFRESH_TOKEN.SECRET,
                );
                yield prisma.refreshToken.create({
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
        });
    }
}
exports.AuthService = AuthService;
