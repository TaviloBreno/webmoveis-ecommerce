import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { StoresModule } from './stores/stores.module';
import { ShippingModule } from './shipping/shipping.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { KafkaModule } from './kafka/kafka.module';
import { EmailModule } from './email/email.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    KafkaModule,
    EmailModule,
    CategoriesModule,
    ProductsModule,
    StoresModule,
    ShippingModule,
    AuthModule,
    UsersModule,
    OrdersModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
