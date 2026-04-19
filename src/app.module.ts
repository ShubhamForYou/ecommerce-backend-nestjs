import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CartModule } from './cart/cart.module';

import { AddressModule } from './address/address.module';
import { PaymentsModule } from './payments/payments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AdminModule } from './admin/admin.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
    AuthModule,
    UsersModule,
    CartModule,
    AddressModule,
    PaymentsModule,
    NotificationsModule,
    AdminModule,
    HealthModule,
    PrismaModule,
    CategoryModule,
    ProductModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaModule],
})
export class AppModule {}
