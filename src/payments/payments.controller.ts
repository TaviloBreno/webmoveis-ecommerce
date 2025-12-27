import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { PagSeguroService } from './pagseguro.service';
import { CreatePaymentDto, PaymentNotificationDto } from './dto/payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { KafkaService } from '../kafka/kafka.service';
import { EmailService } from '../email/email.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly pagSeguroService: PagSeguroService,
    private readonly kafkaService: KafkaService,
    private readonly emailService: EmailService,
  ) {}

  @Post('pagseguro/create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a payment with PagSeguro' })
  @ApiBody({ type: CreatePaymentDto })
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    const payment = await this.pagSeguroService.createPayment({
      orderId: createPaymentDto.orderId,
      amount: createPaymentDto.amount,
      customerEmail: createPaymentDto.customerEmail,
      customerName: createPaymentDto.customerName,
      customerCpf: createPaymentDto.customerCpf,
      customerPhone: createPaymentDto.customerPhone,
      items: [
        {
          name: `Pedido #${createPaymentDto.orderId}`,
          quantity: 1,
          amount: createPaymentDto.amount,
        },
      ],
    });

    // Publica evento no Kafka
    await this.kafkaService.publish('payment-created', {
      orderId: createPaymentDto.orderId,
      checkoutCode: payment.checkoutCode,
      timestamp: new Date().toISOString(),
    });

    return payment;
  }

  @Get('pagseguro/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check payment status' })
  async checkStatus(@Query('transactionCode') transactionCode: string) {
    return await this.pagSeguroService.checkPaymentStatus(transactionCode);
  }

  @Post('pagseguro/notification')
  @ApiOperation({ summary: 'PagSeguro webhook for payment notifications' })
  async handleNotification(@Body() notificationDto: PaymentNotificationDto) {
    const paymentStatus = await this.pagSeguroService.handleNotification(
      notificationDto.notificationCode,
    );

    // Publica evento no Kafka
    await this.kafkaService.publish('payment-status-updated', {
      orderId: paymentStatus.orderId,
      status: paymentStatus.status,
      statusCode: paymentStatus.statusCode,
      timestamp: new Date().toISOString(),
    });

    // Envia e-mail se o pagamento foi confirmado
    if (paymentStatus.statusCode === 3) {
      // Status 3 = Paga
      // Aqui você buscaria os dados do pedido e do usuário
      // Por simplicidade, estou usando dados mock
      await this.emailService.sendPaymentConfirmation('customer@email.com', {
        orderId: paymentStatus.orderId,
        paymentMethod: 'PagSeguro',
        amount: paymentStatus.grossAmount,
        date: new Date().toISOString(),
      });
    }

    return { message: 'Notification processed successfully' };
  }
}
