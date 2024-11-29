import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

export class PutCompanyDto {
  @IsNotEmpty({ message: 'Name cannot be blank' })
  @IsString()
  @Length(1, 50)
  name: string;

  @IsOptional()
  @IsPhoneNumber('ID', { message: 'Invalid phone number format' })
  phone_number?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  NPWP?: string;

  @IsNotEmpty({ message: 'Email has to be filled' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'PPN status must be included' })
  @IsBoolean()
  is_PPN_included: boolean;

  @IsBoolean()
  is_active: boolean;

  updated_by?: string;
}
