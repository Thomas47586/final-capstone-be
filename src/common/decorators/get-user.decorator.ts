import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Decorator lấy thông tin user đã đăng nhập từ request
// Dùng trong Controller: @GetUser() user
export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (data) {
      return request.user?.[data];
    }
    return request.user;
  },
);
