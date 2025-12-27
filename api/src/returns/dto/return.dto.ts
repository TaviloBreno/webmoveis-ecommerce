import { IsInt, IsOptional, IsPositive, IsString, IsArray, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ReturnItemDto {
  @ApiProperty({ example: 1, description: 'ID do item do pedido' })
  @IsInt()
  @IsPositive()
  order_item_id: number;

  @ApiProperty({ example: 1, description: 'Quantidade a devolver' })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 'Produto com defeito' })
  @IsString()
  reason: string;

  @ApiProperty({ example: 'unopened', required: false, enum: ['unopened', 'used', 'damaged'] })
  @IsOptional()
  @IsString()
  condition?: string;
}

export class CreateReturnDto {
  @ApiProperty({ example: 1, description: 'ID do pedido' })
  @IsInt()
  @IsPositive()
  order_id: number;

  @ApiProperty({ example: 'return', description: 'Tipo', enum: ['return', 'exchange'] })
  @IsString()
  type: string;

  @ApiProperty({ example: 'Produto não atende expectativas' })
  @IsString()
  reason: string;

  @ApiProperty({ type: [ReturnItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReturnItemDto)
  items: ReturnItemDto[];

  @ApiProperty({ example: 5, required: false, description: 'ID do produto para troca (se type=exchange)' })
  @IsOptional()
  @IsInt()
  exchange_product_id?: number;
}

export class UpdateReturnStatusDto {
  @ApiProperty({ example: 'approved', enum: ['approved', 'rejected', 'received', 'processing', 'completed'] })
  @IsString()
  status: string;

  @ApiProperty({ example: 'Devolução aprovada. Reembolso será processado em até 5 dias úteis', required: false })
  @IsOptional()
  @IsString()
  admin_notes?: string;

  @ApiProperty({ example: 150.50, required: false })
  @IsOptional()
  @IsNumber()
  refund_amount?: number;
}
