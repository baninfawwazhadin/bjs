import { IsOptional, IsString, MaxLength } from 'class-validator';

export class PutAreaDto {
  @IsString()
  @IsOptional()
  @MaxLength(50)
  name: string;

  updated_by?: string;
}
