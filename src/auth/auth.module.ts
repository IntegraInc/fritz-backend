import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { SeniorModule } from '../senior/senior.module';

@Module({
  imports: [
    PassportModule,
    SeniorModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fritz_equipamentos_secret_key',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
