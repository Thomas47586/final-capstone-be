import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

@ApiSchema({ name: 'BinhLuanViewModel' })
export class CreateBinhLuanDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  maPhong: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  maNguoiBinhLuan: number;

  @ApiProperty({ example: '2026-05-01T00:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  ngayBinhLuan: string;

  @ApiProperty({ example: 'Phòng rất đẹp, view biển tuyệt vời!' })
  @IsString()
  @IsNotEmpty()
  noiDung: string;

  @ApiProperty({ example: 5, description: 'Số sao từ 1 đến 5' })
  @IsInt()
  @Min(1)
  @Max(5)
  saoBinhLuan: number;
}
