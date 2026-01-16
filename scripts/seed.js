import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const dummyCustomers = [
  { name: 'John Doe', mobile: '9876543210' },
  { name: 'Jane Smith', mobile: '9876543211' },
  { name: 'Bob Johnson', mobile: '9876543212' },
  { name: 'Alice Brown', mobile: '9876543213' },
  { name: 'Charlie Wilson', mobile: '9876543214' },
  { name: 'Diana Davis', mobile: '9876543215' },
  { name: 'Edward Miller', mobile: '9876543216' },
  { name: 'Fiona Garcia', mobile: '9876543217' },
  { name: 'George Martinez', mobile: '9876543218' },
  { name: 'Helen Rodriguez', mobile: '9876543219' },
  { name: 'Ian Lee', mobile: '9876543220' },
  { name: 'Julia Walker', mobile: '9876543221' },
  { name: 'Kevin Hall', mobile: '9876543222' },
  { name: 'Laura Allen', mobile: '9876543223' },
  { name: 'Michael Young', mobile: '9876543224' },
  { name: 'Nancy King', mobile: '9876543225' },
  { name: 'Oliver Wright', mobile: '9876543226' },
  { name: 'Paula Lopez', mobile: '9876543227' },
  { name: 'Quinn Hill', mobile: '9876543228' },
  { name: 'Rachel Green', mobile: '9876543229' },
  { name: 'Steve Adams', mobile: '9876543230' },
  { name: 'Tina Baker', mobile: '9876543231' },
  { name: 'Ursula Carter', mobile: '9876543232' },
  { name: 'Victor Diaz', mobile: '9876543233' },
  { name: 'Wendy Evans', mobile: '9876543234' },
  { name: 'Xavier Foster', mobile: '9876543235' },
  { name: 'Yara Gomez', mobile: '9876543236' },
  { name: 'Zane Harris', mobile: '9876543237' },
  { name: 'Anna Taylor', mobile: '9876543238' },
  { name: 'Brian Moore', mobile: '9876543239' },
  { name: 'Cathy Nelson', mobile: '9876543240' },
  { name: 'David Parker', mobile: '9876543241' },
  { name: 'Emma Rivera', mobile: '9876543242' },
  { name: 'Frank Scott', mobile: '9876543243' },
  { name: 'Grace Turner', mobile: '9876543244' },
  { name: 'Henry White', mobile: '9876543245' },
  { name: 'Iris Clark', mobile: '9876543246' },
  { name: 'Jack Lewis', mobile: '9876543247' },
  { name: 'Kate Robinson', mobile: '9876543248' },
  { name: 'Liam Walker', mobile: '9876543249' },
  { name: 'Maya Hall', mobile: '9876543250' },
  { name: 'Noah Allen', mobile: '9876543251' },
  { name: 'Olivia Young', mobile: '9876543252' },
  { name: 'Peter King', mobile: '9876543253' },
  { name: 'Quinn Wright', mobile: '9876543254' },
  { name: 'Rose Lopez', mobile: '9876543255' },
  { name: 'Sam Hill', mobile: '9876543256' },
  { name: 'Tara Green', mobile: '9876543257' },
  { name: 'Uma Adams', mobile: '9876543258' },
  { name: 'Vick Baker', mobile: '9876543259' },
  { name: 'Wynn Carter', mobile: '9876543260' },
  { name: 'Xena Diaz', mobile: '9876543261' },
  { name: 'Yusuf Evans', mobile: '9876543262' },
  { name: 'Zara Foster', mobile: '9876543263' },
];

async function main() {
  console.log('Seeding database with dummy customers...');

  for (const customer of dummyCustomers) {
    try {
      await prisma.customer.create({
        data: customer,
      });
      console.log(`Created customer: ${customer.name}`);
    } catch (error) {
      console.log(`Customer ${customer.name} might already exist, skipping...`);
    }
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });