import { IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ example: 'João Silva', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: '11987654321', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'Rua das Flores, 123', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 'São Paulo', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: 'SP', required: false })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ example: '01234-567', required: false })
  @IsString()
  @IsOptional()
  zip_code?: string;
}
