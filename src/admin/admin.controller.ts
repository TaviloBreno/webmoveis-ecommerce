import { Controller, Get, Post, Put, Delete, Patch, Body, Param, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: '[Admin] Estatísticas do dashboard' })
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Post('products')
  @ApiOperation({ summary: '[Admin] Criar produto' })
  createProduct(@Body() data: any) {
    return this.adminService.createProduct(data);
  }

  @Put('products/:id')
  @ApiOperation({ summary: '[Admin] Atualizar produto' })
  updateProduct(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.adminService.updateProduct(id, data);
  }

  @Delete('products/:id')
  @ApiOperation({ summary: '[Admin] Deletar produto' })
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteProduct(id);
  }

  @Post('categories')
  @ApiOperation({ summary: '[Admin] Criar categoria' })
  createCategory(@Body() data: any) {
    return this.adminService.createCategory(data);
  }

  @Put('categories/:id')
  @ApiOperation({ summary: '[Admin] Atualizar categoria' })
  updateCategory(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.adminService.updateCategory(id, data);
  }

  @Delete('categories/:id')
  @ApiOperation({ summary: '[Admin] Deletar categoria' })
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteCategory(id);
  }

  @Get('orders')
  @ApiOperation({ summary: '[Admin] Listar todos os pedidos' })
  getAllOrders(@Query('status') status?: string) {
    return this.adminService.getAllOrders(status);
  }

  @Patch('orders/:id/status')
  @ApiOperation({ summary: '[Admin] Atualizar status do pedido' })
  updateOrderStatus(@Param('id', ParseIntPipe) id: number, @Body('status') status: string) {
    return this.adminService.updateOrderStatus(id, status);
  }

  @Get('users')
  @ApiOperation({ summary: '[Admin] Listar todos os usuários' })
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Patch('users/:id/role')
  @ApiOperation({ summary: '[Admin] Atualizar role do usuário' })
  updateUserRole(@Param('id', ParseIntPipe) id: number, @Body('role') role: string) {
    return this.adminService.updateUserRole(id, role);
  }
}
