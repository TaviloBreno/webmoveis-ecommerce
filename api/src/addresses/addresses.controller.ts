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
  Patch,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('addresses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo endereço' })
  create(@Request() req, @Body() createAddressDto: CreateAddressDto) {
    return this.addressesService.create(req.user.userId, createAddressDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar endereços do usuário' })
  findAll(@Request() req) {
    return this.addressesService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter endereço por ID' })
  findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.addressesService.findOne(req.user.userId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar endereço' })
  update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressesService.update(req.user.userId, id, updateAddressDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover endereço' })
  remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.addressesService.remove(req.user.userId, id);
  }

  @Patch(':id/set-default')
  @ApiOperation({ summary: 'Definir endereço como padrão' })
  setDefault(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.addressesService.setDefault(req.user.userId, id);
  }
}
