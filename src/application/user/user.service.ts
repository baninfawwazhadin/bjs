import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/post-user.dto';
import { User } from '~/shared/entities/user.entity';
import { Role } from '~/shared/entities/role.entity';
import { UserOtp } from '~/shared/entities/user_otp.entity';
import { EmailService } from '../email/email.service';
import { ChangePasswordDto, ForgetPasswordDto } from './dto/put-user.dto';

@Injectable()
export class UserService {
  private readonly userRepository: Repository<User>;

  constructor(
    @Inject('DATA_SOURCE') private readonly dataSource: DataSource,
    private readonly emailService: EmailService,
  ) {
    this.userRepository = this.dataSource.getRepository(User);
  }

  async create(payload: CreateUserDto) {
    try {
      const newUserId = await this.dataSource.transaction(async (manager) => {
        const roleRepository = manager.getRepository(Role);

        const foundRole = await roleRepository.findOne({
          where: {
            pkid: payload.role_pkid,
          },
        });
        if (!foundRole) {
          throw new BadRequestException('Role not found');
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(payload.password, salt);

        const insertUserQuery = `
          INSERT INTO user 
          (username, password, first_name, last_name, role_pkid, phone_number, email) 
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const parameters = [
          payload.username,
          hashedPassword,
          payload.first_name,
          payload.last_name,
          payload.role_pkid,
          payload.phone_number,
          payload.email,
        ];

        await manager.query(insertUserQuery, parameters);

        const pkidQuery = 'SELECT pkid FROM user WHERE username = ?';
        const pkidResult = await manager.query(pkidQuery, [payload.username]);

        const newUserId = pkidResult[0]?.pkid;
        if (!newUserId) {
          throw new InternalServerErrorException('Failed to create user.');
        }

        const userOtpRepository = manager.getRepository(UserOtp);
        const newUserOtp = userOtpRepository.create({
          user_pkid: newUserId,
          pkid: 1,
        });
        await userOtpRepository.insert(newUserOtp);

        return newUserId;
      });

      const result = this.findOneProfile(newUserId);

      return result;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An unexpected error occurred during user creation: ' + error.message,
      );
    }
  }

  async verifyOtp(pkid: string, otp_code: string) {
    const userOtpRepository = this.dataSource.getRepository(UserOtp);
    const otpRecord = await userOtpRepository.findOne({
      where: { user_pkid: pkid, otp_code },
    });

    if (!otpRecord || otpRecord.is_used) {
      throw new ForbiddenException('Invalid or already used OTP.');
    }

    await userOtpRepository.update(otpRecord.pkid, { is_used: true });

    return { message: 'OTP verified successfully.' };
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { username, is_user_active: true },
    });

    if (!user) {
      return null;
    }

    const isMatch = bcrypt.compareSync(password, user.password);

    return isMatch ? user : null;
  }

  async findOneProfile(pkid: string) {
    const result = await this.userRepository.findOne({
      select: [
        'pkid',
        'username',
        'first_name',
        'last_name',
        'role_pkid',
        'phone_number',
        'email',
        'role',
        'userOtp',
      ],
      where: {
        pkid: pkid,
      },
      relations: ['role', 'userOtp'],
    });

    if (!result) {
      throw new NotFoundException('User not found.');
    }
    return result;
  }

  async changePassword(user_pkid: string, payload: ChangePasswordDto) {
    const userRepository = this.dataSource.getRepository(User);
    const userOtpRepository = this.dataSource.getRepository(UserOtp);

    const foundUser = await userRepository.findOne({
      where: {
        pkid: user_pkid,
      },
    });

    if (!foundUser) {
      throw new NotFoundException('User not found.');
    }

    const foundOtp = await userOtpRepository.findOne({
      where: [
        { user_pkid, is_used: true },
        { user_pkid, otp_code: '' },
      ],
    });

    if (!foundOtp) {
      throw new NotFoundException('OTP not found.');
    }
    const isMatch = bcrypt.compareSync(
      payload.old_password,
      foundUser.password,
    );
    if (!isMatch) {
      throw new ForbiddenException('Old password mismatch');
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(payload.new_password, salt);

    await userRepository.update(user_pkid, {
      password: hashedPassword,
    });

    return null;
  }

  async forgetPasswordSubmit(username: string) {
    await this.dataSource.transaction(async (manager) => {
      const foundUser = await manager.getRepository(User).findOne({
        where: {
          username,
        },
      });
      if (!foundUser) {
        throw new NotFoundException('User not found');
      }

      const userOtpRepository = manager.getRepository(UserOtp);

      const foundOtp = await userOtpRepository.findOne({
        where: { user_pkid: foundUser.pkid },
      });

      if (!foundOtp) {
        throw new NotFoundException('OTP not found.');
      }

      const otp_code = Math.floor(100000 + Math.random() * 900000).toString();
      await userOtpRepository.update(foundOtp.pkid, {
        otp_code,
      });

      await this.emailService.sendEmail(
        foundUser.email,
        'Forget Password',
        `otp: ${otp_code}`,
      );
    });
    return null;
  }

  async forgetPassword(payload: ForgetPasswordDto) {
    const userRepository = this.dataSource.getRepository(User);
    const userOtpRepository = this.dataSource.getRepository(UserOtp);

    const foundUser = await userRepository.findOne({
      where: {
        username: payload.username,
      },
    });

    if (!foundUser) {
      throw new NotFoundException('User not found.');
    }

    const foundOtp = await userOtpRepository.findOne({
      where: { user_pkid: foundUser.pkid, is_used: true },
    });

    if (!foundOtp) {
      throw new NotFoundException('OTP not found.');
    }

    const isMatch = bcrypt.compareSync(payload.password, foundUser.password);
    if (!isMatch) {
      throw new ForbiddenException(
        'New password cannot be same as old password.',
      );
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(payload.password, salt);

    await userRepository.update(foundUser.pkid, {
      password: hashedPassword,
    });

    return null;
  }
}
