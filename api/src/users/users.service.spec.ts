import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return user profile without password', async () => {
      const user = {
        id: 1,
        name: 'Test User',
        email: 'test@email.com',
        password: 'hashed-password',
        phone: '11987654321',
        address: 'Rua Teste, 123',
        city: 'São Paulo',
        state: 'SP',
        zip_code: '01234-567',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const result = await service.getProfile(1);

      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe(user.email);
      expect(result.name).toBe(user.name);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getProfile(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      const updateDto = {
        name: 'Updated Name',
        phone: '11999999999',
        address: 'New Address',
      };

      const updatedUser = {
        id: 1,
        email: 'test@email.com',
        password: 'hashed-password',
        ...updateDto,
        city: 'São Paulo',
        state: 'SP',
        zip_code: '01234-567',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateProfile(1, updateDto);

      expect(result).not.toHaveProperty('password');
      expect(result.name).toBe(updateDto.name);
      expect(result.phone).toBe(updateDto.phone);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateDto,
      });
    });
  });

  describe('updatePassword', () => {
    it('should update password successfully', async () => {
      const userId = 1;
      const updatePasswordDto = {
        current_password: 'oldPassword123',
        new_password: 'newPassword123',
      };

      const user = {
        id: userId,
        email: 'test@email.com',
        password: await bcrypt.hash(updatePasswordDto.current_password, 10),
        name: 'Test User',
        phone: null,
        address: null,
        city: null,
        state: null,
        zip_code: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      mockPrismaService.user.update.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('new-hashed-password'));

      const result = await service.updatePassword(userId, updatePasswordDto);

      expect(result).toHaveProperty('message', 'Password updated successfully');
      expect(mockPrismaService.user.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      const updatePasswordDto = {
        current_password: 'oldPassword123',
        new_password: 'newPassword123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.updatePassword(999, updatePasswordDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if current password is incorrect', async () => {
      const userId = 1;
      const updatePasswordDto = {
        current_password: 'wrongPassword',
        new_password: 'newPassword123',
      };

      const user = {
        id: userId,
        password: 'hashed-password',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      await expect(service.updatePassword(userId, updatePasswordDto)).rejects.toThrow(UnauthorizedException);
      expect(mockPrismaService.user.update).not.toHaveBeenCalled();
    });
  });
});
