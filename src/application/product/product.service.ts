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
import { Product } from '~/shared/entities/product.entity';
import { PostProductDto } from './dto/post-product.dto';
import { PutProductDto } from './dto/put-product.dto';
import { GetTableDto, ResultTable } from '~/shared/dto/general.dto';

@Injectable()
export class ProductService {
  private readonly productRepository: Repository<Product>;
  constructor(@Inject('DATA_SOURCE') private readonly dataSource: DataSource) {
    this.productRepository = this.dataSource.getRepository(Product);
  }

  private async isNameTaken(
    name: string,
    excludePkid?: string,
  ): Promise<boolean> {
    const whereCondition: FindOptionsWhere<Product> = { name };
    if (excludePkid) {
      whereCondition.pkid = Not(excludePkid);
    }
    const count = await this.productRepository.count({
      where: whereCondition,
    });
    return count < 1;
  }

  async createProduct(dto: PostProductDto): Promise<Product> {
    const isUnique = await this.isNameTaken(dto.name);
    if (!isUnique) {
      throw new BadRequestException(`The name '${dto.name}' is already taken.`);
    }

    const newProduct = this.productRepository.create(dto);
    await this.productRepository.save(newProduct, { reload: false });
    const result = await this.productRepository.findOne({
      where: {
        name: dto.name,
      },
    });
    if (!result) {
      throw new ConflictException(`Product not found after created.`);
    }
    return result;
  }

  async updateProduct(dto: PutProductDto, pkid: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { pkid },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID '${pkid}' not found`);
    }

    const isUnique = await this.isNameTaken(dto.name, pkid);
    if (!isUnique) {
      throw new BadRequestException(`The name '${dto.name}' is already taken.`);
    }

    product.name = dto.name;
    return this.productRepository.save(product);
  }

  async deleteProduct(pkid: string): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { pkid },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID '${pkid}' not found`);
    }
    await this.productRepository.softDelete({ pkid });
  }

  async getProduct(payload: GetTableDto) {
    const page = (payload.page - 1) * payload.limit;
    const keyword = payload.term ? payload.term.trim() : '';
    const sql = this.productRepository.createQueryBuilder('a').where('1 = 1');

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

  async getListProduct(pkid?: string): Promise<Product | Product[]> {
    if (pkid) {
      const product = await this.productRepository.findOne({
        where: { pkid },
      });
      if (!product) {
        throw new NotFoundException(`Product with ID '${pkid}' not found`);
      }
      return product;
    }
    return this.productRepository.find();
  }
}
