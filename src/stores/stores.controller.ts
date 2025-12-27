import { Controller, Get, Post, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('stores')
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new store' })
  @ApiBody({ type: CreateStoreDto })
  registerStore(@Body() createStoreDto: CreateStoreDto) {
    return this.storesService.createStore(createStoreDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all stores' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of stores to return (default: 10)' })
  findStores(@Query('limit') limit: number) {
    return this.storesService.findAllStores(+limit || 10);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get store details by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Store ID' })
  findStoreById(@Param('id', ParseIntPipe) id: number) {
    return this.storesService.findStoreById(id);
  }
}
