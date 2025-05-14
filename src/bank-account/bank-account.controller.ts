import { Controller, Post, Body } from '@nestjs/common';
import { CreateBankAccountDto } from './bank-account.dto';
import { BankAccountService } from './bank-account.service';

@Controller('bank-account')
export class BankAccountController {
  constructor(private readonly bankAccountService: BankAccountService) {}

  @Post()
  async create(@Body() dto: CreateBankAccountDto) {
    return this.bankAccountService.createBankAccount(dto);
  }
}
