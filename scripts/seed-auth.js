const { PrismaClient } = require('@prisma/client');
const bcryptjs = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    // Hash the password
    const hashedPassword = await bcryptjs.hash('sunu', 10);

    // Create the user
    const user = await prisma.user.upsert({
      where: { username: 'sunu' },
      update: {},
      create: {
        username: 'sunu',
        password: hashedPassword,
      },
    });

    console.log('✅ User seeded successfully:', user);
  } catch (error) {
    console.error('❌ Error seeding user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
