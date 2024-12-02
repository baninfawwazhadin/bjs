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
import { RequestType } from '~/shared/entities/request_type.entity';
import { PostRequestTypeDto } from './dto/post-request-type.dto';
import { PutRequestTypeDto } from './dto/put-request-type.dto';
import { GetTableDto, ResultTable } from '~/shared/dto/general.dto';

@Injectable()
export class RequestTypeService {
  private readonly requestTypeRepository: Repository<RequestType>;
  constructor(@Inject('DATA_SOURCE') private readonly dataSource: DataSource) {
    this.requestTypeRepository = this.dataSource.getRepository(RequestType);
  }

  private async isNameUnique(
    name: string,
    excludePkid?: string,
  ): Promise<boolean> {
    const whereCondition: FindOptionsWhere<RequestType> = { name };
    if (excludePkid) {
      whereCondition.pkid = Not(excludePkid);
    }
    const count = await this.requestTypeRepository.count({
      where: whereCondition,
    });
    return count === 0;
  }

  async createRequestType(dto: PostRequestTypeDto): Promise<RequestType> {
    const isUnique = await this.isNameUnique(dto.name);
    if (!isUnique) {
      throw new BadRequestException(`The name '${dto.name}' is already taken.`);
    }

    const newRequestType = this.requestTypeRepository.create(dto);
    await this.requestTypeRepository.save(newRequestType, { reload: false });
    const result = await this.requestTypeRepository.findOne({
      where: {
        name: dto.name,
      },
    });
    if (!result) {
      throw new ConflictException(`Request Type not found after created.`);
    }
    return result;
  }

  async updateRequestType(
    dto: PutRequestTypeDto,
    pkid: string,
  ): Promise<RequestType> {
    const requestType = await this.requestTypeRepository.findOne({
      where: { pkid },
    });
    if (!requestType) {
      throw new NotFoundException(`Request Type with ID '${pkid}' not found`);
    }

    const isUnique = await this.isNameUnique(dto.name, pkid);
    if (!isUnique) {
      throw new BadRequestException(`The name '${dto.name}' is already taken.`);
    }

    requestType.name = dto.name;
    return await this.requestTypeRepository.save(requestType);
  }

  async deleteRequestType(pkid: string): Promise<boolean> {
    const requestType = await this.requestTypeRepository.findOne({
      where: { pkid },
    });
    if (!requestType) {
      throw new NotFoundException(`Request Type with ID '${pkid}' not found`);
    }
    await this.requestTypeRepository.softDelete({ pkid });
    return true;
  }

  async getRequestType(payload: GetTableDto) {
    const page = (payload.page - 1) * payload.limit;
    const keyword = payload.term ? payload.term.trim() : '';
    const sql = this.requestTypeRepository
      .createQueryBuilder('a')
      .where('1 = 1');

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

  async getListRequestType(
    pkid?: string,
  ): Promise<RequestType | RequestType[]> {
    if (pkid) {
      const requestType = await this.requestTypeRepository.findOne({
        where: { pkid },
      });
      if (!requestType) {
        throw new NotFoundException(`Request Type with ID '${pkid}' not found`);
      }
      return requestType;
    }
    return await this.requestTypeRepository.find();
  }
}
