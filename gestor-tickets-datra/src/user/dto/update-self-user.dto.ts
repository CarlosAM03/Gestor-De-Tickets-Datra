import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateSelfUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
