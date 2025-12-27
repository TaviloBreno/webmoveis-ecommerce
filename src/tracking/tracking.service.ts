import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  CreateTrackingEventDto,
  UpdateTrackingCodeDto,
  BulkTrackingEventDto,
} from './dto/tracking.dto';

@Injectable()
export class TrackingService {
  constructor(private prisma: PrismaService) {}

  // Criar evento de rastreamento
  async createTrackingEvent(data: CreateTrackingEventDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: data.order_id },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    const event = await this.prisma.orderTrackingEvent.create({
      data: {
        order_id: data.order_id,
        status: data.status,
        location: data.location,
        description: data.description,
      },
    });

    // Atualizar status do pedido se necessário
    const statusMap = {
      payment_confirmed: 'paid',
      preparing: 'processing',
      shipped: 'shipped',
      delivered: 'delivered',
      cancelled: 'cancelled',
    };

    if (statusMap[data.status]) {
      await this.prisma.order.update({
        where: { id: data.order_id },
        data: { status: statusMap[data.status] },
      });
    }

    return event;
  }

  // Criar múltiplos eventos (bulk)
  async createBulkTrackingEvents(data: BulkTrackingEventDto) {
    const orders = await this.prisma.order.findMany({
      where: { id: { in: data.order_ids } },
    });

    if (orders.length !== data.order_ids.length) {
      throw new BadRequestException('Um ou mais pedidos não foram encontrados');
    }

    const events = await this.prisma.$transaction(
      data.order_ids.map((orderId) =>
        this.prisma.orderTrackingEvent.create({
          data: {
            order_id: orderId,
            status: data.status,
            location: data.location,
            description: data.description,
          },
        }),
      ),
    );

    return {
      message: `${events.length} eventos criados com sucesso`,
      events,
    };
  }

  // Atualizar código de rastreamento
  async updateTrackingCode(orderId: number, data: UpdateTrackingCodeDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { tracking_code: data.tracking_code },
    });

    // Criar evento de rastreamento
    await this.prisma.orderTrackingEvent.create({
      data: {
        order_id: orderId,
        status: 'shipped',
        description: `Código de rastreamento adicionado: ${data.tracking_code}${data.carrier ? ` - ${data.carrier}` : ''}`,
      },
    });

    return updatedOrder;
  }

  // Obter histórico de rastreamento de um pedido
  async getOrderTracking(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        tracking_events: {
          orderBy: { created_at: 'asc' },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    return {
      order_id: order.id,
      tracking_code: order.tracking_code,
      current_status: order.status,
      total: order.total,
      created_at: order.created_at,
      user: order.user,
      events: order.tracking_events,
      event_count: order.tracking_events.length,
    };
  }

  // Rastreamento público (por código)
  async trackByCode(trackingCode: string) {
    const order = await this.prisma.order.findFirst({
      where: { tracking_code: trackingCode },
      include: {
        tracking_events: {
          orderBy: { created_at: 'asc' },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: { where: { is_primary: true } },
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Código de rastreamento não encontrado');
    }

    return {
      tracking_code: order.tracking_code,
      current_status: order.status,
      estimated_delivery: this.calculateEstimatedDelivery(order),
      items_count: order.items.length,
      items: order.items.map((item) => ({
        product_name: item.product.name,
        quantity: item.quantity,
        image: item.product.images[0]?.image_url,
      })),
      events: order.tracking_events,
    };
  }

  // Listar todos os pedidos com rastreamento
  async listAllTracking(filters?: { status?: string; limit?: number }) {
    const orders = await this.prisma.order.findMany({
      where: filters?.status ? { status: filters.status } : {},
      take: filters?.limit || 50,
      orderBy: { created_at: 'desc' },
      include: {
        tracking_events: {
          orderBy: { created_at: 'desc' },
          take: 1,
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return orders.map((order) => ({
      order_id: order.id,
      tracking_code: order.tracking_code,
      status: order.status,
      total: order.total,
      created_at: order.created_at,
      user: order.user,
      last_event: order.tracking_events[0] || null,
    }));
  }

  // Calcular entrega estimada
  private calculateEstimatedDelivery(order: any): string | null {
    const shippedEvent = order.tracking_events?.find(
      (e) => e.status === 'shipped',
    );

    if (!shippedEvent) return null;

    // Estimativa de 5-7 dias úteis após envio
    const estimatedDays = 7;
    const estimatedDate = new Date(shippedEvent.created_at);
    estimatedDate.setDate(estimatedDate.getDate() + estimatedDays);

    return estimatedDate.toISOString().split('T')[0];
  }

  // Obter estatísticas de rastreamento
  async getTrackingStats() {
    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      avgDeliveryTime,
    ] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: 'pending' } }),
      this.prisma.order.count({ where: { status: 'processing' } }),
      this.prisma.order.count({ where: { status: 'shipped' } }),
      this.prisma.order.count({ where: { status: 'delivered' } }),
      this.calculateAverageDeliveryTime(),
    ]);

    return {
      total_orders: totalOrders,
      by_status: {
        pending: pendingOrders,
        processing: processingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
      },
      average_delivery_days: avgDeliveryTime,
    };
  }

  // Calcular tempo médio de entrega
  private async calculateAverageDeliveryTime(): Promise<number> {
    const deliveredOrders = await this.prisma.order.findMany({
      where: { status: 'delivered' },
      include: {
        tracking_events: {
          where: {
            status: { in: ['order_placed', 'delivered'] },
          },
        },
      },
      take: 100,
    });

    if (deliveredOrders.length === 0) return 0;

    const totalDays = deliveredOrders.reduce((sum, order) => {
      const placedEvent = order.tracking_events.find((e) => e.status === 'order_placed');
      const deliveredEvent = order.tracking_events.find((e) => e.status === 'delivered');

      if (placedEvent && deliveredEvent) {
        const diff = deliveredEvent.created_at.getTime() - placedEvent.created_at.getTime();
        return sum + diff / (1000 * 60 * 60 * 24);
      }
      return sum;
    }, 0);

    return Math.round(totalDays / deliveredOrders.length);
  }
}
