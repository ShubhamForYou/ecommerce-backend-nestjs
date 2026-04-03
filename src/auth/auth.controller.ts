import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './Dto/register.dto';
import { loginDto } from './Dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const response = await this.authService.registerUser(registerDto);
    return response;
  }
  @Post('login')
  async login(@Body() dto: loginDto) {
    const response = await this.authService.loginUser(dto);
    return response;
  }
}
 