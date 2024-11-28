import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { Role } from '~/shared/entities/role.entity';
import { ROLES_KEY } from '~/shared/decorator/roles.decorator';
import { JwtPayload } from '~/shared/interfaces/jwt-payload.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject('DATA_SOURCE') private readonly dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: JwtPayload = request.user;

    const roleRepository = this.dataSource.getRepository(Role);
    const userRole = await roleRepository.findOne({
      where: { pkid: user.role_pkid },
    });

    if (!userRole) {
      throw new ForbiddenException('Access Denied: Role not found.');
    }

    if (!requiredRoles.includes(userRole.pkid)) {
      throw new ForbiddenException('Access Denied: Insufficient role.');
    }

    return true;
  }
}
