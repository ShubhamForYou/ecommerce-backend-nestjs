import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  name: string;
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  description?: string;
}
