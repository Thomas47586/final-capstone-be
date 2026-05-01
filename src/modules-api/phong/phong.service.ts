import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import { CreatePhongDto } from './dto/phong.dto';

@Injectable()
export class PhongService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.phong.findMany({ where: { isDeleted: false } });
  }

  async getTheoViTri(maViTri: number) {
    return this.prisma.phong.findMany({
      where: { isDeleted: false, ma_vi_tri: maViTri },
    });
  }

  async getPhanTrang(pageIndex: number, pageSize: number, keyword: string) {
    const skip = (pageIndex - 1) * pageSize;
    const where = {
      isDeleted: false,
      ...(keyword && { ten_phong: { contains: keyword } }),
    };
    const [data, total] = await Promise.all([
      this.prisma.phong.findMany({ where, skip, take: pageSize }),
      this.prisma.phong.count({ where }),
    ]);
    return { pageIndex, pageSize, totalRow: total, keyword, data };
  }

  async getById(id: number) {
    const phong = await this.prisma.phong.findFirst({
      where: { id, isDeleted: false },
    });
    if (!phong) throw new NotFoundException('Không tìm thấy phòng!');
    return phong;
  }

  async create(body: CreatePhongDto) {
    return this.prisma.phong.create({
      data: {
        ten_phong: body.tenPhong,
        khach: body.khach,
        phong_ngu: body.phongNgu,
        giuong: body.giuong,
        phong_tam: body.phongTam,
        mo_ta: body.moTa,
        gia_tien: body.giaTien,
        may_giat: body.mayGiat,
        ban_la: body.banLa,
        tivi: body.tivi,
        dieu_hoa: body.dieuHoa,
        wifi: body.wifi,
        bep: body.bep,
        do_xe: body.doXe,
        ho_boi: body.hoBoi,
        ban_ui: body.banUi,
        ma_vi_tri: body.maViTri,
        hinh_anh: body.hinhAnh,
      },
    });
  }

  async update(id: number, body: CreatePhongDto) {
    await this.getById(id);
    return this.prisma.phong.update({
      where: { id },
      data: {
        ten_phong: body.tenPhong,
        khach: body.khach,
        phong_ngu: body.phongNgu,
        giuong: body.giuong,
        phong_tam: body.phongTam,
        mo_ta: body.moTa,
        gia_tien: body.giaTien,
        may_giat: body.mayGiat,
        ban_la: body.banLa,
        tivi: body.tivi,
        dieu_hoa: body.dieuHoa,
        wifi: body.wifi,
        bep: body.bep,
        do_xe: body.doXe,
        ho_boi: body.hoBoi,
        ban_ui: body.banUi,
        ma_vi_tri: body.maViTri,
        hinh_anh: body.hinhAnh,
        updatedAT: new Date(),
      },
    });
  }

  async delete(id: number, userId: number) {
    await this.getById(id);
    return this.prisma.phong.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date(), deletedBY: userId },
    });
  }

  async uploadHinh(id: number, fileName: string) {
    await this.getById(id);
    return this.prisma.phong.update({
      where: { id },
      data: { hinh_anh: fileName, updatedAT: new Date() },
    });
  }
}
