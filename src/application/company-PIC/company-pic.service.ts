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
import { PostCompanyPICDto } from './dto/post-company-pic.dto';
import { PutCompanyPICDto } from './dto/put-company-pic.dto';
import { GetTableDto, ResultTable } from '~/shared/dto/general.dto';
import { CompanyPic } from '~/shared/entities/company_PIC.entity';

@Injectable()
export class CompanyPICService {
  private readonly companyPICRepository: Repository<CompanyPic>;
  constructor(@Inject('DATA_SOURCE') private readonly dataSource: DataSource) {
    this.companyPICRepository = this.dataSource.getRepository(CompanyPic);
  }

  private async isFieldUnique(
    field: keyof CompanyPic,
    value: string,
    excludePkid?: string,
  ): Promise<boolean> {
    const whereCondition: FindOptionsWhere<CompanyPic> = { [field]: value };
    if (excludePkid) {
      whereCondition.pkid = Not(excludePkid);
    }
    const count = await this.companyPICRepository.count({
      where: whereCondition,
    });
    console.log(count);
    return count === 0;
  }

  async createCompanyPIC(dto: PostCompanyPICDto): Promise<CompanyPic> {
    console.log('masuk sini');
    const isPhoneNumberUnique = await this.isFieldUnique(
      'phone_number',
      dto.phone_number,
    );
    const isEmailUsed = await this.isFieldUnique('email', dto.email);
    if (!isPhoneNumberUnique) {
      throw new BadRequestException(`Phone number is already used.`);
    }
    if (!isEmailUsed) {
      throw new BadRequestException(`Email is already used.`);
    }

    const newCompanyPIC = this.companyPICRepository.create(dto);
    await this.companyPICRepository.save(newCompanyPIC, { reload: false });
    const result = await this.companyPICRepository.findOne({
      where: {
        first_name: dto.first_name,
        last_name: dto.last_name,
        email: dto.email,
      },
    });
    if (!result) {
      throw new ConflictException(`Company PIC not found after created.`);
    }
    return result;
  }

  async updateCompanyPIC(
    dto: PutCompanyPICDto,
    pkid: string,
  ): Promise<CompanyPic> {
    const companyPIC = await this.companyPICRepository.findOne({
      where: { pkid },
    });
    if (!companyPIC) {
      throw new NotFoundException(`Company PIC with ID '${pkid}' not found`);
    }

    const isPhoneNumberUnique = await this.isFieldUnique(
      'phone_number',
      dto.phone_number ?? '',
      pkid,
    );
    const isEmailUsed = await this.isFieldUnique('email', dto.email, pkid);

    if (!isPhoneNumberUnique) {
      throw new BadRequestException(`Phone number is already used.`);
    }
    if (!isEmailUsed) {
      throw new BadRequestException(`Email is already used.`);
    }

    companyPIC.first_name = dto.first_name;
    companyPIC.last_name = dto.last_name;
    companyPIC.phone_number = dto.phone_number;
    companyPIC.email = dto.email;
    companyPIC.position = dto.position;
    companyPIC.is_active = dto.is_active;
    return await this.companyPICRepository.save(companyPIC);
  }

  async deleteCompanyPIC(pkid: string): Promise<void> {
    const companyPIC = await this.companyPICRepository.findOne({
      where: { pkid },
    });
    if (!companyPIC) {
      throw new NotFoundException(`Company PIC with ID '${pkid}' not found`);
    }
    await this.companyPICRepository.softDelete({ pkid });
  }

  async getCompanyPIC(payload: GetTableDto) {
    const page = (payload.page - 1) * payload.limit;
    const keyword = payload.term ? payload.term.trim() : '';
    const sql = this.companyPICRepository
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

  async getListCompanyPIC(pkid?: string): Promise<CompanyPic[]> {
    if (pkid) {
      const companyPIC = await this.companyPICRepository.findOne({
        where: { pkid },
      });
      if (!companyPIC) {
        throw new NotFoundException(`Company with ID '${pkid}' not found`);
      }
      return [companyPIC];
    }
    return await this.companyPICRepository.find();
  }
}
