import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  fullName: string;
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  phoneNumber: string;
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.toLowerCase().trim())
  city: string;
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.toLowerCase().trim())
  state: string;
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  pinCode: string;
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.toLowerCase().trim())
  country: string;
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  fullAddress: string;
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.toLowerCase().trim())
  landmark?: string;
  @IsOptional()
  isDefault?: boolean;
}
