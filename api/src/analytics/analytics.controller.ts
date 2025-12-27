import { Controller, Get, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('sales')
  @ApiOperation({ summary: '[Admin] Relatório de vendas' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  getSalesReport(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.analyticsService.getSalesReport(startDate, endDate);
  }

  @Get('products/top')
  @ApiOperation({ summary: '[Admin] Produtos mais vendidos' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getTopProducts(@Query('limit', new ParseIntPipe({ optional: true })) limit?: number) {
    return this.analyticsService.getTopProducts(limit);
  }

  @Get('categories')
  @ApiOperation({ summary: '[Admin] Estatísticas por categoria' })
  getCategoryStats() {
    return this.analyticsService.getCategoryStats();
  }

  @Get('revenue/timeline')
  @ApiOperation({ summary: '[Admin] Receita ao longo do tempo' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  getRevenueOverTime(@Query('days', new ParseIntPipe({ optional: true })) days?: number) {
    return this.analyticsService.getRevenueOverTime(days);
  }

  @Get('customers')
  @ApiOperation({ summary: '[Admin] Estatísticas de clientes' })
  getCustomerStats() {
    return this.analyticsService.getCustomerStats();
  }
}
