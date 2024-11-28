import {
  Controller,
  HttpStatus,
  UseGuards,
  Body,
  Put,
  Param,
  Get,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { ResponseMetadata } from '~/shared/decorator/response.decorator';
import { Roles } from '~/shared/decorator/roles.decorator';
import { UserJWT } from '~/shared/decorator/user-jwt.decorator';
import { Role } from '~/shared/entities/role.entity';
import { ApiStandardResponse } from '~/shared/helper/swagger.helper';
import { JwtPayload } from '~/shared/interfaces/jwt-payload.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UpdateRoleDto } from './dto/put-role.dto';
import { RoleService } from './role.service';

@ApiBearerAuth()
@ApiBasicAuth()
@ApiTags('Role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiStandardResponse(Role, HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('R001')
  @Get('list')
  @ResponseMetadata(HttpStatus.OK, 'Role list retrieved successfully.')
  async list() {
    const result = await this.roleService.list();
    return result;
  }

  @ApiStandardResponse(Role, HttpStatus.ACCEPTED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('R001')
  @Put(':pkid')
  @ResponseMetadata(HttpStatus.ACCEPTED, 'Role updated successfuly.')
  async update(
    @UserJWT() userJWT: JwtPayload,
    @Param('pkid') pkid: string,
    @Body() payload: UpdateRoleDto,
  ) {
    const result = await this.roleService.update(userJWT, pkid, payload);
    return result;
  }

  @ApiStandardResponse(Role, HttpStatus.ACCEPTED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('R001')
  @Delete(':pkid')
  @ResponseMetadata(HttpStatus.ACCEPTED, 'Role deleted successfuly.')
  async delete(@UserJWT() userJWT: JwtPayload, @Param('pkid') pkid: string) {
    const result = await this.roleService.delete(userJWT, pkid);
    return result;
  }
}
