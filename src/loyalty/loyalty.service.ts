import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AddLoyaltyPointsDto, RedeemPointsDto, TransferPointsDto } from './dto/loyalty.dto';

@Injectable()
export class LoyaltyService {
  constructor(private prisma: PrismaService) {}

  // Configuração de tiers
  private readonly tiers = {
    bronze: { min: 0, max: 499, multiplier: 1 },
    silver: { min: 500, max: 1999, multiplier: 1.25 },
    gold: { min: 2000, max: 4999, multiplier: 1.5 },
    platinum: { min: 5000, max: Infinity, multiplier: 2 },
  };

  // Calcular tier baseado nos pontos
  private calculateTier(points: number): string {
    if (points >= this.tiers.platinum.min) return 'platinum';
    if (points >= this.tiers.gold.min) return 'gold';
    if (points >= this.tiers.silver.min) return 'silver';
    return 'bronze';
  }

  // Adicionar pontos
  async addPoints(data: AddLoyaltyPointsDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: data.user_id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Calcular pontos com multiplicador do tier
    const tierMultiplier = this.tiers[user.loyalty_tier]?.multiplier || 1;
    const finalPoints = Math.floor(data.points * tierMultiplier);

    // Atualizar pontos do usuário
    const newTotal = user.loyalty_points + finalPoints;
    const newTier = this.calculateTier(newTotal);

    const [transaction, updatedUser] = await this.prisma.$transaction([
      this.prisma.loyaltyTransaction.create({
        data: {
          user_id: data.user_id,
          type: 'earned',
          points: finalPoints,
          description: data.description,
          reference_type: data.reference_type,
          reference_id: data.reference_id,
        },
      }),
      this.prisma.user.update({
        where: { id: data.user_id },
        data: {
          loyalty_points: newTotal,
          loyalty_tier: newTier,
        },
      }),
    ]);

    return {
      transaction,
      user: {
        id: updatedUser.id,
        loyalty_points: updatedUser.loyalty_points,
        loyalty_tier: updatedUser.loyalty_tier,
        points_earned: finalPoints,
        tier_upgraded: newTier !== user.loyalty_tier,
      },
    };
  }

  // Resgatar pontos
  async redeemPoints(userId: number, data: RedeemPointsDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (user.loyalty_points < data.points) {
      throw new BadRequestException(
        `Pontos insuficientes. Você tem ${user.loyalty_points} pontos`,
      );
    }

    const newTotal = user.loyalty_points - data.points;
    const newTier = this.calculateTier(newTotal);

    const [transaction, updatedUser] = await this.prisma.$transaction([
      this.prisma.loyaltyTransaction.create({
        data: {
          user_id: userId,
          type: 'redeemed',
          points: -data.points,
          description: data.description,
        },
      }),
      this.prisma.user.update({
        where: { id: userId },
        data: {
          loyalty_points: newTotal,
          loyalty_tier: newTier,
        },
      }),
    ]);

    return {
      transaction,
      user: {
        id: updatedUser.id,
        loyalty_points: updatedUser.loyalty_points,
        loyalty_tier: updatedUser.loyalty_tier,
        points_redeemed: data.points,
      },
    };
  }

  // Transferir pontos
  async transferPoints(senderId: number, data: TransferPointsDto) {
    const sender = await this.prisma.user.findUnique({
      where: { id: senderId },
    });

    if (!sender) {
      throw new NotFoundException('Usuário remetente não encontrado');
    }

    const recipient = await this.prisma.user.findUnique({
      where: { id: data.recipient_user_id },
    });

    if (!recipient) {
      throw new NotFoundException('Usuário destinatário não encontrado');
    }

    if (sender.loyalty_points < data.points) {
      throw new BadRequestException('Pontos insuficientes para transferência');
    }

    const senderNewTotal = sender.loyalty_points - data.points;
    const recipientNewTotal = recipient.loyalty_points + data.points;

    await this.prisma.$transaction([
      // Deduzir do remetente
      this.prisma.loyaltyTransaction.create({
        data: {
          user_id: senderId,
          type: 'redeemed',
          points: -data.points,
          description: `Transferência para ${recipient.name}`,
        },
      }),
      this.prisma.user.update({
        where: { id: senderId },
        data: {
          loyalty_points: senderNewTotal,
          loyalty_tier: this.calculateTier(senderNewTotal),
        },
      }),
      // Adicionar ao destinatário
      this.prisma.loyaltyTransaction.create({
        data: {
          user_id: data.recipient_user_id,
          type: 'earned',
          points: data.points,
          description: `Transferência de ${sender.name}`,
        },
      }),
      this.prisma.user.update({
        where: { id: data.recipient_user_id },
        data: {
          loyalty_points: recipientNewTotal,
          loyalty_tier: this.calculateTier(recipientNewTotal),
        },
      }),
    ]);

    return {
      message: 'Pontos transferidos com sucesso',
      sender: { id: senderId, remaining_points: senderNewTotal },
      recipient: { id: data.recipient_user_id, new_points: recipientNewTotal },
    };
  }

  // Obter saldo de pontos
  async getBalance(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        loyalty_points: true,
        loyalty_tier: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const tierInfo = this.tiers[user.loyalty_tier] || this.tiers.bronze;
    const nextTier = this.getNextTier(user.loyalty_tier);
    const pointsToNextTier = nextTier ? nextTier.min - user.loyalty_points : 0;

    return {
      user,
      tier_info: {
        current_tier: user.loyalty_tier,
        multiplier: tierInfo.multiplier,
        next_tier: nextTier?.name,
        points_to_next_tier: pointsToNextTier > 0 ? pointsToNextTier : 0,
      },
    };
  }

  // Obter histórico de transações
  async getHistory(userId: number, limit = 50) {
    const transactions = await this.prisma.loyaltyTransaction.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: limit,
    });

    const summary = transactions.reduce(
      (acc, t) => {
        if (t.type === 'earned') acc.total_earned += t.points;
        if (t.type === 'redeemed') acc.total_redeemed += Math.abs(t.points);
        return acc;
      },
      { total_earned: 0, total_redeemed: 0 },
    );

    return {
      transactions,
      summary,
    };
  }

  // Obter próximo tier
  private getNextTier(currentTier: string) {
    const tiers = ['bronze', 'silver', 'gold', 'platinum'];
    const currentIndex = tiers.indexOf(currentTier);
    
    if (currentIndex === -1 || currentIndex === tiers.length - 1) {
      return null;
    }

    const nextTierName = tiers[currentIndex + 1];
    return {
      name: nextTierName,
      min: this.tiers[nextTierName].min,
      multiplier: this.tiers[nextTierName].multiplier,
    };
  }

  // Calcular pontos ganhos em uma compra
  calculatePointsFromPurchase(amount: number): number {
    // 1 ponto para cada R$ 1 gasto
    return Math.floor(amount);
  }

  // Converter pontos em desconto (1 ponto = R$ 0,01)
  convertPointsToDiscount(points: number): number {
    return points * 0.01;
  }
}
