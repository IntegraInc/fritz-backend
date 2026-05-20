import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SeniorService } from './senior.service';
import { SeniorController } from './senior.controller';

@Module({
  imports: [HttpModule],
  providers: [SeniorService],
  exports: [SeniorService],
  controllers: [SeniorController],
})
export class SeniorModule {}
