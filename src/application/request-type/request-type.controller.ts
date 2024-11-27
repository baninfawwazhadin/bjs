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
import { RequestTypeService } from './request-type.service';
import { PostRequestTypeDto } from './dto/post-request-type.dto';
import { PutRequestTypeDto } from './dto/put-request-type.dto';
import { RequestType } from '~/shared/entities/request_type.entity';
import { GetRequestTypeDto } from './dto/get-request-type.dto';
import { ResponseMetadata } from '~/shared/decorator/response.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetTableDto } from '~/shared/dto/general.dto';

@ApiBearerAuth()
@ApiTags('Request_Type')
@Controller('requesttype')
export class RequestTypeController {
  constructor(private readonly requestTypeService: RequestTypeService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ResponseMetadata(HttpStatus.CREATED, 'Request Type added successfully.')
  async createRequestType(@Body() postRequestTypeDto: PostRequestTypeDto) {
    return await this.requestTypeService.createRequestType(postRequestTypeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':pkid')
  @ResponseMetadata(HttpStatus.ACCEPTED, 'Request Type updated successfully.')
  async updateRequestType(
    @Param('pkid') pkid: string,
    @Body() dto: PutRequestTypeDto,
  ): Promise<RequestType> {
    return this.requestTypeService.updateRequestType(dto, pkid);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':pkid')
  @ResponseMetadata(HttpStatus.OK, 'Request Type deleted successfully.')
  async deleteRequestType(@Param('pkid') pkid: string): Promise<void> {
    await this.requestTypeService.deleteRequestType(pkid);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ResponseMetadata(HttpStatus.OK, 'Data Request Type fetched successfully.')
  async getRequestType(@Query() query: GetTableDto) {
    const result = await this.requestTypeService.getRequestType(query);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('list')
  @ResponseMetadata(HttpStatus.OK, 'Data Request Type fetched successfully.')
  async getListRequestType(
    @Query() getRequestTypeDto: GetRequestTypeDto,
  ): Promise<RequestType | RequestType[]> {
    const { pkid } = getRequestTypeDto;
    return this.requestTypeService.getListRequestType(pkid);
  }
}
