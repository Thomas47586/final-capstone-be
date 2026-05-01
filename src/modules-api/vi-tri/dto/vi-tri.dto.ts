import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@ApiSchema({ name: 'ViTriViewModel' })
export class CreateViTriDto {
  @ApiProperty({ description: 'Tên vị trí', example: 'Đà Lạt' })
  @IsString()
  @IsNotEmpty({ message: 'Tên vị trí không được để trống' })
  tenViTri: string;

  @ApiProperty({ description: 'Tỉnh thành', example: 'Lâm Đồng' })
  @IsString()
  @IsNotEmpty({ message: 'Tỉnh thành không được để trống' })
  tinhThanh: string;

  @ApiProperty({ description: 'Quốc gia', example: 'Việt Nam' })
  @IsString()
  @IsNotEmpty({ message: 'Quốc gia không được để trống' })
  quocGia: string;

  @ApiProperty({ description: 'Hình ảnh URL', example: 'https://...', required: false })
  @IsString()
  @IsOptional()
  hinhAnh?: string;
}
