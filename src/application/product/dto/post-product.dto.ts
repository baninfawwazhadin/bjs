import { IsNotEmpty, IsString, Length } from 'class-validator';

export class PostProductDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  name: string;
}
