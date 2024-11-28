import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RoleService } from '../role/role.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  async generateMasterData() {
    await this.roleService.generateMasterData();
    await this.userService.generateMasterData();
  }
}
