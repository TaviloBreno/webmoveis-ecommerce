import { IsInt, IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddLoyaltyPointsDto {
  @ApiProperty({ example: 1, description: 'ID do usuário' })
  @IsInt()
  @IsPositive()
  user_id: number;

  @ApiProperty({ example: 100, description: 'Quantidade de pontos' })
  @IsInt()
  @IsPositive()
  points: number;

  @ApiProperty({ example: 'Compra realizada', description: 'Descrição da transação' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'order', required: false })
  @IsOptional()
  @IsString()
  reference_type?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  reference_id?: number;
}

export class RedeemPointsDto {
  @ApiProperty({ example: 50, description: 'Pontos a resgatar' })
  @IsInt()
  @Min(10, { message: 'Mínimo de 10 pontos para resgatar' })
  points: number;

  @ApiProperty({ example: 'Desconto em pedido #123' })
  @IsString()
  description: string;
}

export class TransferPointsDto {
  @ApiProperty({ example: 2, description: 'ID do usuário destinatário' })
  @IsInt()
  @IsPositive()
  recipient_user_id: number;

  @ApiProperty({ example: 20, description: 'Pontos a transferir' })
  @IsInt()
  @Min(10)
  points: number;
}
