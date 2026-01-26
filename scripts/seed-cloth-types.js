const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🌱 Seeding cloth types...');

    const clothTypes = [
      { name: 'Pants' },
      { name: 'Shirts' },
      { name: 'Dresses' },
      { name: 'Jackets' },
      { name: 'Skirts' },
      { name: 'Blazers' },
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
