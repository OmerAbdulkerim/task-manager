import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedRoles() {
    try {
        // Create roles if they don't exist
        const roles = [{ name: 'ADMIN' }, { name: 'USER' }];

        console.log('Seeding roles...');

        for (const role of roles) {
            const existingRole = await prisma.role.findUnique({
                where: { name: role.name },
            });

            if (!existingRole) {
                await prisma.role.create({
                    data: role,
                });
                console.log(`Created role: ${role.name}`);
            } else {
                console.log(`Role ${role.name} already exists`);
            }
        }

        // Create admin user if it doesn't exist
        const adminEmail = 'admin@taskmanager.com';
        const existingAdmin = await prisma.user.findUnique({
            where: { email: adminEmail },
        });

        if (!existingAdmin) {
            // Get admin role
            const adminRole = await prisma.role.findUnique({
                where: { name: 'ADMIN' },
            });

            if (adminRole) {
                // Hash password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash('admin123', salt);

                await prisma.user.create({
                    data: {
                        email: adminEmail,
                        password: hashedPassword,
                        roleId: adminRole.id,
                    },
                });
                console.log('Created admin user');
            }
        } else {
            console.log('Admin user already exists');
        }

        console.log('Seeding completed successfully');
    } catch (error) {
        console.error('Error seeding roles:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the seeding function
seedRoles();
