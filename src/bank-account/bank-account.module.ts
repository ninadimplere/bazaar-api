import { Module } from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import { BankAccountController } from './bank-account.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [BankAccountController],
  providers: [BankAccountService, PrismaService],
})
export class BankAccountModule {}
