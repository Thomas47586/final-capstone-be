import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

@ApiSchema({ name: 'PhongViewModel' })
export class CreatePhongDto {
  @ApiProperty({ example: 'Căn hộ view biển Đà Nẵng' })
  @IsString()
  @IsNotEmpty()
  tenPhong: string;

  @ApiProperty({ example: 4 })
  @IsInt()
  khach: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  phongNgu: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  giuong: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  phongTam: number;

  @ApiProperty({ example: 'Căn hộ view biển tuyệt đẹp...' })
  @IsString()
  @IsNotEmpty()
  moTa: string;

  @ApiProperty({ example: 1500000 })
  @IsInt()
  giaTien: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  mayGiat: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  banLa: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  tivi: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  dieuHoa: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  wifi: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  bep: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  doXe: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  hoBoi: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  banUi: boolean;

  @ApiProperty({ example: 1 })
  @IsInt()
  maViTri: number;

  @ApiProperty({ example: '', required: false })
  @IsString()
  @IsOptional()
  hinhAnh?: string;
}
