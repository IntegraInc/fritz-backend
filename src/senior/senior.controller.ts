import { Controller, Get, Headers, UseGuards } from '@nestjs/common';
import * as net from 'net';
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

  @Get('health/senior')
  async testSenior() {
    return new Promise((resolve) => {
      const socket = new net.Socket();

      socket.setTimeout(10000);

      socket.connect(30181, 'webp20.seniorcloud.com.br', () => {
        socket.destroy();
        resolve({ ok: true, message: 'Conectou na porta da Senior' });
      });

      socket.on('timeout', () => {
        socket.destroy();
        resolve({ ok: false, message: 'Timeout ao conectar na Senior' });
      });

      socket.on('error', (err) => {
        resolve({
          ok: false,
          message: 'Erro de conexão',
          error: err.message,
        });
      });
    });
  }
}
