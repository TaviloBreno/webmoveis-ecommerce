import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';

export interface PaymentData {
  orderId: number;
  amount: number;
  customerEmail: string;
  customerName: string;
  customerCpf: string;
  customerPhone: string;
  items: Array<{
    name: string;
    quantity: number;
    amount: number;
  }>;
}

@Injectable()
export class PagSeguroService {
  private readonly apiUrl: string;
  private readonly token: string;
  private readonly email: string;

  constructor() {
    this.apiUrl = process.env.PAGSEGURO_SANDBOX === 'true' 
      ? 'https://ws.sandbox.pagseguro.uol.com.br'
      : 'https://ws.pagseguro.uol.com.br';
    this.token = process.env.PAGSEGURO_TOKEN || '';
    this.email = process.env.PAGSEGURO_EMAIL || '';
  }

  async createPayment(paymentData: PaymentData) {
    try {
      // Monta o XML para criar a transação
      const xmlData = this.buildPaymentXml(paymentData);

      const response = await axios.post(
        `${this.apiUrl}/v2/checkout`,
        xmlData,
        {
          headers: {
            'Content-Type': 'application/xml; charset=ISO-8859-1',
          },
          params: {
            email: this.email,
            token: this.token,
          },
        },
      );

      // Extrai o código do checkout da resposta
      const checkoutCode = this.extractCheckoutCode(response.data);

      return {
        success: true,
        checkoutCode,
        paymentUrl: `${this.getCheckoutUrl()}?code=${checkoutCode}`,
      };
    } catch (error: any) {
      console.error('PagSeguro Error:', error.response?.data || error.message);
      throw new BadRequestException('Failed to create payment with PagSeguro');
    }
  }

  async checkPaymentStatus(transactionCode: string) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/v3/transactions/${transactionCode}`,
        {
          params: {
            email: this.email,
            token: this.token,
          },
        },
      );

      return this.parseTransactionStatus(response.data);
    } catch (error: any) {
      console.error('PagSeguro Status Check Error:', error.response?.data || error.message);
      throw new BadRequestException('Failed to check payment status');
    }
  }

  async handleNotification(notificationCode: string) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/v3/transactions/notifications/${notificationCode}`,
        {
          params: {
            email: this.email,
            token: this.token,
          },
        },
      );

      return this.parseTransactionStatus(response.data);
    } catch (error: any) {
      console.error('PagSeguro Notification Error:', error.response?.data || error.message);
      throw new BadRequestException('Failed to process notification');
    }
  }

  private buildPaymentXml(paymentData: PaymentData): string {
    const items = paymentData.items
      .map(
        (item, index) => `
        <item>
          <id>${index + 1}</id>
          <description>${this.escapeXml(item.name)}</description>
          <amount>${item.amount.toFixed(2)}</amount>
          <quantity>${item.quantity}</quantity>
        </item>
      `,
      )
      .join('');

    return `<?xml version="1.0" encoding="ISO-8859-1" standalone="yes"?>
      <checkout>
        <currency>BRL</currency>
        <items>
          ${items}
        </items>
        <reference>${paymentData.orderId}</reference>
        <sender>
          <name>${this.escapeXml(paymentData.customerName)}</name>
          <email>${paymentData.customerEmail}</email>
          <phone>
            <areaCode>${paymentData.customerPhone.substring(0, 2)}</areaCode>
            <number>${paymentData.customerPhone.substring(2)}</number>
          </phone>
          <documents>
            <document>
              <type>CPF</type>
              <value>${paymentData.customerCpf.replace(/\D/g, '')}</value>
            </document>
          </documents>
        </sender>
        <redirectURL>${process.env.FRONTEND_URL}/order/success</redirectURL>
        <notificationURL>${process.env.API_URL}/payments/pagseguro/notification</notificationURL>
      </checkout>`;
  }

  private extractCheckoutCode(xml: string): string {
    const match = xml.match(/<code>(.*?)<\/code>/);
    if (!match) {
      throw new Error('Could not extract checkout code from response');
    }
    return match[1];
  }

  private parseTransactionStatus(xml: string): any {
    const status = this.extractXmlTag(xml, 'status');
    const reference = this.extractXmlTag(xml, 'reference');
    const grossAmount = this.extractXmlTag(xml, 'grossAmount');
    const netAmount = this.extractXmlTag(xml, 'netAmount');

    return {
      orderId: parseInt(reference),
      status: this.getStatusLabel(parseInt(status)),
      statusCode: parseInt(status),
      grossAmount: parseFloat(grossAmount),
      netAmount: parseFloat(netAmount),
    };
  }

  private extractXmlTag(xml: string, tag: string): string {
    const match = xml.match(new RegExp(`<${tag}>(.*?)</${tag}>`));
    return match ? match[1] : '';
  }

  private getStatusLabel(statusCode: number): string {
    const statuses: { [key: number]: string } = {
      1: 'Aguardando pagamento',
      2: 'Em análise',
      3: 'Paga',
      4: 'Disponível',
      5: 'Em disputa',
      6: 'Devolvida',
      7: 'Cancelada',
    };
    return statuses[statusCode] || 'Desconhecido';
  }

  private getCheckoutUrl(): string {
    return process.env.PAGSEGURO_SANDBOX === 'true'
      ? 'https://sandbox.pagseguro.uol.com.br/v2/checkout/payment.html'
      : 'https://pagseguro.uol.com.br/v2/checkout/payment.html';
  }

  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
