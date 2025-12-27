import { Test, TestingModule } from '@nestjs/testing';
import { KafkaService } from './kafka.service';

describe('KafkaService', () => {
  let service: KafkaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KafkaService],
    }).compile();

    service = module.get<KafkaService>(KafkaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('publish', () => {
    it('should have a method to publish messages', () => {
      expect(service.publish).toBeDefined();
      expect(typeof service.publish).toBe('function');
    });
  });

  describe('subscribe', () => {
    it('should have a method to subscribe to topics', () => {
      expect(service.subscribe).toBeDefined();
      expect(typeof service.subscribe).toBe('function');
    });
  });
});
