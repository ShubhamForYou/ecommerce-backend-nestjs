import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
  async findAll() {
    const categories = await this.prismaService.category.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });
    return {
      statusCode: HttpStatus.OK,
      message:
        categories.length > 0
          ? 'Categories retrieved successfully'
          : 'No categories found',
      data: categories,
    };
  }
  // findOne(id: string) {
  //   return `This action returns a #${id} category`;
  // }
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prismaService.category.findFirst({
      where: { id, isDeleted: false },
    });
    if (!category) {
      throw new NotFoundException(`Category not found `);
    }
    try {
      const updatedCategory = await this.prismaService.category.update({
        where: { id },
        data: updateCategoryDto,
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Category updated successfully',
        data: updatedCategory,
      };
    } catch (error: any) {
      const DUPLICATE_CATEGORY = 'P2002';
      if (error?.code === DUPLICATE_CATEGORY) {
        const field =
          error.meta?.driverAdapterError?.cause?.constraint?.fields[0];
        throw new ConflictException(`Category name already exists`);
      }
      throw new InternalServerErrorException(
        'An error occurred while updating the category',
      );
    }
  }
  // remove(id: string) {
  //   return `This action removes a #${id} category`;
  // }
}
