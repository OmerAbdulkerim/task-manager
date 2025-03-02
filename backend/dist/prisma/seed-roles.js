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
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
function seedRoles() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Create roles if they don't exist
            const roles = [{ name: 'ADMIN' }, { name: 'USER' }];
            console.log('Seeding roles...');
            for (const role of roles) {
                const existingRole = yield prisma.role.findUnique({
                    where: { name: role.name },
                });
                if (!existingRole) {
                    yield prisma.role.create({
                        data: role,
                    });
                    console.log(`Created role: ${role.name}`);
                }
                else {
                    console.log(`Role ${role.name} already exists`);
                }
            }
            // Create admin user if it doesn't exist
            const adminEmail = 'admin@taskmanager.com';
            const existingAdmin = yield prisma.user.findUnique({
                where: { email: adminEmail },
            });
            if (!existingAdmin) {
                // Get admin role
                const adminRole = yield prisma.role.findUnique({
                    where: { name: 'ADMIN' },
                });
                if (adminRole) {
                    // Hash password
                    const salt = yield bcrypt_1.default.genSalt(10);
                    const hashedPassword = yield bcrypt_1.default.hash('admin123', salt);
                    yield prisma.user.create({
                        data: {
                            email: adminEmail,
                            password: hashedPassword,
                            roleId: adminRole.id,
                        },
                    });
                    console.log('Created admin user');
                }
                else {
                    console.error('Admin role not found');
                }
            }
            else {
                console.log('Admin user already exists');
            }
        }
        catch (error) {
            console.error('Error seeding roles:', error);
        }
    });
}
exports.default = seedRoles;
