import {
  Body, Controller, Delete, Get, Param, ParseIntPipe,
  Post, Put, Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DatPhongService } from './dat-phong.service';
import { CreateDatPhongDto } from './dto/dat-phong.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@ApiTags('DatPhong')
@Controller('dat-phong')
export class DatPhongController {
  constructor(private readonly datPhongService: DatPhongService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách đặt phòng' })
  getAll() { return this.datPhongService.getAll(); }

  @Get('lay-theo-nguoi-dung/:maNguoiDung')
  @ApiOperation({ summary: 'Lấy danh sách đặt phòng theo người dùng' })
  @ApiParam({ name: 'maNguoiDung', type: Number })
  getTheoNguoiDung(@Param('maNguoiDung', ParseIntPipe) maNguoiDung: number) {
    return this.datPhongService.getTheoNguoiDung(maNguoiDung);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin đặt phòng theo ID' })
  @ApiParam({ name: 'id', type: Number })
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.datPhongService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Đặt phòng' })
  create(@Body() body: CreateDatPhongDto) {
    return this.datPhongService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật đặt phòng' })
  @ApiParam({ name: 'id', type: Number })
  update(@Param('id', ParseIntPipe) id: number, @Body() body: CreateDatPhongDto) {
    return this.datPhongService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Huỷ đặt phòng (soft delete)' })
  @ApiParam({ name: 'id', type: Number })
  delete(@Param('id', ParseIntPipe) id: number, @GetUser('id') userId: number) {
    return this.datPhongService.delete(id, userId);
  }
}
