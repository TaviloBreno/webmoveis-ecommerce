import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('OrdersService', () => {
  let service: OrdersService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    product: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
    order: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create order successfully', async () => {
      const userId = 1;
      const createOrderDto = {
        items: [
          { product_id: 1, quantity: 2 },
          { product_id: 2, quantity: 1 },
        ],
        shipping_address: 'Rua Teste, 123',
        shipping_city: 'São Paulo',
        shipping_state: 'SP',
        shipping_zip_code: '01234-567',
        shipping_cost: 15.50,
        shipping_method: 'SEDEX',
      };

      const products = [
        { id: 1, price: 100, stock: 10, name: 'Product 1' },
        { id: 2, price: 50, stock: 5, name: 'Product 2' },
      ];

      const createdOrder = {
        id: 1,
        user_id: userId,
        total: 265.50, // (100*2 + 50*1 + 15.50)
        status: 'pending',
        ...createOrderDto,
        items: [
          { id: 1, product_id: 1, quantity: 2, price: 100, product: products[0] },
          { id: 2, product_id: 2, quantity: 1, price: 50, product: products[1] },
        ],
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockPrismaService.product.findMany.mockResolvedValue(products);
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback(mockPrismaService);
      });
      mockPrismaService.order.create.mockResolvedValue(createdOrder);

      const result = await service.createOrder(userId, createOrderDto);

      expect(result).toBeDefined();
      expect(result.total).toBe(265.50);
      expect(mockPrismaService.product.findMany).toHaveBeenCalled();
    });

    it('should throw BadRequestException if product not found', async () => {
      const userId = 1;
      const createOrderDto = {
        items: [{ product_id: 999, quantity: 1 }],
        shipping_address: 'Rua Teste, 123',
        shipping_city: 'São Paulo',
        shipping_state: 'SP',
        shipping_zip_code: '01234-567',
        shipping_cost: 15.50,
        shipping_method: 'SEDEX',
      };

      mockPrismaService.product.findMany.mockResolvedValue([]);

      await expect(service.createOrder(userId, createOrderDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if insufficient stock', async () => {
      const userId = 1;
      const createOrderDto = {
        items: [{ product_id: 1, quantity: 100 }],
        shipping_address: 'Rua Teste, 123',
        shipping_city: 'São Paulo',
        shipping_state: 'SP',
        shipping_zip_code: '01234-567',
        shipping_cost: 15.50,
        shipping_method: 'SEDEX',
      };

      const products = [{ id: 1, price: 100, stock: 5, name: 'Product 1' }];

      mockPrismaService.product.findMany.mockResolvedValue(products);

      await expect(service.createOrder(userId, createOrderDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getUserOrders', () => {
    it('should return user orders', async () => {
      const userId = 1;
      const orders = [
        {
          id: 1,
          user_id: userId,
          total: 265.50,
          status: 'pending',
          items: [],
          created_at: new Date(),
        },
        {
          id: 2,
          user_id: userId,
          total: 150.00,
          status: 'completed',
          items: [],
          created_at: new Date(),
        },
      ];

      mockPrismaService.order.findMany.mockResolvedValue(orders);

      const result = await service.getUserOrders(userId, 20);

      expect(result).toHaveLength(2);
      expect(result[0].user_id).toBe(userId);
      expect(mockPrismaService.order.findMany).toHaveBeenCalledWith({
        where: { user_id: userId },
        take: 20,
        include: expect.any(Object),
        orderBy: { created_at: 'desc' },
      });
    });
  });

  describe('getOrderById', () => {
    it('should return order details', async () => {
      const userId = 1;
      const orderId = 1;
      const order = {
        id: orderId,
        user_id: userId,
        total: 265.50,
        status: 'pending',
        items: [
          {
            id: 1,
            product_id: 1,
            quantity: 2,
            price: 100,
            product: { id: 1, name: 'Product 1' },
          },
        ],
        created_at: new Date(),
      };

      mockPrismaService.order.findFirst.mockResolvedValue(order);

      const result = await service.getOrderById(userId, orderId);

      expect(result).toBeDefined();
      expect(result.id).toBe(orderId);
      expect(result.user_id).toBe(userId);
      expect(mockPrismaService.order.findFirst).toHaveBeenCalledWith({
        where: { id: orderId, user_id: userId },
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundException if order not found', async () => {
      const userId = 1;
      const orderId = 999;

      mockPrismaService.order.findFirst.mockResolvedValue(null);

      await expect(service.getOrderById(userId, orderId)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if order belongs to different user', async () => {
      const userId = 1;
      const orderId = 1;

      mockPrismaService.order.findFirst.mockResolvedValue(null);

      await expect(service.getOrderById(userId, orderId)).rejects.toThrow(NotFoundException);
    });
  });
});
