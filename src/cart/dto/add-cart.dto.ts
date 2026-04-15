import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AddToCartDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  productId: string;
  @IsOptional()
  @IsNumber()
  quantity?: number;
}
