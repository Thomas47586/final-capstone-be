import { Module } from '@nestjs/common';
import { ViTriService } from './vi-tri.service';
import { ViTriController } from './vi-tri.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({ dest: './public/imgs' }),
  ],
  controllers: [ViTriController],
  providers: [ViTriService],
})
export class ViTriModule {}
