import { Test, TestingModule } from '@nestjs/testing';
import { UploadService } from './upload.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

// Mock fs module
jest.mock('fs');

describe('UploadService', () => {
  let service: UploadService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    product: {
      findUnique: jest.fn(),
      count: jest.fn(),
    },
    productImage: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UploadService>(UploadService);
    prismaService = module.get<PrismaService>(PrismaService);

    // Setup fs mocks
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.mkdirSync as jest.Mock).mockReturnValue(undefined);
    (fs.writeFileSync as jest.Mock).mockReturnValue(undefined);
    (fs.unlinkSync as jest.Mock).mockReturnValue(undefined);
    (fs.readdirSync as jest.Mock).mockReturnValue([]);
    (fs.statSync as jest.Mock).mockReturnValue({ size: 1024 });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateFile', () => {
    it('should accept valid image types', () => {
      const validFile = {
        mimetype: 'image/jpeg',
        size: 1024 * 1024, // 1MB
      } as Express.Multer.File;

      expect(() => service.validateFile(validFile)).not.toThrow();
    });

    it('should reject invalid mime types', () => {
      const invalidFile = {
        mimetype: 'application/pdf',
        size: 1024,
      } as Express.Multer.File;

      expect(() => service.validateFile(invalidFile)).toThrow(
        BadRequestException,
      );
    });

    it('should reject files exceeding size limit', () => {
      const largeFile = {
        mimetype: 'image/jpeg',
        size: 10 * 1024 * 1024, // 10MB
      } as Express.Multer.File;

      expect(() => service.validateFile(largeFile)).toThrow(
        BadRequestException,
      );
    });
  });

  describe('uploadProductImage', () => {
    it('should upload image successfully', async () => {
      const mockProduct = { id: 1, name: 'Product' };
      const mockFile = {
        mimetype: 'image/jpeg',
        size: 1024,
        buffer: Buffer.from('test'),
        originalname: 'test.jpg',
      } as Express.Multer.File;

      const mockImage = {
        id: 1,
        product_id: 1,
        image_url: '/uploads/product_1_123.jpg',
        is_primary: false,
      };

      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.productImage.create.mockResolvedValue(mockImage);

      const result = await service.uploadProductImage(1, mockFile, false);

      expect(result.id).toBe(1);
      expect(result.url).toBe('/uploads/product_1_123.jpg');
      expect(mockPrismaService.productImage.create).toHaveBeenCalled();
    });

    it('should set as primary and update other images', async () => {
      const mockProduct = { id: 1 };
      const mockFile = {
        mimetype: 'image/png',
        size: 1024,
        buffer: Buffer.from('test'),
        originalname: 'test.png',
      } as Express.Multer.File;

      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.productImage.updateMany.mockResolvedValue({});
      mockPrismaService.productImage.create.mockResolvedValue({
        id: 1,
        image_url: '/uploads/test.png',
        is_primary: true,
      });

      await service.uploadProductImage(1, mockFile, true);

      expect(mockPrismaService.productImage.updateMany).toHaveBeenCalledWith({
        where: { product_id: 1 },
        data: { is_primary: false },
      });
    });

    it('should throw NotFoundException if product not found', async () => {
      const mockFile = {
        mimetype: 'image/jpeg',
        size: 1024,
        buffer: Buffer.from('test'),
        originalname: 'test.jpg',
      } as Express.Multer.File;

      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(
        service.uploadProductImage(999, mockFile, false),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('uploadMultipleImages', () => {
    it('should upload multiple images', async () => {
      const mockProduct = { id: 1 };
      const mockFiles = [
        {
          mimetype: 'image/jpeg',
          size: 1024,
          buffer: Buffer.from('test1'),
          originalname: 'test1.jpg',
        },
        {
          mimetype: 'image/png',
          size: 1024,
          buffer: Buffer.from('test2'),
          originalname: 'test2.png',
        },
      ] as Express.Multer.File[];

      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.productImage.create
        .mockResolvedValueOnce({ id: 1, image_url: '/uploads/img1.jpg' })
        .mockResolvedValueOnce({ id: 2, image_url: '/uploads/img2.png' });

      const result = await service.uploadMultipleImages(1, mockFiles);

      expect(result.count).toBe(2);
      expect(result.images).toHaveLength(2);
    });

    it('should throw BadRequestException if no files provided', async () => {
      await expect(service.uploadMultipleImages(1, [])).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('setPrimaryImage', () => {
    it('should set image as primary', async () => {
      const mockImage = {
        id: 1,
        product_id: 1,
        image_url: '/uploads/test.jpg',
        is_primary: false,
      };

      mockPrismaService.productImage.findFirst.mockResolvedValue(mockImage);
      mockPrismaService.productImage.updateMany.mockResolvedValue({});
      mockPrismaService.productImage.update.mockResolvedValue({
        ...mockImage,
        is_primary: true,
      });

      const result = await service.setPrimaryImage(1, 1);

      expect(result.is_primary).toBe(true);
      expect(mockPrismaService.productImage.updateMany).toHaveBeenCalled();
    });

    it('should throw NotFoundException if image not found', async () => {
      mockPrismaService.productImage.findFirst.mockResolvedValue(null);

      await expect(service.setPrimaryImage(1, 999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteImage', () => {
    it('should delete image and file', async () => {
      const mockImage = {
        id: 1,
        image_url: '/uploads/test.jpg',
      };

      mockPrismaService.productImage.findUnique.mockResolvedValue(mockImage);
      mockPrismaService.productImage.delete.mockResolvedValue(mockImage);

      const result = await service.deleteImage(1);

      expect(result.message).toBe('Imagem deletada com sucesso');
      expect(fs.unlinkSync).toHaveBeenCalled();
    });

    it('should throw NotFoundException if image not found', async () => {
      mockPrismaService.productImage.findUnique.mockResolvedValue(null);

      await expect(service.deleteImage(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getProductImages', () => {
    it('should return product images', async () => {
      const mockImages = [
        { id: 1, product_id: 1, is_primary: true, created_at: new Date() },
        { id: 2, product_id: 1, is_primary: false, created_at: new Date() },
      ];

      mockPrismaService.productImage.findMany.mockResolvedValue(mockImages);

      const result = await service.getProductImages(1);

      expect(result.product_id).toBe(1);
      expect(result.count).toBe(2);
      expect(result.images).toHaveLength(2);
    });
  });

  describe('getStorageStats', () => {
    it('should return storage statistics', async () => {
      mockPrismaService.productImage.count.mockResolvedValue(100);
      mockPrismaService.product.count
        .mockResolvedValueOnce(80) // with images
        .mockResolvedValueOnce(20); // without images

      const result = await service.getStorageStats();

      expect(result.total_images).toBe(100);
      expect(result.products_with_images).toBe(80);
      expect(result.products_without_images).toBe(20);
    });
  });
});
