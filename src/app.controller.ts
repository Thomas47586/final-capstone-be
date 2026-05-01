import { Controller, Get, Redirect } from '@nestjs/common';
import { Public } from './common/guards/jwt-auth.guard';

@Controller()
export class AppController {
  // Redirect từ root "/" về "/swagger" để tiện truy cập
  @Get()
  @Public()
  @Redirect('/swagger', 301)
  redirectToSwagger() {}
}
