import { PrismaClient } from '@prisma/client';

export const categoriesToInsert = [
  {
    name: 'Sofás e Poltronas',
    image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
  },
  {
    name: 'Mesas',
    image_url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80',
  },
  {
    name: 'Cadeiras',
    image_url: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=800&q=80',
  },
  {
    name: 'Camas e Colchões',
    image_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80',
  },
  {
    name: 'Estantes e Armários',
    image_url: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80',
  },
  {
    name: 'Decoração',
    image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80',
  },
  {
    name: 'Escritório',
    image_url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
  },
  {
    name: 'Iluminação',
    image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
  },
];

export async function seedCategories() {
  const prisma = new PrismaClient();
  
  console.log('📦 Criando categorias...');
  
  for (const category of categoriesToInsert) {
    const cat = await prisma.category.findFirst({
      where: {
        name: category.name,
      },
    });
    
    if (!cat) {
      await prisma.category.create({
        data: category,
      });
      console.log(`✅ Categoria criada: ${category.name}`);
    } else {
      console.log(`ℹ️  Categoria já existe: ${category.name}`);
    }
  }
  
  await prisma.$disconnect();
}
