import { IsOptional, IsString } from 'class-validator';

export class GetRequestTypeDto {
  @IsOptional()
  @IsString()
  pkid?: string;
}
