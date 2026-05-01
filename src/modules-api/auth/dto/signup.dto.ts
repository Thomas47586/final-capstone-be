import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

@ApiSchema({ name: 'ThongTinDangKy' })
export class SignupDto {
  @ApiProperty({ description: 'Tên người dùng', example: 'Nguyen Van A' })
  @IsString()
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;

  @ApiProperty({ description: 'Email', example: 'test@gmail.com' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({ description: 'Mật khẩu', example: '123456' })
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;

  @ApiProperty({ description: 'Số điện thoại', example: '0901234567', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Ngày sinh', example: '01/01/2000', required: false })
  @IsString()
  @IsOptional()
  birthday?: string;

  @ApiProperty({ description: 'Giới tính (true: Nam, false: Nữ)', example: true, required: false })
  @IsBoolean()
  @IsOptional()
  gender?: boolean;

  @ApiProperty({ description: 'Vai trò (USER/ADMIN)', example: 'USER', required: false })
  @IsString()
  @IsOptional()
  role?: string;
}
