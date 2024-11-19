import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BasicAuthGuard } from './guards/basic-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiBasicAuth, ApiBearerAuth } from '@nestjs/swagger';
import { JwtPayload } from '~/shared/interfaces/jwt-payload.interface';
import { UserJWT } from '~/shared/decorator/user-jwt.decorator';
import { LoginDto } from './dto/login.dto';

@ApiBearerAuth()
@ApiBasicAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(BasicAuthGuard)
  @Post('login')
  async login(@Body() payload: LoginDto) {
    const result = await this.authService.login(payload);
    return {
      status: true,
      message: 'Logic successful',
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('jwt')
  getJWT(@UserJWT() userJWT: JwtPayload) {
    return {
      status: true,
      message: 'User JWT',
      data: userJWT,
    };
  }
}
