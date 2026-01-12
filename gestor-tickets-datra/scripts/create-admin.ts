import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@datra.com';
  const password = 'keyAdmin01';

  const hashedPassword = await bcrypt.hash(password, 10);

  const exists = await prisma.user.findUnique({
    where: { email },
  });

  if (exists) {
    console.log('⚠️ El usuario ADMIN ya existe');
    return;
  }

  const admin = await prisma.user.create({
    data: {
      name: 'Administrador',
      email,
      password: hashedPassword,
      role: UserRole.ADMIN,
      active: true,
    },
  });

  console.log('✅ ADMIN creado correctamente');
  console.log({
    email: admin.email,
    role: admin.role,
  });
}

main()
  .catch((e) => {
    console.error('❌ Error creando ADMIN:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });