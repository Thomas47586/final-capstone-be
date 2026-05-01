import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import { CreateNguoiDungDto, UpdateNguoiDungDto } from './dto/nguoi-dung.dto';
import * as bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from 'src/common/constants/app.constant';

@Injectable()
export class NguoiDungService {
  constructor(private prisma: PrismaService) {}

  // Lấy tất cả users
  async getAll() {
    const users = await this.prisma.nguoiDung.findMany({
      where: { isDeleted: false },
    });
    // Không trả về password
    return users.map(({ pass_word, ...user }) => user);
  }

  // Phân trang + tìm kiếm
  async getPhanTrang(pageIndex: number, pageSize: number, keyword: string) {
    const skip = (pageIndex - 1) * pageSize;
    const where = {
      isDeleted: false,
      ...(keyword && {
        name: { contains: keyword },
      }),
    };

    const [rawData, total] = await Promise.all([
      this.prisma.nguoiDung.findMany({ where, skip, take: pageSize }),
      this.prisma.nguoiDung.count({ where }),
    ]);

    const data = rawData.map(({ pass_word, ...user }) => user);

    return { pageIndex, pageSize, totalRow: total, keyword, data };
  }

  // Lấy user theo ID
  async getById(id: number) {
    const user = await this.prisma.nguoiDung.findFirst({
      where: { id, isDeleted: false },
    });
    if (!user) throw new NotFoundException('Không tìm thấy người dùng!');
    const { pass_word, ...result } = user;
    return result;
  }

  // Tìm theo tên
  async searchByName(tenNguoiDung: string) {
    const users = await this.prisma.nguoiDung.findMany({
      where: {
        isDeleted: false,
        name: { contains: tenNguoiDung },
      },
    });
    return users.map(({ pass_word, ...user }) => user);
  }

  // Admin tạo user mới
  async create(body: CreateNguoiDungDto) {
    const existing = await this.prisma.nguoiDung.findUnique({
      where: { email: body.email },
    });
    if (existing) throw new BadRequestException('Email đã tồn tại!');

    const hashedPassword = await bcrypt.hash(body.password, BCRYPT_SALT_ROUNDS);

    const newUser = await this.prisma.nguoiDung.create({
      data: {
        name: body.name,
        email: body.email,
        pass_word: hashedPassword,
        phone: body.phone,
        birth_day: body.birthday,
        gender: body.gender,
        role: body.role || 'USER',
      },
    });

    const { pass_word, ...result } = newUser;
    return result;
  }

  // Cập nhật user
  async update(id: number, body: UpdateNguoiDungDto) {
    await this.getById(id); // Kiểm tra user tồn tại

    // Kiểm tra email mới có bị trùng với user khác không
    if (body.email) {
      const emailConflict = await this.prisma.nguoiDung.findFirst({
        where: {
          email: body.email,
          id: { not: id }, // Loại trừ chính user đang cập nhật
          isDeleted: false,
        },
      });
      if (emailConflict) {
        throw new BadRequestException('Email đã được sử dụng bởi tài khoản khác!');
      }
    }

    const updated = await this.prisma.nguoiDung.update({
      where: { id },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        birth_day: body.birthday,
        gender: body.gender,
        role: body.role,
        updatedAT: new Date(),
      },
    });

    const { pass_word, ...result } = updated;
    return result;
  }

  // Xoá mềm (query param theo chuẩn Cybersoft)
  async delete(id: number, userId: number) {
    await this.getById(id);
    return this.prisma.nguoiDung.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBY: userId,
      },
    });
  }

  // Upload avatar
  async uploadAvatar(userId: number, fileName: string) {
    const updated = await this.prisma.nguoiDung.update({
      where: { id: userId },
      data: { hinh_anh: fileName, updatedAT: new Date() },
    });
    const { pass_word, ...result } = updated;
    return result;
  }
}
