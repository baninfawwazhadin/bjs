import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseModule } from '~/database/database.module';
import { EmailModule } from '../email/email.module';
import { HelperModule } from '~/shared/helpers/helper.module';

@Module({
  imports: [DatabaseModule, EmailModule, HelperModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
