import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedTaskMetadata() {
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
            const existingCategory = await prisma.taskCategory.findUnique({
                where: { name: category.name },
            });

            if (!existingCategory) {
                await prisma.taskCategory.create({
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
            const existingPriority = await prisma.taskPriority.findUnique({
                where: { name: priority.name },
            });

            if (!existingPriority) {
                await prisma.taskPriority.create({
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
        await prisma.$disconnect();
    }
}

// Run the seeding function
seedTaskMetadata();
