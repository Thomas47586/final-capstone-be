import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import { CreateViTriDto } from './dto/vi-tri.dto';

@Injectable()
export class ViTriService {
  constructor(private prisma: PrismaService) {}

  // Lấy tất cả vị trí (chưa xoá)
  async getAll() {
    return this.prisma.viTri.findMany({
      where: { isDeleted: false },
    });
  }

  // Phân trang + tìm kiếm
  async getPhanTrang(pageIndex: number, pageSize: number, keyword: string) {
    const skip = (pageIndex - 1) * pageSize;
    const where = {
      isDeleted: false,
      ...(keyword && {
        ten_vi_tri: { contains: keyword },
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.viTri.findMany({
        where,
        skip,
        take: pageSize,
      }),
      this.prisma.viTri.count({ where }),
    ]);

    return {
      pageIndex,
      pageSize,
      totalRow: total,
      keyword,
      data,
    };
  }

  // Lấy theo ID
  async getById(id: number) {
    const viTri = await this.prisma.viTri.findFirst({
      where: { id, isDeleted: false },
    });
    if (!viTri) throw new NotFoundException('Không tìm thấy vị trí!');
    return viTri;
  }

  // Tạo mới
  async create(body: CreateViTriDto) {
    return this.prisma.viTri.create({
      data: {
        ten_vi_tri: body.tenViTri,
        tinh_thanh: body.tinhThanh,
        quoc_gia: body.quocGia,
        hinh_anh: body.hinhAnh,
      },
    });
  }

  // Cập nhật
  async update(id: number, body: CreateViTriDto) {
    await this.getById(id); // Kiểm tra tồn tại
    return this.prisma.viTri.update({
      where: { id },
      data: {
        ten_vi_tri: body.tenViTri,
        tinh_thanh: body.tinhThanh,
        quoc_gia: body.quocGia,
        hinh_anh: body.hinhAnh,
        updatedAT: new Date(),
      },
    });
  }

  // Xoá mềm (Soft Delete)
  async delete(id: number, userId: number) {
    await this.getById(id); // Kiểm tra tồn tại
    return this.prisma.viTri.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBY: userId,
      },
    });
  }

  // Upload hình ảnh vị trí
  async uploadHinh(id: number, fileName: string) {
    await this.getById(id);
    return this.prisma.viTri.update({
      where: { id },
      data: { hinh_anh: fileName, updatedAT: new Date() },
    });
  }
}
