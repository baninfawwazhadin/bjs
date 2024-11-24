import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AreaModule } from './area/area.module';

@Module({
  imports: [UserModule, AuthModule, AreaModule],
})
export class ApplicationModule {}
