'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const auth_middleware_1 = require('../middleware/auth.middleware');
const router = express_1.default.Router();
// Route accessible to all authenticated users
router.get('/user', auth_middleware_1.authenticate, (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'You are authenticated',
        data: {
            user: {
                id: req.user.id,
                email: req.user.email,
                role: req.user.role.name,
            },
        },
    });
});
// Route accessible only to admin users
router.get(
    '/admin',
    auth_middleware_1.authenticate,
    (0, auth_middleware_1.authorize)(['ADMIN']),
    (req, res) => {
        res.status(200).json({
            status: 'success',
            message: 'You have admin access',
            data: {
                info: 'This is protected admin data',
            },
        });
    },
);
exports.default = router;
