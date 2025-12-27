import { IsInt, IsPositive, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({ example: 1, description: 'ID do produto' })
  @IsInt()
  @IsPositive()
  product_id!: number;

  @ApiProperty({ example: 2, description: 'Quantidade desejada' })
  @IsInt()
  @Min(1)
  quantity!: number;
}
