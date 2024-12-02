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
import { CompanyPICService } from './company-pic.service';
import { PostCompanyPICDto } from './dto/post-company-pic.dto';
import { PutCompanyPICDto } from './dto/put-company-pic.dto';
import { GetCompanyPICDto } from './dto/get-company-pic.dto';
import { CompanyPic } from '~/shared/entities/company_PIC.entity';
import { ResponseMetadata } from '~/shared/decorator/response.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetTableDto } from '~/shared/dto/general.dto';

@ApiBearerAuth()
@ApiTags('Company PIC')
@Controller('companypic')
export class CompanyPICController {
  constructor(private readonly companyPICService: CompanyPICService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ResponseMetadata(HttpStatus.CREATED, 'Company PIC added successfully.')
  async createCompanyPIC(@Body() postCompanyPICDto: PostCompanyPICDto) {
    return await this.companyPICService.createCompanyPIC(postCompanyPICDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':pkid')
  @ResponseMetadata(HttpStatus.ACCEPTED, 'Company PIC updated successfully.')
  async updateCompanyPIC(
    @Param('pkid') pkid: string,
    @Body() dto: PutCompanyPICDto,
  ): Promise<CompanyPic> {
    return this.companyPICService.updateCompanyPIC(dto, pkid);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':pkid')
  @ResponseMetadata(HttpStatus.OK, 'Company PIC deleted successfully.')
  async deleteCompanyPIC(@Param('pkid') pkid: string): Promise<void> {
    await this.companyPICService.deleteCompanyPIC(pkid);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ResponseMetadata(HttpStatus.OK, 'Company data fetched successfully.')
  async getCompanyPIC(@Query() query: GetTableDto) {
    const result = await this.companyPICService.getCompanyPIC(query);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('list')
  @ResponseMetadata(HttpStatus.OK, 'Company data fetched successfully.')
  async getListCompanyPIC(
    @Query() getCompanyPICDto: GetCompanyPICDto,
  ): Promise<CompanyPic[]> {
    const { pkid } = getCompanyPICDto;
    const { company_pkid } = getCompanyPICDto;
    return this.companyPICService.getListCompanyPIC(pkid, company_pkid);
  }
}
