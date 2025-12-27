import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({ example: 'senhaAtual123', description: 'Current password' })
  @IsString()
  @IsNotEmpty()
  current_password: string;

  @ApiProperty({ example: 'novaSenha123', description: 'New password', minLength: 6 })
  @IsString()
  @MinLength(6)
  new_password: string;
}
