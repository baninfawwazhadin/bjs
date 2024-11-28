import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Role } from '~/shared/entities/role.entity';
import { UpdateRoleDto } from './dto/put-role.dto';
import { JwtPayload } from '~/shared/interfaces/jwt-payload.interface';

@Injectable()
export class RoleService {
  private readonly roleRepository: Repository<Role>;

  constructor(@Inject('DATA_SOURCE') private readonly dataSource: DataSource) {
    this.roleRepository = this.dataSource.getRepository(Role);
  }

  async checkMasterData() {
    const foundMaster = await this.roleRepository.findOne({
      where: {
        pkid: 'R001',
      },
    });
    if (foundMaster) {
      return false;
    }
    return true;
  }

  async generateMasterData() {
    const check = await this.checkMasterData();
    if (!check) {
      return;
    }
    await this.dataSource.transaction(async (manager) => {
      const roleRepository = manager.getRepository(Role);

      await roleRepository.insert({
        pkid: 'R001',
        name: 'Super Admin',
        description: 'Super Admin',
      });
      await roleRepository.insert({
        pkid: 'R002',
        name: 'Admin Order',
        description: 'Admin Order',
      });
      await roleRepository.insert({
        pkid: 'R003',
        name: 'General Manager',
        description: 'General Manager',
      });
    });
  }

  async update(userJwt: JwtPayload, pkid: string, payload: UpdateRoleDto) {
    const foundRole = await this.roleRepository.findOne({ where: { pkid } });
    if (!foundRole) {
      throw new NotFoundException(`Role not found`);
    }

    const foundSameName = await this.roleRepository.find({
      where: { name: payload.name },
    });
    if (foundSameName.length > 0) {
      throw new BadRequestException(`Name alread used`);
    }

    if (payload.description) foundRole.description = payload.description;
    await this.roleRepository.update(foundRole.pkid, {
      ...payload,
      updated_by: userJwt.pkid,
    });
    return true;
  }

  async delete(userJwt: JwtPayload, pkid: string) {
    const foundRole = await this.roleRepository.findOne({ where: { pkid } });
    if (!foundRole) {
      throw new NotFoundException(`Role not found`);
    }
    await this.roleRepository.update(foundRole.pkid, {
      deleted_at: new Date(),
      deleted_by: userJwt.pkid,
    });
    return true;
  }

  async list() {
    const result = await this.roleRepository.find();
    return result;
  }
}
