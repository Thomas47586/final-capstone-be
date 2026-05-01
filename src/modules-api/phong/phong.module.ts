import { Module } from '@nestjs/common';
import { PhongService } from './phong.service';
import { PhongController } from './phong.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [MulterModule.register({ dest: './public/imgs/phong' })],
  controllers: [PhongController],
  providers: [PhongService],
})
export class PhongModule {}
