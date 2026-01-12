import { IsString, IsOptional, Length } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @Length(12, 13)
  rfc!: string;

  @IsString()
  clientNumber!: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  businessName?: string;

  @IsOptional()
  @IsString()
  location?: string;
}
