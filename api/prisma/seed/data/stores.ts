import { PrismaClient } from '@prisma/client';

export const storesToInsert = [
  {
    name: 'WebMóveis Store',
    description: 'Loja principal de móveis e decoração',
    email: 'loja@webmoveis.com',
    phone: '(11) 3000-0000',
    address: 'Rua das Flores, 123',
    city: 'São Paulo',
    state: 'SP',
    zip_code: '01234-567',
  },
];

export async function seedStores() {
  const prisma = new PrismaClient();
  
  console.log('🏪 Criando lojas...');
  
  for (const store of storesToInsert) {
    const existingStore = await prisma.store.findFirst({
      where: {
        email: store.email,
      },
    });
    
    if (!existingStore) {
      await prisma.store.create({
        data: store,
      });
      console.log(`✅ Loja criada: ${store.name}`);
    } else {
      console.log(`ℹ️  Loja já existe: ${store.name}`);
    }
  }
  
  await prisma.$disconnect();
}
