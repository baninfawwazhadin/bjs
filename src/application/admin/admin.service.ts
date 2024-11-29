import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RoleService } from '../role/role.service';
import { AreaService } from '../area/area.service';
import { ProductService } from '../product/product.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly roleService: RoleService,
    private readonly userService: UserService,
    private readonly areaService: AreaService,
    private readonly productService: ProductService,
  ) {}

  async generateMasterData() {
    this.areaService.generateMasterData();
    this.productService.generateMasterData();

    await this.roleService.generateMasterData();
    await this.userService.generateMasterData();
  }
}
