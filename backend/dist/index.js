"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const protected_routes_1 = __importDefault(require("./routes/protected.routes"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const comment_routes_1 = __importDefault(require("./routes/comment.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// CORS MIDDLEWARE
app.use((0, cors_1.default)({
    origin: [
        'https://zp1v56uxy8rdx5ypatb0ockcb9tr6a-oci3--3000--31ca1d38.local-credentialless.webcontainer-api.io',
        'https://task-manager-frontend-sepia-delta.vercel.app',
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
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/protected', protected_routes_1.default);
app.use('/api/tasks', task_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/comments', comment_routes_1.default);
// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Task Manager API' });
});
// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
