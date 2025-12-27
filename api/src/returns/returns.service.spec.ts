import { Test, TestingModule } from '@nestjs/testing';
import { ReturnsService } from './returns.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ReturnsService', () => {
  let service: ReturnsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    order: {
      findFirst: jest.fn(),
    },
    return: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
      groupBy: jest.fn(),
    },
    orderItem: {
      findUnique: jest.fn(),
    },
    product: {
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReturnsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ReturnsService>(ReturnsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createReturn', () => {
    it('should create return request successfully', async () => {
      const mockOrder = {
        id: 1,
        user_id: 1,
        status: 'delivered',
        items: [
          { id: 1, price: 100, quantity: 2 },
          { id: 2, price: 50, quantity: 1 },
        ],
      };

      const mockReturn = {
        id: 1,
        order_id: 1,
        user_id: 1,
        type: 'return',
        reason: 'Defective product',
        status: 'requested',
        refund_amount: 100,
        items: [{ id: 1, order_item_id: 1, quantity: 1 }],
        order: mockOrder,
      };

      mockPrismaService.order.findFirst.mockResolvedValue(mockOrder);
      mockPrismaService.return.findFirst.mockResolvedValue(null);
      mockPrismaService.return.create.mockResolvedValue(mockReturn);

      const result = await service.createReturn(1, {
        order_id: 1,
        type: 'return',
        reason: 'Defective product',
        items: [
          {
            order_item_id: 1,
            quantity: 1,
            reason: 'Defective',
            condition: 'damaged',
          },
        ],
      });

      expect(result.status).toBe('requested');
      expect(result.refund_amount).toBe(100);
    });

    it('should throw NotFoundException if order not found', async () => {
      mockPrismaService.order.findFirst.mockResolvedValue(null);

      await expect(
        service.createReturn(1, {
          order_id: 999,
          type: 'return',
          reason: 'Test',
          items: [],
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if order not delivered', async () => {
      const mockOrder = {
        id: 1,
        user_id: 1,
        status: 'pending',
        items: [],
      };

      mockPrismaService.order.findFirst.mockResolvedValue(mockOrder);

      await expect(
        service.createReturn(1, {
          order_id: 1,
          type: 'return',
          reason: 'Test',
          items: [],
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if return already exists', async () => {
      const mockOrder = {
        id: 1,
        user_id: 1,
        status: 'delivered',
        items: [],
      };

      mockPrismaService.order.findFirst.mockResolvedValue(mockOrder);
      mockPrismaService.return.findFirst.mockResolvedValue({ id: 1 });

      await expect(
        service.createReturn(1, {
          order_id: 1,
          type: 'return',
          reason: 'Test',
          items: [],
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateReturnStatus', () => {
    it('should update return status to approved', async () => {
      const mockReturn = {
        id: 1,
        type: 'return',
        status: 'requested',
        items: [],
        order: { id: 1 },
        user: { id: 1 },
      };

      const mockUpdatedReturn = {
        ...mockReturn,
        status: 'approved',
        admin_notes: 'Approved',
      };

      mockPrismaService.return.findUnique.mockResolvedValue(mockReturn);
      mockPrismaService.return.update.mockResolvedValue(mockUpdatedReturn);

      const result = await service.updateReturnStatus(1, {
        status: 'approved',
        admin_notes: 'Approved',
      });

      expect(result.status).toBe('approved');
    });

    it('should restore stock when status is completed', async () => {
      const mockReturn = {
        id: 1,
        type: 'return',
        status: 'processing',
        items: [
          { id: 1, order_item_id: 1, quantity: 2 },
        ],
        order: { id: 1 },
        user: { id: 1 },
      };

      const mockOrderItem = {
        id: 1,
        product_id: 10,
      };

      mockPrismaService.return.findUnique.mockResolvedValue(mockReturn);
      mockPrismaService.return.update.mockResolvedValue({
        ...mockReturn,
        status: 'completed',
      });
      mockPrismaService.orderItem.findUnique.mockResolvedValue(mockOrderItem);
      mockPrismaService.product.update.mockResolvedValue({});

      await service.updateReturnStatus(1, {
        status: 'completed',
      });

      expect(mockPrismaService.product.update).toHaveBeenCalledWith({
        where: { id: 10 },
        data: { stock: { increment: 2 } },
      });
    });
  });

  describe('getUserReturns', () => {
    it('should return user returns list', async () => {
      const mockReturns = [
        {
          id: 1,
          order_id: 1,
          type: 'return',
          status: 'requested',
          items: [],
          order: { id: 1, total: 100 },
        },
      ];

      mockPrismaService.return.findMany.mockResolvedValue(mockReturns);

      const result = await service.getUserReturns(1);

      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('requested');
    });
  });

  describe('getReturnStats', () => {
    it('should return statistics', async () => {
      mockPrismaService.return.count
        .mockResolvedValueOnce(50) // total
        .mockResolvedValueOnce(10) // requested
        .mockResolvedValueOnce(20) // approved
        .mockResolvedValueOnce(5) // rejected
        .mockResolvedValueOnce(15); // completed

      mockPrismaService.return.aggregate.mockResolvedValue({
        _sum: { refund_amount: 5000 },
      });

      mockPrismaService.return.groupBy.mockResolvedValue([
        { type: 'return', _count: { id: 30 } },
        { type: 'exchange', _count: { id: 20 } },
      ]);

      const result = await service.getReturnStats();

      expect(result.total_returns).toBe(50);
      expect(result.by_status.requested).toBe(10);
      expect(result.total_refund_amount).toBe(5000);
    });
  });

  describe('cancelReturn', () => {
    it('should cancel return if status is requested', async () => {
      const mockReturn = {
        id: 1,
        user_id: 1,
        status: 'requested',
      };

      mockPrismaService.return.findFirst.mockResolvedValue(mockReturn);
      mockPrismaService.return.update.mockResolvedValue({
        ...mockReturn,
        status: 'rejected',
      });

      const result = await service.cancelReturn(1, 1);

      expect(result.status).toBe('rejected');
    });

    it('should throw BadRequestException if cannot cancel', async () => {
      const mockReturn = {
        id: 1,
        user_id: 1,
        status: 'completed',
      };

      mockPrismaService.return.findFirst.mockResolvedValue(mockReturn);

      await expect(service.cancelReturn(1, 1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
