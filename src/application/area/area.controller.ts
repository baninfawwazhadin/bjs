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

@Controller('area')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ResponseMetadata(HttpStatus.CREATED, 'Area added successfully.')
  async createArea(@Body() PostAreaDto: PostAreaDto) {
    return await this.areaService.createArea(PostAreaDto);
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
  async getArea(@Query() GetAreaDto: GetAreaDto): Promise<Area | Area[]> {
    const { pkid } = GetAreaDto;
    return this.areaService.getArea(pkid);
  }
}
