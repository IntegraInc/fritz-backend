import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { SeniorModule } from './senior/senior.module';
import { TablePriceController } from './table-price/table-price.controller';
import { TablePriceModule } from './table-price/table-price.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    ProductsModule,
    SeniorModule,
    TablePriceModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
