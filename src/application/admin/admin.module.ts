import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';
import { AreaModule } from '../area/area.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [RoleModule, UserModule, AreaModule, ProductModule],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
