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
import MasterDataRole from './data/role.json';

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
    await this.dataSource.transaction(async (manager) => {
      const roleRepository = manager.getRepository(Role);

      for (const data of MasterDataRole) {
        await roleRepository.save({
          pkid: data.pkid,
          name: data.name,
          description: data.name,
        });
      }
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
      throw new BadRequestException(`Name already used`);
    }

    if (payload.description) foundRole.description = payload.description;
    await this.roleRepository.update(foundRole.pkid, {
      ...payload,
      updated_by: userJwt.pkid,
    });
    return true;
  }

  async delete(userJwt: JwtPayload, pkid: string): Promise<boolean> {
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
