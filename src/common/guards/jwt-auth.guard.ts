import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenService } from '../token/token.service';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';

// Decorator để đánh dấu API không cần token
export const IS_PUBLIC_KEY = 'isPublic';
import { SetMetadata } from '@nestjs/common';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private prisma: PrismaService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Nếu có decorator @Public() thì bỏ qua xác thực
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Vui lòng đăng nhập để tiếp tục');
    }

    const token = authHeader.split(' ')[1];
    const decoded = this.tokenService.verifyAccessToken(token);

    // Lấy thông tin user từ DB và gắn vào request để dùng sau
    const user = await this.prisma.nguoiDung.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.isDeleted) {
      throw new UnauthorizedException('Tài khoản không tồn tại');
    }

    request.user = user;
    return true;
  }
}
