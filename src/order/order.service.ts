import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
interface OrderItem {
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
}
@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createOrderDto: CreateOrderDto, userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }
    let addressId = createOrderDto?.addressId;
    if (!addressId) {
      const defaultAddress = await this.prisma.address.findFirst({
        where: { userId, isDeleted: false, isDefault: true },
      });
      if (!defaultAddress) {
        throw new NotFoundException('Address not found');
      }
      addressId = defaultAddress.id;
    }
    let order = await this.prisma.order.create({
      data: { addressId, userId, totalAmount: 0 },
    });
    const orderItems: OrderItem[] = cart.items.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
    }));

    await this.prisma.orderItem.createMany({
      data: orderItems,
    });
    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    order = await this.prisma.order.update({
      where: { id: order.id },
      data: { totalAmount },
    });
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Order created successfully',
      data: order,
    };
  }

  async findAll(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            product: {
              select: { name: true },
            },
          },
        },
        address: true,
      },
    });
    return {
      statusCode: HttpStatus.OK,
      message:
        orders.length > 0 ? 'Orders retrieved successfully' : 'No orders found',
      data: orders,
    };
  }

  async findOne(id: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id,
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: { name: true },
            },
          },
        },
      },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Order retrieved successfully',
      data: order,
    };
  }

  // update(id: number, updateOrderDto: UpdateOrderDto) {
  //   return `This action updates a #${id} order`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} order`;
  // }
}
