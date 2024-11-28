import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [RoleModule, UserModule],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
