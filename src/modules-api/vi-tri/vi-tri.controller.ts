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
  ApiResponse,
  ApiQuery,
  ApiConsumes,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { ViTriService } from './vi-tri.service';
import { CreateViTriDto } from './dto/vi-tri.dto';
import { Public } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@ApiTags('ViTri')
@Controller('vi-tri')
export class ViTriController {
  constructor(private readonly viTriService: ViTriService) {}

  // GET /api/vi-tri
  @Get()
  @Public()
  @ApiOperation({ summary: 'Lấy danh sách vị trí' })
  @ApiResponse({ status: 200, description: 'Thành công' })
  getAll() {
    return this.viTriService.getAll();
  }

  // GET /api/vi-tri/phan-trang-tim-kiem
  @Get('phan-trang-tim-kiem')
  @Public()
  @ApiOperation({ summary: 'Phân trang + tìm kiếm vị trí' })
  @ApiQuery({ name: 'pageIndex', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 10 })
  @ApiQuery({ name: 'keyword', required: false, example: 'Đà Lạt' })
  getPhanTrang(
    @Query('pageIndex') pageIndex: string = '1',
    @Query('pageSize') pageSize: string = '10',
    @Query('keyword') keyword: string = '',
  ) {
    return this.viTriService.getPhanTrang(+pageIndex, +pageSize, keyword);
  }

  // GET /api/vi-tri/:id
  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Lấy vị trí theo ID' })
  @ApiParam({ name: 'id', type: Number })
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.viTriService.getById(id);
  }

  // POST /api/vi-tri
  @Post()
  @ApiOperation({ summary: 'Thêm vị trí mới' })
  @ApiResponse({ status: 201, description: 'Tạo vị trí thành công' })
  create(@Body() body: CreateViTriDto) {
    return this.viTriService.create(body);
  }

  // PUT /api/vi-tri/:id
  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật vị trí' })
  @ApiParam({ name: 'id', type: Number })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateViTriDto,
  ) {
    return this.viTriService.update(id, body);
  }

  // DELETE /api/vi-tri/:id
  @Delete(':id')
  @ApiOperation({ summary: 'Xoá vị trí (soft delete)' })
  @ApiParam({ name: 'id', type: Number })
  delete(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') userId: number,
  ) {
    return this.viTriService.delete(id, userId);
  }

  // POST /api/vi-tri/upload-hinh-vitri
  @Post('upload-hinh-vitri')
  @ApiOperation({ summary: 'Upload hình ảnh vị trí' })
  @ApiConsumes('multipart/form-data')
  @ApiQuery({ name: 'maViTri', required: true, example: 1 })
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
        destination: './public/imgs',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `vitri-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadHinh(
    @Query('maViTri', ParseIntPipe) maViTri: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.viTriService.uploadHinh(maViTri, file.filename);
  }
}
