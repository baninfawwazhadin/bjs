import { IsOptional, IsString } from 'class-validator';

export class GetCompanyDto {
  @IsOptional()
  @IsString()
  pkid?: string;
}
