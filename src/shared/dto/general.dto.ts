import { IsNotEmpty, IsEnum, IsOptional, IsNumber, Min } from 'class-validator';
import { SortType } from '../entities/enum.entity';
import { Type } from 'class-transformer';

export class GetTableDto {
  @IsNotEmpty()
  sortBy: string;

  @IsEnum(SortType)
  sortType: SortType;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  limit: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page: number;

  @IsOptional()
  term?: string;
}

export class ResultTable<T> {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  data: T[];
}
