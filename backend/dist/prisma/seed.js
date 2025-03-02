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
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Create roles
        const adminRole = yield prisma.role.upsert({
            where: { name: 'Admin' },
            update: {},
            create: { name: 'Admin' },
        });
        const userRole = yield prisma.role.upsert({
            where: { name: 'User' },
            update: {},
            create: { name: 'User' },
        });
        console.log('Roles created:', adminRole, userRole);
        // Create task priorities
        const priorities = ['Low', 'Medium', 'High', 'Urgent'];
        const createdPriorities = [];
        for (const priority of priorities) {
            const created = yield prisma.taskPriority.upsert({
                where: { name: priority },
                update: {},
                create: { name: priority },
            });
            createdPriorities.push(created);
        }
        console.log('Task priorities created:', createdPriorities);
        // Create task categories
        const categories = ['Work', 'Personal', 'Study', 'Health', 'Finance'];
        const createdCategories = [];
        for (const category of categories) {
            const created = yield prisma.taskCategory.upsert({
                where: { name: category },
                update: {},
                create: { name: category },
            });
            createdCategories.push(created);
        }
        console.log('Task categories created:', createdCategories);
        // Create admin user
        const adminUser = yield prisma.user.upsert({
            where: { email: 'admin@example.com' },
            update: {},
            create: {
                email: 'admin@example.com',
                password: '$2b$10$LwRLOozcfCvbjF9/WcL7SuCNYAQ5bfCzRJ9UY.E1a4lRGvGFCfh02',
                roleId: adminRole.id,
            },
        });
        console.log('Admin user created:', adminUser);
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
