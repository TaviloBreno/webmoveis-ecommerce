import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSupportTicketDto {
  @ApiProperty({ example: 'Problema com meu pedido' })
  @IsString()
  subject: string;

  @ApiProperty({ example: 'Meu pedido não chegou', required: false })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({ example: 'medium', enum: ['low', 'medium', 'high'], required: false })
  @IsString()
  @IsOptional()
  priority?: string;
}

export class SendMessageDto {
  @ApiProperty({ example: 'Aqui está a atualização...' })
  @IsString()
  message: string;
}

export class UpdateTicketStatusDto {
  @ApiProperty({ example: 'in_progress', enum: ['open', 'in_progress', 'closed'] })
  @IsString()
  status: string;
}
