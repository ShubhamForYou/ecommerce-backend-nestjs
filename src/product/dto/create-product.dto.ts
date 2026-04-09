import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.toLowerCase().trim())
  name: string;
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  description?: string;
  @IsNotEmpty()
  @IsNumber()
  @Transform(({value}) => parseFloat(value))
  price: number;
  @IsNotEmpty()
  @IsInt()
  @Transform(({value}) => Number(value))
  stock: number;
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  categoryId: string;
}
