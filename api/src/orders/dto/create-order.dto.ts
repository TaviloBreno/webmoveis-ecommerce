import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty({ example: 1, description: 'Product ID' })
  @IsNumber()
  @IsNotEmpty()
  product_id: number;

  @ApiProperty({ example: 2, description: 'Quantity' })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto], description: 'Order items' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ example: 'Rua das Flores, 123', description: 'Shipping address' })
  @IsString()
  @IsNotEmpty()
  shipping_address: string;

  @ApiProperty({ example: 'São Paulo', description: 'Shipping city' })
  @IsString()
  @IsNotEmpty()
  shipping_city: string;

  @ApiProperty({ example: 'SP', description: 'Shipping state' })
  @IsString()
  @IsNotEmpty()
  shipping_state: string;

  @ApiProperty({ example: '01234-567', description: 'Shipping zip code' })
  @IsString()
  @IsNotEmpty()
  shipping_zip_code: string;

  @ApiProperty({ example: 15.50, description: 'Shipping cost' })
  @IsNumber()
  @Min(0)
  shipping_cost: number;

  @ApiProperty({ example: 'SEDEX', description: 'Shipping method' })
  @IsString()
  @IsNotEmpty()
  shipping_method: string;
}
