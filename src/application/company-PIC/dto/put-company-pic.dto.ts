import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

export class PutCompanyPICDto {
  @IsNotEmpty({ message: 'Company pkid has to be filled' })
  @IsString()
  @Length(1, 7)
  company_pkid: string;

  @IsNotEmpty({ message: 'First name cannot be blank' })
  @IsString()
  @Length(1, 45)
  first_name: string;

  @IsNotEmpty({ message: 'Last name cannot be blank' })
  @IsString()
  @Length(1, 45)
  last_name: string;

  @IsNotEmpty({ message: 'Phone number cannot be blank' })
  @IsPhoneNumber('ID', { message: 'Invalid phone number format' })
  phone_number: string;

  @IsNotEmpty({ message: 'Email has to be filled' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Position cannot be blank' })
  @IsString()
  @Length(1, 45)
  position: string;

  @IsBoolean()
  is_active: boolean;

  updated_by?: string;
}
