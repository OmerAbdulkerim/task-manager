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
exports.requireAdmin = requireAdmin;
const auth_middleware_1 = require("./auth.middleware");
/**
 * Admin authorization middleware
 *
 * @remarks
 * This middleware checks if the authenticated user has admin privileges.
 * It first authenticates the user using the authenticate middleware,
 * then checks if the user's roleId is 1 (admin).
 *
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 */
function requireAdmin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // First authenticate the user
        (0, auth_middleware_1.authenticate)(req, res, (err) => {
            if (err) {
                return next(err);
            }
            // Check if user exists and has admin role (roleId === 1)
            if (!req.user || req.user.roleId !== 1) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Access denied: Admin privileges required',
                });
            }
            // User is authenticated and has admin privileges
            next();
        });
    });
}
