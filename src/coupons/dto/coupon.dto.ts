import { IsString, IsNumber, IsDateString, IsBoolean, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCouponDto {
  @ApiProperty({ example: 'NATAL2025' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'Desconto de Natal' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'percentage', enum: ['percentage', 'fixed'] })
  @IsString()
  type: string;

  @ApiProperty({ example: 15 })
  @IsNumber()
  @Min(0)
  value: number;

  @ApiProperty({ example: 100, required: false })
  @IsNumber()
  @IsOptional()
  min_purchase?: number;

  @ApiProperty({ example: 50, required: false })
  @IsNumber()
  @IsOptional()
  max_discount?: number;

  @ApiProperty({ example: 100, required: false })
  @IsInt()
  @IsOptional()
  usage_limit?: number;

  @ApiProperty({ example: '2025-12-01T00:00:00Z' })
  @IsDateString()
  valid_from: string;

  @ApiProperty({ example: '2025-12-31T23:59:59Z' })
  @IsDateString()
  valid_until: string;
}

export class ValidateCouponDto {
  @ApiProperty({ example: 'NATAL2025' })
  @IsString()
  code: string;

  @ApiProperty({ example: 250.00 })
  @IsNumber()
  @Min(0)
  cart_total: number;
}
