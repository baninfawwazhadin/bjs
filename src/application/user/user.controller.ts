import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBasicAuth, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, ForgetPasswordSubmitDto } from './dto/post-user.dto';
import { ResponseMetadata } from '~/shared/decorator/response.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserJWT } from '~/shared/decorator/user-jwt.decorator';
import { JwtPayload } from '~/shared/interfaces/jwt-payload.interface';
import {
  ChangePasswordDto,
  ForgetPasswordDto,
  UpdateUserDto,
} from './dto/put-user.dto';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';
import { VerifyOtpDto } from './dto/get-user.dto';
import { Roles } from '~/shared/decorator/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiBearerAuth()
@ApiBasicAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin')
  @Post()
  @ResponseMetadata(HttpStatus.CREATED, 'User registered successfully.')
  async register(
    @UserJWT() userJWT: JwtPayload,
    @Body() payload: CreateUserDto,
  ) {
    const result = await this.userService.create(payload, userJWT);
    return result;
  }

  @UseGuards(BasicAuthGuard)
  @Post('forget-password-submit')
  @ResponseMetadata(HttpStatus.ACCEPTED, 'OTP sent to email.')
  async forgetPasswordSubmit(@Body() payload: ForgetPasswordSubmitDto) {
    const result = await this.userService.forgetPasswordSubmit(
      payload.username,
    );
    return result;
  }

  @UseGuards(BasicAuthGuard)
  @Post('forget-password')
  @ResponseMetadata(HttpStatus.ACCEPTED, 'Password changed successfully.')
  async forgetPassword(@Body() payload: ForgetPasswordDto) {
    const result = await this.userService.forgetPassword(payload);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ResponseMetadata(HttpStatus.OK, 'User profile fetched successfully.')
  async getProfile(@UserJWT() userJWT: JwtPayload) {
    const result = await this.userService.findOneProfile(userJWT.pkid);
    return result;
  }

  @UseGuards(BasicAuthGuard)
  @Get('verify-otp')
  @ResponseMetadata(HttpStatus.ACCEPTED, 'OTP verified.')
  async verifyOtp(@Query() query: VerifyOtpDto) {
    const result = await this.userService.verifyOtp(
      query.username,
      query.otp_code,
    );
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  @ResponseMetadata(HttpStatus.ACCEPTED, 'Password changed successfully.')
  async changePassword(
    @UserJWT() userJWT: JwtPayload,
    @Body() payload: ChangePasswordDto,
  ) {
    const result = await this.userService.changePassword(userJWT.pkid, payload);
    return result;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin')
  @Put(':pkid')
  @ResponseMetadata(HttpStatus.ACCEPTED, 'User updated successfully.')
  async update(
    @Param('pkid') pkid: string,
    @UserJWT() userJWT: JwtPayload,
    @Body() payload: UpdateUserDto,
  ) {
    const result = await this.userService.update(pkid, payload, userJWT);
    return result;
  }
}
