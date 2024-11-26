import {
  IsString,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  Length,
  MinLength,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { User } from '~/shared/entities/user.entity';
import { UserLogAuthType } from '~/shared/entities/enum.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 45)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter.',
  })
  @Matches(/(?=.*\d)/, {
    message: 'Password must contain at least one number.',
  })
  @Matches(/(?=.*[!@#$%^&*(),.?":{}|<>])/, {
    message: 'Password must contain at least one special character.',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  role_pkid: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  first_name: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  last_name: string;

  @IsOptional()
  @IsPhoneNumber('ID', { message: 'Invalid phone number format' })
  phone_number?: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsOptional()
  password_attempt_counter?: number;
}

export class ForgetPasswordSubmitDto {
  @IsNotEmpty()
  @IsString()
  username: string;
}

export class CreateUserLogAuth {
  user: User;
  type: UserLogAuthType;
}
