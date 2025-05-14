import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBankAccountDto } from './bank-account.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class BankAccountService {
  private readonly logger = new Logger(BankAccountService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createBankAccount(dto: CreateBankAccountDto) {
    try {
      await this.prisma.bankAccount.create({
        data: {
          accountNumber: dto.accountNumber,
          ifscCode: dto.ifscCode,
          userId: dto.userId,
        },
      });

      return {
        success: true,
        message: 'Bank account created successfully',
      };
    } catch (error) {
      this.logger.error('Error creating bank account:', error);

      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return {
            success: false,
            message: 'Bank account already exists for this user',
          };
        }

        if (error.code === 'P2003') {
          return {
            success: false,
            message: 'User does not exist',
          };
        }
      }

      return {
        success: false,
        message: 'An unexpected error occurred while creating the bank account',
      };
    }
  }
}
