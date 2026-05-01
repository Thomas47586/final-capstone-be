import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import { CreateBinhLuanDto } from './dto/binh-luan.dto';

@Injectable()
export class BinhLuanService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.binhLuan.findMany({ where: { isDeleted: false } });
  }

  async getTheoPhong(maPhong: number) {
    return this.prisma.binhLuan.findMany({
      where: { isDeleted: false, ma_phong: maPhong },
    });
  }

  async create(body: CreateBinhLuanDto) {
    return this.prisma.binhLuan.create({
      data: {
        ma_phong: body.maPhong,
        ma_nguoi_binh_luan: body.maNguoiBinhLuan,
        ngay_binh_luan: new Date(body.ngayBinhLuan),
        noi_dung: body.noiDung,
        sao_binh_luan: body.saoBinhLuan,
      },
    });
  }

  async update(id: number, body: CreateBinhLuanDto) {
    const bl = await this.prisma.binhLuan.findFirst({
      where: { id, isDeleted: false },
    });
    if (!bl) throw new NotFoundException('Không tìm thấy bình luận!');
    return this.prisma.binhLuan.update({
      where: { id },
      data: {
        ma_phong: body.maPhong,
        ma_nguoi_binh_luan: body.maNguoiBinhLuan,
        ngay_binh_luan: new Date(body.ngayBinhLuan),
        noi_dung: body.noiDung,
        sao_binh_luan: body.saoBinhLuan,
        updatedAT: new Date(),
      },
    });
  }

  async delete(id: number, userId: number) {
    const bl = await this.prisma.binhLuan.findFirst({
      where: { id, isDeleted: false },
    });
    if (!bl) throw new NotFoundException('Không tìm thấy bình luận!');
    return this.prisma.binhLuan.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date(), deletedBY: userId },
    });
  }
}
