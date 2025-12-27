import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendWelcomeEmail', () => {
    it('should have a method to send welcome email', () => {
      expect(service.sendWelcomeEmail).toBeDefined();
      expect(typeof service.sendWelcomeEmail).toBe('function');
    });
  });

  describe('sendOrderConfirmation', () => {
    it('should have a method to send order confirmation', () => {
      expect(service.sendOrderConfirmation).toBeDefined();
      expect(typeof service.sendOrderConfirmation).toBe('function');
    });
  });

  describe('sendPaymentConfirmation', () => {
    it('should have a method to send payment confirmation', () => {
      expect(service.sendPaymentConfirmation).toBeDefined();
      expect(typeof service.sendPaymentConfirmation).toBe('function');
    });
  });

  describe('sendOrderStatusUpdate', () => {
    it('should have a method to send order status update', () => {
      expect(service.sendOrderStatusUpdate).toBeDefined();
      expect(typeof service.sendOrderStatusUpdate).toBe('function');
    });
  });
});
