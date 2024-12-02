import { IsOptional, IsString } from 'class-validator';

export class GetCompanyPICDto {
  @IsOptional()
  @IsString()
  pkid?: string;

  @IsOptional()
  @IsString()
  company_pkid?: string;
}
