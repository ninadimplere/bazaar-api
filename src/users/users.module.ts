import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SpenderTypeService } from './spender-type.service';
import { UserResolver } from './user.resolver';

@Module({
  imports: [PrismaModule],
  providers: [UsersService, SpenderTypeService, UserResolver],
  exports: [UsersService, SpenderTypeService],
  controllers: [UsersController],
})
export class UsersModule {}
