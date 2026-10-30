const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

async function main() {
  console.log('Intentando conectar...');
  const result = await prisma.$queryRaw`SELECT 1 as test`;
  console.log('✓ Conexión exitosa:', result);
}

main()
  .catch(e => {
    console.error('✗ Error completo:');
    console.error(JSON.stringify(e, null, 2));
  })
  .finally(() => prisma.$disconnect());