import 'reflect-metadata';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import protectedRoutes from './routes/protected.routes';

dotenv.config();

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);

// Basic route
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Welcome to Task Manager API' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
