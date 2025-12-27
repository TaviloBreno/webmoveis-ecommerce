import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export const usersToInsert = [
  {
    email: 'admin@webmoveis.com',
    password: 'admin123',
    name: 'Administrador',
    role: 'admin',
    phone: '11999999999',
  },
  {
    email: 'func@webmoveis.com',
    password: 'func123',
    name: 'Funcionário',
    role: 'employee',
    phone: '11988888888',
  },
  {
    email: 'cliente@webmoveis.com',
    password: 'cliente123',
    name: 'Cliente Teste',
    role: 'customer',
    phone: '11977777777',
  },
];

export async function seedUsers() {
  const prisma = new PrismaClient();
  
  for (const user of usersToInsert) {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: user.email,
      },
    });
    
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await prisma.user.create({
        data: {
          ...user,
          password: hashedPassword,
        },
      });
      console.log(`✅ Usuário criado: ${user.email}`);
    } else {
      console.log(`ℹ️  Usuário já existe: ${user.email}`);
    }
  }
  
  await prisma.$disconnect();
}
