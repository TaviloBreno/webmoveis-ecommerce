import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer, Consumer, EachMessagePayload } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumers: Map<string, Consumer> = new Map();

  constructor() {
    this.kafka = new Kafka({
      clientId: 'webmoveis-ecommerce',
      brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
      retry: {
        retries: 5,
        initialRetryTime: 300,
      },
    });

    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    try {
      await this.producer.connect();
      console.log('✅ Kafka conectado com sucesso');
    } catch (error) {
      console.warn('⚠️  Kafka não disponível. Sistema funcionará sem mensageria.');
    }
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    
    for (const [_, consumer] of this.consumers) {
      await consumer.disconnect();
    }
  }

  async publish(topic: string, message: any) {
    try {
      await this.producer.send({
        topic,
        messages: [
          {
            value: JSON.stringify(message),
            timestamp: Date.now().toString(),
          },
        ],
      });
    } catch (error: any) {
      console.warn('⚠️  Erro ao publicar mensagem no Kafka (serviço offline):', error?.message || error);
      // Não lança erro para não quebrar a aplicação
    }
  }

  async subscribe(
    topic: string,
    groupId: string,
    callback: (payload: EachMessagePayload) => Promise<void>,
  ) {
    const consumer = this.kafka.consumer({ groupId });
    
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: false });

    await consumer.run({
      eachMessage: callback,
    });

    this.consumers.set(`${groupId}-${topic}`, consumer);
  }
}
