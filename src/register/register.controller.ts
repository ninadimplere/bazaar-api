import { Controller, Post, Body, UseGuards, Req, Logger } from '@nestjs/common';
import { RegisterService } from './register.service';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post('user')
  async login() {
    return this.registerService.validateUser();
  }
}
