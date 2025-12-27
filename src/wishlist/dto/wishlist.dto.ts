import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToWishlistDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  product_id: number;
}
