'use strict';
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator['throw'](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step(
                (generator = generator.apply(thisArg, _arguments || [])).next(),
            );
        });
    };
Object.defineProperty(exports, '__esModule', { value: true });
const client_1 = require('@prisma/client');
const prisma = new client_1.PrismaClient();
function seedTaskMetadata() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Create task categories if they don't exist
            const categories = [
                { name: 'Work' },
                { name: 'Personal' },
                { name: 'Education' },
                { name: 'Health' },
                { name: 'Finance' },
                { name: 'Home' },
                { name: 'Other' },
            ];
            console.log('Seeding task categories...');
            for (const category of categories) {
                const existingCategory = yield prisma.taskCategory.findUnique({
                    where: { name: category.name },
                });
                if (!existingCategory) {
                    yield prisma.taskCategory.create({
                        data: category,
                    });
                    console.log(`Created category: ${category.name}`);
                } else {
                    console.log(`Category ${category.name} already exists`);
                }
            }
            // Create task priorities if they don't exist
            const priorities = [
                { name: 'LOW' },
                { name: 'MEDIUM' },
                { name: 'HIGH' },
                { name: 'URGENT' },
            ];
            console.log('Seeding task priorities...');
            for (const priority of priorities) {
                const existingPriority = yield prisma.taskPriority.findUnique({
                    where: { name: priority.name },
                });
                if (!existingPriority) {
                    yield prisma.taskPriority.create({
                        data: priority,
                    });
                    console.log(`Created priority: ${priority.name}`);
                } else {
                    console.log(`Priority ${priority.name} already exists`);
                }
            }
            console.log('Seeding completed successfully');
        } catch (error) {
            console.error('Error seeding task metadata:', error);
        } finally {
            yield prisma.$disconnect();
        }
    });
}
// Run the seeding function
seedTaskMetadata();
