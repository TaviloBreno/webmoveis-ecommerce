import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateSupportTicketDto, SendMessageDto, UpdateTicketStatusDto } from './dto/support.dto';

@Injectable()
export class SupportService {
  constructor(private readonly prisma: PrismaService) {}

  async createTicket(userId: number, createTicketDto: CreateSupportTicketDto) {
    const ticket = await this.prisma.supportTicket.create({
      data: {
        user_id: userId,
        subject: createTicketDto.subject,
        priority: createTicketDto.priority || 'medium',
      },
    });

    if (createTicketDto.message) {
      await this.prisma.supportMessage.create({
        data: {
          ticket_id: ticket.id,
          user_id: userId,
          message: createTicketDto.message,
        },
      });
    }

    return this.findOne(ticket.id);
  }

  async findAll(userId?: number, status?: string) {
    return this.prisma.supportTicket.findMany({
      where: {
        ...(userId && { user_id: userId }),
        ...(status && { status }),
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        _count: { select: { messages: true } },
      },
      orderBy: [
        { priority: 'desc' },
        { created_at: 'desc' },
      ],
    });
  }

  async findOne(id: number) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        messages: {
          include: {
            user: { select: { id: true, name: true } },
          },
          orderBy: { created_at: 'asc' },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket não encontrado');
    }

    return ticket;
  }

  async sendMessage(ticketId: number, userId: number, sendMessageDto: SendMessageDto, isAdmin: boolean = false) {
    await this.findOne(ticketId);

    return this.prisma.supportMessage.create({
      data: {
        ticket_id: ticketId,
        user_id: userId,
        message: sendMessageDto.message,
        is_admin: isAdmin,
      },
      include: {
        user: { select: { id: true, name: true } },
      },
    });
  }

  async updateStatus(id: number, updateStatusDto: UpdateTicketStatusDto) {
    return this.prisma.supportTicket.update({
      where: { id },
      data: { status: updateStatusDto.status },
    });
  }
}
