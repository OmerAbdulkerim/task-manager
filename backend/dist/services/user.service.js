"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
class UserService {
    /**
     * Get all users
     *
     * @remarks
     * This function returns a list of all users.
     *
     * @returns A list of all users
     */
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield prisma.user.findMany({
                    include: {
                        role: true,
                    },
                    orderBy: {
                        email: 'asc',
                    },
                });
                // Return users without passwords
                return users.map((user) => ({
                    id: user.id,
                    email: user.email,
                    roleId: user.roleId,
                    role: user.role,
                }));
            }
            catch (error) {
                console.error('Get all users service error:', error);
                throw error;
            }
        });
    }
    /**
     * Get user by ID
     *
     * @param id - The ID of the user to get
     * @returns The user with the given ID
     */
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield prisma.user.findUnique({
                    where: { id },
                    include: {
                        role: true,
                    },
                });
                if (!user) {
                    throw new Error('User not found');
                }
                // Return user without password
                return {
                    id: user.id,
                    email: user.email,
                    roleId: user.roleId,
                    role: user.role,
                };
            }
            catch (error) {
                console.error('Get user by ID service error:', error);
                throw error;
            }
        });
    }
    /**
     * Create a new user
     *
     * @param userData - The data for the new user
     * @returns The newly created user
     */
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield prisma.user.findUnique({
                    where: { email: userData.email },
                });
                if (existingUser) {
                    throw new Error('User with this email already exists');
                }
                const role = yield prisma.role.findUnique({
                    where: { id: userData.roleId },
                });
                if (!role) {
                    throw new Error('Invalid role ID');
                }
                const salt = yield bcrypt_1.default.genSalt(10);
                const hashedPassword = yield bcrypt_1.default.hash(userData.password, salt);
                const user = yield prisma.user.create({
                    data: {
                        email: userData.email,
                        password: hashedPassword,
                        roleId: userData.roleId,
                    },
                    include: {
                        role: true,
                    },
                });
                // Return user without password
                return {
                    id: user.id,
                    email: user.email,
                    roleId: user.roleId,
                    role: user.role,
                };
            }
            catch (error) {
                console.error('Create user service error:', error);
                throw error;
            }
        });
    }
    /**
     * Update a user
     *
     * @param id - The ID of the user to update
     * @param userData - The data to update the user with
     * @returns The updated user
     */
    updateUser(id, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield prisma.user.findUnique({
                    where: { id },
                });
                if (!user) {
                    throw new Error('User not found');
                }
                // Check if email is being updated and not already taken
                if (userData.email && userData.email !== user.email) {
                    const existingUser = yield prisma.user.findUnique({
                        where: { email: userData.email },
                    });
                    if (existingUser) {
                        throw new Error('Email already in use');
                    }
                }
                // Check if role exists if updating role
                if (userData.roleId) {
                    const role = yield prisma.role.findUnique({
                        where: { id: userData.roleId },
                    });
                    if (!role) {
                        throw new Error('Invalid role ID');
                    }
                }
                // Prepare update data
                const updateData = {
                    email: userData.email,
                    roleId: userData.roleId,
                };
                // Only hash password if it's being updated
                if (userData.password) {
                    const salt = yield bcrypt_1.default.genSalt(10);
                    updateData.password = yield bcrypt_1.default.hash(userData.password, salt);
                }
                // Remove undefined fields
                Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key]);
                const updatedUser = yield prisma.user.update({
                    where: { id },
                    data: updateData,
                    include: {
                        role: true,
                    },
                });
                // Return user without password
                return {
                    id: updatedUser.id,
                    email: updatedUser.email,
                    roleId: updatedUser.roleId,
                    role: updatedUser.role,
                };
            }
            catch (error) {
                console.error('Update user service error:', error);
                throw error;
            }
        });
    }
    /**
     * Delete a user
     *
     * @param id - The ID of the user to delete
     * @returns A success message
     */
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield prisma.user.findUnique({
                    where: { id },
                });
                if (!user) {
                    throw new Error('User not found');
                }
                yield prisma.user.delete({
                    where: { id },
                });
                return { message: 'User deleted successfully' };
            }
            catch (error) {
                console.error('Delete user service error:', error);
                throw error;
            }
        });
    }
    /**
     * Get all roles
     *
     * @returns A list of all roles
     */
    getAllRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma.role.findMany({
                    orderBy: {
                        id: 'asc',
                    },
                });
            }
            catch (error) {
                console.error('Get all roles service error:', error);
                throw error;
            }
        });
    }
}
exports.UserService = UserService;
