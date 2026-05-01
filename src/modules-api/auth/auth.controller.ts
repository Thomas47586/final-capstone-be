import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from 'src/common/guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Public() // Không cần Token để đăng ký
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  @ApiResponse({ status: 201, description: 'Đăng ký thành công' })
  @ApiResponse({ status: 400, description: 'Email đã tồn tại' })
  signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @Post('signin')
  @Public()
  @ApiOperation({ summary: 'Đăng nhập, lấy accessToken' })
  @ApiResponse({ status: 201, description: 'Đăng nhập thành công, trả về accessToken' })
  @ApiResponse({ status: 400, description: 'Email hoặc mật khẩu không đúng' })
  signin(@Body() body: SigninDto) {
    return this.authService.signin(body);
  }
}
