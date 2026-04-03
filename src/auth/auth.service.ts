import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './Dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { loginDto } from './Dto/login.dto';
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {
    console.log('JWT_SECRET inside service:', process.env.JWT_SECRET);
  }
  async registerUser(registerDto: RegisterDto) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(registerDto.password, saltOrRounds);

    const user = await this.userService.createUser({
      ...registerDto,
      password: hash,
    });
    if (user) {
      const token = await this.jwtService.signAsync({
        userId: user.id,
      });
      return {
        access_token: token,
        user: user,
        message: 'User Register Successfully',
      };
    }
  }
  async loginUser(dto: loginDto) {
    const user = await this.userService.getUserByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const isPasswordMatch = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const token = await this.jwtService.signAsync({ userId: user.id });
    return { access_token: token };
  }
}
