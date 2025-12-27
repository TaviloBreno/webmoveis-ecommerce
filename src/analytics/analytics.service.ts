import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSalesReport(startDate?: string, endDate?: string) {
    const where: any = {};
    
    if (startDate || endDate) {
      where.created_at = {};
      if (startDate) where.created_at.gte = new Date(startDate);
      if (endDate) where.created_at.lte = new Date(endDate);
    }

    const [orders, revenue, avgOrderValue] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.aggregate({ where, _sum: { total: true } }),
      this.prisma.order.aggregate({ where, _avg: { total: true } }),
    ]);

    return {
      totalOrders: orders,
      totalRevenue: revenue._sum.total || 0,
      averageOrderValue: avgOrderValue._avg.total || 0,
    };
  }

  async getTopProducts(limit: number = 10) {
    const products = await this.prisma.orderItem.groupBy({
      by: ['product_id'],
      _sum: { quantity: true, price: true },
      _count: true,
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit,
    });

    const productDetails = await this.prisma.product.findMany({
      where: { id: { in: products.map(p => p.product_id) } },
      select: { id: true, name: true, price: true },
    });

    return products.map(p => {
      const product = productDetails.find(pd => pd.id === p.product_id);
      return {
        product_id: p.product_id,
        product_name: product?.name,
        quantity_sold: p._sum.quantity,
        revenue: p._sum.price,
        orders_count: p._count,
      };
    });
  }

  async getCategoryStats() {
    const categories = await this.prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
      },
    });

    return Promise.all(
      categories.map(async (category) => {
        const revenue = await this.prisma.orderItem.aggregate({
          where: {
            product: { category_id: category.id },
          },
          _sum: { price: true },
        });

        return {
          category_id: category.id,
          category_name: category.name,
          products_count: category._count.products,
          revenue: revenue._sum.price || 0,
        };
      }),
    );
  }

  async getRevenueOverTime(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await this.prisma.order.findMany({
      where: {
        created_at: { gte: startDate },
      },
      select: {
        created_at: true,
        total: true,
      },
      orderBy: { created_at: 'asc' },
    });

    // Agrupa por dia
    const revenueByDay: Record<string, number> = {};
    orders.forEach(order => {
      const date = order.created_at.toISOString().split('T')[0];
      revenueByDay[date] = (revenueByDay[date] || 0) + order.total;
    });

    return Object.entries(revenueByDay).map(([date, revenue]) => ({
      date,
      revenue,
    }));
  }

  async getCustomerStats() {
    const [totalCustomers, customersWithOrders] = await Promise.all([
      this.prisma.user.count({ where: { role: 'customer' } }),
      this.prisma.user.count({
        where: {
          role: 'customer',
          orders: { some: {} },
        },
      }),
    ]);

    return {
      totalCustomers,
      customersWithOrders,
      conversionRate: totalCustomers > 0 ? (customersWithOrders / totalCustomers) * 100 : 0,
    };
  }
}
