import {
  BadRequestException,
  Injectable,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, FindOptionsWhere, Not, Repository } from 'typeorm';
import { Area } from '~/shared/entities/area.entity';
import { PostAreaDto } from './dto/post-area.dto';
import { PutAreaDto } from './dto/put-area.dto';

@Injectable()
export class AreaService {
  private readonly areaRepository: Repository<Area>;
  constructor(@Inject('DATA_SOURCE') private readonly dataSource: DataSource) {
    this.areaRepository = this.dataSource.getRepository(Area);
  }

  private async isNameTaken(
    name: string,
    excludePkid?: string,
  ): Promise<boolean> {
    const whereCondition: FindOptionsWhere<Area> = { name };
    if (excludePkid) {
      whereCondition.pkid = Not(excludePkid);
    }
    const count = await this.areaRepository.count({ where: whereCondition });
    return count < 1;
  }

  async createArea(dto: PostAreaDto): Promise<Area> {
    const isUnique = await this.isNameTaken(dto.name);
    if (!isUnique) {
      throw new BadRequestException(`The name '${dto.name}' is already taken.`);
    }

    const newArea = this.areaRepository.create(dto);
    return this.areaRepository.save(newArea, { reload: false });
  }

  async updateArea(dto: PutAreaDto, pkid: string): Promise<Area> {
    const area = await this.areaRepository.findOne({ where: { pkid } });
    if (!area) {
      throw new NotFoundException(`Area with ID '${pkid}' not found`);
    }

    const isUnique = await this.isNameTaken(dto.name, pkid);
    if (!isUnique) {
      throw new BadRequestException(`The name '${dto.name}' is already taken.`);
    }

    area.name = dto.name;
    return this.areaRepository.save(area);
  }

  async deleteArea(pkid: string): Promise<void> {
    const area = await this.areaRepository.findOne({ where: { pkid } });
    if (!area) {
      throw new NotFoundException(`Area with ID '${pkid}' not found`);
    }
    await this.areaRepository.save(area);
    await this.areaRepository.softDelete({ pkid });
  }

  async getArea(pkid?: string): Promise<Area | Area[]> {
    if (pkid) {
      const area = await this.areaRepository.findOne({ where: { pkid } });
      if (!area) {
        throw new NotFoundException(`Area with ID '${pkid}' not found`);
      }
      return area;
    }
    return this.areaRepository.find();
  }
}
