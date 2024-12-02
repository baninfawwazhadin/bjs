import {
  BadRequestException,
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import {
  Brackets,
  DataSource,
  FindOptionsWhere,
  Not,
  Repository,
} from 'typeorm';
import { Area } from '~/shared/entities/area.entity';
import { PostAreaDto } from './dto/post-area.dto';
import { PutAreaDto } from './dto/put-area.dto';
import { GetTableDto, ResultTable } from '~/shared/dto/general.dto';
import MasterDataProvince from './data/province.json';

@Injectable()
export class AreaService {
  private readonly areaRepository: Repository<Area>;
  constructor(@Inject('DATA_SOURCE') private readonly dataSource: DataSource) {
    this.areaRepository = this.dataSource.getRepository(Area);
  }

  async checkMasterData() {
    const foundMaster = await this.areaRepository.findOne({
      where: {
        pkid: 'A001',
      },
    });
    if (foundMaster) {
      return false;
    }
    return true;
  }

  async generateMasterData() {
    await this.dataSource.transaction(async (manager) => {
      const areaRepository = manager.getRepository(Area);

      for (const data of MasterDataProvince) {
        await areaRepository.save({
          pkid: data.pkid,
          name: data.name,
        });
      }
    });
  }

  private async isNameUnique(
    name: string,
    excludePkid?: string,
  ): Promise<boolean> {
    const whereCondition: FindOptionsWhere<Area> = { name };
    if (excludePkid) {
      whereCondition.pkid = Not(excludePkid);
    }
    const count = await this.areaRepository.count({ where: whereCondition });
    return count === 0;
  }

  async createArea(dto: PostAreaDto): Promise<Area> {
    const isUnique = await this.isNameUnique(dto.name);
    if (!isUnique) {
      throw new BadRequestException(`The name '${dto.name}' is already taken.`);
    }

    const newArea = this.areaRepository.create(dto);
    await this.areaRepository.save(newArea, { reload: false });
    const result = await this.areaRepository.findOne({
      where: {
        name: dto.name,
      },
    });
    if (!result) {
      throw new ConflictException(`Area not found after create.`);
    }
    return result;
  }

  async updateArea(dto: PutAreaDto, pkid: string): Promise<Area> {
    const area = await this.areaRepository.findOne({ where: { pkid } });
    if (!area) {
      throw new NotFoundException(`Area with ID '${pkid}' not found`);
    }

    const isUnique = await this.isNameUnique(dto.name, pkid);
    if (!isUnique) {
      throw new BadRequestException(`The name '${dto.name}' is already taken.`);
    }

    area.name = dto.name;
    return await this.areaRepository.save(area);
  }

  async deleteArea(pkid: string): Promise<boolean> {
    const area = await this.areaRepository.findOne({ where: { pkid } });
    if (!area) {
      throw new NotFoundException(`Area with ID '${pkid}' not found`);
    }
    await this.areaRepository.softDelete({ pkid });
    return true;
  }

  async getArea(payload: GetTableDto) {
    const page = (payload.page - 1) * payload.limit;
    const keyword = payload.term ? payload.term.trim() : '';
    const sql = this.areaRepository.createQueryBuilder('a').where('1 = 1');

    if (keyword != '') {
      sql.andWhere(
        new Brackets((qb) => {
          qb.where('a.name like :keyword', {
            keyword: `%${keyword}%`,
          });
        }),
      );
    }

    if (payload.sortBy) {
      payload.sortBy =
        payload.sortBy.split('.').length > 1
          ? payload.sortBy
          : `a.${payload.sortBy}`;
      sql.orderBy(`${payload.sortBy}`, payload.sortType);
    }

    const count = await sql.getCount();
    sql.offset(page);
    sql.limit(payload.limit);
    const resultData = await sql.getMany();

    const result = new ResultTable();
    const totalPagesRaw = count / payload.limit;

    result.perPage = payload.limit;
    result.currentPage = payload.page;
    result.data = resultData;
    result.totalItems = count;
    result.totalPages = totalPagesRaw < 1 ? 1 : totalPagesRaw;
    return result;
  }

  async getListArea(pkid?: string): Promise<Area | Area[]> {
    if (pkid) {
      const area = await this.areaRepository.findOne({ where: { pkid } });
      if (!area) {
        throw new NotFoundException(`Area with ID '${pkid}' not found`);
      }
      return area;
    }
    return await this.areaRepository.find();
  }
}
