import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import * as CryptoJS from 'crypto-js';

interface MutableRequest extends Request {
  body: any;
}

@Injectable()
export class PayloadEncryptionMiddleware implements NestMiddleware {
  private decryptField(encryptedValue: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedValue, 'BJS-SECRET');
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  private decryptPayload(payload: any): string {
    const decryptedPayload: any = {};
    for (const key in payload) {
      if (payload.hasOwnProperty(key)) {
        const value = payload[key];
        if (typeof value === 'string') {
          decryptedPayload[key] = this.decryptField(value);
        } else {
          decryptedPayload[key] = value;
        }
      }
    }
    return decryptedPayload;
  }

  async use(req: Request, res: Response, next: NextFunction) {
    if (req.method === 'POST' && process.env.IS_DEV === '0') {
      if (req.body) {
        try {
          (req as MutableRequest).body = this.decryptPayload(req.body);
          return next();
        } catch (error) {
          console.error('Invalid encrypted payload', error.message);
          return res.status(400).send({ message: 'Invalid encrypted payload' });
        }
      }
    }
    next();
  }
}
