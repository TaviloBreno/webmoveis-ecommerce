import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTrackingEventDto {
  @ApiProperty({ example: 1, description: 'ID do pedido' })
  @IsInt()
  @IsPositive()
  order_id: number;

  @ApiProperty({
    example: 'shipped',
    description: 'Status do evento',
    enum: ['order_placed', 'payment_confirmed', 'preparing', 'shipped', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled'],
  })
  @IsString()
  status: string;

  @ApiProperty({ example: 'Centro de Distribuição - São Paulo, SP', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: 'Pedido saiu para entrega' })
  @IsString()
  description: string;
}

export class UpdateTrackingCodeDto {
  @ApiProperty({ example: 'BR123456789BR', description: 'Código de rastreamento da transportadora' })
  @IsString()
  tracking_code: string;

  @ApiProperty({ example: 'Correios', required: false })
  @IsOptional()
  @IsString()
  carrier?: string;
}

export class BulkTrackingEventDto {
  @ApiProperty({ example: [1, 2, 3], description: 'IDs dos pedidos' })
  @IsInt({ each: true })
  order_ids: number[];

  @ApiProperty({ example: 'shipped' })
  @IsString()
  status: string;

  @ApiProperty({ example: 'Centro de Distribuição', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: 'Pedidos enviados' })
  @IsString()
  description: string;
}
