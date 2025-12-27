import { Test, TestingModule } from '@nestjs/testing';
import { PagSeguroService } from './pagseguro.service';

describe('PagSeguroService', () => {
  let service: PagSeguroService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PagSeguroService],
    }).compile();

    service = module.get<PagSeguroService>(PagSeguroService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPayment', () => {
    it('should have a method to create payment', () => {
      expect(service.createPayment).toBeDefined();
      expect(typeof service.createPayment).toBe('function');
    });
  });

  describe('checkPaymentStatus', () => {
    it('should have a method to check payment status', () => {
      expect(service.checkPaymentStatus).toBeDefined();
      expect(typeof service.checkPaymentStatus).toBe('function');
    });
  });

  describe('handleNotification', () => {
    it('should have a method to handle notifications', () => {
      expect(service.handleNotification).toBeDefined();
      expect(typeof service.handleNotification).toBe('function');
    });
  });
});
