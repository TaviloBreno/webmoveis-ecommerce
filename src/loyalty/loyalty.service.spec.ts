import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyService } from './loyalty.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('LoyaltyService', () => {
  let service: LoyaltyService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    loyaltyTransaction: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoyaltyService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<LoyaltyService>(LoyaltyService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addPoints', () => {
    it('should add points to user with bronze tier multiplier', async () => {
      const mockUser = {
        id: 1,
        loyalty_points: 100,
        loyalty_tier: 'bronze',
      };

      const mockTransaction = {
        id: 1,
        user_id: 1,
        type: 'earned',
        points: 50,
        description: 'Purchase points',
      };

      const mockUpdatedUser = {
        id: 1,
        loyalty_points: 150,
        loyalty_tier: 'bronze',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.$transaction.mockResolvedValue([
        mockTransaction,
        mockUpdatedUser,
      ]);

      const result = await service.addPoints({
        user_id: 1,
        points: 50,
        description: 'Purchase points',
      });

      expect(result.user.points_earned).toBe(50);
      expect(result.user.loyalty_tier).toBe('bronze');
    });

    it('should upgrade tier when reaching threshold', async () => {
      const mockUser = {
        id: 1,
        loyalty_points: 450,
        loyalty_tier: 'bronze',
      };

      const mockUpdatedUser = {
        id: 1,
        loyalty_points: 550,
        loyalty_tier: 'silver',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.$transaction.mockResolvedValue([
        { id: 1 },
        mockUpdatedUser,
      ]);

      const result = await service.addPoints({
        user_id: 1,
        points: 100,
        description: 'Purchase',
      });

      expect(result.user.tier_upgraded).toBe(true);
      expect(result.user.loyalty_tier).toBe('silver');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.addPoints({
          user_id: 999,
          points: 50,
          description: 'Test',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('redeemPoints', () => {
    it('should redeem points successfully', async () => {
      const mockUser = {
        id: 1,
        loyalty_points: 100,
        loyalty_tier: 'bronze',
      };

      const mockUpdatedUser = {
        id: 1,
        loyalty_points: 50,
        loyalty_tier: 'bronze',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.$transaction.mockResolvedValue([
        { id: 1 },
        mockUpdatedUser,
      ]);

      const result = await service.redeemPoints(1, {
        points: 50,
        description: 'Discount',
      });

      expect(result.user.points_redeemed).toBe(50);
      expect(result.user.loyalty_points).toBe(50);
    });

    it('should throw BadRequestException if insufficient points', async () => {
      const mockUser = {
        id: 1,
        loyalty_points: 20,
        loyalty_tier: 'bronze',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        service.redeemPoints(1, {
          points: 50,
          description: 'Discount',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getBalance', () => {
    it('should return user balance with tier info', async () => {
      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        loyalty_points: 300,
        loyalty_tier: 'bronze',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getBalance(1);

      expect(result.user.loyalty_points).toBe(300);
      expect(result.tier_info.current_tier).toBe('bronze');
      expect(result.tier_info.next_tier).toBe('silver');
      expect(result.tier_info.points_to_next_tier).toBe(200);
    });
  });

  describe('calculatePointsFromPurchase', () => {
    it('should calculate 1 point per R$ 1', () => {
      expect(service.calculatePointsFromPurchase(100)).toBe(100);
      expect(service.calculatePointsFromPurchase(250.99)).toBe(250);
    });
  });

  describe('convertPointsToDiscount', () => {
    it('should convert points to discount (1 point = R$ 0.01)', () => {
      expect(service.convertPointsToDiscount(100)).toBe(1);
      expect(service.convertPointsToDiscount(500)).toBe(5);
    });
  });
});
