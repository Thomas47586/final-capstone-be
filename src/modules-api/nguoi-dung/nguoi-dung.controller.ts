import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { NguoiDungService } from './nguoi-dung.service';
import { CreateNguoiDungDto, UpdateNguoiDungDto } from './dto/nguoi-dung.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@ApiTags('NguoiDung')
@Controller('users')
export class NguoiDungController {
  constructor(private readonly nguoiDungService: NguoiDungService) {}

  // GET /api/users
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách người dùng' })
  getAll() {
    return this.nguoiDungService.getAll();
  }

  // GET /api/users/phan-trang-tim-kiem
  @Get('phan-trang-tim-kiem')
  @ApiOperation({ summary: 'Phân trang + tìm kiếm người dùng' })
  @ApiQuery({ name: 'pageIndex', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 10 })
  @ApiQuery({ name: 'keyword', required: false, example: 'Nguyen' })
  getPhanTrang(
    @Query('pageIndex') pageIndex: string = '1',
    @Query('pageSize') pageSize: string = '10',
    @Query('keyword') keyword: string = '',
  ) {
    return this.nguoiDungService.getPhanTrang(+pageIndex, +pageSize, keyword);
  }

  // GET /api/users/search/:tenNguoiDung
  @Get('search/:tenNguoiDung')
  @ApiOperation({ summary: 'Tìm kiếm người dùng theo tên' })
  @ApiParam({ name: 'tenNguoiDung', type: String, example: 'Nguyen' })
  searchByName(@Param('tenNguoiDung') tenNguoiDung: string) {
    return this.nguoiDungService.searchByName(tenNguoiDung);
  }

  // GET /api/users/:id
  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin người dùng theo ID' })
  @ApiParam({ name: 'id', type: Number })
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.nguoiDungService.getById(id);
  }

  // POST /api/users
  @Post()
  @ApiOperation({ summary: 'Thêm người dùng mới (Admin)' })
  create(@Body() body: CreateNguoiDungDto) {
    return this.nguoiDungService.create(body);
  }

  // PUT /api/users/:id
  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin người dùng' })
  @ApiParam({ name: 'id', type: Number })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateNguoiDungDto,
  ) {
    return this.nguoiDungService.update(id, body);
  }

  // DELETE /api/users?id=1 (query param theo chuẩn Cybersoft)
  @Delete()
  @ApiOperation({ summary: 'Xoá người dùng (soft delete)' })
  @ApiQuery({ name: 'id', type: Number, required: true })
  delete(
    @Query('id', ParseIntPipe) id: number,
    @GetUser('id') userId: number,
  ) {
    return this.nguoiDungService.delete(id, userId);
  }

  // POST /api/users/upload-avatar
  @Post('upload-avatar')
  @ApiOperation({ summary: 'Upload ảnh đại diện (lấy user từ token)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        formFile: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('formFile', {
      storage: diskStorage({
        destination: './public/imgs/avatars',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `avatar-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadAvatar(
    @GetUser('id') userId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.nguoiDungService.uploadAvatar(userId, file.filename);
  }
}
