import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { BasicAuthGuard } from './guards/basic-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiBasicAuth, ApiBearerAuth } from '@nestjs/swagger';
import { JwtPayload } from '~/shared/interfaces/jwt-payload.interface';
import { UserJWT } from '~/shared/decorator/user-jwt.decorator';
import { LoginDto } from './dto/login.dto';
import { ResponseMetadata } from '~/shared/decorator/response.decorator';

@ApiBearerAuth()
@ApiBasicAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(BasicAuthGuard)
  @ResponseMetadata(HttpStatus.ACCEPTED, 'Login successfully.')
  @Post('login')
  async login(@Body() payload: LoginDto) {
    const result = await this.authService.login(payload);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @ResponseMetadata(HttpStatus.ACCEPTED, 'User JWT.')
  @Get('jwt')
  getJWT(@UserJWT() userJWT: JwtPayload) {
    return userJWT;
  }
}
