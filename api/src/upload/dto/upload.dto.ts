import { IsInt, IsOptional, IsPositive, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadProductImageDto {
  @ApiProperty({ example: 1, description: 'ID do produto' })
  @IsInt()
  @IsPositive()
  product_id: number;

  @ApiProperty({ example: false, required: false, description: 'Definir como imagem principal' })
  @IsOptional()
  @IsBoolean()
  is_primary?: boolean;
}

export class SetPrimaryImageDto {
  @ApiProperty({ example: 1, description: 'ID da imagem' })
  @IsInt()
  @IsPositive()
  image_id: number;
}
