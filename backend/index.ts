import 'reflect-metadata';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import protectedRoutes from './routes/protected.routes';
import taskRoutes from './routes/task.routes';
import adminRoutes from './routes/admin.routes';
import commentRoutes from './routes/comment.routes';

dotenv.config();

const app: Express = express();

// CORS MIDDLEWARE
app.use(
    cors({
        origin: [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'https://zp1v56uxy8rdx5ypatb0ockcb9tr6a-oci3--3000--31ca1d38.local-credentialless.webcontainer-api.io',
        ], // Explicit origins for Next.js frontend
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Allow all methods
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-Requested-With',
            'Accept',
        ], // Common headers
        credentials: true, // Allow cookies with CORS
        preflightContinue: false,
        optionsSuccessStatus: 204,
    }),
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/comments', commentRoutes);

// Basic route
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Welcome to Task Manager API' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
