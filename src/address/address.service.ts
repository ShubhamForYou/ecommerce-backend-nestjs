import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AddressService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createAddressDto: CreateAddressDto, userId: string) {
    const existingAddresses = await this.prismaService.address.findMany({
      where: {
        userId,
      },
    });
    if (existingAddresses.length > 0) {
      if (createAddressDto.isDefault) {
        await this.prismaService.address.updateMany({
          where: {
            userId,
            isDefault: true,
          },
          data: {
            isDefault: false,
          },
        });
        const newAddress = await this.prismaService.address.create({
          data: {
            ...createAddressDto,
            userId,
            isDefault: true,
          },
        });
        return {
          statusCode: HttpStatus.CREATED,
          message: 'Address Created Successfully',
          data: newAddress,
        };
      }
      const newAddress = await this.prismaService.address.create({
        data: {
          ...createAddressDto,
          userId,
        },
      });
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Address Created',
        data: newAddress,
      };
    }
    const newAddress = await this.prismaService.address.create({
      data: {
        ...createAddressDto,
        userId,
        isDefault: true,
      },
    });
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Address created Successfully',
      data: newAddress,
    };
  }

  async findAll(userId: string) {
    const addresses = await this.prismaService.address.findMany({
      where: { userId, isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });
    return {
      statusCode: HttpStatus.OK,
      message:
        addresses.length > 0
          ? 'Addresses Retrieved Successfully'
          : 'No Addresses Found for this user',
      data: addresses,
    };
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} address`;
  // }

  async update(id: string, updateAddressDto: UpdateAddressDto, userId: string) {
    const address = await this.prismaService.address.findFirst({
      where: { id, userId, isDeleted: false },
    });
    if (!address) throw new NotFoundException('Address not found');
    if (updateAddressDto.isDefault === true) {
      await this.prismaService.address.updateMany({
        where: { userId, isDefault: true, isDeleted: false },
        data: { isDefault: false },
      });
      const updatedAddress = await this.prismaService.address.update({
        where: { id },
        data: { ...updateAddressDto, isDefault: true },
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Address updated successfully',
        data: updatedAddress,
      };
    }
    const updatedAddress = await this.prismaService.address.update({
      where: {
        id,
      },
      data: updateAddressDto,
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Address updated successfully',
      data: updatedAddress,
    };
  }

  async remove(id: string, userId: string) {
    const address = await this.prismaService.address.findFirst({
      where: { id, userId, isDeleted: false },
    });
    if (!address) throw new NotFoundException('Address not found');
    if (address.isDefault === true) {
      const otherAddress = await this.prismaService.address.findFirst({
        where: { userId, isDeleted: false, id: { not: id } },
      });
      if (otherAddress) {
        await this.prismaService.address.update({
          where: { id: otherAddress.id },
          data: { isDefault: true },
        });
      }
    }
    await this.prismaService.address.update({
      where: { id },
      data: { isDeleted: true, isDefault: false },
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Address deleted successfully',
    };
  }
}
