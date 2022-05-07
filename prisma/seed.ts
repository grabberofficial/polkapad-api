import { PrismaClient } from '@prisma/client';
import { genSalt, hash } from 'bcryptjs';

const prisma = new PrismaClient();

const USER = {
  password: 'testtest',
  email: 'test@email.com'
};

async function main() {
  const salt = await genSalt(12);
  const hashedPassword = await hash(USER.password, salt);
  await prisma.user.create({ data: { ...USER, password: hashedPassword } });
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
