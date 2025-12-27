import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AddToWishlistDto } from './dto/wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  async add(userId: number, addToWishlistDto: AddToWishlistDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: addToWishlistDto.product_id },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    const existing = await this.prisma.wishlistItem.findUnique({
      where: {
        user_id_product_id: {
          user_id: userId,
          product_id: addToWishlistDto.product_id,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Produto já está na lista de desejos');
    }

    return this.prisma.wishlistItem.create({
      data: {
        user_id: userId,
        product_id: addToWishlistDto.product_id,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.wishlistItem.findMany({
      where: { user_id: userId },
      include: {
        product: {
          include: {
            images: {
              where: { is_primary: true },
              take: 1,
            },
            category: true,
            store: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async remove(userId: number, productId: number) {
    const item = await this.prisma.wishlistItem.findUnique({
      where: {
        user_id_product_id: {
          user_id: userId,
          product_id: productId,
        },
      },
    });

    if (!item) {
      throw new NotFoundException('Item não encontrado na lista de desejos');
    }

    return this.prisma.wishlistItem.delete({
      where: {
        user_id_product_id: {
          user_id: userId,
          product_id: productId,
        },
      },
    });
  }

  async clear(userId: number) {
    return this.prisma.wishlistItem.deleteMany({
      where: { user_id: userId },
    });
  }
}
