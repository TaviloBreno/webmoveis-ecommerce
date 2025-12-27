import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCouponDto, ValidateCouponDto } from './dto/coupon.dto';

@Injectable()
export class CouponsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCouponDto: CreateCouponDto) {
    const existing = await this.prisma.coupon.findUnique({
      where: { code: createCouponDto.code },
    });

    if (existing) {
      throw new BadRequestException('Código de cupom já existe');
    }

    return this.prisma.coupon.create({
      data: {
        ...createCouponDto,
        valid_from: new Date(createCouponDto.valid_from),
        valid_until: new Date(createCouponDto.valid_until),
      },
    });
  }

  async findAll() {
    return this.prisma.coupon.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async findActive() {
    const now = new Date();
    return this.prisma.coupon.findMany({
      where: {
        is_active: true,
        valid_from: { lte: now },
        valid_until: { gte: now },
      },
    });
  }

  async validate(validateCouponDto: ValidateCouponDto) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: validateCouponDto.code },
    });

    if (!coupon) {
      throw new NotFoundException('Cupom não encontrado');
    }

    const now = new Date();

    if (!coupon.is_active) {
      throw new BadRequestException('Cupom inativo');
    }

    if (now < coupon.valid_from) {
      throw new BadRequestException('Cupom ainda não é válido');
    }

    if (now > coupon.valid_until) {
      throw new BadRequestException('Cupom expirado');
    }

    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      throw new BadRequestException('Cupom atingiu limite de uso');
    }

    if (validateCouponDto.cart_total < coupon.min_purchase) {
      throw new BadRequestException(
        `Compra mínima de R$ ${coupon.min_purchase.toFixed(2)} necessária`,
      );
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (validateCouponDto.cart_total * coupon.value) / 100;
      if (coupon.max_discount && discount > coupon.max_discount) {
        discount = coupon.max_discount;
      }
    } else {
      discount = coupon.value;
    }

    return {
      valid: true,
      coupon,
      discount,
      final_total: validateCouponDto.cart_total - discount,
    };
  }

  async incrementUsage(code: string) {
    return this.prisma.coupon.update({
      where: { code },
      data: { used_count: { increment: 1 } },
    });
  }

  async deactivate(id: number) {
    return this.prisma.coupon.update({
      where: { id },
      data: { is_active: false },
    });
  }
}
