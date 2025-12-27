import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CalculateShippingDto {
  @ApiProperty({ example: '01234-567', description: 'Destination zip code' })
  @IsString()
  @IsNotEmpty()
  zip_code: string;

  @ApiProperty({ example: 1.5, description: 'Package weight in kg' })
  @IsNumber()
  @Min(0.1)
  weight: number;

  @ApiProperty({ example: 20, description: 'Package width in cm' })
  @IsNumber()
  @Min(1)
  width: number;

  @ApiProperty({ example: 15, description: 'Package height in cm' })
  @IsNumber()
  @Min(1)
  height: number;

  @ApiProperty({ example: 30, description: 'Package length in cm' })
  @IsNumber()
  @Min(1)
  length: number;
}
