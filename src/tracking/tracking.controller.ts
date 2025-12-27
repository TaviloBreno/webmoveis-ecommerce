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
import { TrackingService } from './tracking.service';
import {
  CreateTrackingEventDto,
  UpdateTrackingCodeDto,
  BulkTrackingEventDto,
} from './dto/tracking.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('tracking')
@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post('events')
  @ApiOperation({ summary: 'Criar evento de rastreamento (Admin)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  createEvent(@Body() createEventDto: CreateTrackingEventDto) {
    return this.trackingService.createTrackingEvent(createEventDto);
  }

  @Post('events/bulk')
  @ApiOperation({ summary: 'Criar eventos em lote (Admin)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  createBulkEvents(@Body() bulkEventDto: BulkTrackingEventDto) {
    return this.trackingService.createBulkTrackingEvents(bulkEventDto);
  }

  @Post('orders/:orderId/tracking-code')
  @ApiOperation({ summary: 'Adicionar código de rastreamento (Admin)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'orderId', type: Number })
  updateTrackingCode(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() updateCodeDto: UpdateTrackingCodeDto,
  ) {
    return this.trackingService.updateTrackingCode(orderId, updateCodeDto);
  }

  @Get('orders/:orderId')
  @ApiOperation({ summary: 'Obter histórico de rastreamento de um pedido' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'orderId', type: Number })
  getOrderTracking(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.trackingService.getOrderTracking(orderId);
  }

  @Get('code/:trackingCode')
  @ApiOperation({ summary: 'Rastrear pedido por código (público)' })
  @ApiParam({ name: 'trackingCode', type: String })
  trackByCode(@Param('trackingCode') trackingCode: string) {
    return this.trackingService.trackByCode(trackingCode);
  }

  @Get('list')
  @ApiOperation({ summary: 'Listar todos os pedidos com rastreamento (Admin)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  listAllTracking(@Query('status') status?: string, @Query('limit') limit?: number) {
    return this.trackingService.listAllTracking({
      status,
      limit: limit ? +limit : undefined,
    });
  }

  @Get('stats')
  @ApiOperation({ summary: 'Estatísticas de rastreamento (Admin)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getStats() {
    return this.trackingService.getTrackingStats();
  }
}
