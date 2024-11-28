import { PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './post-role.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
