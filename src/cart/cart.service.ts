import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { AddToCartDto } from './dto/add-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}
  async addToCart(addToCartDto: AddToCartDto, userId: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        id: addToCartDto.productId,
        isDeleted: false,
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    let cart = await this.prisma.cart.findFirst({
      where: {
        userId,
      },
    });
    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
      });
    }

    const newCartItem = await this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: product.id,
        quantity: addToCartDto.quantity || 1,
      },
    });
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Product added to cart successfully',
      data: newCartItem,
    };
  }

  async findCart(userId: string) {
    const cart = await this.prisma.cart.findFirst({
      where: {
        userId,
      },
      select: {
        items: {
          select: {
            quantity: true,
            product: {
              select: {
                name: true,
                description: true,
                price: true,
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    if (!cart) throw new NotFoundException('Cart not found');
    return {
      statusCode: HttpStatus.OK,
      message:
        cart.items.length > 0
          ? 'Cart retrieved successfully'
          : 'No product in user cart',
      data: cart,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
