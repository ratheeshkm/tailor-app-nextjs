const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearOrders() {
  try {
    console.log('Deleting all orders...');
    
    const result = await prisma.order.deleteMany({});
    
    console.log(`✅ Successfully deleted ${result.count} orders`);
  } catch (error) {
    console.error('Error deleting orders:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearOrders();
