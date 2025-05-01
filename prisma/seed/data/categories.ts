import { PrismaClient } from '@prisma/client';

export const categoriesToInsert = [
  {
    name: 'Categoria 01',
    image_url: 'https://via.placeholder.com/360x360',
  },
  {
    name: 'Categoria 02',
    image_url: 'https://via.placeholder.com/360x360',
  },
  {
    name: 'Categoria 03',
    image_url: 'https://via.placeholder.com/360x360',
  },
  {
    name: 'Categoria 04',
    image_url: 'https://via.placeholder.com/360x360',
  },
  {
    name: 'Categoria 05',
    image_url: 'https://via.placeholder.com/360x360',
  },
];

export async function seedCategories() {
  const prisma = new PrismaClient();
  for (const category of categoriesToInsert) {
    const cat = await prisma.category.findFirst({
      where: {
        name: category.name,
      },
    });
    if (!cat)
      await prisma.category.create({
        data: category,
      });
  }
}
