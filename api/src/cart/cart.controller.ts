import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Obter carrinho do usuário' })
  getCart(@Request() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Get('count')
  @ApiOperation({ summary: 'Obter contagem de itens no carrinho' })
  getCartItemCount(@Request() req) {
    return this.cartService.getCartItemCount(req.user.id);
  }

  @Post('items')
  @ApiOperation({ summary: 'Adicionar produto ao carrinho' })
  @ApiBody({ type: AddToCartDto })
  addToCart(@Request() req, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(req.user.id, addToCartDto);
  }

  @Put('items/:id')
  @ApiOperation({ summary: 'Atualizar quantidade de item no carrinho' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do item no carrinho' })
  @ApiBody({ type: UpdateCartItemDto })
  updateCartItem(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(req.user.id, id, updateCartItemDto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Remover item do carrinho' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do item no carrinho' })
  removeFromCart(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.cartService.removeFromCart(req.user.id, id);
  }

  @Delete()
  @ApiOperation({ summary: 'Limpar carrinho' })
  clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.id);
  }
}
