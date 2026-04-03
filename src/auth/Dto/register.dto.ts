import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  password: string;
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  name: string;
}
