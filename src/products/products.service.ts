import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllProducts(
    limit: number = 10,
    categoryId?: number,
    search?: string,
    minPrice?: number,
    maxPrice?: number,
    sortBy?: string,
  ) {
    const where: any = {};

    if (categoryId) {
      where.category_id = categoryId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    let orderBy: any = { created_at: 'desc' };
    
    if (sortBy === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sortBy === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (sortBy === 'name') {
      orderBy = { name: 'asc' };
    }

    return this.prisma.product.findMany({
      take: limit,
      where,
      include: {
        category: true,
        store: true,
        images: {
          where: { is_primary: true },
          take: 1,
        },
      },
      orderBy,
    });
  }

  async findProductById(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        store: true,
        images: {
          orderBy: { is_primary: 'desc' },
        },
        reviews: {
          where: { status: 'approved' },
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
          orderBy: { created_at: 'desc' },
        },
      },
    });
  }

  async searchProducts(query: string) {
    return this.prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        category: true,
        images: {
          where: { is_primary: true },
          take: 1,
        },
      },
      take: 20,
    });
  }
}
