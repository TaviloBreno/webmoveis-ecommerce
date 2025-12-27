import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PagSeguroService } from './pagseguro.service';

@Module({
  controllers: [PaymentsController],
  providers: [PagSeguroService],
  exports: [PagSeguroService],
})
export class PaymentsModule {}
