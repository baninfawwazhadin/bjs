import { Injectable } from '@nestjs/common';

@Injectable()
export class HelperService {
  sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }
}
