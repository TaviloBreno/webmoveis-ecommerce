import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateReturnDto, UpdateReturnStatusDto } from './dto/return.dto';

@Injectable()
export class ReturnsService {
  constructor(private prisma: PrismaService) {}

  // Criar solicitação de devolução/troca
  async createReturn(userId: number, data: CreateReturnDto) {
    // Verificar se o pedido existe e pertence ao usuário
    const order = await this.prisma.order.findFirst({
      where: {
        id: data.order_id,
        user_id: userId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado ou não pertence ao usuário');
    }

    // Verificar se o pedido foi entregue
    if (order.status !== 'delivered') {
      throw new BadRequestException('Somente pedidos entregues podem ser devolvidos');
    }

    // Verificar se já existe uma devolução para este pedido
    const existingReturn = await this.prisma.return.findFirst({
      where: {
        order_id: data.order_id,
        status: { in: ['requested', 'approved', 'received', 'processing'] },
      },
    });

    if (existingReturn) {
      throw new BadRequestException('Já existe uma solicitação de devolução em andamento para este pedido');
    }

    // Validar itens
    const orderItemIds = order.items.map((item) => item.id);
    const invalidItems = data.items.filter(
      (item) => !orderItemIds.includes(item.order_item_id),
    );

    if (invalidItems.length > 0) {
      throw new BadRequestException('Um ou mais itens não pertencem a este pedido');
    }

    // Calcular valor do reembolso
    let refundAmount = 0;
    for (const returnItem of data.items) {
      const orderItem = order.items.find((oi) => oi.id === returnItem.order_item_id);
      if (orderItem) {
        refundAmount += orderItem.price * returnItem.quantity;
      }
    }

    // Criar devolução
    const returnRequest = await this.prisma.return.create({
      data: {
        order_id: data.order_id,
        user_id: userId,
        type: data.type,
        reason: data.reason,
        status: 'requested',
        refund_amount: data.type === 'return' ? refundAmount : 0,
        exchange_product_id: data.exchange_product_id,
        items: {
          create: data.items.map((item) => ({
            order_item_id: item.order_item_id,
            quantity: item.quantity,
            reason: item.reason,
            condition: item.condition || 'used',
          })),
        },
      },
      include: {
        items: true,
        order: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    return returnRequest;
  }

  // Atualizar status da devolução (Admin)
  async updateReturnStatus(returnId: number, data: UpdateReturnStatusDto) {
    const returnRequest = await this.prisma.return.findUnique({
      where: { id: returnId },
      include: {
        items: true,
        order: true,
        user: true,
      },
    });

    if (!returnRequest) {
      throw new NotFoundException('Solicitação de devolução não encontrada');
    }

    const updateData: any = {
      status: data.status,
      admin_notes: data.admin_notes,
    };

    if (data.refund_amount !== undefined) {
      updateData.refund_amount = data.refund_amount;
    }

    const updatedReturn = await this.prisma.return.update({
      where: { id: returnId },
      data: updateData,
      include: {
        items: true,
        order: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Se aprovado e for troca, criar notificação
    if (data.status === 'approved' && returnRequest.type === 'exchange') {
      // Aqui você pode adicionar lógica para criar um novo pedido de troca
    }

    // Se completado e for devolução, retornar estoque
    if (data.status === 'completed' && returnRequest.type === 'return') {
      await this.restoreStock(returnRequest);
    }

    return updatedReturn;
  }

  // Restaurar estoque dos produtos devolvidos
  private async restoreStock(returnRequest: any) {
    for (const item of returnRequest.items) {
      const orderItem = await this.prisma.orderItem.findUnique({
        where: { id: item.order_item_id },
      });

      if (orderItem) {
        await this.prisma.product.update({
          where: { id: orderItem.product_id },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }
    }
  }

  // Listar devoluções do usuário
  async getUserReturns(userId: number) {
    const returns = await this.prisma.return.findMany({
      where: { user_id: userId },
      include: {
        items: true,
        order: {
          select: {
            id: true,
            total: true,
            created_at: true,
          },
        },
      },
      orderBy: { requested_at: 'desc' },
    });

    return returns;
  }

  // Obter detalhes de uma devolução
  async getReturnDetails(returnId: number, userId?: number) {
    const whereClause: any = { id: returnId };
    if (userId) {
      whereClause.user_id = userId;
    }

    const returnRequest = await this.prisma.return.findFirst({
      where: whereClause,
      include: {
        items: {
          include: {
            return: {
              include: {
                order: {
                  include: {
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
                },
              },
            },
          },
        },
        order: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!returnRequest) {
      throw new NotFoundException('Solicitação de devolução não encontrada');
    }

    return returnRequest;
  }

  // Listar todas as devoluções (Admin)
  async listAllReturns(filters?: { status?: string; type?: string; limit?: number }) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.type) {
      where.type = filters.type;
    }

    const returns = await this.prisma.return.findMany({
      where,
      take: filters?.limit || 50,
      orderBy: { requested_at: 'desc' },
      include: {
        items: true,
        user: {
          select: { id: true, name: true, email: true },
        },
        order: {
          select: { id: true, total: true },
        },
      },
    });

    return returns;
  }

  // Estatísticas de devoluções (Admin)
  async getReturnStats() {
    const [
      totalReturns,
      requestedReturns,
      approvedReturns,
      rejectedReturns,
      completedReturns,
      totalRefundAmount,
    ] = await Promise.all([
      this.prisma.return.count(),
      this.prisma.return.count({ where: { status: 'requested' } }),
      this.prisma.return.count({ where: { status: 'approved' } }),
      this.prisma.return.count({ where: { status: 'rejected' } }),
      this.prisma.return.count({ where: { status: 'completed' } }),
      this.prisma.return.aggregate({
        where: { status: 'completed', type: 'return' },
        _sum: { refund_amount: true },
      }),
    ]);

    const returnsByType = await this.prisma.return.groupBy({
      by: ['type'],
      _count: { id: true },
    });

    return {
      total_returns: totalReturns,
      by_status: {
        requested: requestedReturns,
        approved: approvedReturns,
        rejected: rejectedReturns,
        completed: completedReturns,
      },
      by_type: returnsByType.reduce((acc, item) => {
        acc[item.type] = item._count.id;
        return acc;
      }, {}),
      total_refund_amount: totalRefundAmount._sum.refund_amount || 0,
    };
  }

  // Cancelar devolução (Usuário)
  async cancelReturn(returnId: number, userId: number) {
    const returnRequest = await this.prisma.return.findFirst({
      where: {
        id: returnId,
        user_id: userId,
      },
    });

    if (!returnRequest) {
      throw new NotFoundException('Solicitação de devolução não encontrada');
    }

    if (!['requested', 'approved'].includes(returnRequest.status)) {
      throw new BadRequestException('Não é possível cancelar esta devolução');
    }

    const updated = await this.prisma.return.update({
      where: { id: returnId },
      data: { status: 'rejected', admin_notes: 'Cancelado pelo usuário' },
    });

    return updated;
  }
}
