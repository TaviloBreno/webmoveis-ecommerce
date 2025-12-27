import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
  Query,
  Patch,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, UpdateReviewStatusDto } from './dto/review.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Criar avaliação de produto' })
  create(@Request() req, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(req.user.id, createReviewDto);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Listar avaliações de um produto' })
  @ApiQuery({ name: 'status', required: false, enum: ['approved', 'pending', 'rejected'] })
  findByProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Query('status') status?: string,
  ) {
    return this.reviewsService.findByProduct(productId, status);
  }

  @Get('product/:productId/rating')
  @ApiOperation({ summary: 'Obter média de avaliações do produto' })
  getProductRating(@Param('productId', ParseIntPipe) productId: number) {
    return this.reviewsService.getProductRating(productId);
  }

  @Get('pending')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '[Admin] Listar avaliações pendentes' })
  findPending() {
    return this.reviewsService.findPending();
  }

  @Patch(':id/status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '[Admin] Atualizar status da avaliação' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateReviewStatusDto,
  ) {
    return this.reviewsService.updateStatus(id, updateStatusDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remover avaliação' })
  remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.remove(req.user.id, id);
  }
}
