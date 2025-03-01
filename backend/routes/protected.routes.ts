import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// Route accessible to all authenticated users
router.get('/user', authenticate, (req, res) => {
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
router.get('/admin', authenticate, authorize(['ADMIN']), (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'You have admin access',
        data: {
            info: 'This is protected admin data',
        },
    });
});

export default router;
