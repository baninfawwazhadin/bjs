import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AdminService {
  constructor(private readonly userService: UserService) {}

  async generateMasterData() {
    this.userService.generateMasterData();
  }

  async checkMasterData() {
    const result = await this.userService.checkMasterData();
    return result;
  }
}
