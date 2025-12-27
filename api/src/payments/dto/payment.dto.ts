import { IsString, IsEmail, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ example: 1, description: 'Order ID' })
  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @ApiProperty({ example: 'João Silva', description: 'Customer name' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ example: 'customer@email.com', description: 'Customer email' })
  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;

  @ApiProperty({ example: '12345678900', description: 'Customer CPF (only numbers)' })
  @IsString()
  @IsNotEmpty()
  customerCpf: string;

  @ApiProperty({ example: '11987654321', description: 'Customer phone (only numbers)' })
  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @ApiProperty({ example: 250.00, description: 'Total amount' })
  @IsNumber()
  @Min(0.01)
  amount: number;
}

export class PaymentNotificationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  notificationCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  notificationType: string;
}
