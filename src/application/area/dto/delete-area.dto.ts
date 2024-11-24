import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteAreaDto {
  @IsNotEmpty()
  @IsString()
  pkid: string;
}
