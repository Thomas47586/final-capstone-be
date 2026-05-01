import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import { CreateDatPhongDto } from './dto/dat-phong.dto';

@Injectable()
export class DatPhongService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.datPhong.findMany({ where: { isDeleted: false } });
  }

  async getById(id: number) {
    const datPhong = await this.prisma.datPhong.findFirst({
      where: { id, isDeleted: false },
    });
    if (!datPhong) throw new NotFoundException('Không tìm thấy đặt phòng!');
    return datPhong;
  }

  async getTheoNguoiDung(maNguoiDung: number) {
    return this.prisma.datPhong.findMany({
      where: { isDeleted: false, ma_nguoi_dat: maNguoiDung },
    });
  }

  async create(body: CreateDatPhongDto) {
    const ngayDen = new Date(body.ngayDen);
    const ngayDi = new Date(body.ngayDi);
    if (ngayDi <= ngayDen) {
      throw new BadRequestException('Ngày đi phải sau ngày đến!');
    }
    return this.prisma.datPhong.create({
      data: {
        ma_phong: body.maPhong,
        ngay_den: ngayDen,
        ngay_di: ngayDi,
        so_luong_khach: body.soLuongKhach,
        ma_nguoi_dat: body.maNguoiDung,
      },
    });
  }

  async update(id: number, body: CreateDatPhongDto) {
    await this.getById(id);
    const ngayDen = new Date(body.ngayDen);
    const ngayDi = new Date(body.ngayDi);
    if (ngayDi <= ngayDen) {
      throw new BadRequestException('Ngày đi phải sau ngày đến!');
    }
    return this.prisma.datPhong.update({
      where: { id },
      data: {
        ma_phong: body.maPhong,
        ngay_den: ngayDen,
        ngay_di: ngayDi,
        so_luong_khach: body.soLuongKhach,
        ma_nguoi_dat: body.maNguoiDung,
        updatedAT: new Date(),
      },
    });
  }

  async delete(id: number, userId: number) {
    await this.getById(id);
    return this.prisma.datPhong.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date(), deletedBY: userId },
    });
  }
}
