import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserDummy } from '~/shared/entities/user_dummy.entity';

@Injectable()
export class UserService {
  constructor(@Inject('DATA_SOURCE') private readonly dataSource: DataSource) {}
  async findAll() {
    const result = await this.dataSource.getRepository(UserDummy).find();
    return result;
  }
}
