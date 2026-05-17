import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SeniorService } from '../senior/senior.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly seniorService: SeniorService,
  ) {}

  async login(username: string, password: string) {
    const isValidUser = await this.seniorService.validateUser(
      username,
      password,
    );

    if (!isValidUser) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    const payload = {
      username,
    };
    const expiresInSeconds = 60 * 60 * 24; // 1 dia

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        username,
      },
      expires_at: new Date(Date.now() + expiresInSeconds * 1000).toISOString(),
    };
  }
}
