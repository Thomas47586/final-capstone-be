import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

// DTO dùng khi tạo mới user (Admin tạo) — có password
@ApiSchema({ name: 'ThongTinNguoiDung' })
export class CreateNguoiDungDto {
  @ApiProperty({ example: 'Nguyen Van A' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'user@gmail.com' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: '0901234567', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: '01/01/2000', required: false })
  @IsString()
  @IsOptional()
  birthday?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  gender?: boolean;

  @ApiProperty({ example: 'USER', required: false })
  @IsString()
  @IsOptional()
  role?: string;
}

// DTO dùng khi cập nhật user — không có password
@ApiSchema({ name: 'CapNhatNguoiDung' })
export class UpdateNguoiDungDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  id?: number;

  @ApiProperty({ example: 'Nguyen Van B', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'user@gmail.com', required: false })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '0901234567', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: '01/01/2000', required: false })
  @IsString()
  @IsOptional()
  birthday?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  gender?: boolean;

  @ApiProperty({ example: 'USER', required: false })
  @IsString()
  @IsOptional()
  role?: string;
}
