"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../controllers/admin.controller");
const admin_middleware_1 = require("../middleware/admin.middleware");
const validator_1 = require("../utils/validator");
const admin_dto_1 = require("../dtos/admin.dto");
const router = express_1.default.Router();
const adminController = new admin_controller_1.AdminController();
// All admin routes are protected by the requireAdmin middleware
router.use(admin_middleware_1.requireAdmin);
// User Management routes
router.get('/users', adminController.getAllUsers.bind(adminController));
router.get('/users/:id', adminController.getUserById.bind(adminController));
router.post('/users', (0, validator_1.validateDto)(admin_dto_1.CreateUserDto), adminController.createUser.bind(adminController));
router.patch('/users/:id', (0, validator_1.validateDto)(admin_dto_1.UpdateUserDto), adminController.updateUser.bind(adminController));
router.delete('/users/:id', adminController.deleteUser.bind(adminController));
// Role Management routes
router.get('/roles', adminController.getAllRoles.bind(adminController));
exports.default = router;
