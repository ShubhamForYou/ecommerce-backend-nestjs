import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from 'src/auth/auth.guard';
@UseGuards(AuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  addToCart(@Body() addToCart: AddToCartDto, @Req() req) {
    return this.cartService.addToCart(addToCart, req.user.userId);
  }
  @Get()
  findCart(@Req() req) {
    return this.cartService.findCart(req.user.userId);
  }
  @Patch('item/:id')
  updateQuantity(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
    @Req() req,
  ) {
    return this.cartService.updateQuantity(id, quantity, req.user.userId);
  }
  @Delete('item/:id')
  removeItem(@Param('id') id: string, @Req() req) {
    return this.cartService.removeItem(id, req.user.userId);
  }
  
}
