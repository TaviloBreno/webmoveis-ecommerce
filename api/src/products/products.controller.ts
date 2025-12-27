import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('search')
  @ApiOperation({ summary: 'Buscar produtos por texto' })
  @ApiQuery({ name: 'q', description: 'Termo de busca' })
  searchProducts(@Query('q') query: string) {
    return this.productsService.searchProducts(query);
  }

  @Get()
  @ApiOperation({ summary: 'Listar produtos com filtros avançados' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'category_id', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'min_price', required: false, type: Number })
  @ApiQuery({ name: 'max_price', required: false, type: Number })
  @ApiQuery({ name: 'sort_by', required: false, enum: ['price_asc', 'price_desc', 'name', 'newest'] })
  findProducts(
    @Query('limit') limit: number,
    @Query('category_id') categoryId?: number,
    @Query('search') search?: string,
    @Query('min_price') minPrice?: number,
    @Query('max_price') maxPrice?: number,
    @Query('sort_by') sortBy?: string,
  ) {
    return this.productsService.findAllProducts(
      +limit || 10,
      categoryId ? +categoryId : undefined,
      search,
      minPrice ? +minPrice : undefined,
      maxPrice ? +maxPrice : undefined,
      sortBy,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes do produto com avaliações' })
  @ApiParam({ name: 'id', type: Number })
  findProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findProductById(id);
  }
}
