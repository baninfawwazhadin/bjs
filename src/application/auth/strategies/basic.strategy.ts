import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http';

@Injectable()
export class BasicAuthStrategy extends PassportStrategy(Strategy) {
  private readonly username: string;
  private readonly password: string;

  constructor(private readonly configService: ConfigService) {
    super();
    this.username = this.configService.get<string>(
      'BASIC_AUTH_USER',
      'defaultBasicUserBJS',
    );
    this.password = this.configService.get<string>(
      'BASIC_AUTH_PASS',
      'defaultBasicPasswordBJS',
    );
  }

  async validate(username: string, password: string): Promise<any> {
    if (username === this.username && password === this.password) {
      return { username };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
