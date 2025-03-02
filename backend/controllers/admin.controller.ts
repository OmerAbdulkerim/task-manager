import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { validateDto } from '../utils/validator';

const userService = new UserService();

export class AdminController {
    /**
     * Get all users
     *
     * @remarks
     * This route is protected and requires admin privileges.
     *
     * @param req - The request object
     * @param res - The response object
     * @returns A list of all users
     */
    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await userService.getAllUsers();

            res.status(200).json({
                status: 'success',
                data: { users },
            });
        } catch (error: any) {
            console.error('Get all users error:', error);
            res.status(500).json({
                status: 'error',
                message: error.message || 'Failed to get users',
            });
        }
    }

    /**
     * Get user by ID
     *
     * @remarks
     * This route is protected and requires admin privileges.
     *
     * @param req - The request object
     * @param res - The response object
     * @returns The user with the specified ID
     */
    async getUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = await userService.getUserById(id);

            res.status(200).json({
                status: 'success',
                data: { user },
            });
        } catch (error: any) {
            console.error('Get user by ID error:', error);
            res.status(error.message === 'User not found' ? 404 : 500).json({
                status: 'error',
                message: error.message || 'Failed to get user',
            });
        }
    }

    /**
     * Create a new user
     *
     * @remarks
     * This route is protected and requires admin privileges.
     *
     * @param req - The request object
     * @param res - The response object
     * @returns The newly created user
     */
    async createUser(req: Request, res: Response) {
        try {
            const { email, password, roleId } = req.body;
            const user = await userService.createUser({
                email,
                password,
                roleId: Number(roleId),
            });

            res.status(201).json({
                status: 'success',
                message: 'User created successfully',
                data: { user },
            });
        } catch (error: any) {
            console.error('Create user error:', error);
            res.status(400).json({
                status: 'error',
                message: error.message || 'Failed to create user',
            });
        }
    }

    /**
     * Update a user
     *
     * @remarks
     * This route is protected and requires admin privileges.
     *
     * @param req - The request object
     * @param res - The response object
     * @returns The updated user
     */
    async updateUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { email, password, roleId } = req.body;

            // Create update data object with optional fields
            const updateData: any = {};
            if (email !== undefined) updateData.email = email;
            if (password !== undefined) updateData.password = password;
            if (roleId !== undefined) updateData.roleId = Number(roleId);

            const user = await userService.updateUser(id, updateData);

            res.status(200).json({
                status: 'success',
                message: 'User updated successfully',
                data: { user },
            });
        } catch (error: any) {
            console.error('Update user error:', error);
            res.status(error.message === 'User not found' ? 404 : 400).json({
                status: 'error',
                message: error.message || 'Failed to update user',
            });
        }
    }

    /**
     * Delete a user
     *
     * @remarks
     * This route is protected and requires admin privileges.
     *
     * @param req - The request object
     * @param res - The response object
     * @returns A success message
     */
    async deleteUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await userService.deleteUser(id);

            res.status(200).json({
                status: 'success',
                message: 'User deleted successfully',
            });
        } catch (error: any) {
            console.error('Delete user error:', error);
            res.status(error.message === 'User not found' ? 404 : 500).json({
                status: 'error',
                message: error.message || 'Failed to delete user',
            });
        }
    }

    /**
     * Get all roles
     *
     * @remarks
     * This route is protected and requires admin privileges.
     *
     * @param req - The request object
     * @param res - The response object
     * @returns A list of all roles
     */
    async getAllRoles(req: Request, res: Response) {
        try {
            const roles = await userService.getAllRoles();

            res.status(200).json({
                status: 'success',
                data: { roles },
            });
        } catch (error: any) {
            console.error('Get all roles error:', error);
            res.status(500).json({
                status: 'error',
                message: error.message || 'Failed to get roles',
            });
        }
    }
}
