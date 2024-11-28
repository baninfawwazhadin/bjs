import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RoleService } from '../role/role.service';
import { AreaService } from '../area/area.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly roleService: RoleService,
    private readonly userService: UserService,
    private readonly areaService: AreaService,
  ) {}

  async generateMasterData() {
    this.areaService.generateMasterData();

    await this.roleService.generateMasterData();
    await this.userService.generateMasterData();
  }
}
