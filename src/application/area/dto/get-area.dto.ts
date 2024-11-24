import { IsOptional, IsString } from 'class-validator';

export class GetAreaDto {
  @IsOptional()
  @IsString()
  pkid?: string;
}
