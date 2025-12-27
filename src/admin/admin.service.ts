import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // Dashboard Stats
  async getDashboardStats() {
    const [totalOrders, totalRevenue, totalUsers, totalProducts] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.aggregate({ _sum: { total: true } }),
      this.prisma.user.count(),
      this.prisma.product.count(),
    ]);

    return {
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      totalUsers,
      totalProducts,
    };
  }

  // Products Management
  async createProduct(data: any) {
    return this.prisma.product.create({ data });
  }

  async updateProduct(id: number, data: any) {
    return this.prisma.product.update({ where: { id }, data });
  }

  async deleteProduct(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }

  // Categories Management
  async createCategory(data: any) {
    return this.prisma.category.create({ data });
  }

  async updateCategory(id: number, data: any) {
    return this.prisma.category.update({ where: { id }, data });
  }

  async deleteCategory(id: number) {
    return this.prisma.category.delete({ where: { id } });
  }

  // Orders Management
  async getAllOrders(status?: string) {
    return this.prisma.order.findMany({
      where: status ? { status } : undefined,
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: {
            product: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async updateOrderStatus(id: number, status: string) {
    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }

  // Users Management
  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        created_at: true,
        _count: {
          select: { orders: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async updateUserRole(id: number, role: string) {
    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, name: true, role: true },
    });
  }
}
