import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  Request,
  Delete,
} from '@nestjs/common';
import { ReturnsService } from './returns.service';
import { CreateReturnDto, UpdateReturnStatusDto } from './dto/return.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('returns')
@Controller('returns')
export class ReturnsController {
  constructor(private readonly returnsService: ReturnsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar solicitação de devolução/troca' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  createReturn(@Request() req, @Body() createReturnDto: CreateReturnDto) {
    return this.returnsService.createReturn(req.user.id, createReturnDto);
  }

  @Get('my-returns')
  @ApiOperation({ summary: 'Listar minhas devoluções' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getMyReturns(@Request() req) {
    return this.returnsService.getUserReturns(req.user.id);
  }

  @Get('admin/list')
  @ApiOperation({ summary: 'Listar todas as devoluções (Admin)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'type', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  listAllReturns(
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('limit') limit?: number,
  ) {
    return this.returnsService.listAllReturns({
      status,
      type,
      limit: limit ? +limit : undefined,
    });
  }

  @Get('admin/stats')
  @ApiOperation({ summary: 'Estatísticas de devoluções (Admin)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getStats() {
    return this.returnsService.getReturnStats();
  }

  @Get(':returnId')
  @ApiOperation({ summary: 'Obter detalhes da devolução' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'returnId', type: Number })
  getReturnDetails(@Request() req, @Param('returnId', ParseIntPipe) returnId: number) {
    return this.returnsService.getReturnDetails(returnId, req.user.id);
  }

  @Patch(':returnId/status')
  @ApiOperation({ summary: 'Atualizar status da devolução (Admin)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'returnId', type: Number })
  updateStatus(
    @Param('returnId', ParseIntPipe) returnId: number,
    @Body() updateStatusDto: UpdateReturnStatusDto,
  ) {
    return this.returnsService.updateReturnStatus(returnId, updateStatusDto);
  }

  @Delete(':returnId')
  @ApiOperation({ summary: 'Cancelar devolução' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'returnId', type: Number })
  cancelReturn(@Request() req, @Param('returnId', ParseIntPipe) returnId: number) {
    return this.returnsService.cancelReturn(returnId, req.user.id);
  }
}
