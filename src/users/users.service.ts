import {
  ConflictException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';

import { RegisterDto } from 'src/auth/Dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async createUser(registerDto: RegisterDto) {
    try {
      const newUser = await this.prisma.user.create({
        data: registerDto,
        omit: { password: true },
      });
      return newUser;
    } catch (err:any) {
      const DUPLICATE_EMAIL = 'P2002';
      if (err.code === DUPLICATE_EMAIL) {
        const field =
          err.meta?.driverAdapterError?.cause?.constraint?.fields[0];
        throw new ConflictException(`${field} already exists`);
      }
      throw new ConflictException();
    }
  }
  async getUserByEmail(email: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email: email,
        },
      });
      return user;
    } catch (error) {
      throw new ServiceUnavailableException({ error: error });
    }
  }
  async getUserById(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
        omit: { password: true },
      });
      return user;
    } catch (error) {
      throw new ServiceUnavailableException(error);
    }
  }
}
