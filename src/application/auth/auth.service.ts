import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { User } from '~/shared/entities/user.entity';
import { JwtPayload } from '~/shared/interfaces/jwt-payload.interface';
import { UserService } from '../user/user.service';
import { UserLogAuthType } from '../../shared/entities/enum.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('DATA_SOURCE') private readonly dataSource: DataSource,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly userService: UserService,
  ) {}

  async login(payload: LoginDto) {
    const key = `${payload.username}:password_attempt`;
    const foundUser = await this.dataSource.getRepository(User).findOne({
      where: {
        username: payload.username,
      },
      relations: ['role'],
    });
    if (!foundUser) {
      await this.loginFail(key, null);
      throw new ForbiddenException('Access Denied.');
    }
    if (foundUser.is_user_locked) {
      throw new ForbiddenException('User locked, please call admin.');
    }
    if (!foundUser.is_user_active) {
      throw new ForbiddenException('User inactive, please call admin.');
    }

    const isMatch = await bcrypt.compare(payload.password, foundUser.password);
    if (!isMatch) {
      await this.loginFail(key, foundUser);
      throw new ForbiddenException('Access Denied.');
    }

    this.cacheManager.del(key);

    const jwtPayload: JwtPayload = {
      pkid: foundUser.pkid,
      username: foundUser.username,
      first_name: foundUser.first_name,
      last_name: foundUser.last_name,
      role_pkid: foundUser.role_pkid,
    };

    this.userService.logAuth({
      user: foundUser,
      type: UserLogAuthType.Login,
    });

    return {
      access_token: this.jwtService.sign(jwtPayload, {
        expiresIn: process.env.JWT_EXPIRY ?? '1h',
      }),
      refresh_token: this.jwtService.sign(jwtPayload, {
        expiresIn: '7d',
      }),
    };
  }

  async loginFail(key: string, user: User | null) {
    let cachedData =
      (await this.cacheManager.get<{ count: number }>(key)) || null;
    if (!cachedData) {
      cachedData = {
        count: 0,
      };
    }

    cachedData.count++;
    if (cachedData.count > 2) {
      const userRepository = this.dataSource.manager.getRepository(User);
      if (user) {
        await userRepository.update(user.pkid, {
          is_user_locked: true,
        });
      }

      await this.cacheManager.del(key);
      throw new ForbiddenException('User locked, please call admin.');
    }

    await this.cacheManager.set(key, cachedData, 300);
  }

  async logout(user_pkid: string) {
    const foundUser = await this.dataSource.getRepository(User).findOne({
      where: {
        pkid: user_pkid,
      },
      relations: ['role'],
    });
    if (!foundUser) {
      throw new ForbiddenException('Logout failed.');
    }

    this.userService.logAuth({
      user: foundUser,
      type: UserLogAuthType.Logout,
    });

    return true;
  }
}
