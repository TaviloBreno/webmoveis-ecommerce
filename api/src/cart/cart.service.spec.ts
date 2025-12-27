import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('CartService', () => {
  let service: CartService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    cart: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    cartItem: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
      aggregate: jest.fn(),
    },
    product: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCart', () => {
    it('should return user cart with total and item count', async () => {
      const userId = 1;
      const mockCart = {
        id: 1,
        user_id: userId,
        items: [
          {
            id: 1,
            quantity: 2,
            product: { id: 1, price: 100, images: [], category: {}, store: {} },
          },
          {
            id: 2,
            quantity: 1,
            product: { id: 2, price: 50, images: [], category: {}, store: {} },
          },
        ],
      };

      mockPrismaService.cart.findUnique.mockResolvedValue(mockCart);

      const result = await service.getCart(userId);

      expect(result.total).toBe(250); // (100*2 + 50*1)
      expect(result.item_count).toBe(3); // (2 + 1)
      expect(result.items).toHaveLength(2);
    });

    it('should create cart if not exists', async () => {
      const userId = 1;
      const newCart = {
        id: 1,
        user_id: userId,
        items: [],
      };

      mockPrismaService.cart.findUnique.mockResolvedValue(null);
      mockPrismaService.cart.create.mockResolvedValue(newCart);

      const result = await service.getCart(userId);

      expect(mockPrismaService.cart.create).toHaveBeenCalled();
      expect(result.total).toBe(0);
      expect(result.item_count).toBe(0);
    });
  });

  describe('addToCart', () => {
    it('should add new product to cart', async () => {
      const userId = 1;
      const addToCartDto = { product_id: 1, quantity: 2 };
      const mockProduct = { id: 1, stock: 10, price: 100 };
      const mockCart = { id: 1, user_id: userId, items: [] };

      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.cart.findUnique.mockResolvedValue(mockCart);
      mockPrismaService.cartItem.findUnique.mockResolvedValue(null);
      mockPrismaService.cartItem.create.mockResolvedValue({});

      await service.addToCart(userId, addToCartDto);

      expect(mockPrismaService.cartItem.create).toHaveBeenCalledWith({
        data: {
          cart_id: mockCart.id,
          product_id: addToCartDto.product_id,
          quantity: addToCartDto.quantity,
        },
      });
    });

    it('should throw NotFoundException if product not found', async () => {
      const userId = 1;
      const addToCartDto = { product_id: 999, quantity: 1 };

      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.addToCart(userId, addToCartDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if insufficient stock', async () => {
      const userId = 1;
      const addToCartDto = { product_id: 1, quantity: 10 };
      const mockProduct = { id: 1, stock: 5, price: 100 };

      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);

      await expect(service.addToCart(userId, addToCartDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should update quantity if product already in cart', async () => {
      const userId = 1;
      const addToCartDto = { product_id: 1, quantity: 2 };
      const mockProduct = { id: 1, stock: 10, price: 100 };
      const mockCart = { id: 1, user_id: userId, items: [] };
      const existingItem = { id: 1, cart_id: 1, product_id: 1, quantity: 3 };

      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.cart.findUnique.mockResolvedValue(mockCart);
      mockPrismaService.cartItem.findUnique.mockResolvedValue(existingItem);
      mockPrismaService.cartItem.update.mockResolvedValue({});

      await service.addToCart(userId, addToCartDto);

      expect(mockPrismaService.cartItem.update).toHaveBeenCalledWith({
        where: { id: existingItem.id },
        data: { quantity: 5 }, // 3 + 2
      });
    });
  });

  describe('updateCartItem', () => {
    it('should update item quantity', async () => {
      const userId = 1;
      const itemId = 1;
      const updateDto = { quantity: 5 };
      const mockCart = { id: 1, user_id: userId, items: [] };
      const mockCartItem = {
        id: itemId,
        cart_id: 1,
        product: { stock: 10 },
      };

      mockPrismaService.cart.findUnique.mockResolvedValue(mockCart);
      mockPrismaService.cartItem.findFirst.mockResolvedValue(mockCartItem);
      mockPrismaService.cartItem.update.mockResolvedValue({});

      await service.updateCartItem(userId, itemId, updateDto);

      expect(mockPrismaService.cartItem.update).toHaveBeenCalledWith({
        where: { id: itemId },
        data: { quantity: updateDto.quantity },
      });
    });

    it('should throw NotFoundException if item not in cart', async () => {
      const userId = 1;
      const itemId = 999;
      const updateDto = { quantity: 5 };
      const mockCart = { id: 1, user_id: userId, items: [] };

      mockPrismaService.cart.findUnique.mockResolvedValue(mockCart);
      mockPrismaService.cartItem.findFirst.mockResolvedValue(null);

      await expect(
        service.updateCartItem(userId, itemId, updateDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeFromCart', () => {
    it('should remove item from cart', async () => {
      const userId = 1;
      const itemId = 1;
      const mockCart = { id: 1, user_id: userId, items: [] };
      const mockCartItem = { id: itemId, cart_id: 1 };

      mockPrismaService.cart.findUnique.mockResolvedValue(mockCart);
      mockPrismaService.cartItem.findFirst.mockResolvedValue(mockCartItem);
      mockPrismaService.cartItem.delete.mockResolvedValue({});

      await service.removeFromCart(userId, itemId);

      expect(mockPrismaService.cartItem.delete).toHaveBeenCalledWith({
        where: { id: itemId },
      });
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', async () => {
      const userId = 1;
      const mockCart = { id: 1, user_id: userId, items: [] };

      mockPrismaService.cart.findUnique.mockResolvedValue(mockCart);
      mockPrismaService.cartItem.deleteMany.mockResolvedValue({ count: 3 });

      await service.clearCart(userId);

      expect(mockPrismaService.cartItem.deleteMany).toHaveBeenCalledWith({
        where: { cart_id: mockCart.id },
      });
    });
  });

  describe('getCartItemCount', () => {
    it('should return total item count in cart', async () => {
      const userId = 1;
      const mockCart = { id: 1, user_id: userId, items: [] };

      mockPrismaService.cart.findUnique.mockResolvedValue(mockCart);
      mockPrismaService.cartItem.aggregate.mockResolvedValue({
        _sum: { quantity: 5 },
      });

      const result = await service.getCartItemCount(userId);

      expect(result.item_count).toBe(5);
    });
  });
});
