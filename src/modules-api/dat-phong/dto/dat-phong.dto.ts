import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty } from 'class-validator';

@ApiSchema({ name: 'DatPhongViewModel' })
export class CreateDatPhongDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  maPhong: number;

  @ApiProperty({ example: '2026-06-01T00:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  ngayDen: string;

  @ApiProperty({ example: '2026-06-05T00:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  ngayDi: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  soLuongKhach: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  maNguoiDung: number;
}
