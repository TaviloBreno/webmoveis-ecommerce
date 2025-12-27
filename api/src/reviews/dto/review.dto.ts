import { IsInt, IsString, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  product_id: number;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Produto excelente!', required: false })
  @IsString()
  @IsOptional()
  comment?: string;
}

export class UpdateReviewStatusDto {
  @ApiProperty({ example: 'approved', enum: ['approved', 'rejected'] })
  @IsString()
  status: string;
}
