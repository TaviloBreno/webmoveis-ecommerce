import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartItemDto {
  @ApiProperty({ example: 3, description: 'Nova quantidade do item' })
  @IsInt()
  @Min(1)
  quantity!: number;
}
