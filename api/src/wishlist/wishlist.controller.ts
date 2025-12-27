import { Controller, Get, Post, Delete, Body, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AddToWishlistDto } from './dto/wishlist.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('wishlist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  @ApiOperation({ summary: 'Adicionar produto à lista de desejos' })
  add(@Request() req, @Body() addToWishlistDto: AddToWishlistDto) {
    return this.wishlistService.add(req.user.id, addToWishlistDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar lista de desejos' })
  findAll(@Request() req) {
    return this.wishlistService.findAll(req.user.id);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Remover produto da lista de desejos' })
  remove(@Request() req, @Param('productId', ParseIntPipe) productId: number) {
    return this.wishlistService.remove(req.user.id, productId);
  }

  @Delete()
  @ApiOperation({ summary: 'Limpar lista de desejos' })
  clear(@Request() req) {
    return this.wishlistService.clear(req.user.id);
  }
}
