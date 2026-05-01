import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules-system/prisma/prisma.module';
import { AuthModule } from './modules-api/auth/auth.module';
import { ViTriModule } from './modules-api/vi-tri/vi-tri.module';
import { NguoiDungModule } from './modules-api/nguoi-dung/nguoi-dung.module';
import { PhongModule } from './modules-api/phong/phong.module';
import { DatPhongModule } from './modules-api/dat-phong/dat-phong.module';
import { BinhLuanModule } from './modules-api/binh-luan/binh-luan.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { TokenService } from './common/token/token.service';
import { JwtModule } from '@nestjs/jwt';
import { ACCESS_TOKEN_SECRET } from './common/constants/app.constant';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ViTriModule,
    NguoiDungModule,
    PhongModule,
    DatPhongModule,
    BinhLuanModule,
    // Đăng ký JwtModule ở root để JwtAuthGuard dùng được
    JwtModule.register({
      secret: ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TokenService,
    {
      // Áp dụng Guard toàn cục: mọi API đều cần token, trừ khi có @Public()
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
