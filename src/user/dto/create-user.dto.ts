import { IsEmail, IsOptional, IsString, IsBoolean, IsNumber, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsNumber()
  roleId?: number;

  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password?: any;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  ngaySinh?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean; // ✅ đổi tên thay vì "delete"

  @IsOptional()
  @IsBoolean()
  online?: boolean;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsNumber()
  created_at?: number;
}
