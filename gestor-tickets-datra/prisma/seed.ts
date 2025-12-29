import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('keyAdmin01', 10);
  const ingPassword = await bcrypt.hash('keyIng01', 10);
  const tecPassword = await bcrypt.hash('keyTec01', 10);

  await prisma.user.createMany({
    data: [
      {
        name: 'Admin Datra',
        email: 'admin@email.com',
        password: adminPassword,
        role: UserRole.ADMIN,
        active: true,
      },
      {
        name: 'Ingeniero Datra',
        email: 'ingeniero@email.com',
        password: ingPassword,
        role: UserRole.INGENIERO,
        active: true,
      },
      {
        name: 'Tecnico Datra',
        email: 'tecnico@email.com',
        password: tecPassword,
        role: UserRole.TECNICO,
        active: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Usuarios base creados');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
