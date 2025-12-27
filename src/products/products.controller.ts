import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'List all products' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of products to return (default: 10)' })
  @ApiQuery({ name: 'category_id', required: false, type: Number, description: 'Filter by category ID' })
  findProducts(
    @Query('limit') limit: number,
    @Query('category_id') categoryId?: number,
  ) {
    return this.productsService.findAllProducts(+limit || 10, categoryId ? +categoryId : undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product details by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Product ID' })
  findProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findProductById(id);
  }
}
