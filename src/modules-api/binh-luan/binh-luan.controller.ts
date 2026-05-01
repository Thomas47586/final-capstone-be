import {
  Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { BinhLuanService } from './binh-luan.service';
import { CreateBinhLuanDto } from './dto/binh-luan.dto';
import { Public } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@ApiTags('BinhLuan')
@Controller('binh-luan')
export class BinhLuanController {
  constructor(private readonly binhLuanService: BinhLuanService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Lấy danh sách bình luận' })
  getAll() { return this.binhLuanService.getAll(); }

  @Get('lay-binh-luan-theo-phong/:maPhong')
  @Public()
  @ApiOperation({ summary: 'Lấy bình luận theo phòng' })
  @ApiParam({ name: 'maPhong', type: Number })
  getTheoPhong(@Param('maPhong', ParseIntPipe) maPhong: number) {
    return this.binhLuanService.getTheoPhong(maPhong);
  }

  @Post()
  @ApiOperation({ summary: 'Thêm bình luận' })
  create(@Body() body: CreateBinhLuanDto) {
    return this.binhLuanService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật bình luận' })
  @ApiParam({ name: 'id', type: Number })
  update(@Param('id', ParseIntPipe) id: number, @Body() body: CreateBinhLuanDto) {
    return this.binhLuanService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá bình luận (soft delete)' })
  @ApiParam({ name: 'id', type: Number })
  delete(@Param('id', ParseIntPipe) id: number, @GetUser('id') userId: number) {
    return this.binhLuanService.delete(id, userId);
  }
}
