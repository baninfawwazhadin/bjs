import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseModule } from '~/database/database.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [DatabaseModule, EmailModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
