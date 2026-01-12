import {
  IsOptional,
  IsEnum,
  IsBoolean,
  IsEmail,
  IsString,
} from 'class-validator';
import { UserRole } from '@prisma/client';

export class AdminUpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
