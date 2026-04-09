import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createProductDto: CreateProductDto) {
    const categoryExists = await this.prisma.category.findFirst({
      where: { id: createProductDto.categoryId, isDeleted: false },
    });
    if (!categoryExists) {
      throw new NotFoundException(`Category not found`);
    }
    const newProduct = await this.prisma.product.create({
      data: {
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        stock: createProductDto.stock,
        categoryId: createProductDto.categoryId,
      },
    });
    return {
      statusCode: HttpStatus.CREATED,
      message: `Product created successfully`,
      data: newProduct,
    };
  }

  async findAll(page: string, limit: string, categoryId?: string) {
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const products = await this.prisma.product.findMany({
      where: {
        isDeleted: false,
        ...(categoryId && { categoryId: categoryId }),
      },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
      orderBy: { createdAt: 'desc' },
    });
    return {
      statusCode: HttpStatus.OK,
      message:
        products.length > 0
          ? `Products retrieved successfully`
          : `No products found`,
      data: products,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
