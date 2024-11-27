import { IsOptional, IsString, MaxLength } from 'class-validator';

export class PutProductDto {
  @IsString()
  @IsOptional()
  @MaxLength(50)
  name: string;

  updated_by?: string;
}
