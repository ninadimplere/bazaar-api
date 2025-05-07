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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: true, // Code-first approach
      driver: ApolloDriver,
    }),
    AuthModule,
    UsersModule,
    PrismaModule,
    RegisterModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
