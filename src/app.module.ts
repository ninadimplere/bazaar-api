import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@auth/auth.module';
import { UsersModule } from '@users/users.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from 'prisma/prisma.module';
import { RegisterModule } from '@register/register.module';
import { CategoryModule } from 'category/category.module';
// import { ProductsModule } from './products/products.module';
import { CouponsModule } from 'coupons/coupons.module';
import { CartModule } from 'cart/cart.module';
import { AddressModule } from './address/address.module';
import { BankAccountModule } from 'bank-account/bank-account.module';
import { OrderModule } from 'order/order.module';
import { CustomersModule } from 'customers/list/customer-list.module';
import { BrandModule } from 'brand/brand.module';
import { BrandCategoryModule } from 'brand/brand-category/brand-category.module';
import { ProductModule } from 'product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: 'schema.gql',
      driver: ApolloDriver,
      path: '/graphql',
      playground: true,
      introspection: true,
    }),
    AuthModule,
    UsersModule,
    PrismaModule,
    RegisterModule,
    CategoryModule,
    // ProductsModule,
    CouponsModule,
    CartModule,
    AddressModule,
    BankAccountModule,
    OrderModule,
    CustomersModule,
    BrandModule,
    BrandCategoryModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
