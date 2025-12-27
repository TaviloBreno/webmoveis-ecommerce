import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, Request, Query, Patch } from '@nestjs/common';
import { SupportService } from './support.service';
import { CreateSupportTicketDto, SendMessageDto, UpdateTicketStatusDto } from './dto/support.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('support')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('tickets')
  @ApiOperation({ summary: 'Criar ticket de suporte' })
  createTicket(@Request() req, @Body() createTicketDto: CreateSupportTicketDto) {
    return this.supportService.createTicket(req.user.userId, createTicketDto);
  }

  @Get('tickets')
  @ApiOperation({ summary: 'Listar tickets' })
  @ApiQuery({ name: 'status', required: false })
  findAll(@Request() req, @Query('status') status?: string) {
    // Se for admin, lista todos, senão apenas os do usuário
    return this.supportService.findAll(req.user.userId, status);
  }

  @Get('tickets/:id')
  @ApiOperation({ summary: 'Obter detalhes do ticket' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.supportService.findOne(id);
  }

  @Post('tickets/:id/messages')
  @ApiOperation({ summary: 'Enviar mensagem no ticket' })
  sendMessage(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    return this.supportService.sendMessage(id, req.user.userId, sendMessageDto);
  }

  @Patch('tickets/:id/status')
  @ApiOperation({ summary: '[Admin] Atualizar status do ticket' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateTicketStatusDto,
  ) {
    return this.supportService.updateStatus(id, updateStatusDto);
  }
}
