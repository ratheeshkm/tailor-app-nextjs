const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🌱 Seeding cloth types...');

    const clothTypes = [
      { name: 'Shirt' },
      { name: 'Pant' },
      { name: 'Coat' },
      { name: 'Dhoti' },
      { name: 'Goun' },
      { name: 'Skirt & Top' },
      { name: 'Bottom' },
    ];

    for (const clothType of clothTypes) {
      await prisma.clothType.upsert({
        where: { name: clothType.name },
        update: {},
        create: clothType,
      });
    }

    console.log('✅ Cloth types seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding cloth types:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
