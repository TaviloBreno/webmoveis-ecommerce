import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(userId: number, createOrderDto: CreateOrderDto) {
    // Validar produtos e calcular total
    const productIds = createOrderDto.items.map(item => item.product_id);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('One or more products not found');
    }

    // Verificar estoque
    for (const item of createOrderDto.items) {
      const product = products.find(p => p.id === item.product_id);
      if (!product || product.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for product ${item.product_id}`);
      }
    }

    // Calcular total
    let total = createOrderDto.shipping_cost;
    const orderItems = createOrderDto.items.map(item => {
      const product = products.find(p => p.id === item.product_id);
      if (!product) {
        throw new BadRequestException(`Product ${item.product_id} not found`);
      }
      const subtotal = product.price * item.quantity;
      total += subtotal;
      return {
        product_id: item.product_id,
        quantity: item.quantity,
        price: product.price,
      };
    });

    // Criar pedido com transação
    const order = await this.prisma.$transaction(async (tx) => {
      // Criar pedido
      const newOrder = await tx.order.create({
        data: {
          user_id: userId,
          total,
          shipping_address: createOrderDto.shipping_address,
          shipping_city: createOrderDto.shipping_city,
          shipping_state: createOrderDto.shipping_state,
          shipping_zip_code: createOrderDto.shipping_zip_code,
          shipping_cost: createOrderDto.shipping_cost,
          shipping_method: createOrderDto.shipping_method,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    where: { is_primary: true },
                    take: 1,
                  },
                },
              },
            },
          },
        },
      });

      // Atualizar estoque
      for (const item of createOrderDto.items) {
        await tx.product.update({
          where: { id: item.product_id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    return order;
  }

  async getUserOrders(userId: number, limit: number) {
    return this.prisma.order.findMany({
      where: { user_id: userId },
      take: limit,
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  where: { is_primary: true },
                  take: 1,
                },
              },
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async getOrderById(userId: number, orderId: number) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        user_id: userId,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
                category: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }
}
