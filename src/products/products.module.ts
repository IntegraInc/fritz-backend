import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { SeniorService } from '../senior/senior.service';
import { ProductsController } from './products.controller';
import { SeniorModule } from '../senior/senior.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [SeniorModule, AuthModule],
  providers: [ProductsService],
  exports: [],
  controllers: [ProductsController],
})
export class ProductsModule {}
