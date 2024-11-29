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
import MasterDataProduct from './data/product.json';

@Injectable()
export class ProductService {
  private readonly productRepository: Repository<Product>;
  constructor(@Inject('DATA_SOURCE') private readonly dataSource: DataSource) {
    this.productRepository = this.dataSource.getRepository(Product);
  }

  async checkMasterData() {
    const foundMaster = await this.productRepository.findOne({
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
      const productRepository = manager.getRepository(Product);

      for (const data of MasterDataProduct) {
        await productRepository.save({
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
    const whereCondition: FindOptionsWhere<Product> = { name };
    if (excludePkid) {
      whereCondition.pkid = Not(excludePkid);
    }
    const count = await this.productRepository.count({
      where: whereCondition,
    });
    console.log(count);
    return count === 0;
  }

  async createProduct(dto: PostProductDto): Promise<Product> {
    const isUnique = await this.isNameUnique(dto.name);
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

  async updateProduct(dto: PutProductDto, pkid: string) {
    const product = await this.productRepository.findOne({
      where: { pkid },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID '${pkid}' not found`);
    }

    const isUnique = await this.isNameUnique(dto.name, pkid);
    if (!isUnique) {
      throw new BadRequestException(`The name '${dto.name}' is already taken.`);
    }

    product.name = dto.name;
    const result = await this.productRepository.save(product);
    return result;
  }

  async deleteProduct(pkid: string) {
    const product = await this.productRepository.findOne({
      where: { pkid },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID '${pkid}' not found`);
    }
    await this.productRepository.softDelete({ pkid });
    return true;
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

  async getListProduct(pkid?: string) {
    if (pkid) {
      const product = await this.productRepository.findOne({
        where: { pkid },
      });
      if (!product) {
        throw new NotFoundException(`Product with ID '${pkid}' not found`);
      }
      return [product];
    }
    const result = await this.productRepository.find();
    return result;
  }
}
