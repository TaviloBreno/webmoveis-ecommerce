import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreDto {
  @ApiProperty({ example: 'Minha Loja', description: 'Store name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Loja de produtos diversos', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'loja@email.com', description: 'Store email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '11987654321', description: 'Store phone' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'Rua das Flores, 123', description: 'Store address' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'São Paulo', description: 'City' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'SP', description: 'State' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ example: '01234-567', description: 'Zip code' })
  @IsString()
  @IsNotEmpty()
  zip_code: string;
}
