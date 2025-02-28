import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Create roles
    const adminRole = await prisma.role.upsert({
        where: { name: 'Admin' },
        update: {},
        create: { name: 'Admin' },
    });

    const userRole = await prisma.role.upsert({
        where: { name: 'User' },
        update: {},
        create: { name: 'User' },
    });

    console.log('Roles created:', adminRole, userRole);

    // Create task priorities
    const priorities = ['Low', 'Medium', 'High', 'Urgent'];
    const createdPriorities = [];

    for (const priority of priorities) {
        const created = await prisma.taskPriority.upsert({
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
        const created = await prisma.taskCategory.upsert({
            where: { name: category },
            update: {},
            create: { name: category },
        });
        createdCategories.push(created);
    }

    console.log('Task categories created:', createdCategories);

    // Create admin user
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            password:
                '$2b$10$LwRLOozcfCvbjF9/WcL7SuCNYAQ5bfCzRJ9UY.E1a4lRGvGFCfh02',
            roleId: adminRole.id,
        },
    });

    console.log('Admin user created:', adminUser);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
