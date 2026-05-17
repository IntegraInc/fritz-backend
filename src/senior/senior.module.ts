import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SeniorService } from './senior.service';

@Module({
  imports: [HttpModule],
  providers: [SeniorService],
  exports: [SeniorService],
})
export class SeniorModule {}
