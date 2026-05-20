import { Controller, Get, Headers, UseGuards } from '@nestjs/common';

import { SeniorService } from './senior.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Senior')
@ApiBearerAuth()
@Controller('senior')
export class SeniorController {
  constructor(private readonly seniorService: SeniorService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('companies')
  @ApiOperation({ summary: 'Obter lista de empresas do Senior ERP' })
  getCompanies(@CurrentUser() user: { username: string; password: string }) {
    return this.seniorService.getCompanies(user.username, user.password);
  }
}
