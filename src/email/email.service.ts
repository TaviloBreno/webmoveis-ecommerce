import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendWelcomeEmail(to: string, name: string) {
    const html = this.getWelcomeTemplate(name);
    
    await this.transporter.sendMail({
      from: `"WebMoveis E-commerce" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Bem-vindo ao WebMoveis! 🎉',
      html,
    });
  }

  async sendOrderConfirmation(to: string, orderData: any) {
    const html = this.getOrderConfirmationTemplate(orderData);
    
    await this.transporter.sendMail({
      from: `"WebMoveis E-commerce" <${process.env.SMTP_USER}>`,
      to,
      subject: `Pedido #${orderData.orderId} Confirmado! 📦`,
      html,
    });
  }

  async sendPaymentConfirmation(to: string, paymentData: any) {
    const html = this.getPaymentConfirmationTemplate(paymentData);
    
    await this.transporter.sendMail({
      from: `"WebMoveis E-commerce" <${process.env.SMTP_USER}>`,
      to,
      subject: `Pagamento Confirmado - Pedido #${paymentData.orderId} 💳`,
      html,
    });
  }

  async sendOrderStatusUpdate(to: string, statusData: any) {
    const html = this.getOrderStatusTemplate(statusData);
    
    await this.transporter.sendMail({
      from: `"WebMoveis E-commerce" <${process.env.SMTP_USER}>`,
      to,
      subject: `Atualização do Pedido #${statusData.orderId} 📬`,
      html,
    });
  }

  private getWelcomeTemplate(name: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Bem-vindo ao WebMoveis!</h1>
          </div>
          <div class="content">
            <h2>Olá, ${name}!</h2>
            <p>Estamos muito felizes em ter você conosco. Sua conta foi criada com sucesso!</p>
            <p>Agora você pode:</p>
            <ul>
              <li>✅ Navegar por milhares de produtos</li>
              <li>✅ Adicionar itens ao carrinho</li>
              <li>✅ Realizar compras com segurança</li>
              <li>✅ Acompanhar seus pedidos</li>
            </ul>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="button">Começar a Comprar</a>
          </div>
          <div class="footer">
            <p>© 2025 WebMoveis E-commerce. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getOrderConfirmationTemplate(orderData: any): string {
    const itemsHtml = orderData.items.map((item: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">R$ ${item.price.toFixed(2)}</td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          table { width: 100%; border-collapse: collapse; background: white; margin: 20px 0; }
          .total { font-size: 18px; font-weight: bold; margin-top: 20px; text-align: right; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📦 Pedido Confirmado!</h1>
          </div>
          <div class="content">
            <h2>Pedido #${orderData.orderId}</h2>
            <p>Olá, ${orderData.customerName}!</p>
            <p>Recebemos seu pedido e ele está sendo processado.</p>
            <table>
              <thead>
                <tr style="background: #f0f0f0;">
                  <th style="padding: 10px; text-align: left;">Produto</th>
                  <th style="padding: 10px; text-align: center;">Qtd</th>
                  <th style="padding: 10px; text-align: right;">Preço</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            <div class="total">
              <p>Frete: R$ ${orderData.shippingCost.toFixed(2)}</p>
              <p>Total: R$ ${orderData.total.toFixed(2)}</p>
            </div>
            <p style="margin-top: 20px;"><strong>Endereço de Entrega:</strong><br>
            ${orderData.address}</p>
          </div>
          <div class="footer">
            <p>© 2025 WebMoveis E-commerce. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getPaymentConfirmationTemplate(paymentData: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Pagamento Confirmado!</h1>
          </div>
          <div class="content">
            <div class="success">
              <strong>Seu pagamento foi aprovado com sucesso!</strong>
            </div>
            <h2>Pedido #${paymentData.orderId}</h2>
            <p><strong>Método de Pagamento:</strong> ${paymentData.paymentMethod}</p>
            <p><strong>Valor:</strong> R$ ${paymentData.amount.toFixed(2)}</p>
            <p><strong>Data:</strong> ${new Date(paymentData.date).toLocaleString('pt-BR')}</p>
            <p style="margin-top: 20px;">Seu pedido está sendo preparado para envio. Você receberá uma atualização em breve!</p>
          </div>
          <div class="footer">
            <p>© 2025 WebMoveis E-commerce. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getOrderStatusTemplate(statusData: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .status { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📬 Atualização do Pedido</h1>
          </div>
          <div class="content">
            <h2>Pedido #${statusData.orderId}</h2>
            <div class="status">
              <strong>Status Atual:</strong> ${statusData.status}
            </div>
            <p>${statusData.message}</p>
            ${statusData.trackingCode ? `<p><strong>Código de Rastreamento:</strong> ${statusData.trackingCode}</p>` : ''}
          </div>
          <div class="footer">
            <p>© 2025 WebMoveis E-commerce. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
