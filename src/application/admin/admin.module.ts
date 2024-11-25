import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
