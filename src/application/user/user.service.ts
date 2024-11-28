import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { DataSource, IsNull, Not, Repository } from 'typeorm';
import { CreateUserDto, CreateUserLogAuth } from './dto/post-user.dto';
import { User } from '~/shared/entities/user.entity';
import { Role } from '~/shared/entities/role.entity';
import { UserOtp } from '~/shared/entities/user_otp.entity';
import { EmailService } from '../email/email.service';
import {
  ChangePasswordDto,
  ForgetPasswordDto,
  UpdateUserDto,
} from './dto/put-user.dto';
import { JwtPayload } from '~/shared/interfaces/jwt-payload.interface';
import { HelperService } from '~/shared/helpers/helper.service';
import { UserLogAuth } from '~/shared/entities/user_log_auth.entity';
import { UserLogAuthType } from '~/shared/entities/enum.entity';

@Injectable()
export class UserService {
  private readonly userRepository: Repository<User>;
  private readonly userOtpRepository: Repository<UserOtp>;
  private readonly userLogAuthRepository: Repository<UserLogAuth>;

  constructor(
    @Inject('DATA_SOURCE') private readonly dataSource: DataSource,
    private readonly emailService: EmailService,
    private readonly helperService: HelperService,
  ) {
    this.userRepository = this.dataSource.getRepository(User);
    this.userOtpRepository = this.dataSource.getRepository(UserOtp);
    this.userLogAuthRepository = this.dataSource.getRepository(UserLogAuth);
  }

  async checkMasterData() {
    const foundAdmin = await this.userRepository.findOne({
      where: {
        pkid: 'BJSA001',
      },
    });
    if (foundAdmin) {
      return false;
    }
    return true;
  }

  async generateMasterData() {
    const check = await this.checkMasterData();
    if (!check) {
      return;
    }
    await this.dataSource.transaction(async (manager) => {
      const userRepository = manager.getRepository(User);
      const userOtpRepository = manager.getRepository(UserOtp);
      const hashedPassword = await this.helperService.encryptBcrypt(
        process.env.DEFAULT_PASSWORD ?? 'Admin123*',
      );
      await userRepository.insert({
        pkid: 'BJSA001',
        username: 'admin',
        first_name: 'Admin',
        last_name: 'Default',
        email: 'admin@gmail.com',
        phone_number: '628123456789',
        password: hashedPassword,
        role_pkid: 'R001',
      });

      await userOtpRepository.insert({ user_pkid: 'BJSA001' });
    });
  }

  async create(payload: CreateUserDto, userJwt: JwtPayload) {
    try {
      const newUserPkId = await this.dataSource.transaction(async (manager) => {
        const userRepository = manager.getRepository(User);
        const roleRepository = manager.getRepository(Role);

        const foundRole = await roleRepository.findOne({
          where: {
            pkid: payload.role_pkid,
          },
        });
        if (!foundRole) {
          throw new BadRequestException('Role not found');
        }

        const hashedPassword = await this.helperService.encryptBcrypt(
          payload.password,
        );

        const newUser = userRepository.create({
          ...payload,
          password: hashedPassword,
          created_by: userJwt.pkid,
        });
        await userRepository.save(newUser, { reload: false });

        const pkidResult = await userRepository.find();
        console.log(pkidResult);

        const newUserPkId = pkidResult[0]?.pkid;
        if (!newUserPkId) {
          throw new InternalServerErrorException(
            'Failed to retrieve pkid for the last inserted ID.',
          );
        }

        const userOtpRepository = manager.getRepository(UserOtp);
        const newUserOtp = userOtpRepository.create({
          user_pkid: newUserPkId,
        });
        await userOtpRepository.insert(newUserOtp);

        return newUserPkId;
      });

      const result = this.findOneProfile(newUserPkId);

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

  async logAuth(payload: CreateUserLogAuth) {
    if (payload.type === UserLogAuthType.Login) {
      await this.userLogAuthRepository.insert({
        username: payload.user.username,
        name: `${payload.user.first_name} ${payload.user.last_name}`,
        date: new Date(),
        login_time: new Date(),
      });
      return true;
    }

    const foundLog = await this.userLogAuthRepository.findOne({
      where: {
        username: payload.user.username,
        login_time: Not(IsNull()),
        logout_time: IsNull(),
      },
      order: {
        date: 'DESC',
      },
    });

    if (!foundLog) {
      throw new BadRequestException('Logout without login.');
    }

    foundLog.logout_time = new Date();
    await this.userLogAuthRepository.update(foundLog.pkid, foundLog);
    return true;
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
      ],
      where: {
        pkid,
      },
      relations: ['role'],
    });

    if (!result) {
      throw new NotFoundException('User not found.');
    }
    return result;
  }

  async update(
    pkid: string,
    payload: UpdateUserDto,
    userJwt: JwtPayload | null = null,
  ) {
    const foundUser = await this.userRepository.findOne({
      where: {
        pkid,
      },
    });

    if (!foundUser) {
      throw new ForbiddenException('User not found.');
    }

    const updateData = {
      ...payload,
      updated_by: userJwt ? userJwt.pkid : null,
    };
    const result = await this.userRepository.update(pkid, updateData);
    return result;
  }

  async changePassword(pkid: string, payload: ChangePasswordDto) {
    const userRepository = this.dataSource.getRepository(User);

    const foundUser = await userRepository.findOne({
      where: {
        pkid: pkid,
      },
    });

    if (!foundUser) {
      throw new NotFoundException('User not found.');
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

    await userRepository.update(pkid, {
      password: hashedPassword,
    });

    return null;
  }

  async forgetPasswordSubmit(username: string) {
    await this.dataSource.transaction(async (manager) => {
      const now = new Date();

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

      now.setMinutes(now.getMinutes() + 5);
      const otp_code = Math.floor(100000 + Math.random() * 900000).toString();
      await userOtpRepository.update(foundOtp.pkid, {
        otp_code,
        expired_at: now,
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
    await this.dataSource.transaction(async (manager) => {
      const userRepository = manager.getRepository(User);
      const userOtpRepository = manager.getRepository(UserOtp);

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
      if (isMatch) {
        throw new ForbiddenException(
          'New password cannot be same as old password.',
        );
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(payload.password, salt);

      await userRepository.update(foundUser.pkid, {
        password: hashedPassword,
      });

      await userOtpRepository.update(foundOtp.pkid, {
        otp_code: null,
        is_used: false,
      });
    });

    return null;
  }

  async verifyOtp(username: string, otp_code: string) {
    const now = new Date();
    const foundUser = await this.userRepository.findOne({
      where: {
        username,
      },
    });
    if (!foundUser) {
      throw new NotFoundException('User not found.');
    }

    const foundOtp = await this.userOtpRepository.findOne({
      where: { user_pkid: foundUser.pkid, otp_code },
    });

    if (!foundOtp || foundOtp.is_used) {
      throw new ForbiddenException('Invalid or already used OTP.');
    }

    if (foundOtp.expired_at) {
      if (foundOtp.expired_at <= now) {
        throw new ForbiddenException('OTP expired.');
      }
    }

    await this.userOtpRepository.update(foundOtp.pkid, { is_used: true });

    return null;
  }
}
