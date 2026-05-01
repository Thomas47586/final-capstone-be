import {
  Body, Controller, Delete, Get, Param, ParseIntPipe,
  Post, Put, Query, UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PhongService } from './phong.service';
import { CreatePhongDto } from './dto/phong.dto';
import { Public } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@ApiTags('Phong')
@Controller('phong-thue')
export class PhongController {
  constructor(private readonly phongService: PhongService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Lấy danh sách phòng thuê' })
  getAll() { return this.phongService.getAll(); }

  @Get('lay-phong-theo-vi-tri')
  @Public()
  @ApiOperation({ summary: 'Lấy danh sách phòng theo vị trí' })
  @ApiQuery({ name: 'maViTri', required: false, example: 1 })
  getTheoViTri(@Query('maViTri') maViTri: string) {
    return this.phongService.getTheoViTri(+maViTri);
  }

  @Get('phan-trang-tim-kiem')
  @Public()
  @ApiOperation({ summary: 'Phân trang + tìm kiếm phòng thuê' })
  @ApiQuery({ name: 'pageIndex', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 10 })
  @ApiQuery({ name: 'keyword', required: false, example: '' })
  getPhanTrang(
    @Query('pageIndex') pageIndex: string = '1',
    @Query('pageSize') pageSize: string = '10',
    @Query('keyword') keyword: string = '',
  ) { return this.phongService.getPhanTrang(+pageIndex, +pageSize, keyword); }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Lấy thông tin phòng theo ID' })
  @ApiParam({ name: 'id', type: Number })
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.phongService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Thêm phòng thuê mới' })
  create(@Body() body: CreatePhongDto) { return this.phongService.create(body); }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật phòng thuê' })
  @ApiParam({ name: 'id', type: Number })
  update(@Param('id', ParseIntPipe) id: number, @Body() body: CreatePhongDto) {
    return this.phongService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá phòng thuê (soft delete)' })
  @ApiParam({ name: 'id', type: Number })
  delete(@Param('id', ParseIntPipe) id: number, @GetUser('id') userId: number) {
    return this.phongService.delete(id, userId);
  }

  @Post('upload-hinh-phong')
  @ApiOperation({ summary: 'Upload hình ảnh phòng thuê' })
  @ApiConsumes('multipart/form-data')
  @ApiQuery({ name: 'maPhong', required: true, example: 1 })
  @ApiBody({ schema: { type: 'object', properties: { formFile: { type: 'string', format: 'binary' } } } })
  @UseInterceptors(FileInterceptor('formFile', {
    storage: diskStorage({
      destination: './public/imgs/phong',
      filename: (req, file, cb) => {
        cb(null, `phong-${Date.now()}${extname(file.originalname)}`);
      },
    }),
  }))
  uploadHinh(
    @Query('maPhong', ParseIntPipe) maPhong: number,
    @UploadedFile() file: Express.Multer.File,
  ) { return this.phongService.uploadHinh(maPhong, file.filename); }
}
