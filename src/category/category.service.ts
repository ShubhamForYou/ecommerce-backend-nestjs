import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const newCategory = await this.prismaService.category.create({
        data: createCategoryDto,
      });
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Category Created Successfully',
        data: newCategory,
      };
    } catch (error: any) {
      const DUPLICATE_CATEGORY = 'P2002';
      if (error?.code === DUPLICATE_CATEGORY) {
        const field =
          error.meta?.driverAdapterError?.cause?.constraint?.fields[0];
        throw new ConflictException(
          `${field} already exists, please choose different ${field}`,
        );
      }
      throw new InternalServerErrorException(
        'An error occurred while creating the category',
      );
    }
  }
  // findAll() {
  //   return `This action returns all category`;
  // }
  // findOne(id: number) {
  //   return `This action returns a #${id} category`;
  // }
  // update(id: number, updateCategoryDto: UpdateCategoryDto) {
  //   return `This action updates a #${id} category`;
  // }
  // remove(id: number) {
  //   return `This action removes a #${id} category`;
  // }
}
