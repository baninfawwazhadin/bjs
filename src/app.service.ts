import { Injectable, OnModuleInit } from '@nestjs/common';
import { AdminService } from './application/admin/admin.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly adminService: AdminService) {}

  async onModuleInit() {
    await this.adminService.generateMasterData();
  }
}
