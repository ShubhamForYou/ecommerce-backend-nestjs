import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createAddressDto: CreateAddressDto, @Request() req) {
    return await this.addressService.create(createAddressDto, req.user.userId);
  }
  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Request() req) {
    return await this.addressService.findAll(req.user.userId);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.addressService.findOne(+id);
  // }
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
    @Request() req,
  ) {
    return this.addressService.update(id, updateAddressDto, req.user.userId);
  }
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return await this.addressService.remove(id, req.user.userId);
  }
}
