import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { User } from '~/shared/entities/user.entity';
import { JwtPayload } from '~/shared/interfaces/jwt-payload.interface';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('DATA_SOURCE') private readonly dataSource: DataSource,
  ) {}

  async login(payload: LoginDto) {
    const foundUser = await this.dataSource.getRepository(User).findOne({
      where: {
        username: payload.username,
      },
    });
    if (!foundUser) {
      throw new ForbiddenException('Access Denied.');
    }

    const isMatch = await bcrypt.compare(payload.password, foundUser.password);
    if (!isMatch) {
      throw new ForbiddenException('Access Denied.');
    }

    const jwtPayload: JwtPayload = {
      pkid: foundUser.pkid,
      username: foundUser.username,
      first_name: foundUser.first_name,
      last_name: foundUser.last_name,
      role_pkid: foundUser.role_pkid,
    };

    return {
      access_token: this.jwtService.sign(jwtPayload, {
        expiresIn: process.env.JWT_EXPIRY ?? '1h',
      }),
      refresh_token: this.jwtService.sign(jwtPayload, {
        expiresIn: '7d',
      }),
    };
  }
}
