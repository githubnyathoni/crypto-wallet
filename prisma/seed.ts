import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prismaService = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prismaService.user.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      balance: 0,
      role: 'admin',
    },
  });

  console.log('Database has been seeded');
}

main()
  .then(async () => {
    await prismaService.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismaService.$disconnect();
    process.exit(1);
  });
