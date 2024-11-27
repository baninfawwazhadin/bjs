import { IsOptional, IsString, MaxLength } from 'class-validator';

export class PutRequestTypeDto {
  @IsString()
  @IsOptional()
  @MaxLength(50)
  name: string;

  updated_by?: string;
}
