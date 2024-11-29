import { Module } from '@nestjs/common';
import { CompanyPICService } from './company-pic.service';
import { CompanyPICController } from './company-pic.controller';
import { DatabaseModule } from '~/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [CompanyPICService],
  controllers: [CompanyPICController],
})
export class CompanyPICModule {}
