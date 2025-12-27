import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';

@Injectable()
export class AddressesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createAddressDto: CreateAddressDto) {
    return this.prisma.address.create({
      data: {
        ...createAddressDto,
        user_id: userId,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.address.findMany({
      where: { user_id: userId },
      orderBy: [
        { is_default: 'desc' },
        { created_at: 'desc' },
      ],
    });
  }

  async findOne(userId: number, id: number) {
    const address = await this.prisma.address.findFirst({
      where: { id, user_id: userId },
    });

    if (!address) {
      throw new NotFoundException('Endereço não encontrado');
    }

    return address;
  }

  async update(userId: number, id: number, updateAddressDto: UpdateAddressDto) {
    await this.findOne(userId, id);

    return this.prisma.address.update({
      where: { id },
      data: updateAddressDto,
    });
  }

  async remove(userId: number, id: number) {
    await this.findOne(userId, id);

    return this.prisma.address.delete({
      where: { id },
    });
  }

  async setDefault(userId: number, id: number) {
    await this.findOne(userId, id);

    // Remove default de todos os endereços do usuário
    await this.prisma.address.updateMany({
      where: { user_id: userId, is_default: true },
      data: { is_default: false },
    });

    // Define o novo endereço padrão
    return this.prisma.address.update({
      where: { id },
      data: { is_default: true },
    });
  }
}
