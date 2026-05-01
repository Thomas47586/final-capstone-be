import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { TokenService } from 'src/common/token/token.service';
import * as bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from 'src/common/constants/app.constant';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
  ) {}

  async signup(body: SignupDto) {
    // 1. Kiểm tra email đã tồn tại chưa
    const existingUser = await this.prisma.nguoiDung.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email đã được sử dụng!');
    }

    // 2. Mã hóa mật khẩu bằng bcrypt (cải tiến so với gateway cũ không hash)
    const hashedPassword = await bcrypt.hash(body.password, BCRYPT_SALT_ROUNDS);

    // 3. Tạo user mới
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

    // 4. Không trả về mật khẩu
    const { pass_word, ...result } = newUser;

    return { message: 'Đăng ký thành công', content: result };
  }

  async signin(body: SigninDto) {
    // 1. Tìm user theo email
    const user = await this.prisma.nguoiDung.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      throw new BadRequestException('Email hoặc mật khẩu không đúng!');
    }

    // 2. So sánh mật khẩu bằng bcrypt
    const isPasswordValid = await bcrypt.compare(body.password, user.pass_word);

    if (!isPasswordValid) {
      throw new BadRequestException('Email hoặc mật khẩu không đúng!');
    }

    // 3. Tạo Access Token thật bằng JWT
    const accessToken = this.tokenService.createAccessToken(user.id);

    // 4. Trả về token và thông tin user (không trả về password)
    const { pass_word, ...userInfo } = user;

    return {
      message: 'Đăng nhập thành công',
      content: { accessToken, user: userInfo },
    };
  }
}
