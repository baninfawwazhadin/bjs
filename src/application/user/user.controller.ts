import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBasicAuth, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, ForgetPasswordSubmitDto } from './dto/post-user.dto';
import { ResponseMetadata } from '~/shared/decorator/response.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserJWT } from '~/shared/decorator/user-jwt.decorator';
import { JwtPayload } from '~/shared/interfaces/jwt-payload.interface';
import { ChangePasswordDto, ForgetPasswordDto } from './dto/put-user.dto';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';

@ApiBearerAuth()
@ApiBasicAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ResponseMetadata(HttpStatus.CREATED, 'User registered successfully.')
  async register(@Body() payload: CreateUserDto) {
    const result = await this.userService.create(payload);
    return result;
  }

  @UseGuards(BasicAuthGuard)
  @Post('forget-password-submit')
  @ResponseMetadata(HttpStatus.ACCEPTED, 'OTP sent to email.')
  async forgetPasswordSubmit(@Body() payload: ForgetPasswordSubmitDto) {
    return await this.userService.forgetPasswordSubmit(payload.username);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ResponseMetadata(HttpStatus.OK, 'User profile fetched successfully.')
  async getProfile(@UserJWT() userJWT: JwtPayload) {
    const result = await this.userService.findOneProfile(userJWT.pkid);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  @ResponseMetadata(HttpStatus.ACCEPTED, 'Password changed successfully.')
  async changePassword(
    @UserJWT() userJWT: JwtPayload,
    @Body() payload: ChangePasswordDto,
  ) {
    return await this.userService.changePassword(userJWT.pkid, payload);
  }

  @UseGuards(BasicAuthGuard)
  @Post('forget-password')
  @ResponseMetadata(HttpStatus.ACCEPTED, 'Password changed successfully.')
  async forgetPassword(@Body() payload: ForgetPasswordDto) {
    return await this.userService.forgetPassword(payload);
  }
}
