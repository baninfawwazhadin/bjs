import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  async getUsername(username: string) {
    return `Hello, ${username}! Kamu homo.`;
  }
}
