import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenService } from 'src/common/token/token.service';
import { ACCESS_TOKEN_SECRET } from 'src/common/constants/app.constant';

@Module({
  imports: [
    JwtModule.register({
      secret: ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService],
  exports: [TokenService, JwtModule], // Export để các module khác dùng Guard
})
export class AuthModule {}
