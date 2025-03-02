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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const user_service_1 = require("../services/user.service");
const userService = new user_service_1.UserService();
class AdminController {
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
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield userService.getAllUsers();
                res.status(200).json({
                    status: 'success',
                    data: { users },
                });
            }
            catch (error) {
                console.error('Get all users error:', error);
                res.status(500).json({
                    status: 'error',
                    message: error.message || 'Failed to get users',
                });
            }
        });
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
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const user = yield userService.getUserById(id);
                res.status(200).json({
                    status: 'success',
                    data: { user },
                });
            }
            catch (error) {
                console.error('Get user by ID error:', error);
                res.status(error.message === 'User not found' ? 404 : 500).json({
                    status: 'error',
                    message: error.message || 'Failed to get user',
                });
            }
        });
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
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, roleId } = req.body;
                const user = yield userService.createUser({
                    email,
                    password,
                    roleId: Number(roleId),
                });
                res.status(201).json({
                    status: 'success',
                    message: 'User created successfully',
                    data: { user },
                });
            }
            catch (error) {
                console.error('Create user error:', error);
                res.status(400).json({
                    status: 'error',
                    message: error.message || 'Failed to create user',
                });
            }
        });
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
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { email, password, roleId } = req.body;
                // Create update data object with optional fields
                const updateData = {};
                if (email !== undefined)
                    updateData.email = email;
                if (password !== undefined)
                    updateData.password = password;
                if (roleId !== undefined)
                    updateData.roleId = Number(roleId);
                const user = yield userService.updateUser(id, updateData);
                res.status(200).json({
                    status: 'success',
                    message: 'User updated successfully',
                    data: { user },
                });
            }
            catch (error) {
                console.error('Update user error:', error);
                res.status(error.message === 'User not found' ? 404 : 400).json({
                    status: 'error',
                    message: error.message || 'Failed to update user',
                });
            }
        });
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
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield userService.deleteUser(id);
                res.status(200).json({
                    status: 'success',
                    message: 'User deleted successfully',
                });
            }
            catch (error) {
                console.error('Delete user error:', error);
                res.status(error.message === 'User not found' ? 404 : 500).json({
                    status: 'error',
                    message: error.message || 'Failed to delete user',
                });
            }
        });
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
    getAllRoles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roles = yield userService.getAllRoles();
                res.status(200).json({
                    status: 'success',
                    data: { roles },
                });
            }
            catch (error) {
                console.error('Get all roles error:', error);
                res.status(500).json({
                    status: 'error',
                    message: error.message || 'Failed to get roles',
                });
            }
        });
    }
}
exports.AdminController = AdminController;
