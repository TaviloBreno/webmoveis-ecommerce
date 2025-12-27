import { Controller, Get, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'List all categories' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of categories to return (default: 10)' })
  findCategories(@Query('limit') limit: number) {
    return this.categoriesService.findAllCategories(+limit || 10);
  }
}
