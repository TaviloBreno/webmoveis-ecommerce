import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateReviewDto, UpdateReviewStatusDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createReviewDto: CreateReviewDto) {
    // Verifica se o produto existe
    const product = await this.prisma.product.findUnique({
      where: { id: createReviewDto.product_id },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    // Verifica se usuário já avaliou este produto
    const existing = await this.prisma.review.findUnique({
      where: {
        product_id_user_id: {
          product_id: createReviewDto.product_id,
          user_id: userId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Você já avaliou este produto');
    }

    return this.prisma.review.create({
      data: {
        ...createReviewDto,
        user_id: userId,
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async findByProduct(productId: number, status: string = 'approved') {
    return this.prisma.review.findMany({
      where: { product_id: productId, status },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async getProductRating(productId: number) {
    const reviews = await this.prisma.review.findMany({
      where: { product_id: productId, status: 'approved' },
      select: { rating: true },
    });

    if (reviews.length === 0) {
      return { average: 0, count: 0 };
    }

    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return {
      average: Number((sum / reviews.length).toFixed(1)),
      count: reviews.length,
    };
  }

  async findPending() {
    return this.prisma.review.findMany({
      where: { status: 'pending' },
      include: {
        user: { select: { id: true, name: true } },
        product: { select: { id: true, name: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async updateStatus(id: number, updateStatusDto: UpdateReviewStatusDto) {
    return this.prisma.review.update({
      where: { id },
      data: { status: updateStatusDto.status },
    });
  }

  async remove(userId: number, id: number, isAdmin: boolean = false) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Avaliação não encontrada');
    }

    if (!isAdmin && review.user_id !== userId) {
      throw new ForbiddenException('Você não pode remover esta avaliação');
    }

    return this.prisma.review.delete({ where: { id } });
  }
}
