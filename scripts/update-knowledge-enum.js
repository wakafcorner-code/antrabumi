const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Altering Knowledge type enum in MySQL...');
  await prisma.$executeRawUnsafe(
    "ALTER TABLE `Knowledge` MODIFY COLUMN `type` ENUM('ARTICLE', 'RESEARCH_PUBLICATION', 'STORY') NOT NULL;"
  );
  console.log('Enum successfully updated in database!');
}

main()
  .catch((e) => {
    console.error('Error modifying enum:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
