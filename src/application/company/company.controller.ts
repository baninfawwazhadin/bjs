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
import { CompanyService } from './company.service';
import { PostCompanyDto } from './dto/post-company.dto';
import { PutCompanyDto } from './dto/put-company.dto';
import { GetCompanyDto } from './dto/get-company.dto';
import { Company } from '~/shared/entities/company.entity';
import { ResponseMetadata } from '~/shared/decorator/response.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetTableDto } from '~/shared/dto/general.dto';

@ApiBearerAuth()
@ApiTags('Company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ResponseMetadata(HttpStatus.CREATED, 'Company added successfully.')
  async createCompany(@Body() postCompanyDto: PostCompanyDto) {
    return await this.companyService.createCompany(postCompanyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':pkid')
  @ResponseMetadata(HttpStatus.ACCEPTED, 'Company updated successfully.')
  async updateCompany(
    @Param('pkid') pkid: string,
    @Body() dto: PutCompanyDto,
  ): Promise<Company> {
    return this.companyService.updateCompany(dto, pkid);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':pkid')
  @ResponseMetadata(HttpStatus.OK, 'Company deleted successfully.')
  async deleteCompany(@Param('pkid') pkid: string): Promise<void> {
    await this.companyService.deleteCompany(pkid);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ResponseMetadata(HttpStatus.OK, 'Company data fetched successfully.')
  async getCompany(@Query() query: GetTableDto) {
    const result = await this.companyService.getCompany(query);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('list')
  @ResponseMetadata(HttpStatus.OK, 'Company data fetched successfully.')
  async getListCompany(
    @Query() getCompanyDto: GetCompanyDto,
  ): Promise<Company | Company[]> {
    const { pkid } = getCompanyDto;
    return this.companyService.getListCompany(pkid);
  }
}
