import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { PostProductDto } from './dto/post-product.dto';
import { PutProductDto } from './dto/put-product.dto';
import { GetProductDto } from './dto/get-product.dto';
import { ResponseMetadata } from '~/shared/decorator/response.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetTableDto } from '~/shared/dto/general.dto';

@ApiBearerAuth()
@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ResponseMetadata(HttpStatus.CREATED, 'Product added successfully.')
  async createProduct(@Body() postProductDto: PostProductDto) {
    const result = await this.productService.createProduct(postProductDto);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':pkid')
  @ResponseMetadata(HttpStatus.ACCEPTED, 'Product updated successfully.')
  async updateProduct(@Param('pkid') pkid: string, @Body() dto: PutProductDto) {
    const result = await this.productService.updateProduct(dto, pkid);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':pkid')
  @ResponseMetadata(HttpStatus.OK, 'Product deleted successfully.')
  async deleteProduct(@Param('pkid') pkid: string) {
    const result = await this.productService.deleteProduct(pkid);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ResponseMetadata(HttpStatus.OK, 'Data Product fetched successfully.')
  async getProduct(@Query() query: GetTableDto) {
    const result = await this.productService.getProduct(query);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('list')
  @ResponseMetadata(HttpStatus.OK, 'Data Product fetched successfully.')
  async getListProduct(@Query() getProductDto: GetProductDto) {
    const { pkid } = getProductDto;
    const result = await this.productService.getListProduct(pkid);
    return result;
  }
}
