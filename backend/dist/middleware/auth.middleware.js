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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.authorize = authorize;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const jwt_config_1 = require("../config/jwt.config");
const prisma = new client_1.PrismaClient();
/**
 * Authenticate user
 *
 * @remarks
 * This route is protected and requires authentication.
 * The function checks if the user is authenticated and
 * returns a new access token.
 *
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 * @returns The refreshed access token
 */
function authenticate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                res.status(401).json({
                    status: 'error',
                    message: 'Authentication required. Please log in.',
                });
                return;
            }
            // Verify token
            const token = authHeader.split(' ')[1];
            const decoded = jsonwebtoken_1.default.verify(token, jwt_config_1.JWT_CONFIG.ACCESS_TOKEN.SECRET);
            const user = yield prisma.user.findUnique({
                where: { id: decoded.userId },
                include: { role: true },
            });
            if (!user) {
                res.status(401).json({
                    status: 'error',
                    message: 'User not found or token is invalid',
                });
                return;
            }
            // Add user to request object
            req.user = user;
            next();
        }
        catch (error) {
            console.error('Auth error:', error);
            // Check if error is due to token expiration
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                res.status(401).json({
                    status: 'error',
                    message: 'Access token expired',
                    code: 'TOKEN_EXPIRED',
                });
                return;
            }
            res.status(401).json({
                status: 'error',
                message: 'Invalid token. Please log in again.',
            });
        }
    });
}
/**
 * Authorize user
 *
 * @remarks
 * This middleware checks if the user is authenticated and
 * has the required role to access the route.
 *
 * @param roles - The roles that are allowed to access the route
 * @returns The authorize middleware
 */
function authorize(roles) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                status: 'error',
                message: 'Authentication required',
            });
            return;
        }
        if (!roles.includes(req.user.role.name)) {
            res.status(403).json({
                status: 'error',
                message: 'Forbidden: You do not have permission to access this resource',
            });
            return;
        }
        next();
    };
}
