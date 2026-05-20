import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Healthcheck')
@Controller()
export class AppController {
  @Get()
  hello() {
    return {
      message: 'API running',
    };
  }
}
