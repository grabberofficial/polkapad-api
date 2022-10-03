import { PrismaClient, UserRoleTypes } from '@prisma/client';
import { genSalt, hash } from 'bcryptjs';

const prisma = new PrismaClient();

const USERS = [
  {
    password: 'testtest',
    email: 'test@email.com'
  },
  {
    password: 'adminadmin',
    email: 'admin@email.com',
    role: UserRoleTypes.ADMIN
  }
];

async function main() {
  const [user, admin] = USERS;
  const salt = await genSalt(12);

  await prisma.user.create({
    data: { ...user, password: await hash(user.password, salt) }
  });
  await prisma.user.create({
    data: { ...admin, password: await hash(admin.password, salt) }
  });
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
