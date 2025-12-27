import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';

@Injectable()
export class StoresService {
  constructor(private readonly prisma: PrismaService) {}

  async createStore(createStoreDto: CreateStoreDto) {
    const existingStore = await this.prisma.store.findUnique({
      where: { email: createStoreDto.email },
    });

    if (existingStore) {
      throw new ConflictException('Email already registered');
    }

    return this.prisma.store.create({
      data: createStoreDto,
    });
  }

  findAllStores(limit: number) {
    return this.prisma.store.findMany({
      take: limit,
      orderBy: { created_at: 'desc' },
    });
  }

  findStoreById(id: number) {
    return this.prisma.store.findUnique({
      where: { id },
      include: {
        products: {
          take: 10,
          include: {
            images: {
              where: { is_primary: true },
              take: 1,
            },
          },
        },
      },
    });
  }
}
