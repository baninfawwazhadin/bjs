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
import { PostCompanyDto } from './dto/post-company.dto';
import { PutCompanyDto } from './dto/put-company.dto';
import { GetTableDto, ResultTable } from '~/shared/dto/general.dto';
import { Company } from '~/shared/entities/company.entity';

@Injectable()
export class CompanyService {
  private readonly companyRepository: Repository<Company>;
  constructor(@Inject('DATA_SOURCE') private readonly dataSource: DataSource) {
    this.companyRepository = this.dataSource.getRepository(Company);
  }

  private async isFieldUnique(
    field: keyof Company,
    value: string,
    excludePkid?: string,
  ): Promise<boolean> {
    const whereCondition: FindOptionsWhere<Company> = { [field]: value };
    if (excludePkid) {
      whereCondition.pkid = Not(excludePkid);
    }
    const count = await this.companyRepository.count({ where: whereCondition });
    console.log(count);
    return count === 0;
  }

  async createCompany(dto: PostCompanyDto): Promise<Company> {
    const isNameUnique = await this.isFieldUnique('name', dto.name);
    const isPhoneNumberUnique = await this.isFieldUnique(
      'phone_number',
      dto.phone_number ?? '',
    );
    const isEmailUsed = await this.isFieldUnique('email', dto.email);

    if (!isNameUnique) {
      throw new BadRequestException(`The name '${dto.name}' is already taken.`);
    }
    if (!isPhoneNumberUnique) {
      throw new BadRequestException(`Phone number is already used.`);
    }
    if (!isEmailUsed) {
      throw new BadRequestException(`Email is already used.`);
    }

    const newCompany = this.companyRepository.create(dto);
    await this.companyRepository.save(newCompany, { reload: false });
    const result = await this.companyRepository.findOne({
      where: {
        name: dto.name,
      },
    });
    if (!result) {
      throw new ConflictException(`Company not found after create.`);
    }
    return result;
  }

  async updateCompany(dto: PutCompanyDto, pkid: string): Promise<Company> {
    const company = await this.companyRepository.findOne({ where: { pkid } });
    if (!company) {
      throw new NotFoundException(`Company with ID '${pkid}' not found`);
    }

    console.log(dto.name, pkid);
    const isNameUnique = await this.isFieldUnique('name', dto.name, pkid);
    const isPhoneNumberUnique = await this.isFieldUnique(
      'phone_number',
      dto.phone_number ?? '',
      pkid,
    );
    const isEmailUsed = await this.isFieldUnique('email', dto.email, pkid);

    if (!isNameUnique) {
      throw new BadRequestException(`The name '${dto.name}' is already taken.`);
    }
    if (!isPhoneNumberUnique) {
      throw new BadRequestException(`Phone number is already used.`);
    }
    if (!isEmailUsed) {
      throw new BadRequestException(`Email is already used.`);
    }

    company.name = dto.name;
    company.phone_number = dto.phone_number ?? '';
    company.email = dto.email;
    company.NPWP = dto.NPWP ?? '';
    company.is_PPN_included = dto.is_PPN_included;
    company.is_active = dto.is_PPN_included;
    return this.companyRepository.save(company);
  }

  async deleteCompany(pkid: string): Promise<void> {
    const company = await this.companyRepository.findOne({ where: { pkid } });
    if (!company) {
      throw new NotFoundException(`Company with ID '${pkid}' not found`);
    }
    await this.companyRepository.softDelete({ pkid });
  }

  async getCompany(payload: GetTableDto) {
    const page = (payload.page - 1) * payload.limit;
    const keyword = payload.term ? payload.term.trim() : '';
    const sql = this.companyRepository.createQueryBuilder('a').where('1 = 1');

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

  async getListCompany(pkid?: string): Promise<Company | Company[]> {
    if (pkid) {
      const company = await this.companyRepository.findOne({ where: { pkid } });
      if (!company) {
        throw new NotFoundException(`Company with ID '${pkid}' not found`);
      }
      return company;
    }
    return this.companyRepository.find();
  }
}
