import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class HelperService {
  sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async encryptBcrypt(input: string) {
    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(input, salt);
    return hashed;
  }
}
