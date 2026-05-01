import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ACCESS_TOKEN_SECRET } from '../constants/app.constant';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  createAccessToken(userId: number): string {
    return this.jwtService.sign(
      { userId },
      { secret: ACCESS_TOKEN_SECRET, expiresIn: '7d' },
    );
  }

  verifyAccessToken(token: string): { userId: number } {
    try {
      return this.jwtService.verify(token, { secret: ACCESS_TOKEN_SECRET });
    } catch {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }
  }
}
