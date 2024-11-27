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
import { AreaService } from './area.service';
import { PostAreaDto } from './dto/post-area.dto';
import { PutAreaDto } from './dto/put-area.dto';
import { Area } from '~/shared/entities/area.entity';
import { GetAreaDto } from './dto/get-area.dto';
import { ResponseMetadata } from '~/shared/decorator/response.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetTableDto } from '~/shared/dto/general.dto';

@ApiBearerAuth()
@ApiTags('Area')
@Controller('area')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ResponseMetadata(HttpStatus.CREATED, 'Area added successfully.')
  async createArea(@Body() postAreaDto: PostAreaDto) {
    return await this.areaService.createArea(postAreaDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':pkid')
  @ResponseMetadata(HttpStatus.ACCEPTED, 'Area updated successfully.')
  async updateArea(
    @Param('pkid') pkid: string,
    @Body() dto: PutAreaDto,
  ): Promise<Area> {
    return this.areaService.updateArea(dto, pkid);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':pkid')
  @ResponseMetadata(HttpStatus.OK, 'Area deleted successfully.')
  async deleteArea(@Param('pkid') pkid: string): Promise<void> {
    await this.areaService.deleteArea(pkid);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ResponseMetadata(HttpStatus.OK, 'Data Area fetched successfully.')
  async getArea(@Query() query: GetTableDto) {
    const result = await this.areaService.getArea(query);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('list')
  @ResponseMetadata(HttpStatus.OK, 'Data Area fetched successfully.')
  async getListArea(@Query() getAreaDto: GetAreaDto): Promise<Area | Area[]> {
    const { pkid } = getAreaDto;
    return this.areaService.getListArea(pkid);
  }
}
