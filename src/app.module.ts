import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { StoresModule } from './stores/stores.module';
import { ShippingModule } from './shipping/shipping.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CategoriesModule,
    ProductsModule,
    StoresModule,
    ShippingModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
