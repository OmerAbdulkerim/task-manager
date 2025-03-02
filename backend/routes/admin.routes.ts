import express from 'express';
import { AdminController } from '../controllers/admin.controller';
import { requireAdmin } from '../middleware/admin.middleware';
import { validateDto } from '../utils/validator';
import { CreateUserDto, UpdateUserDto } from '../dtos/admin.dto';

const router = express.Router();
const adminController = new AdminController();

// All admin routes are protected by the requireAdmin middleware
router.use(requireAdmin);

// User Management routes
router.get('/users', adminController.getAllUsers.bind(adminController));
router.get('/users/:id', adminController.getUserById.bind(adminController));
router.post(
    '/users',
    validateDto(CreateUserDto),
    adminController.createUser.bind(adminController),
);
router.patch(
    '/users/:id',
    validateDto(UpdateUserDto),
    adminController.updateUser.bind(adminController),
);
router.delete('/users/:id', adminController.deleteUser.bind(adminController));

// Role Management routes
router.get('/roles', adminController.getAllRoles.bind(adminController));

export default router;
