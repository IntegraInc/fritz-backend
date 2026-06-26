import { Module } from '@nestjs/common';
import { TablePriceService } from './table-price.service';
import { SeniorModule } from '../senior/senior.module';
import { AuthModule } from '../auth/auth.module';
import { TablePriceController } from './table-price.controller';

@Module({
  imports: [SeniorModule, AuthModule],
  providers: [TablePriceService],
  controllers: [TablePriceController],
})
export class TablePriceModule {}
