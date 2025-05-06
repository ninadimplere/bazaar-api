import { Module } from '@nestjs/common';
import { UsersModule } from '@users/users.module';
import { RegisterController } from './register.controller';
import { PrismaModule } from '@prisma/prisma.module';
import { RegisterService } from './register.service';

@Module({
  imports: [UsersModule, PrismaModule],
  controllers: [RegisterController],
  providers: [RegisterService],
})
export class RegisterModule {}
