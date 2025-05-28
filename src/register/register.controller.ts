import { Controller, Post, Body, UseGuards, Req, Logger } from '@nestjs/common';
import { RegisterDto } from './register.dto';
import { RegisterService } from './register.service';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post('user')
  async register(@Body() dto: RegisterDto) {
    return this.registerService.registerUser(dto);
  }

  @Post('seller')
  async registerSeller(@Body() dto: RegisterDto) {
    return this.registerService.registerSeller(dto);
  }
}
