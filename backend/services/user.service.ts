import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { User, UserCreate, UserUpdate } from '../models/user.interface';

const prisma = new PrismaClient();

export class UserService {
    /**
     * Get all users
     *
     * @remarks
     * This function returns a list of all users.
     *
     * @returns A list of all users
     */
    async getAllUsers() {
        try {
            const users = await prisma.user.findMany({
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
        } catch (error) {
            console.error('Get all users service error:', error);
            throw error;
        }
    }

    /**
     * Get user by ID
     *
     * @param id - The ID of the user to get
     * @returns The user with the given ID
     */
    async getUserById(id: string) {
        try {
            const user = await prisma.user.findUnique({
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
        } catch (error) {
            console.error('Get user by ID service error:', error);
            throw error;
        }
    }

    /**
     * Create a new user
     *
     * @param userData - The data for the new user
     * @returns The newly created user
     */
    async createUser(userData: UserCreate) {
        try {
            const existingUser = await prisma.user.findUnique({
                where: { email: userData.email },
            });

            if (existingUser) {
                throw new Error('User with this email already exists');
            }

            const role = await prisma.role.findUnique({
                where: { id: userData.roleId },
            });

            if (!role) {
                throw new Error('Invalid role ID');
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);

            const user = await prisma.user.create({
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
        } catch (error) {
            console.error('Create user service error:', error);
            throw error;
        }
    }

    /**
     * Update a user
     *
     * @param id - The ID of the user to update
     * @param userData - The data to update the user with
     * @returns The updated user
     */
    async updateUser(id: string, userData: UserUpdate) {
        try {
            const user = await prisma.user.findUnique({
                where: { id },
            });

            if (!user) {
                throw new Error('User not found');
            }

            // Check if email is being updated and not already taken
            if (userData.email && userData.email !== user.email) {
                const existingUser = await prisma.user.findUnique({
                    where: { email: userData.email },
                });

                if (existingUser) {
                    throw new Error('Email already in use');
                }
            }

            // Check if role exists if updating role
            if (userData.roleId) {
                const role = await prisma.role.findUnique({
                    where: { id: userData.roleId },
                });

                if (!role) {
                    throw new Error('Invalid role ID');
                }
            }

            // Prepare update data
            const updateData: any = {
                email: userData.email,
                roleId: userData.roleId,
            };

            // Only hash password if it's being updated
            if (userData.password) {
                const salt = await bcrypt.genSalt(10);
                updateData.password = await bcrypt.hash(
                    userData.password,
                    salt,
                );
            }

            // Remove undefined fields
            Object.keys(updateData).forEach(
                (key) =>
                    updateData[key] === undefined && delete updateData[key],
            );

            const updatedUser = await prisma.user.update({
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
        } catch (error) {
            console.error('Update user service error:', error);
            throw error;
        }
    }

    /**
     * Delete a user
     *
     * @param id - The ID of the user to delete
     * @returns A success message
     */
    async deleteUser(id: string) {
        try {
            const user = await prisma.user.findUnique({
                where: { id },
            });

            if (!user) {
                throw new Error('User not found');
            }

            await prisma.user.delete({
                where: { id },
            });

            return { message: 'User deleted successfully' };
        } catch (error) {
            console.error('Delete user service error:', error);
            throw error;
        }
    }

    /**
     * Get all roles
     *
     * @returns A list of all roles
     */
    async getAllRoles() {
        try {
            return await prisma.role.findMany({
                orderBy: {
                    id: 'asc',
                },
            });
        } catch (error) {
            console.error('Get all roles service error:', error);
            throw error;
        }
    }
}
