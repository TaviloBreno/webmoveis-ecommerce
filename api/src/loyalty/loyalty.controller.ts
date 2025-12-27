import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LoyaltyService } from './loyalty.service';
import { AddLoyaltyPointsDto, RedeemPointsDto, TransferPointsDto } from './dto/loyalty.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('loyalty')
@Controller('loyalty')
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  @Post('add-points')
  @ApiOperation({ summary: 'Adicionar pontos (Admin)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  addPoints(@Body() addPointsDto: AddLoyaltyPointsDto) {
    return this.loyaltyService.addPoints(addPointsDto);
  }

  @Post('redeem')
  @ApiOperation({ summary: 'Resgatar pontos' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  redeemPoints(@Request() req, @Body() redeemDto: RedeemPointsDto) {
    return this.loyaltyService.redeemPoints(req.user.id, redeemDto);
  }

  @Post('transfer')
  @ApiOperation({ summary: 'Transferir pontos para outro usuário' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  transferPoints(@Request() req, @Body() transferDto: TransferPointsDto) {
    return this.loyaltyService.transferPoints(req.user.id, transferDto);
  }

  @Get('balance')
  @ApiOperation({ summary: 'Consultar saldo de pontos' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getBalance(@Request() req) {
    return this.loyaltyService.getBalance(req.user.id);
  }

  @Get('balance/:userId')
  @ApiOperation({ summary: 'Consultar saldo de pontos de um usuário (Admin)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getBalanceByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.loyaltyService.getBalance(userId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Histórico de transações de pontos' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getHistory(@Request() req, @Query('limit') limit?: number) {
    return this.loyaltyService.getHistory(req.user.id, limit ? +limit : 50);
  }

  @Get('calculate/:amount')
  @ApiOperation({ summary: 'Calcular pontos para um valor de compra' })
  calculatePoints(@Param('amount', ParseIntPipe) amount: number) {
    const points = this.loyaltyService.calculatePointsFromPurchase(amount);
    const discount = this.loyaltyService.convertPointsToDiscount(points);
    return {
      purchase_amount: amount,
      points_to_earn: points,
      discount_value: discount,
    };
  }
}
