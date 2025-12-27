import { Controller, Get, Post, Body, Param, ParseIntPipe, Query, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order (purchase)' })
  @ApiBody({ type: CreateOrderDto })
  createOrder(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(req.user.id, createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'List user orders' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of orders to return (default: 20)' })
  getUserOrders(@Request() req, @Query('limit') limit: number) {
    return this.ordersService.getUserOrders(req.user.id, +limit || 20);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order details by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Order ID' })
  getOrderById(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.ordersService.getOrderById(req.user.id, id);
  }
}
