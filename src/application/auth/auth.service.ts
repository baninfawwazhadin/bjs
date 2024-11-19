import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '~/shared/interfaces/jwt-payload.interface';
import { LoginDto } from './dto/login.dto';
import { CustomHttpException } from '~/shared/exceptions/custom-http.exception';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(payload: LoginDto) {
    if (payload.username != payload.password) {
      throw new CustomHttpException(
        {
          status: false,
          message: 'Invalid username or password',
          data: null,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const jwtPayload: JwtPayload = {
      username: payload.username,
    };
    return {
      access_token: this.jwtService.sign(jwtPayload),
    };
  }
}
