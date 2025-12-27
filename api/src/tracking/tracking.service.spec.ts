import { Test, TestingModule } from '@nestjs/testing';
import { TrackingService } from './tracking.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('TrackingService', () => {
  let service: TrackingService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    order: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    orderTrackingEvent: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrackingService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TrackingService>(TrackingService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTrackingEvent', () => {
    it('should create tracking event and update order status', async () => {
      const mockOrder = {
        id: 1,
        status: 'pending',
      };

      const mockEvent = {
        id: 1,
        order_id: 1,
        status: 'payment_confirmed',
        location: 'São Paulo',
        description: 'Payment confirmed',
        created_at: new Date(),
      };

      mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);
      mockPrismaService.orderTrackingEvent.create.mockResolvedValue(mockEvent);
      mockPrismaService.order.update.mockResolvedValue({
        ...mockOrder,
        status: 'paid',
      });

      const result = await service.createTrackingEvent({
        order_id: 1,
        status: 'payment_confirmed',
        location: 'São Paulo',
        description: 'Payment confirmed',
      });

      expect(result).toEqual(mockEvent);
      expect(mockPrismaService.order.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: 'paid' },
      });
    });

    it('should throw NotFoundException if order not found', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(null);

      await expect(
        service.createTrackingEvent({
          order_id: 999,
          status: 'shipped',
          description: 'Shipped',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTrackingCode', () => {
    it('should update order with tracking code', async () => {
      const mockOrder = {
        id: 1,
        tracking_code: null,
      };

      const mockUpdatedOrder = {
        id: 1,
        tracking_code: 'BR123456789BR',
      };

      mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);
      mockPrismaService.order.update.mockResolvedValue(mockUpdatedOrder);
      mockPrismaService.orderTrackingEvent.create.mockResolvedValue({});

      const result = await service.updateTrackingCode(1, {
        tracking_code: 'BR123456789BR',
        carrier: 'Correios',
      });

      expect(result.tracking_code).toBe('BR123456789BR');
    });
  });

  describe('getOrderTracking', () => {
    it('should return order tracking with events', async () => {
      const mockOrder = {
        id: 1,
        tracking_code: 'BR123456789BR',
        status: 'shipped',
        total: 100,
        created_at: new Date(),
        user: { id: 1, name: 'John', email: 'john@example.com' },
        tracking_events: [
          {
            id: 1,
            status: 'order_placed',
            description: 'Order placed',
            created_at: new Date(),
          },
          {
            id: 2,
            status: 'shipped',
            description: 'Shipped',
            created_at: new Date(),
          },
        ],
      };

      mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);

      const result = await service.getOrderTracking(1);

      expect(result.order_id).toBe(1);
      expect(result.tracking_code).toBe('BR123456789BR');
      expect(result.event_count).toBe(2);
    });
  });

  describe('trackByCode', () => {
    it('should track order by code (public)', async () => {
      const mockOrder = {
        tracking_code: 'BR123456789BR',
        status: 'in_transit',
        items: [
          {
            quantity: 2,
            product: {
              id: 1,
              name: 'Product 1',
              images: [{ image_url: '/image.jpg' }],
            },
          },
        ],
        tracking_events: [
          { id: 1, status: 'shipped', created_at: new Date() },
        ],
      };

      mockPrismaService.order.findFirst.mockResolvedValue(mockOrder);

      const result = await service.trackByCode('BR123456789BR');

      expect(result.tracking_code).toBe('BR123456789BR');
      expect(result.items_count).toBe(1);
    });

    it('should throw NotFoundException if code not found', async () => {
      mockPrismaService.order.findFirst.mockResolvedValue(null);

      await expect(service.trackByCode('INVALID')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getTrackingStats', () => {
    it('should return tracking statistics', async () => {
      mockPrismaService.order.count
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(10) // pending
        .mockResolvedValueOnce(20) // processing
        .mockResolvedValueOnce(30) // shipped
        .mockResolvedValueOnce(40); // delivered

      mockPrismaService.order.findMany.mockResolvedValue([]);

      const result = await service.getTrackingStats();

      expect(result.total_orders).toBe(100);
      expect(result.by_status.pending).toBe(10);
      expect(result.by_status.shipped).toBe(30);
    });
  });
});
