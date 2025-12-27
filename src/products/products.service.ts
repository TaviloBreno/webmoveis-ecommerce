import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  findAllProducts(limit: number, categoryId?: number) {
    return this.prisma.product.findMany({
      take: limit,
      where: categoryId ? { category_id: categoryId } : undefined,
      include: {
        category: true,
        store: true,
        images: {
          where: { is_primary: true },
          take: 1,
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  findProductById(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        store: true,
        images: {
          orderBy: { is_primary: 'desc' },
        },
      },
    });
  }
}
