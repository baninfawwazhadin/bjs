import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  async findAll() {
    return ['user1', 'user2'];
  }
}
